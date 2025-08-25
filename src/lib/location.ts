// Location utilities using OpenStreetMap Nominatim API
// Completely free, no API key required

export interface LocationResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

export interface ReverseGeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

// Geocode an address to coordinates
export async function geocodeAddress(query: string): Promise<GeocodeResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Freebox/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data: LocationResult[] = await response.json();

    return data.map((item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
      country: item.address?.country,
      postcode: item.address?.postcode,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// Reverse geocode coordinates to address
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Freebox/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data: LocationResult & { address: any } = await response.json();

    return {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      displayName: data.display_name,
      address: {
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode,
        suburb: data.address?.suburb,
        neighbourhood: data.address?.neighbourhood,
      },
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Search for places (cities, neighborhoods, etc.)
export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=10&addressdetails=1&featuretype=city`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Freebox/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Place search request failed');
    }

    const data: LocationResult[] = await response.json();

    return data
      .filter((item) => item.importance > 0.1) // Filter out low-importance results
      .map((item) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        city: item.address?.city || item.address?.town || item.address?.village,
        state: item.address?.state,
        country: item.address?.country,
        postcode: item.address?.postcode,
      }));
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
}

// Get nearby places from coordinates
export async function getNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 10
): Promise<GeocodeResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Freebox/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Nearby places request failed');
    }

    const data: LocationResult & { address: any } = await response.json();

    // For nearby places, we'll return the current location and some nearby cities
    const nearbyResults: GeocodeResult[] = [
      {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        displayName: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode,
      },
    ];

    // Add some nearby major cities (this is a simplified approach)
    const nearbyCities = await searchPlaces(
      `${data.address?.state || data.address?.country}`
    );
    nearbyResults.push(...nearbyCities.slice(0, 4));

    return nearbyResults;
  } catch (error) {
    console.error('Nearby places error:', error);
    return [];
  }
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
