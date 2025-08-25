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
  AVAILABLE:
    'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20',
  PENDING:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20',
  TAKEN:
    'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20',
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
  status: string;
}

export type Category = (typeof CATEGORIES)[number];
export type ItemStatus = keyof typeof ITEM_STATUS_COLORS;

export interface InterestEntry {
  userId: string;
  timestamp: string;
  selected?: boolean;
  userStats: {
    totalItemsReceived: number;
    totalItemsGiven: number;
    averageResponseTime: number; // in hours
    lastActivity: string;
  };
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}
export type Location = (typeof LOCATIONS)[number];
export type SortOption =
  | 'category'
  | 'location'
  | 'newest'
  | 'oldest'
  | 'title';
