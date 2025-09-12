import { useMemo } from 'react';

import { useAppSelector } from '../../hooks';
import { useGetItemsQuery } from '../items/itemsApi';
import {
  selectFilters,
  selectHasActiveFilters,
  selectUserLocation,
  selectDistanceUnit,
} from './searchSelectors';

import type { ItemWithDistance, SearchFilters, GetItemsParams } from '@/types';

interface UseSearchReturn {
  items: ItemWithDistance[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  filters: SearchFilters;
  sortBy: string;
  hasActiveFilters: boolean;
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  statusFilter: string;
}

export function useSearch(): UseSearchReturn {
  const filters = useAppSelector(selectFilters);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const userLocation = useAppSelector(selectUserLocation);
  const distanceUnit = useAppSelector(selectDistanceUnit);

  // Prepare query parameters including location data
  const queryParams = useMemo(() => {
    const params: GetItemsParams = { ...filters };

    // Add user location if available
    if (userLocation?.lat && userLocation?.lng) {
      params.userLat = userLocation.lat;
      params.userLng = userLocation.lng;
    }

    // Add distance unit
    params.distanceUnit = distanceUnit;

    return params;
  }, [filters, userLocation, distanceUnit]);

  const {
    data: items = [],
    isLoading,
    isFetching,
    error,
    isError,
  } = useGetItemsQuery(queryParams, {
    pollingInterval: 0,
  });

  const enhancedState = useMemo(() => {
    return {
      items,
      isLoading,
      isFetching,
      isError,
      error,
      filters,
      sortBy: filters.sortBy,
      hasActiveFilters,
      searchQuery: filters.search,
      categoryFilter: filters.category,
      locationFilter: filters.location,
      statusFilter: filters.status,
    };
  }, [items, isLoading, isFetching, isError, error, filters, hasActiveFilters]);

  return enhancedState;
}
