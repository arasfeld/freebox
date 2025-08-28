'use client';

import { useCallback, useMemo, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

import { AutoComplete } from '@/components/autocomplete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useLocation } from '@/lib/hooks/useLocation';
import {
  useGeocodeAddressQuery,
  useGetNearbyPlacesQuery,
} from '@/lib/features/location/locationApi';

import type { GeocodeResult } from '@/types';

export function LocationPicker() {
  const {
    location: userLocation,
    hasLocation,
    isGettingLocation,
    setLocation,
    clearLocation,
    getCurrentLocation,
  } = useLocation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // RTK Query hooks
  const { data: locationOptions = [], isLoading: isSearching } =
    useGeocodeAddressQuery(
      { query: searchValue, limit: 5 },
      {
        skip: !searchValue || searchValue.length < 2,
      }
    );
  const { data: nearbyPlaces = [] } = useGetNearbyPlacesQuery(
    {
      lat: userLocation?.lat || 0,
      lng: userLocation?.lng || 0,
      radius: 5000,
    },
    {
      skip: !userLocation?.lat || !userLocation?.lng,
    }
  );

  // Transform location options for autocomplete - memoized to prevent unnecessary re-renders
  const transformedLocationOptions = useMemo(
    () =>
      locationOptions.map((result) => ({
        value: result.displayName,
        label: result.displayName,
      })),
    [locationOptions]
  );

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      await getCurrentLocation();
      setIsDialogOpen(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to get your location. Please search for a location instead.'
      );
    }
  }, [getCurrentLocation]);

  const handleLocationSelect = useCallback(
    (locationName: string) => {
      // Find the location data from search results
      const location = locationOptions.find(
        (loc) => loc.displayName === locationName
      );

      if (location) {
        setLocation({
          lat: location.lat,
          lng: location.lng,
          location: location.displayName,
        });
      }

      setSearchValue('');
      setSelectedLocation('');
      setIsDialogOpen(false);
    },
    [locationOptions, setLocation]
  );

  const handleNearbyPlaceSelect = useCallback(
    (location: GeocodeResult) => {
      setLocation({
        lat: location.lat,
        lng: location.lng,
        location: location.displayName,
      });
      setIsDialogOpen(false);
    },
    [setLocation]
  );

  const handleClearLocation = useCallback(() => {
    clearLocation();
    setSelectedLocation('');
  }, [clearLocation]);

  const getLocationIcon = useCallback((location: GeocodeResult) => {
    if (location.city) return '🏙️';
    if (location.state) return '🗺️';
    return '📍';
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {userLocation?.location ? (
            <>
              📍
              {userLocation.location.length > 20
                ? `${userLocation.location.substring(0, 20)}...`
                : userLocation.location}
            </>
          ) : (
            'Set Location'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="location-picker-description"
      >
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
          <DialogDescription>
            Set your location to see items sorted by distance and find nearby
            places.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-full overflow-hidden space-y-4">
          {/* Current Location Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Use Current Location</label>
            <Button
              onClick={handleGetCurrentLocation}
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
              items={transformedLocationOptions}
              isLoading={isSearching}
              emptyMessage="No locations found."
              placeholder="Search for a city, address, or place..."
            />
          </div>

          {/* Nearby Places - only show if user has a location set */}
          {hasLocation && nearbyPlaces.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Nearby Places</label>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {nearbyPlaces.map((place, index) => (
                  <button
                    key={index}
                    onClick={() => handleNearbyPlaceSelect(place)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0">
                        {getLocationIcon(place)}
                      </span>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="font-medium truncate text-sm">
                          {place.displayName}
                        </div>
                        {place.city && place.state && (
                          <div className="text-xs text-muted-foreground truncate">
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

          {/* Current Location Display - only show if location is set */}
          {userLocation?.location && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Location</label>
              <div className="flex items-center justify-between p-3 border rounded-lg min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="flex-shrink-0">📍</span>
                  <span className="font-medium truncate text-sm">
                    {userLocation.location}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLocation}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
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
