import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SearchFilters, SortOption } from '@/types/search';

interface SearchState {
  filters: SearchFilters;
  sortBy: SortOption;
  isSearching: boolean;
}

const initialState: SearchState = {
  filters: {
    search: '',
    category: 'all',
    location: 'all',
  },
  sortBy: 'newest',
  isSearching: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        location: 'all',
      };
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  clearFilters,
  setCategory,
  setIsSearching,
  setLocation,
  setSearch,
  setSortBy,
} = searchSlice.actions;

// Note: Selectors have been moved to searchSelectors.ts for better performance
