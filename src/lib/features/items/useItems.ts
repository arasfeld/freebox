import { useMemo } from 'react';

import { useGetItemsQuery } from './itemsApi';
import type { GetItemsParams, Item } from './itemsApi';

interface UseItemsReturn {
  items: Item[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  hasItems: boolean;
  itemCount: number;
}

export function useItems(params: GetItemsParams): UseItemsReturn {
  const {
    data: items = [],
    isLoading,
    isFetching,
    error,
    isError,
  } = useGetItemsQuery(params);

  const enhancedState = useMemo(() => {
    const itemCount = items.length;
    const isEmpty = itemCount === 0;
    const hasItems = !isEmpty;

    return {
      items,
      isLoading,
      isFetching,
      isError,
      error,
      isEmpty,
      hasItems,
      itemCount,
    };
  }, [items, isLoading, isFetching, isError, error]);

  return enhancedState;
}
