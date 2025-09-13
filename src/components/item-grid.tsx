'use client';

import { useCallback, useMemo } from 'react';

import { ItemCard } from '@/components/item-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { selectUserLocation } from '@/lib/features/search/searchSelectors';
import { useSearch } from '@/lib/features/search/useSearch';
import { useAppSelector } from '@/lib/hooks';
import { getItemDistance } from '@/lib/utils';

import type { ItemWithDistance } from '@/types';

export function ItemGrid() {
  const { items, isLoading, isError, sortBy, hasActiveFilters } = useSearch();

  const userLocation = useAppSelector(selectUserLocation);

  const sortItems = useCallback(
    (itemsToSort: ItemWithDistance[]): ItemWithDistance[] => {
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
        case 'distance':
          if (
            !userLocation ||
            userLocation.lat === null ||
            userLocation.lng === null
          )
            return sortedItems;

          return sortedItems.sort((a, b) => {
            const distanceA =
              a.latitude &&
              a.longitude &&
              userLocation.lat !== null &&
              userLocation.lng !== null
                ? getItemDistance(
                    userLocation.lat,
                    userLocation.lng,
                    a.latitude,
                    a.longitude
                  )
                : null;
            const distanceB =
              b.latitude &&
              b.longitude &&
              userLocation.lat !== null &&
              userLocation.lng !== null
                ? getItemDistance(
                    userLocation.lat,
                    userLocation.lng,
                    b.latitude,
                    b.longitude
                  )
                : null;

            if (distanceA === null && distanceB === null) return 0;
            if (distanceA === null) return 1;
            if (distanceB === null) return -1;

            return distanceA - distanceB;
          });
        default:
          return sortedItems;
      }
    },
    [sortBy, userLocation]
  );

  const sortedItems = useMemo(() => sortItems(items), [sortItems, items]);

  // Add distance information to items if user location is available
  const itemsWithDistance = useMemo(() => {
    if (!userLocation || userLocation.lat === null || userLocation.lng === null)
      return sortedItems;

    return sortedItems.map(item => ({
      ...item,
      distance:
        item.latitude &&
        item.longitude &&
        userLocation.lat !== null &&
        userLocation.lng !== null
          ? getItemDistance(
              userLocation.lat,
              userLocation.lng,
              item.latitude,
              item.longitude
            )
          : null,
    }));
  }, [sortedItems, userLocation]);

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
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
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
        <p className="text-muted-foreground">
          Error loading items. Please try again later.
        </p>
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
    <div className="space-y-6">
      {itemsWithDistance.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {itemsWithDistance.length} item
          {itemsWithDistance.length !== 1 ? 's' : ''} found
          {userLocation && sortBy === 'distance' && (
            <span className="ml-2">
              • Sorted by distance from your location
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsWithDistance.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
