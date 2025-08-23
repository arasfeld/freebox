export const CATEGORIES = [
  'Books',
  'Clothing',
  'Electronics',
  'Furniture',
  'Home & Garden',
  'Other',
  'Sports',
  'Toys & Games',
] as const;

export const ITEM_STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  TAKEN: 'bg-gray-100 text-gray-800',
} as const;

export const LOCATIONS = [
  'Downtown',
  'East Side',
  'North Side',
  'South Side',
  'Suburbs',
  'West Side',
] as const;

export const SORT_OPTIONS = [
  { label: 'Category', value: 'category' },
  { label: 'Location', value: 'location' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Title A-Z', value: 'title' },
] as const;

export interface SearchFilters {
  category: string;
  location: string;
  search: string;
}

export type Category = (typeof CATEGORIES)[number];
export type ItemStatus = keyof typeof ITEM_STATUS_COLORS;
export type Location = (typeof LOCATIONS)[number];
export type SortOption =
  | 'category'
  | 'location'
  | 'newest'
  | 'oldest'
  | 'title';
