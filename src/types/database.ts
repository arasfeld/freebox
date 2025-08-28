// Database types based on Prisma schema
// These types should match the Prisma schema exactly

export type ItemStatus = 'AVAILABLE' | 'PENDING' | 'TAKEN';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface Item {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  category: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ItemStatus;
  userId: string;
  user: User;
  interests: ItemInterest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemInterest {
  id: string;
  itemId: string;
  userId: string;
  timestamp: Date;
  selected: boolean;
  userStats: UserStats;
  item: Item;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalItemsReceived: number;
  totalItemsGiven: number;
  averageResponseTime: number;
  lastActivity: string;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Extended types for API responses and UI components
export interface ItemWithDistance extends Item {
  distance?: number | null;
  isOwner?: boolean;
  hasExpressedInterest?: boolean;
}

export interface ItemInterestWithUser extends ItemInterest {
  user: User;
}

// API request/response types
export interface CreateItemRequest {
  title: string;
  description?: string;
  images: string[];
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  images?: string[];
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: ItemStatus;
}

export interface GetItemsParams {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

export interface ExpressInterestRequest {
  itemId: string;
}

export interface SelectRecipientRequest {
  itemId: string;
  recipientUserId: string;
}

// Form types
export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
}

// Dashboard specific types
export interface DashboardItem extends Omit<Item, 'user'> {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  latitude: number | null;
  longitude: number | null;
}

// Location types
export interface LocationResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  state?: string;
}
