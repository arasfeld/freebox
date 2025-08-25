'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Heart,
  HeartOff,
  User,
} from 'lucide-react';

import { ImageModal } from '@/components/image-modal';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  useExpressInterestMutation,
  useRemoveInterestMutation,
} from '@/lib/features/items/itemsApi';
import { ITEM_STATUS_COLORS } from '@/types/search';

import type { Item } from '@/lib/features/items/itemsApi';

interface ItemCardProps {
  item: Item;
  onStatusChange?: (
    itemId: string,
    newStatus: 'AVAILABLE' | 'PENDING' | 'TAKEN'
  ) => void;
  onDelete?: (itemId: string) => void;
}

export function ItemCard({ item, onStatusChange, onDelete }: ItemCardProps) {
  const [expressInterest, { isLoading: isExpressingInterest }] =
    useExpressInterestMutation();
  const [removeInterest, { isLoading: isRemovingInterest }] =
    useRemoveInterestMutation();
  const [localHasExpressedInterest, setLocalHasExpressedInterest] = useState(
    item.hasExpressedInterest || false
  );
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusColor = useCallback((status: string) => {
    return (
      ITEM_STATUS_COLORS[status as keyof typeof ITEM_STATUS_COLORS] ||
      ITEM_STATUS_COLORS.TAKEN
    );
  }, []);

  const handleUndoInterest = useCallback(async () => {
    try {
      await removeInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(false);
      onStatusChange?.(item.id, 'AVAILABLE');
      toast.success('Interest removed', {
        description: 'Your interest has been removed from this item.',
      });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast.error('Failed to remove interest', {
        description: 'Please try again later.',
      });
    }
  }, [removeInterest, item.id, onStatusChange]);

  const handleExpressInterest = useCallback(async () => {
    try {
      await expressInterest({ itemId: item.id }).unwrap();
      setLocalHasExpressedInterest(true);
      onStatusChange?.(item.id, 'PENDING');

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
  }, [expressInterest, handleUndoInterest, item.id, onStatusChange]);

  const isAvailable = item.status === 'AVAILABLE';
  const hasMultipleImages = item.images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
        </div>
        {item.category && (
          <Badge variant="outline" className="w-fit">
            {item.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {item.images.length > 0 && (
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
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

            {/* Carousel Navigation */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-8 w-8 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-8 w-8 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        )}

        {item.location && (
          <p className="text-sm text-muted-foreground">📍 {item.location}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={item.user.image || ''}
                alt={item.user.name || ''}
              />
              <AvatarFallback className="text-xs">
                {item.user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {item.user.name || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAvailable && !item.isOwner && !localHasExpressedInterest && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleExpressInterest}
                    disabled={isExpressingInterest}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    {isExpressingInterest ? 'Expressing...' : "I'm Interested"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Express Interest</p>
                </TooltipContent>
              </Tooltip>
            )}
            {localHasExpressedInterest && !item.isOwner && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Interest Expressed
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleUndoInterest}
                      disabled={isRemovingInterest}
                      className="text-xs text-muted-foreground hover:text-red-600"
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Interest</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {item.isOwner && isAvailable && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                <User className="h-3 w-3 mr-1" />
                Your Item
              </Badge>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/items/${item.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>

            {/* Owner Management Actions */}
            {item.isOwner && (
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/items/${item.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Item</p>
                  </TooltipContent>
                </Tooltip>
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Item</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Image Modal */}
      <ImageModal
        images={item.images}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </Card>
  );
}
