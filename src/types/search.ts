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

// Enhanced location data with coordinates and metadata
export const LOCATION_DATA = {
  Downtown: {
    name: 'Downtown',
    coordinates: { lat: 40.7128, lng: -74.006 }, // Example coordinates
    description: 'City center and business district',
    icon: '🏙️',
  },
  'East Side': {
    name: 'East Side',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: 'Eastern residential and commercial area',
    icon: '🌅',
  },
  'North Side': {
    name: 'North Side',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    description: 'Northern neighborhoods and parks',
    icon: '🏔️',
  },
  'South Side': {
    name: 'South Side',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: 'Southern residential areas',
    icon: '🌆',
  },
  Suburbs: {
    name: 'Suburbs',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    description: 'Outer suburban communities',
    icon: '🏘️',
  },
  'West Side': {
    name: 'West Side',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: 'Western residential and cultural district',
    icon: '🌇',
  },
} as const;

// Distance-based sorting options
export const DISTANCE_SORT_OPTIONS = [
  { label: 'Nearest First', value: 'nearest' },
  { label: 'Farthest First', value: 'farthest' },
] as const;

export const SORT_OPTIONS = [
  { label: 'Category', value: 'category' },
  { label: 'Location', value: 'location' },
  { label: 'Distance', value: 'distance' },
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
  | 'distance'
  | 'newest'
  | 'oldest'
  | 'title';
