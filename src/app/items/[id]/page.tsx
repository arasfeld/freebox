'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import LoginBtn from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';

interface Item {
  id: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  location?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'TAKEN';
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

const categories = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys & Games',
  'Other',
];

const locations = [
  'Downtown',
  'North Side',
  'South Side',
  'East Side',
  'West Side',
  'Suburbs',
];

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'AVAILABLE' as 'AVAILABLE' | 'RESERVED' | 'TAKEN',
  });

  useEffect(() => {
    if (params.id) {
      fetchItem(params.id as string);
    }
  }, [params.id]);

  const fetchItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/items/${id}`);
      if (!response.ok) {
        throw new Error('Item not found');
      }
      const data = await response.json();
      setItem(data);
      setEditForm({
        title: data.title,
        description: data.description || '',
        category: data.category || '',
        location: data.location || '',
        status: data.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (item) {
      setEditForm({
        title: item.title,
        description: item.description || '',
        category: item.category || '',
        location: item.location || '',
        status: item.status,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!item) return;

    setEditLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setItem(updatedItem);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'TAKEN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
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
          <div className="text-center py-16">
            <p>Loading item...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
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
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'The item you are looking for does not exist.'}
            </p>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === item.user.id;

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
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Button variant="ghost" onClick={() => router.push('/')}>
              ← Back to Items
            </Button>
          </nav>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item Images */}
              {item.images.length > 0 ? (
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}

              {/* Item Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.category && (
                          <Badge variant="outline">{item.category}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {item.location && (
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-muted-foreground">
                        📍 {item.location}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Posted</h3>
                    <p className="text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Form */}
              {isOwner && isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title *</Label>
                      <Input
                        id="edit-title"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Item title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the item..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select
                          value={editForm.category}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
                        <Label htmlFor="edit-location">Location</Label>
                        <Select
                          value={editForm.location}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, location: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                          value={editForm.status}
                          onValueChange={(
                            value: 'AVAILABLE' | 'RESERVED' | 'TAKEN'
                          ) => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="RESERVED">Reserved</SelectItem>
                            <SelectItem value="TAKEN">Taken</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={editLoading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={editLoading}>
                        {editLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Posted by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={item.user.image || ''}
                        alt={item.user.name || ''}
                      />
                      <AvatarFallback>
                        {item.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {item.user.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Member since {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isOwner ? (
                    <>
                      {!isEditing ? (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={handleEdit}
                        >
                          Edit Item
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel Edit
                        </Button>
                      )}
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Item
                      </Button>
                    </>
                  ) : (
                    <>
                      {item.status === 'AVAILABLE' && (
                        <Button className="w-full">Contact Owner</Button>
                      )}
                      <Button className="w-full" variant="outline">
                        Report Item
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              {!isOwner && item.status === 'AVAILABLE' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Contact the owner to arrange pickup:
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Email:</strong>{' '}
                        {item.user.email || 'Not provided'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please be respectful and arrange pickup at a convenient
                        time.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{item.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
