import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

// Base selectors
const selectSearchState = (state: RootState) => state.search;

// Memoized selectors
export const selectSearchFilters = createSelector(
  [selectSearchState],
  (search) => search.filters
);

export const selectSortBy = createSelector(
  [selectSearchState],
  (search) => search.sortBy
);

export const selectIsSearching = createSelector(
  [selectSearchState],
  (search) => search.isSearching
);

export const selectHasActiveFilters = createSelector(
  [selectSearchFilters],
  (filters) =>
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.location !== 'all'
);

export const selectSearchQuery = createSelector(
  [selectSearchFilters],
  (filters) => filters.search
);

export const selectCategoryFilter = createSelector(
  [selectSearchFilters],
  (filters) => filters.category
);

export const selectLocationFilter = createSelector(
  [selectSearchFilters],
  (filters) => filters.location
);

// Combined selectors
export const selectSearchStateSummary = createSelector(
  [selectSearchFilters, selectSortBy, selectHasActiveFilters],
  (filters, sortBy, hasActiveFilters) => ({
    filters,
    sortBy,
    hasActiveFilters,
    searchQuery: filters.search,
    categoryFilter: filters.category,
    locationFilter: filters.location,
  })
);
