/**
 * Distance calculation utilities using the Haversine formula
 * for calculating distances between geographic coordinates
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Distance unit types
 */
export type DistanceUnit = 'km' | 'mi';

/**
 * User distance preferences
 */
export interface DistancePreferences {
  unit: DistanceUnit;
  showUnit: boolean;
}

/**
 * Default distance preferences
 */
export const DEFAULT_DISTANCE_PREFERENCES: DistancePreferences = {
  unit: 'mi', // Default to miles for US users
  showUnit: true,
};

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles: number): number {
  return miles * 1.60934;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display based on user preferences
 * @param distanceKm Distance in kilometers
 * @param preferences User distance preferences
 * @returns Formatted distance string
 */
export function formatDistance(
  distanceKm: number,
  preferences: DistancePreferences = DEFAULT_DISTANCE_PREFERENCES
): string {
  const { unit, showUnit } = preferences;

  if (unit === 'mi') {
    const miles = kmToMiles(distanceKm);
    return formatDistanceInMiles(miles, showUnit);
  } else {
    return formatDistanceInKm(distanceKm, showUnit);
  }
}

/**
 * Format distance in kilometers
 */
function formatDistanceInKm(
  distanceKm: number,
  showUnit: boolean = true
): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return showUnit ? `${meters}m` : `${meters}`;
  } else if (distanceKm < 10) {
    const formatted = distanceKm.toFixed(1);
    return showUnit ? `${formatted}km` : formatted;
  } else {
    const rounded = Math.round(distanceKm);
    return showUnit ? `${rounded}km` : `${rounded}`;
  }
}

/**
 * Format distance in miles
 */
function formatDistanceInMiles(
  distanceMi: number,
  showUnit: boolean = true
): string {
  if (distanceMi < 10) {
    const formatted = distanceMi.toFixed(1);
    return showUnit ? `${formatted}mi` : formatted;
  } else {
    const rounded = Math.round(distanceMi);
    return showUnit ? `${rounded}mi` : `${rounded}`;
  }
}

/**
 * Get distance badge color based on distance and unit
 * @param distance Distance in the specified unit
 * @param unit Distance unit
 * @returns Tailwind CSS color classes
 */
export function getDistanceColor(
  distance: number,
  unit: DistanceUnit = 'mi'
): string {
  // Convert to km for consistent color thresholds
  const distanceKm = unit === 'mi' ? milesToKm(distance) : distance;

  if (distanceKm <= 5) {
    return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20';
  } else if (distanceKm <= 10) {
    return 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20';
  } else if (distanceKm <= 20) {
    return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20';
  } else {
    return 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20';
  }
}

/**
 * Check if a location is within a specified radius
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param itemLat Item's latitude
 * @param itemLng Item's longitude
 * @param radius Radius in the specified unit
 * @param unit Distance unit
 * @returns True if within radius
 */
export function isWithinRadius(
  userLat: number,
  userLng: number,
  itemLat: number,
  itemLng: number,
  radius: number,
  unit: DistanceUnit = 'mi'
): boolean {
  const distanceKm = calculateDistance(userLat, userLng, itemLat, itemLng);
  const radiusKm = unit === 'mi' ? milesToKm(radius) : radius;
  return distanceKm <= radiusKm;
}

/**
 * Sort items by distance from user location
 * @param items Array of items with coordinates
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @returns Sorted array with distance property added
 */
export function sortItemsByDistance<
  T extends { latitude: number | null; longitude: number | null }
>(
  items: T[],
  userLat: number,
  userLng: number
): (T & { distance: number | null })[] {
  return items
    .map((item) => {
      const distance =
        item.latitude && item.longitude
          ? calculateDistance(userLat, userLng, item.latitude, item.longitude)
          : null;

      return { ...item, distance };
    })
    .sort((a, b) => {
      // Items with no coordinates go to the end
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;

      return a.distance - b.distance;
    });
}

/**
 * Get radius filter options based on unit
 */
export function getRadiusFilterOptions(unit: DistanceUnit = 'mi') {
  if (unit === 'mi') {
    return [
      { value: 'all', label: 'Any distance' },
      { value: '5', label: 'Within 5 miles' },
      { value: '10', label: 'Within 10 miles' },
      { value: '25', label: 'Within 25 miles' },
      { value: '50', label: 'Within 50 miles' },
    ];
  } else {
    return [
      { value: 'all', label: 'Any distance' },
      { value: '5', label: 'Within 5 km' },
      { value: '10', label: 'Within 10 km' },
      { value: '25', label: 'Within 25 km' },
      { value: '50', label: 'Within 50 km' },
    ];
  }
}

/**
 * Convert radius from one unit to another
 */
export function convertRadius(
  radius: number,
  fromUnit: DistanceUnit,
  toUnit: DistanceUnit
): number {
  if (fromUnit === toUnit) return radius;

  if (fromUnit === 'mi' && toUnit === 'km') {
    return milesToKm(radius);
  } else if (fromUnit === 'km' && toUnit === 'mi') {
    return kmToMiles(radius);
  }

  return radius;
}
