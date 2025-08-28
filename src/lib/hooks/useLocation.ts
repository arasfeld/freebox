import { useCallback, useEffect, useState } from 'react';

import { setUserLocation } from '../features/search/searchSlice';
import { useReverseGeocodeQuery } from '../features/location/locationApi';
import { transformReverseGeocodeResult } from '../utils';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { UserLocation } from '../../types/location';

// Local storage key for persisting location
const LOCATION_STORAGE_KEY = 'user-location';

/**
 * Custom hook for managing user location with localStorage persistence
 * and reverse geocoding capabilities.
 */
export function useLocation() {
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector((state) => state.search.userLocation);
  const [tempCoordinates, setTempCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Reverse geocoding for current location
  const { data: reverseGeocodeResult } = useReverseGeocodeQuery(
    {
      lat: tempCoordinates?.lat || 0,
      lng: tempCoordinates?.lng || 0,
    },
    {
      skip: !tempCoordinates?.lat || !tempCoordinates?.lng,
    }
  );

  // Load location from localStorage on mount
  const loadLocationFromStorage = useCallback(() => {
    try {
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        return parsedLocation as UserLocation;
      }
    } catch (error) {
      console.error('Error loading location from localStorage:', error);
    }
    return null;
  }, []);

  // Save location to localStorage
  const saveLocationToStorage = useCallback((location: UserLocation | null) => {
    try {
      if (location) {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
      } else {
        localStorage.removeItem(LOCATION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving location to localStorage:', error);
    }
  }, []);

  // Set location with automatic localStorage persistence
  const setLocation = useCallback(
    (location: UserLocation | null) => {
      dispatch(setUserLocation(location));
      saveLocationToStorage(location);
    },
    [dispatch, saveLocationToStorage]
  );

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation({ lat: null, lng: null, location: null });
    setTempCoordinates(null);
  }, [setLocation]);

  // Get current location from browser with reverse geocoding
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Store coordinates temporarily for reverse geocoding
      setTempCoordinates({ lat: latitude, lng: longitude });

      // Set a temporary location with coordinates while we get the address
      const tempLocation: UserLocation = {
        lat: latitude,
        lng: longitude,
        location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };

      setLocation(tempLocation);
      return tempLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      throw new Error('Unable to get your location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  }, [setLocation]);

  // Initialize location from localStorage on mount
  const initializeLocation = useCallback(() => {
    const savedLocation = loadLocationFromStorage();
    if (savedLocation) {
      dispatch(setUserLocation(savedLocation));
    }
  }, [loadLocationFromStorage, dispatch]);

  // Auto-initialize location from localStorage on mount
  useEffect(() => {
    // Only initialize once on mount
    initializeLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update location with reverse geocoded address when available
  useEffect(() => {
    if (reverseGeocodeResult && tempCoordinates) {
      const { lat, lng } = tempCoordinates;

      // Transform the reverse geocoding result into a standardized location object
      const transformedLocation = transformReverseGeocodeResult(
        reverseGeocodeResult,
        lat,
        lng
      );

      setLocation(transformedLocation);

      // Clear temporary coordinates
      setTempCoordinates(null);
    }
  }, [reverseGeocodeResult, tempCoordinates, setLocation]);

  return {
    // State
    location: userLocation,
    hasLocation: Boolean(userLocation?.lat && userLocation?.lng),
    isGettingLocation,

    // Actions
    setLocation,
    clearLocation,
    getCurrentLocation,
    initializeLocation,

    // Utilities
    loadLocationFromStorage,
    saveLocationToStorage,
  };
}
