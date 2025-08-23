'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { SearchFilters, SortOption } from '@/types/search';

interface SearchContextType {
  filters: SearchFilters;
  sortBy: SortOption;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setLocation: (location: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: 'all',
    location: 'all',
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isSearching, setIsSearching] = useState(false);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const setSortByCallback = useCallback((sortBy: SortOption) => {
    setSortBy(sortBy);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
    });
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      filters.search !== '' ||
      filters.category !== 'all' ||
      filters.location !== 'all',
    [filters.search, filters.category, filters.location]
  );

  return (
    <SearchContext.Provider
      value={{
        filters,
        sortBy,
        setSearch,
        setCategory,
        setLocation,
        setSortBy: setSortByCallback,
        clearFilters,
        hasActiveFilters,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
