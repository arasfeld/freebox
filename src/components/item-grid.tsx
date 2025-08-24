'use client';

import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemCard } from '@/components/item-card';

import { useSearch } from '@/lib/features/search/useSearch';

import type { Item } from '@/lib/features/items/itemsApi';

export function ItemGrid() {
  const {
    items,
    isLoading,
    isFetching,
    isError,
    error,
    sortBy,
    hasActiveFilters,
  } = useSearch();

  const sortItems = useCallback(
    (itemsToSort: Item[]): Item[] => {
      const sortedItems = [...itemsToSort];

      switch (sortBy) {
        case 'newest':
          return sortedItems.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return sortedItems.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'title':
          return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        case 'category':
          return sortedItems.sort((a, b) =>
            (a.category || '').localeCompare(b.category || '')
          );
        case 'location':
          return sortedItems.sort((a, b) =>
            (a.location || '').localeCompare(b.location || '')
          );
        default:
          return sortedItems;
      }
    },
    [sortBy]
  );

  const sortedItems = useMemo(() => sortItems(items), [sortItems, items]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">
            Loading items...
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          {error && typeof error === 'object' && 'data' in error
            ? 'An error occurred while fetching items'
            : 'Failed to fetch items'}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          {hasActiveFilters ? 'No items found' : 'No items available'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {hasActiveFilters
            ? 'Try adjusting your search criteria or browse all items.'
            : 'Be the first to post an item in your community!'}
        </p>
        <div className="flex justify-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Browse All Items
            </Button>
          )}
          <Button asChild>
            <a href="/post-item">Post an Item</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
            {sortBy !== 'newest' && ` • Sorted by ${sortBy}`}
          </p>
          {isFetching && (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">
                Searching...
              </span>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
