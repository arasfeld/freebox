'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

import { AutoComplete } from '@/components/autocomplete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUserLocation } from '@/lib/features/search/searchSlice';
import { selectUserLocation } from '@/lib/features/search/searchSelectors';
import {
  geocodeAddress,
  reverseGeocode,
  getNearbyPlaces,
} from '@/lib/location';

import type { GeocodeResult } from '@/lib/location';

export function LocationPicker() {
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(selectUserLocation);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<GeocodeResult[]>([]);

  // Search for locations when search value changes
  useEffect(() => {
    const searchLocations = async () => {
      if (searchValue.length < 2) {
        setLocationOptions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await geocodeAddress(searchValue);
        const options = results.map((result) => ({
          value: result.displayName,
          label: result.displayName,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error('Search error:', error);
        setLocationOptions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Load nearby places when dialog opens
  useEffect(() => {
    if (isDialogOpen && userLocation) {
      loadNearbyPlaces();
    }
  }, [isDialogOpen, userLocation]);

  const loadNearbyPlaces = async () => {
    if (!userLocation || userLocation.lat === null || userLocation.lng === null)
      return;

    try {
      const places = await getNearbyPlaces(userLocation.lat, userLocation.lng);
      setNearbyPlaces(places);
    } catch (error) {
      console.error('Error loading nearby places:', error);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
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

      // Reverse geocode to get the address
      const address = await reverseGeocode(latitude, longitude);

      if (address) {
        dispatch(
          setUserLocation({
            lat: latitude,
            lng: longitude,
            location: address.displayName,
          })
        );

        // Load nearby places
        const places = await getNearbyPlaces(latitude, longitude);
        setNearbyPlaces(places);
      } else {
        // Fallback to coordinates if reverse geocoding fails
        dispatch(
          setUserLocation({
            lat: latitude,
            lng: longitude,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          })
        );
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error getting location:', error);
      alert(
        'Unable to get your location. Please search for a location instead.'
      );
    } finally {
      setIsGettingLocation(false);
    }
  }, [dispatch]);

  const handleLocationSelect = useCallback(
    (locationName: string) => {
      // Find the full location data from search results or nearby places
      const allLocations = [
        ...locationOptions.map((opt) => ({
          displayName: opt.value,
          lat: 0,
          lng: 0,
          city: '',
          state: '',
        })),
        ...nearbyPlaces,
      ];

      const location = allLocations.find(
        (loc) => loc.displayName === locationName
      );

      if (location) {
        dispatch(
          setUserLocation({
            lat: location.lat,
            lng: location.lng,
            location: location.displayName,
          })
        );
      }

      setSearchValue('');
      setSelectedLocation('');
      setLocationOptions([]);
      setIsDialogOpen(false);
    },
    [dispatch, locationOptions, nearbyPlaces]
  );

  const handleNearbyPlaceSelect = useCallback(
    (location: GeocodeResult) => {
      dispatch(
        setUserLocation({
          lat: location.lat,
          lng: location.lng,
          location: location.displayName,
        })
      );
      setIsDialogOpen(false);
    },
    [dispatch]
  );

  const clearLocation = useCallback(() => {
    dispatch(setUserLocation(null));
    setNearbyPlaces([]);
  }, [dispatch]);

  const getLocationIcon = (location: GeocodeResult) => {
    if (location.city) return '🏙️';
    if (location.state) return '🗺️';
    return '📍';
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {userLocation ? (
            <>
              📍
              {userLocation.location && userLocation.location.length > 20
                ? `${userLocation.location.substring(0, 20)}...`
                : userLocation.location || 'Unknown location'}
            </>
          ) : (
            'Set Location'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current Location Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Use Current Location</label>
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full"
              variant="outline"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isGettingLocation
                ? 'Getting Location...'
                : 'Get Current Location'}
            </Button>
          </div>

          {/* Search Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search for a Location</label>
            <AutoComplete
              selectedValue={selectedLocation}
              onSelectedValueChange={handleLocationSelect}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              items={locationOptions}
              isLoading={isSearching}
              emptyMessage="No locations found."
              placeholder="Search for a city, address, or place..."
            />
          </div>

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Nearby Places</label>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {nearbyPlaces.map((place, index) => (
                  <button
                    key={index}
                    onClick={() => handleNearbyPlaceSelect(place)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{getLocationIcon(place)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {place.displayName}
                        </div>
                        {place.city && place.state && (
                          <div className="text-xs text-muted-foreground">
                            {place.city}, {place.state}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Location Display */}
          {userLocation && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Location</label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="font-medium truncate">
                    {userLocation.location}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Your location helps us show you items sorted by distance and provide
            better recommendations. We use OpenStreetMap data for location
            services.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
