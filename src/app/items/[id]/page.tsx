'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { ImageModal } from '@/components/image-modal';
import { DeleteModal } from '@/components/delete-modal';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import LoginBtn from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';
import { InterestManagement } from '@/components/interest-management';

import {
  useExpressInterestMutation,
  useRemoveInterestMutation,
} from '@/lib/features/items/itemsApi';
import { toast } from 'sonner';

import type { Item } from '@/lib/features/items/itemsApi';

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = use(params);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [localHasExpressedInterest, setLocalHasExpressedInterest] =
    useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [expressInterest, { isLoading: isExpressingInterest }] =
    useExpressInterestMutation();
  const [removeInterest, { isLoading: isRemovingInterest }] =
    useRemoveInterestMutation();

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const fetchItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/items/${id}`);
      if (!response.ok) {
        throw new Error('Item not found');
      }
      const data = await response.json();
      setItem(data);
      setLocalHasExpressedInterest(data.hasExpressedInterest || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!item) return;

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
      setDeleteModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20';
      case 'TAKEN':
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUndoInterest = useCallback(async () => {
    if (!item) return;

    try {
      await removeInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(false);
      setItem((prev) =>
        prev
          ? { ...prev, status: 'AVAILABLE', hasExpressedInterest: false }
          : null
      );
      toast.success('Interest removed', {
        description: 'Your interest has been removed from this item.',
      });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast.error('Failed to remove interest', {
        description: 'Please try again later.',
      });
    }
  }, [removeInterest, item]);

  const handleExpressInterest = useCallback(async () => {
    if (!item) return;

    try {
      await expressInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(true);
      setItem((prev) =>
        prev ? { ...prev, status: 'PENDING', hasExpressedInterest: true } : null
      );

      toast.success('Interest expressed successfully!', {
        description: 'The item owner will be notified of your interest.',
        action: {
          label: 'Undo',
          onClick: () => handleUndoInterest(),
        },
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to express interest:', error);
      toast.error('Failed to express interest', {
        description: 'Please try again later.',
      });
    }
  }, [expressInterest, handleUndoInterest, item]);

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
                <div className="space-y-4">
                  {/* Main Image */}
                  <div
                    className="relative h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setSelectedImageIndex(0);
                      setImageModalOpen(true);
                    }}
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                        Click to view full size
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {item.images.slice(1).map((image, index) => (
                        <div
                          key={index + 1}
                          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedImageIndex(index + 1);
                            setImageModalOpen(true);
                          }}
                        >
                          <Image
                            src={image}
                            alt={`${item.title} - Image ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
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

              {/* Interest Management */}
              {isOwner && item.interests && item.interests.length > 0 && (
                <InterestManagement item={item} />
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
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push(`/items/${item.id}/edit`)}
                      >
                        Edit Item
                      </Button>
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Delete Item
                      </Button>
                    </>
                  ) : (
                    <>
                      {item.status === 'AVAILABLE' &&
                        !item.hasExpressedInterest &&
                        !localHasExpressedInterest && (
                          <Button
                            className="w-full"
                            onClick={handleExpressInterest}
                            disabled={isExpressingInterest}
                          >
                            {isExpressingInterest
                              ? 'Expressing...'
                              : "I'm Interested"}
                          </Button>
                        )}
                      {item.hasExpressedInterest ||
                      localHasExpressedInterest ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-600 text-sm font-medium">
                              Interest Expressed ✓
                            </span>
                          </div>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleUndoInterest}
                            disabled={isRemovingInterest}
                          >
                            {isRemovingInterest
                              ? 'Removing...'
                              : 'Remove Interest'}
                          </Button>
                        </div>
                      ) : null}
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        description="This action cannot be undone."
        itemName={item?.title}
      />

      {/* Image Modal */}
      <ImageModal
        images={item.images}
        initialIndex={selectedImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </div>
  );
}
