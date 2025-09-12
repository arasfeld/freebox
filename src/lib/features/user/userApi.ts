import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  UserProfile,
  UpdateProfileRequest,
  UpdateContactRequest,
  UpdateAddressRequest,
  UpdatePickupRequest,
  UpdatePrivacyRequest,
} from '@/types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, string | undefined>({
      query: (userId) => ({
        url: `/user/profile`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    updateContact: builder.mutation<UserProfile, UpdateContactRequest>({
      query: (data) => ({
        url: '/user/contact',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    updateAddress: builder.mutation<UserProfile, UpdateAddressRequest>({
      query: (data) => ({
        url: '/user/address',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    updatePickup: builder.mutation<UserProfile, UpdatePickupRequest>({
      query: (data) => ({
        url: '/user/pickup',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    updatePrivacy: builder.mutation<UserProfile, UpdatePrivacyRequest>({
      query: (data) => ({
        url: '/user/privacy',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateContactMutation,
  useUpdateAddressMutation,
  useUpdatePickupMutation,
  useUpdatePrivacyMutation,
} = userApi;
