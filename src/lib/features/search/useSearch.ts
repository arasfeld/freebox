import { useMemo } from 'react';

import { useGetItemsQuery } from '../items/itemsApi';
import { useAppSelector } from '../../hooks';
import { selectSearchFilters, selectSortBy } from './searchSelectors';

import type { Item } from '../items/itemsApi';
import type { SearchFilters, SortOption } from '@/types/search';

interface UseSearchReturn {
  items: Item[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  filters: SearchFilters;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  statusFilter: string;
}

export function useSearch(): UseSearchReturn {
  const filters = useAppSelector(selectSearchFilters);
  const sortBy = useAppSelector(selectSortBy);

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
    const hasActiveFilters =
      filters.search !== '' ||
      filters.category !== 'all' ||
      filters.location !== 'all' ||
      filters.status !== 'all';

    return {
      items,
      isLoading,
      isFetching,
      isError,
      error,
      filters,
      sortBy,
      hasActiveFilters,
      searchQuery: filters.search,
      categoryFilter: filters.category,
      locationFilter: filters.location,
      statusFilter: filters.status,
    };
  }, [items, isLoading, isFetching, isError, error, filters, sortBy]);

  return enhancedState;
}
