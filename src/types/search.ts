// Search and filter types
export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title'
  | 'category'
  | 'distance';

export interface SearchFilters {
  search: string;
  category: string;
  location: string;
  status: string;
  sortBy: SortOption;
}

// Interest types (moved from database types)
export interface InterestEntry {
  id: string;
  userId: string;
  timestamp: string;
  selected: boolean;
  userStats: {
    totalItemsReceived: number;
    totalItemsGiven: number;
    averageResponseTime: number;
    lastActivity: string;
  };
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

// Constants
export const CATEGORIES = [
  'All',
  'Books',
  'Clothing',
  'Electronics',
  'Furniture',
  'Home & Garden',
  'Other',
  'Sports',
  'Toys & Games',
] as const;

export const STATUS_OPTIONS = ['All', 'Available', 'Pending', 'Taken'] as const;

export const SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest First' },
  { value: 'oldest' as const, label: 'Oldest First' },
  { value: 'distance' as const, label: 'Distance' },
] as const;

export const ITEM_STATUS_COLORS = {
  AVAILABLE:
    'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20',
  PENDING:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20',
  TAKEN:
    'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20',
} as const;

export const DISTANCE_SORT_OPTIONS = [
  'Nearest First',
  'Farthest First',
] as const;
