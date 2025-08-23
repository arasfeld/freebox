'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';

import { useSearch } from '@/hooks/use-search';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys & Games',
  'Other',
];

const locations = [
  'Downtown',
  'North Side',
  'South Side',
  'East Side',
  'West Side',
  'Suburbs',
];

export function SearchFilters() {
  const {
    filters,
    setSearch,
    setCategory,
    setLocation,
    clearFilters,
    hasActiveFilters,
  } = useSearch();

  // Keyboard shortcut to clear filters (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hasActiveFilters) {
        clearFilters();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearFilters, hasActiveFilters]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items by title or description..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          <Select value={filters.category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters && (
              <span>
                Filters applied • Press{' '}
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                  Esc
                </kbd>{' '}
                to clear
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
