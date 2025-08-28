import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  GeocodeResult,
  ReverseGeocodeResult,
  NominatimSearchResult,
  NominatimReverseResult,
  GeocodeRequest,
  ReverseGeocodeRequest,
  SearchPlacesRequest,
  NearbyPlacesRequest,
} from '@/types';

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/location',
  }),
  tagTypes: ['Location'],
  endpoints: (builder) => ({
    geocodeAddress: builder.query<GeocodeResult[], GeocodeRequest>({
      query: ({ query, limit = 5 }) => ({
        url: '/search',
        params: {
          q: query,
          limit,
        },
      }),
      keepUnusedDataFor: 300, // 5 minutes
      transformResponse: (data: NominatimSearchResult[]): GeocodeResult[] => {
        return data.map((result) => ({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
          city:
            result.address?.city ||
            result.address?.town ||
            result.address?.village,
          state: result.address?.state,
        }));
      },
      providesTags: (result, error, { query }) =>
        result
          ? [
              ...result.map(({ displayName }) => ({
                type: 'Location' as const,
                id: `geocode-${displayName}`,
              })),
              { type: 'Location', id: `geocode-query-${query}` },
            ]
          : [{ type: 'Location', id: `geocode-query-${query}` }],
    }),

    reverseGeocode: builder.query<
      ReverseGeocodeResult | null,
      ReverseGeocodeRequest
    >({
      query: ({ lat, lng }) => ({
        url: '/reverse',
        params: {
          lat,
          lng,
        },
      }),
      keepUnusedDataFor: 600, // 10 minutes for reverse geocoding
      transformResponse: (
        data: NominatimReverseResult
      ): ReverseGeocodeResult | null => {
        if (!data) return null;

        return {
          displayName: data.display_name,
          address: {
            city:
              data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            country: data.address?.country,
          },
        };
      },
      providesTags: (result, error, { lat, lng }) => [
        { type: 'Location', id: `reverse-${lat}-${lng}` },
      ],
    }),

    searchPlaces: builder.query<GeocodeResult[], SearchPlacesRequest>({
      query: ({ query, limit = 10 }) => ({
        url: '/search',
        params: {
          q: query,
          limit,
        },
      }),
      keepUnusedDataFor: 300, // 5 minutes
      transformResponse: (data: NominatimSearchResult[]): GeocodeResult[] => {
        return data.map((result) => ({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
          city:
            result.address?.city ||
            result.address?.town ||
            result.address?.village,
          state: result.address?.state,
        }));
      },
      providesTags: (result, error, { query }) =>
        result
          ? [
              ...result.map(({ displayName }) => ({
                type: 'Location' as const,
                id: `place-${displayName}`,
              })),
              { type: 'Location', id: `place-query-${query}` },
            ]
          : [{ type: 'Location', id: `place-query-${query}` }],
    }),

    getNearbyPlaces: builder.query<GeocodeResult[], NearbyPlacesRequest>({
      query: ({ lat, lng }) => ({
        url: '/reverse',
        params: {
          lat,
          lng,
        },
      }),
      keepUnusedDataFor: 600, // 10 minutes
      transformResponse: (
        data: NominatimReverseResult,
        meta,
        arg
      ): GeocodeResult[] => {
        // For now, return just the current location
        // In a real implementation, you might want to make additional API calls
        // to get actual nearby cities or use a different endpoint
        return [
          {
            lat: arg.lat,
            lng: arg.lng,
            displayName: data.display_name,
            city:
              data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
          },
        ];
      },
      providesTags: (result, error, { lat, lng }) => [
        { type: 'Location', id: `nearby-${lat}-${lng}` },
      ],
    }),
  }),
});

export const {
  useGeocodeAddressQuery,
  useReverseGeocodeQuery,
  useSearchPlacesQuery,
  useGetNearbyPlacesQuery,
} = locationApi;
