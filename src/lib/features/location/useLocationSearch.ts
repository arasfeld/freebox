import { useCallback, useEffect, useState } from 'react';

import { useGeocodeAddressQuery } from './locationApi';

interface UseLocationSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
}

export function useLocationSearch({
  debounceMs = 300,
  minQueryLength = 2,
  maxResults = 5,
}: UseLocationSearchOptions = {}) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Debounce the search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  // RTK Query hook with optimized parameters
  const {
    data: locationOptions = [],
    isLoading,
    error,
  } = useGeocodeAddressQuery(
    {
      query: debouncedValue,
      limit: maxResults,
    },
    {
      skip: !debouncedValue || debouncedValue.length < minQueryLength,
    }
  );

  // Transform location options for autocomplete
  const transformedLocationOptions = locationOptions.map((result) => ({
    value: result.displayName,
    label: result.displayName,
  }));

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  return {
    searchValue,
    debouncedValue,
    locationOptions: transformedLocationOptions,
    isLoading,
    error,
    handleSearchChange,
  };
}
