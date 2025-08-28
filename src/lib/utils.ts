import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ReverseGeocodeResult } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms a reverse geocoding result into a standardized location object
 * with latitude, longitude, and a user-friendly location name.
 */
export function transformReverseGeocodeResult(
  reverseGeocodeResult: ReverseGeocodeResult,
  lat: number,
  lng: number
): { lat: number; lng: number; location: string } {
  // Create a user-friendly display name
  let displayName = reverseGeocodeResult.displayName;

  // Try to create a more specific location name using available address fields
  const address = reverseGeocodeResult.address;

  // Prioritize municipality (most specific local government unit)
  if (address.municipality && address.state) {
    // Municipality, State format (e.g., "West Chester Township, Ohio")
    displayName = `${address.municipality}, ${address.state}`;
  } else if (address.municipality && address.county && address.state) {
    // Municipality, County, State format (e.g., "West Chester Township, Butler County, Ohio")
    displayName = `${address.municipality}, ${address.county}, ${address.state}`;
  } else if (address.city && address.state) {
    // City, State format (most common and user-friendly)
    displayName = `${address.city}, ${address.state}`;
  } else if (address.town && address.state) {
    // Town, State format
    displayName = `${address.town}, ${address.state}`;
  } else if (address.village && address.state) {
    // Village, State format
    displayName = `${address.village}, ${address.state}`;
  } else if (address.suburb && address.city && address.state) {
    // Suburb, City, State format (very specific)
    displayName = `${address.suburb}, ${address.city}, ${address.state}`;
  } else if (address.neighbourhood && address.city && address.state) {
    // Neighbourhood, City, State format
    displayName = `${address.neighbourhood}, ${address.city}, ${address.state}`;
  } else if (address.municipality) {
    // Just municipality
    displayName = address.municipality;
  } else if (address.city) {
    // Just city
    displayName = address.city;
  } else if (address.town) {
    // Just town
    displayName = address.town;
  } else if (address.village) {
    // Just village
    displayName = address.village;
  } else if (address.suburb && address.state) {
    // Suburb, State
    displayName = `${address.suburb}, ${address.state}`;
  } else if (address.county && address.state) {
    // County, State
    displayName = `${address.county}, ${address.state}`;
  } else if (address.state) {
    // Just state (fallback)
    displayName = address.state;
  }

  return {
    lat,
    lng,
    location: displayName,
  };
}

// Distance calculation utilities
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Calculate distance between user location and item location
export function getItemDistance(
  userLat: number,
  userLng: number,
  itemLat: number,
  itemLng: number
): number {
  return calculateDistance(userLat, userLng, itemLat, itemLng);
}
