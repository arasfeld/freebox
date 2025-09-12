export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;

  // Contact Information
  phone: string | null;
  preferredContact: 'email' | 'phone' | 'both' | null;

  // Address Information
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;

  // Pickup Preferences
  pickupInstructions: string | null;
  availableHours: string | null;
  preferredPickupMethod: 'curbside' | 'door' | 'meet' | 'other' | null;

  // Privacy Settings
  showContactInfo: boolean;
  showAddress: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string | null;
  image?: string | null;
}

export interface UpdateContactRequest {
  phone?: string | null;
  preferredContact?: 'email' | 'phone' | 'both';
}

export interface UpdateAddressRequest {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UpdatePickupRequest {
  pickupInstructions?: string | null;
  availableHours?: string | null;
  preferredPickupMethod?: 'curbside' | 'door' | 'meet' | 'other';
}

export interface UpdatePrivacyRequest {
  showContactInfo?: boolean;
  showAddress?: boolean;
}
