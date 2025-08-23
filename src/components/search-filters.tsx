'use client';

import { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search:', { searchTerm, category, location });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setLocation('all');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
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

          <Select value={location} onValueChange={setLocation}>
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
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </CardContent>
    </Card>
  );
}
