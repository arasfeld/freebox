'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { AutoComplete } from '@/components/autocomplete';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

import { LoginBtn } from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';
import { ImageUpload } from '@/components/image-upload';
import { ArrowLeft, Save, Upload } from 'lucide-react';

import { geocodeAddress } from '@/lib/location';

import type { GeocodeResult } from '@/lib/location';

const categories = [
  'Books',
  'Clothing',
  'Electronics',
  'Furniture',
  'Home & Garden',
  'Other',
  'Sports',
  'Toys & Games',
];

export default function PostItemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search for locations when search value changes
  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearch.length < 2) {
        setLocationOptions([]);
        return;
      }

      setIsSearchingLocation(true);
      try {
        const results = await geocodeAddress(locationSearch);
        const options = results.map((result) => ({
          value: result.displayName,
          label: result.displayName,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error('Location search error:', error);
        setLocationOptions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title for your item.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category || null,
          location: location || null,
          latitude: selectedCoordinates?.lat || null,
          longitude: selectedCoordinates?.lng || null,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const item = await response.json();
      router.push(`/items/${item.id}`);
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (locationName: string) => {
    // Find the full location data from search results
    const locationData = locationOptions.find(
      (opt) => opt.value === locationName
    );

    if (locationData) {
      setLocation(locationData.value);
      setSelectedLocation(locationData.value);
      // Note: We don't have coordinates from the autocomplete, so we'll need to geocode again
      // or modify the autocomplete to return full location data
    }

    setLocationSearch('');
    setLocationOptions([]);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Freebox</h1>
              <p className="text-muted-foreground">Everything is free</p>
            </div>
            <div className="flex items-center space-x-4">
              <LoginBtn />
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign in to Post an Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to post items to the marketplace.
              </p>
              <LoginBtn />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Freebox</h1>
            <p className="text-muted-foreground">Everything is free</p>
          </div>
          <div className="flex items-center space-x-4">
            <LoginBtn />
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post an Item</h1>
            <p className="text-muted-foreground">
              Give away something you no longer need. Someone else might find it
              useful!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Free couch in good condition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the item, its condition, and any relevant details..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <AutoComplete
                      selectedValue={selectedLocation}
                      onSelectedValueChange={handleLocationSelect}
                      searchValue={locationSearch}
                      onSearchValueChange={setLocationSearch}
                      items={locationOptions}
                      isLoading={isSearchingLocation}
                      emptyMessage="No locations found."
                      placeholder="Search for a city, address, or place..."
                    />

                    {/* Selected Location Display */}
                    {location && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="text-sm">{location}</span>
                          {selectedCoordinates && (
                            <span className="text-xs text-muted-foreground">
                              ({selectedCoordinates.lat.toFixed(4)},{' '}
                              {selectedCoordinates.lng.toFixed(4)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Images</Label>
                  <ImageUpload
                    images={images}
                    onImagesChange={(images) => setImages(images)}
                    maxImages={5}
                  />
                </div>

                {isSubmitting && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600">Posting item...</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="h-4 w-4" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Post Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
