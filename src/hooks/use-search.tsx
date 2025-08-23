'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface SearchFilters {
  search: string;
  category: string;
  location: string;
}

interface SearchContextType {
  filters: SearchFilters;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setLocation: (location: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: 'all',
    location: 'all',
  });

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
    });
  }, []);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.location !== 'all';

  return (
    <SearchContext.Provider
      value={{
        filters,
        setSearch,
        setCategory,
        setLocation,
        clearFilters,
        hasActiveFilters,
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
