import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  ItemWithDistance,
  GetItemsParams,
  ExpressInterestRequest,
  SelectRecipientRequest,
} from '@/types';

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Items'],
  endpoints: builder => ({
    getItems: builder.query<ItemWithDistance[], GetItemsParams>({
      query: params => {
        const searchParams = new URLSearchParams();

        if (params.search) {
          searchParams.append('search', params.search);
        }
        if (params.category && params.category !== 'all') {
          searchParams.append('category', params.category);
        }
        if (params.location && params.location !== 'all') {
          searchParams.append('location', params.location);
        }
        if (params.status && params.status !== 'all') {
          searchParams.append('status', params.status);
        }

        return {
          url: `items${
            searchParams.toString() ? `?${searchParams.toString()}` : ''
          }`,
        };
      },
      providesTags: ['Items'],
      // Debounce search requests
      keepUnusedDataFor: 300, // Keep data for 5 minutes
    }),
    getItem: builder.query<ItemWithDistance, string>({
      query: id => `items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Items', id }],
    }),
    expressInterest: builder.mutation<ItemWithDistance, ExpressInterestRequest>(
      {
        query: ({ itemId }) => ({
          url: `items/${itemId}/interest`,
          method: 'POST',
        }),
        // Optimistic update
        async onQueryStarted({ itemId }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            itemsApi.util.updateQueryData('getItems', {}, draft => {
              const item = draft.find(item => item.id === itemId);
              if (item) {
                item.hasExpressedInterest = true;
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
        invalidatesTags: ['Items'],
      }
    ),
    removeInterest: builder.mutation<ItemWithDistance, ExpressInterestRequest>({
      query: ({ itemId }) => ({
        url: `items/${itemId}/interest`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),
    selectRecipient: builder.mutation<ItemWithDistance, SelectRecipientRequest>(
      {
        query: ({ itemId, recipientUserId }) => ({
          url: `items/${itemId}/select-recipient`,
          method: 'POST',
          body: { recipientUserId },
        }),
        invalidatesTags: ['Items'],
      }
    ),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useExpressInterestMutation,
  useRemoveInterestMutation,
  useSelectRecipientMutation,
} = itemsApi;
