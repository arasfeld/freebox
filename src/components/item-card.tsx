'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  useExpressInterestMutation,
  useRemoveInterestMutation,
} from '@/lib/features/items/itemsApi';
import { ITEM_STATUS_COLORS } from '@/types/search';

import type { Item } from '@/lib/features/items/itemsApi';

interface ItemCardProps {
  item: Item;
  onStatusChange?: (itemId: string, newStatus: string) => void;
}

export function ItemCard({ item, onStatusChange }: ItemCardProps) {
  const [expressInterest, { isLoading: isExpressingInterest }] =
    useExpressInterestMutation();
  const [removeInterest, { isLoading: isRemovingInterest }] =
    useRemoveInterestMutation();
  const [localHasExpressedInterest, setLocalHasExpressedInterest] = useState(
    item.hasExpressedInterest || false
  );

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
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              className="object-cover"
            />
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
              <Button
                size="sm"
                onClick={handleExpressInterest}
                disabled={isExpressingInterest}
              >
                {isExpressingInterest ? 'Expressing...' : "I'm Interested"}
              </Button>
            )}
            {localHasExpressedInterest && !item.isOwner && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  Interest Expressed ✓
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleUndoInterest}
                  disabled={isRemovingInterest}
                  className="text-xs text-muted-foreground hover:text-red-600"
                >
                  {isRemovingInterest ? 'Removing...' : 'Undo'}
                </Button>
              </div>
            )}
            {item.isOwner && isAvailable && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                Your Item
              </Badge>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link href={`/items/${item.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
