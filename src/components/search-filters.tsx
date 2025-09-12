'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';

import { AutoComplete } from '@/components/autocomplete';
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
import { useLocationSearch } from '@/lib/features/location/useLocationSearch';
import { getRadiusFilterOptions } from '@/lib/utils/distance';

import {
  resetFilters,
  setCategory,
  setLocation,
  setRadiusKm,
  setSearch,
  setStatus,
  setSortBy,
} from '@/lib/features/search/searchSlice';
import {
  selectHasActiveFilters,
  selectFilters,
  selectSortBy,
  selectDistanceUnit,
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
  const distanceUnit = useAppSelector(selectDistanceUnit);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Location search for the filter dialog
  const {
    searchValue: locationSearchValue,
    locationOptions: locationFilterOptions,
    isLoading: isSearchingLocation,
    handleSearchChange: setLocationSearchValue,
  } = useLocationSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 5,
  });

  // Initialize location search when dialog opens
  useEffect(() => {
    if (isDialogOpen && filters.location !== 'all') {
      setLocationSearchValue(filters.location);
    }
  }, [isDialogOpen, filters.location, setLocationSearchValue]);

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
      CATEGORIES.map((category) => (
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
          name="search"
          placeholder="Search items by title or description..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10"
          autoComplete="off"
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
                  Location Filter
                  {filters.location !== 'all' && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (Active)
                    </span>
                  )}
                </label>
                <AutoComplete
                  selectedValue={
                    filters.location === 'all' ? '' : filters.location
                  }
                  onSelectedValueChange={(value: string) => {
                    if (value === '') {
                      // Clear the location filter
                      dispatch(setLocation('all'));
                      setLocationSearchValue('');
                    } else {
                      // Set the selected location
                      dispatch(setLocation(value));
                      setLocationSearchValue(value);
                    }
                  }}
                  searchValue={locationSearchValue}
                  onSearchValueChange={setLocationSearchValue}
                  items={locationFilterOptions}
                  isLoading={isSearchingLocation}
                  emptyMessage="No locations found."
                  placeholder={
                    filters.location === 'all'
                      ? 'Search for a location...'
                      : filters.location
                  }
                />
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

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Search Radius ({distanceUnit === 'mi' ? 'miles' : 'km'})
                </label>
                <Select
                  value={filters.radiusKm?.toString() || 'all'}
                  onValueChange={(value) =>
                    dispatch(
                      setRadiusKm(value === 'all' ? undefined : parseInt(value))
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRadiusFilterOptions(distanceUnit).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
