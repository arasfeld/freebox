'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOptions } from '@/components/sort-options';

import {
  clearFilters,
  setCategory,
  setLocation,
  setSearch,
  setStatus,
  setSortBy,
} from '@/lib/features/search/searchSlice';
import {
  selectHasActiveFilters,
  selectSearchFilters,
  selectSortBy,
} from '@/lib/features/search/searchSelectors';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { CATEGORIES, LOCATIONS } from '@/types/search';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'PENDING', label: 'Pending Interest' },
  { value: 'TAKEN', label: 'Taken' },
];

export function SearchFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);
  const sortBy = useAppSelector(selectSortBy);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  // Keyboard shortcut to clear filters (Escape key)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hasActiveFilters) {
        dispatch(clearFilters());
      }
    },
    [dispatch, hasActiveFilters]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const categoryOptions = useMemo(
    () =>
      CATEGORIES.map((category) => (
        <SelectItem key={category} value={category}>
          {category}
        </SelectItem>
      )),
    []
  );

  const locationOptions = useMemo(
    () =>
      LOCATIONS.map((location) => (
        <SelectItem key={location} value={location}>
          {location}
        </SelectItem>
      )),
    []
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items by title or description..."
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-10"
            />
          </div>

          <Select
            value={filters.category}
            onValueChange={(value) => dispatch(setCategory(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions}
            </SelectContent>
          </Select>

          <Select
            value={filters.location}
            onValueChange={(value) => dispatch(setLocation(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locationOptions}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => dispatch(setStatus(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => dispatch(clearFilters())}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </Button>
            <SortOptions
              value={sortBy}
              onValueChange={(value) => dispatch(setSortBy(value))}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters && (
              <span>
                Filters applied • Press{' '}
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                  Esc
                </kbd>{' '}
                to clear
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
