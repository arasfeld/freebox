'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="flex items-center gap-4">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search items by title or description..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10"
        />
      </div>

      {/* Filter Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => dispatch(setCategory(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Location
                </label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => dispatch(setLocation(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locationOptions}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => dispatch(setStatus(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
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

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <SortOptions
                  value={sortBy}
                  onValueChange={(value) => dispatch(setSortBy(value))}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(clearFilters());
                  setIsDialogOpen(false);
                }}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                {hasActiveFilters && (
                  <span>
                    Press{' '}
                    <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                      Esc
                    </kbd>{' '}
                    to clear
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
