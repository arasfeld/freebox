// Base address interface with all possible fields
export interface NominatimAddress {
  municipality?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
  road?: string;
  house_number?: string;
}

// Base location interface with coordinates
export interface LocationCoordinates {
  lat: number;
  lng: number;
}

// Nominatim API response types
export interface NominatimResult {
  display_name: string;
  address?: Partial<NominatimAddress>;
}

export interface NominatimSearchResult extends NominatimResult {
  lat: string;
  lon: string;
}

export type NominatimReverseResult = NominatimResult;

// Transformed result types
export interface GeocodeResult extends LocationCoordinates {
  displayName: string;
  city?: string;
  state?: string;
}

export interface ReverseGeocodeResult {
  displayName: string;
  address: Partial<NominatimAddress>;
}

// User location state (for Redux store) - allows null values for clearing
export interface UserLocation {
  lat: number | null;
  lng: number | null;
  location: string | null;
}

// Request types - consolidated to avoid duplication
export interface GeocodeRequest {
  query: string;
  limit?: number;
}

export type ReverseGeocodeRequest = LocationCoordinates;
export type SearchPlacesRequest = GeocodeRequest;
export type NearbyPlacesRequest = LocationCoordinates & { radius?: number };
