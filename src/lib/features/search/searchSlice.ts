import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SearchFilters, SortOption } from '@/types/search';

interface SearchState {
  filters: SearchFilters;
  sortBy: SortOption;
  userLocation: {
    lat: number | null;
    lng: number | null;
    location: string | null;
  } | null;
}

const initialState: SearchState = {
  filters: {
    search: '',
    category: 'all',
    location: 'all',
    status: 'all',
  },
  sortBy: 'newest',
  userLocation: null,
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
        status: 'all',
      };
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setUserLocation: (
      state,
      action: PayloadAction<{
        lat: number;
        lng: number;
        location: string;
      } | null>
    ) => {
      state.userLocation = action.payload;
    },
  },
});

export const {
  clearFilters,
  setCategory,
  setLocation,
  setSearch,
  setStatus,
  setSortBy,
  setUserLocation,
} = searchSlice.actions;

// Note: Selectors have been moved to searchSelectors.ts for better performance
