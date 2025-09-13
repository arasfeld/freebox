import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/lib/store';

// Basic selectors
export const selectSearchState = (state: RootState) => state.search;

export const selectFilters = (state: RootState) => state.search.filters;

export const selectSearch = (state: RootState) => state.search.filters.search;

export const selectCategory = (state: RootState) =>
  state.search.filters.category;

export const selectLocation = (state: RootState) =>
  state.search.filters.location;

export const selectStatus = (state: RootState) => state.search.filters.status;

export const selectSortBy = (state: RootState) => state.search.filters.sortBy;

export const selectUserLocation = (state: RootState) =>
  state.search.userLocation;

// Computed selectors
export const selectHasActiveFilters = createSelector(
  [selectFilters],
  filters => {
    return (
      filters.search !== '' ||
      filters.category !== 'all' ||
      filters.location !== 'all' ||
      filters.status !== 'all'
    );
  }
);

export const selectFilterSummary = createSelector([selectFilters], filters => {
  const activeFilters = [];

  if (filters.search) activeFilters.push(`Search: "${filters.search}"`);
  if (filters.category !== 'all')
    activeFilters.push(`Category: ${filters.category}`);
  if (filters.location !== 'all')
    activeFilters.push(`Location: ${filters.location}`);
  if (filters.status !== 'all') activeFilters.push(`Status: ${filters.status}`);

  return activeFilters;
});
