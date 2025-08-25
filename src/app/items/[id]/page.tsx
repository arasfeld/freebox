'use client';

import {
  ArrowLeft,
  Edit,
  Heart,
  HeartOff,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { ImageModal } from '@/components/image-modal';
import { InterestManagement } from '@/components/interest-management';
import { LoginBtn } from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';

import {
  useExpressInterestMutation,
  useRemoveInterestMutation,
} from '@/lib/features/items/itemsApi';
import { ITEM_STATUS_COLORS } from '@/types/search';

import type { Item } from '@/lib/features/items/itemsApi';

export default function ItemPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localHasExpressedInterest, setLocalHasExpressedInterest] =
    useState(false);

  const [expressInterest, { isLoading: isExpressingInterest }] =
    useExpressInterestMutation();
  const [removeInterest, { isLoading: isRemovingInterest }] =
    useRemoveInterestMutation();

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/items/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
        setLocalHasExpressedInterest(data.hasExpressedInterest || false);
      } else if (response.status === 404) {
        setError('Item not found');
      } else {
        setError('Failed to load item');
      }
    } catch (err) {
      setError('Failed to load item');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (!params?.id) return;
    fetchItem();
  }, [fetchItem, params?.id]);

  const handleExpressInterest = async () => {
    if (!item) return;

    try {
      await expressInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(true);
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
  };

  const handleUndoInterest = async () => {
    if (!item) return;

    try {
      await removeInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(false);
      toast.success('Interest removed', {
        description: 'Your interest has been removed from this item.',
      });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast.error('Failed to remove interest', {
        description: 'Please try again later.',
      });
    }
  };

  const getStatusColor = (status: string) => {
    return (
      ITEM_STATUS_COLORS[status as keyof typeof ITEM_STATUS_COLORS] ||
      ITEM_STATUS_COLORS.TAKEN
    );
  };

  const nextImage = () => {
    if (!item) return;
    setCurrentImageIndex((prev) =>
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!item) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
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
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-32 mb-6" />
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
                <Skeleton className="h-32" />
                <Skeleton className="h-20" />
                <Skeleton className="h-16" />
              </div>
            </div>
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
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setImageModalOpen(true)}
                    >
                      <Image
                        src={item.images[currentImageIndex]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity text-white bg-black/50 px-2 py-1 rounded text-xs">
                          Click to view
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {item.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-8 w-8 p-0 rounded-full"
                          onClick={prevImage}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-8 w-8 p-0 rounded-full"
                          onClick={nextImage}
                        >
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                          {item.images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? 'bg-white'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {item.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {item.images.map((image, index) => (
                        <button
                          key={index}
                          className={`relative h-16 w-16 flex-shrink-0 rounded border-2 transition-colors ${
                            index === currentImageIndex
                              ? 'border-primary'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={image}
                            alt={`${item.title} ${index + 1}`}
                            fill
                            className="object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}

              {/* Item Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  {item.category && (
                    <Badge variant="outline" className="w-fit">
                      {item.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Posted by
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {item.user.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(item.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {isOwner ? (
                      <div className="space-y-2">
                        <Button asChild className="w-full">
                          <Link href={`/items/${item.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Item
                          </Link>
                        </Button>
                        <InterestManagement item={item} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {item.status === 'AVAILABLE' &&
                          !localHasExpressedInterest && (
                            <Button
                              onClick={handleExpressInterest}
                              disabled={isExpressingInterest}
                              className="w-full"
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              {isExpressingInterest
                                ? 'Expressing Interest...'
                                : "I'm Interested"}
                            </Button>
                          )}
                        {localHasExpressedInterest && (
                          <div className="space-y-2">
                            <Badge
                              variant="outline"
                              className="w-full justify-center text-green-600 border-green-600"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Interest Expressed
                            </Badge>
                            <Button
                              variant="outline"
                              onClick={handleUndoInterest}
                              disabled={isRemovingInterest}
                              className="w-full"
                            >
                              <HeartOff className="h-4 w-4 mr-2" />
                              Remove Interest
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={item.images}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </div>
  );
}
