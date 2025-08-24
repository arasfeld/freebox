import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { InterestEntry } from '@/types/search';

export interface Item {
  id: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  location?: string;
  status: 'AVAILABLE' | 'PENDING' | 'TAKEN';
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  interests?: InterestEntry[];
  isOwner?: boolean;
  hasExpressedInterest?: boolean;
}

export interface GetItemsParams {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

interface ExpressInterestParams {
  itemId: string;
}

interface SelectRecipientParams {
  itemId: string;
  recipientUserId: string;
}

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Items'],
  endpoints: (builder) => ({
    getItems: builder.query<Item[], GetItemsParams>({
      query: (params) => {
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
    getItem: builder.query<Item, string>({
      query: (id) => `items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Items', id }],
    }),
    expressInterest: builder.mutation<Item, ExpressInterestParams>({
      query: ({ itemId }) => ({
        url: `items/${itemId}/interest`,
        method: 'POST',
      }),
      // Optimistic update
      async onQueryStarted({ itemId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          itemsApi.util.updateQueryData('getItems', {}, (draft) => {
            const item = draft.find((item) => item.id === itemId);
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
    }),
    removeInterest: builder.mutation<void, ExpressInterestParams>({
      query: ({ itemId }) => ({
        url: `items/${itemId}/interest`,
        method: 'DELETE',
      }),
      // Optimistic update
      async onQueryStarted({ itemId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          itemsApi.util.updateQueryData('getItems', {}, (draft) => {
            const item = draft.find((item) => item.id === itemId);
            if (item) {
              item.hasExpressedInterest = false;
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
    }),
    selectRecipient: builder.mutation<
      { message: string; recipientUserId: string; item: Item },
      SelectRecipientParams
    >({
      query: ({ itemId, recipientUserId }) => ({
        url: `items/${itemId}/select-recipient`,
        method: 'POST',
        body: { recipientUserId },
      }),
      // Optimistic update
      async onQueryStarted(
        { itemId, recipientUserId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          itemsApi.util.updateQueryData('getItems', {}, (draft) => {
            const item = draft.find((item) => item.id === itemId);
            if (item) {
              item.status = 'TAKEN';
              // Update the selected interest
              if (item.interests) {
                item.interests.forEach((interest) => {
                  interest.selected = interest.userId === recipientUserId;
                });
              }
            }
          })
        );

        // Also update the individual item query
        const itemPatchResult = dispatch(
          itemsApi.util.updateQueryData('getItem', itemId, (draft) => {
            if (draft) {
              draft.status = 'TAKEN';
              if (draft.interests) {
                draft.interests.forEach((interest) => {
                  interest.selected = interest.userId === recipientUserId;
                });
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          itemPatchResult.undo();
        }
      },
      invalidatesTags: ['Items'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useExpressInterestMutation,
  useRemoveInterestMutation,
  useSelectRecipientMutation,
} = itemsApi;
