'use client';

import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

import { AutoComplete } from '@/components/autocomplete';
import { ImageUpload } from '@/components/image-upload';
import { Layout } from '@/components/layout';
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

import { useLocationSearch } from '@/lib/features/location/useLocationSearch';

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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use optimized location search hook
  const {
    searchValue: locationSearch,
    locationOptions: transformedLocationOptions,
    isLoading: isSearchingLocation,
    handleSearchChange: setLocationSearch,
  } = useLocationSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 5,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
            latitude: null,
            longitude: null,
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
    },
    [title, description, category, location, images, router]
  );

  const handleLocationSelect = useCallback(
    (locationName: string) => {
      setLocation(locationName);
      setSelectedLocation(locationName);
      // Clear the search input
      setLocationSearch('');
    },
    [setLocationSearch]
  );

  if (status === 'loading') {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (!session?.user?.id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to post an item.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                      items={transformedLocationOptions}
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
                          {/* selectedCoordinates && ( // This line was removed */}
                          {/*   <span className="text-xs text-muted-foreground"> */}
                          {/*     ({selectedCoordinates.lat.toFixed(4)},{' '} */}
                          {/*     {selectedCoordinates.lng.toFixed(4)}) */}
                          {/*   </span> */}
                          {/* ) */}
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
    </Layout>
  );
}
