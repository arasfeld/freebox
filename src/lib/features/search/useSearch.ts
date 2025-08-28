import { useMemo } from 'react';

import { useAppSelector } from '../../hooks';
import { useGetItemsQuery } from '../items/itemsApi';
import { selectFilters, selectHasActiveFilters } from './searchSelectors';

import type { ItemWithDistance, SearchFilters } from '@/types';

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

  const {
    data: items = [],
    isLoading,
    isFetching,
    error,
    isError,
  } = useGetItemsQuery(filters, {
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
