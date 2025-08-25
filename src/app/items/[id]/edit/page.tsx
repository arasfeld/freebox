'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use, useCallback } from 'react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ImageUpload } from '@/components/image-upload';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';

interface EditItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  images: string[];
}

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<EditItemFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    images: [],
  });

  const fetchItem = useCallback(async () => {
    try {
      const response = await fetch(`/api/items/${id}`);
      if (response.ok) {
        const data = await response.json();

        // Check if user owns this item
        if (!data.isOwner) {
          router.push('/dashboard');
          return;
        }

        setFormData({
          title: data.title,
          description: data.description || '',
          category: data.category || '',
          location: data.location || '',
          images: data.images || [],
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.id) {
      router.push('/');
      return;
    }

    fetchItem();
  }, [session, status, fetchItem, router]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Item</h1>
          <p className="text-muted-foreground">Update your item details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Make changes to your item below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter item title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Describe your item"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange('category', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Home & Garden">
                        Home & Garden
                      </SelectItem>
                      <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) =>
                    handleInputChange('images', images)
                  }
                  maxImages={5}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
