'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { LocationPicker } from '@/components/location-picker';
import { SortOptions } from '@/components/sort-options';

import {
  resetFilters,
  setCategory,
  setLocation,
  setSearch,
  setStatus,
  setSortBy,
} from '@/lib/features/search/searchSlice';
import {
  selectHasActiveFilters,
  selectFilters,
  selectSortBy,
} from '@/lib/features/search/searchSelectors';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { CATEGORIES } from '@/types/search';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'TAKEN', label: 'Taken' },
] as const;

export function SearchFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const sortBy = useAppSelector(selectSortBy);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Keyboard shortcut to clear filters (Escape key)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hasActiveFilters) {
        dispatch(resetFilters());
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
      CATEGORIES.map(category => (
        <SelectItem key={category} value={category}>
          {category}
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
          onChange={e => dispatch(setSearch(e.target.value))}
          className="w-full pl-10"
        />
      </div>

      {/* Location Picker */}
      <LocationPicker />

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
            <DialogDescription>
              Filter items by category, location, status, and sort order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={value => dispatch(setCategory(value))}
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
                <Input
                  placeholder="Enter location to filter by..."
                  value={filters.location === 'all' ? '' : filters.location}
                  onChange={e => dispatch(setLocation(e.target.value || 'all'))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={value => dispatch(setStatus(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
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
                  onValueChange={value => dispatch(setSortBy(value))}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    dispatch(resetFilters());
                    setIsDialogOpen(false);
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcut Hint */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Press <Kbd>Esc</Kbd> to clear filters
        </div>
      )}
    </div>
  );
}
