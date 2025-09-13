import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SearchFilters, UserLocation, SortOption } from '@/types';

interface SearchState {
  filters: SearchFilters;
  userLocation: UserLocation | null;
}

const initialState: SearchState = {
  filters: {
    search: '',
    category: 'all',
    location: 'all',
    status: 'all',
    sortBy: 'newest',
  },
  userLocation: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.filters.sortBy = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<UserLocation | null>) => {
      state.userLocation = action.payload;
    },
    resetFilters: state => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setLocation,
  setStatus,
  setSortBy,
  setUserLocation,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
