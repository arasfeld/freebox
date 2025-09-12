'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MapPin, Navigation } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  useGetUserProfileQuery,
  useUpdateAddressMutation,
} from '@/lib/features/user/userApi';
import { useGeocodeAddressQuery } from '@/lib/features/location/locationApi';

export function AddressSettings() {
  const { data: session } = useSession();
  const { data: userProfile, isLoading } = useGetUserProfileQuery(
    session?.user?.id
  );
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults, isLoading: isSearching } =
    useGeocodeAddressQuery(
      { query: searchQuery, limit: 5 },
      { skip: !searchQuery || searchQuery.length < 3 }
    );

  useEffect(() => {
    if (userProfile) {
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setState(userProfile.state || '');
      setZipCode(userProfile.zipCode || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAddress({
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        zipCode: zipCode.trim() || null,
      }).unwrap();

      toast.success('Address updated successfully');
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error('Failed to update address');
    }
  };

  const handleLocationSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = (location: any) => {
    setAddress(location.displayName.split(',')[0] || '');
    setCity(location.city || '');
    setState(location.state || '');
    setZipCode(''); // ZIP code not available in this API response
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
          <CardDescription>Set your address for item pickups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
        <CardDescription>
          Set your address for item pickups. This helps users know where to meet
          you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search for your address</Label>
            <div className="relative">
              <Input
                id="search"
                name="address-search"
                type="text"
                placeholder="Enter your address to search..."
                value={searchQuery}
                onChange={(e) => handleLocationSearch(e.target.value)}
                autoComplete="off"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                </div>
              )}
            </div>
            {searchResults && searchResults.length > 0 && searchQuery && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {searchResults.map((location: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location.displayName}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Search for your address to auto-fill the fields below
            </p>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="street-address"
              type="text"
              placeholder="123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="address-level2"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="address-level1"
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                autoComplete="address-level1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="postal-code"
                type="text"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                autoComplete="postal-code"
              />
            </div>
          </div>

          {/* Current Location Display */}
          {userProfile?.latitude && userProfile?.longitude && (
            <div className="space-y-2">
              <Label>Current Coordinates</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                {userProfile.latitude.toFixed(6)},{' '}
                {userProfile.longitude.toFixed(6)}
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates are automatically set when you search for an address
              </p>
            </div>
          )}

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Address'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
