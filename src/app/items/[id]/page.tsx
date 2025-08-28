'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

import { DeleteModal } from '@/components/delete-modal';
import { ImageModal } from '@/components/image-modal';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
  useExpressInterestMutation,
  useRemoveInterestMutation,
} from '@/lib/features/items/itemsApi';
import { toast } from 'sonner';

import type { ItemWithDistance } from '@/types';
import { Layout } from '@/components/layout';
import { ArrowLeft, Edit, Trash2, Heart, HeartOff } from 'lucide-react';

import { InterestManagement } from '@/components/interest-management';

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id } = use(params);

  const [item, setItem] = useState<ItemWithDistance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const handleUndoInterest = useCallback(async () => {
    try {
      await removeInterest({ itemId: item?.id || '' }).unwrap();
      toast.success('Interest removed', {
        description: 'Your interest has been removed from this item.',
      });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast.error('Failed to remove interest', {
        description: 'Please try again later.',
      });
    }
  }, [removeInterest, item?.id]);

  const handleExpressInterest = useCallback(async () => {
    try {
      await expressInterest({ itemId: item?.id || '' }).unwrap();

      // Show success notification with undo option
      toast.success('Interest expressed successfully!', {
        description: 'The item owner will be notified of your interest.',
        action: {
          label: 'Undo',
          onClick: () => handleUndoInterest(),
        },
        duration: 5000, // 5 seconds to allow undo
      });
    } catch (error) {
      console.error('Failed to express interest:', error);
      toast.error('Failed to express interest', {
        description: 'Please try again later.',
      });
    }
  }, [expressInterest, handleUndoInterest, item?.id]);

  const handleRemoveInterest = useCallback(async () => {
    if (!item) return;

    try {
      await removeInterest({ itemId: item.id }).unwrap();
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

  const handleDelete = async () => {
    if (!item) return;

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-32" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'The item you are looking for does not exist.'}
            </p>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Button>

        {loading ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </div>
        ) : item ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Item Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  {item.images.length > 0 ? (
                    <Image
                      src={item.images[currentImageIndex]}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      className="object-cover cursor-pointer"
                      priority={currentImageIndex === 0}
                      onClick={() => setImageModalOpen(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>
                {item.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded overflow-hidden cursor-pointer border-2 ${
                          index === currentImageIndex
                            ? 'border-primary'
                            : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${item.title} - Image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.category && (
                          <Badge variant="outline">{item.category}</Badge>
                        )}
                      </div>
                    </div>
                    {item.isOwner && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/items/${item.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Location */}
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{item.location}</span>
                    {item.distance && (
                      <span>({item.distance.toFixed(1)} km)</span>
                    )}
                  </div>
                )}

                {/* Owner Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posted by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.user.image || undefined} />
                        <AvatarFallback>
                          {item.user.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {item.user.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {!item.isOwner && (
                  <div className="space-y-3">
                    {item.hasExpressedInterest ? (
                      <Button
                        variant="outline"
                        onClick={handleRemoveInterest}
                        disabled={isRemovingInterest}
                        className="w-full"
                      >
                        <HeartOff className="h-4 w-4 mr-2" />
                        Remove Interest
                      </Button>
                    ) : (
                      <Button
                        onClick={handleExpressInterest}
                        disabled={isExpressingInterest}
                        className="w-full"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Express Interest
                      </Button>
                    )}
                  </div>
                )}

                {/* Interest Management (for owners) */}
                {item.isOwner &&
                  item.interests &&
                  item.interests.length > 0 && (
                    <InterestManagement item={item} />
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Item not found.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {item && (
        <ImageModal
          images={item.images}
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          initialIndex={currentImageIndex}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </Layout>
  );
}
