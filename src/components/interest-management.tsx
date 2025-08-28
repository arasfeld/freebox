'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useSelectRecipientMutation } from '@/lib/features/items/itemsApi';
import { ITEM_STATUS_COLORS } from '@/types/search';

import type { InterestEntry } from '@/types/search';
import type { ItemWithDistance, ItemInterest } from '@/types';

interface InterestManagementProps {
  item: ItemWithDistance;
}

export function InterestManagement({ item }: InterestManagementProps) {
  const [selectRecipient, { isLoading: isSelecting }] =
    useSelectRecipientMutation();

  const handleSelectRecipient = useCallback(
    async (recipientUserId: string) => {
      const recipientName =
        item.interests?.find(
          (interest: ItemInterest) => interest.userId === recipientUserId
        )?.user?.name || 'Unknown User';

      try {
        await selectRecipient({ itemId: item.id, recipientUserId }).unwrap();

        toast.success(`${recipientName} has been selected as the recipient!`, {
          description: 'The item has been marked as given away.',
          action: {
            label: 'Undo',
            onClick: () => {
              // TODO: Implement undo functionality
              toast.info('Undo functionality coming soon');
            },
          },
        });
      } catch (error) {
        console.error('Failed to select recipient:', error);
        toast.error('Failed to select recipient', {
          description:
            'Please try again or contact support if the problem persists.',
        });
      }
    },
    [selectRecipient, item.id, item.interests]
  );

  const sortedInterests = useMemo(() => {
    if (!item.interests) return [];
    return [...item.interests].sort(
      (a: ItemInterest, b: ItemInterest) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [item.interests]);

  const getFairnessScore = useCallback((stats: InterestEntry['userStats']) => {
    const { totalItemsReceived, totalItemsGiven } = stats;

    if (totalItemsGiven === 0 && totalItemsReceived === 0) {
      return {
        score: 0,
        label: 'New User',
        color:
          'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20',
      };
    }

    if (totalItemsGiven === 0) {
      return {
        score: 0,
        label: 'Taker Only',
        color:
          'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:bg-red-500/20',
      };
    }

    const ratio = totalItemsGiven / totalItemsReceived;

    if (ratio >= 2) {
      return {
        score: ratio,
        label: 'Very Fair',
        color:
          'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20',
      };
    } else if (ratio >= 1) {
      return {
        score: ratio,
        label: 'Fair',
        color:
          'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20',
      };
    } else {
      return {
        score: ratio,
        label: 'Takes More',
        color:
          'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/20',
      };
    }
  }, []);

  if (!item.isOwner) {
    return null;
  }

  if ((item.status as string) === 'TAKEN') {
    const selectedInterest = item.interests?.find(
      (interest: ItemInterest) => interest.selected
    );
    const recipientName = selectedInterest?.user?.name || 'Unknown User';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Item Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge className={ITEM_STATUS_COLORS.TAKEN}>
              Item has been given away
            </Badge>
            <p className="text-sm text-muted-foreground">
              Recipient: <span className="font-medium">{recipientName}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!item.interests || item.interests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interest Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No one has expressed interest in this item yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Interest Management ({item.interests.length} interested)
          {(item.status as string) === 'TAKEN' && (
            <Badge className="ml-2 bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20">
              Recipient Selected
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {(item.status as string) === 'TAKEN'
            ? 'A recipient has been selected for this item.'
            : 'Review and select who should receive this item. Consider fairness scores and response times.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedInterests.map((interest, index) => {
          const fairness = getFairnessScore(interest.userStats);
          const timeSinceInterest = new Date(
            interest.timestamp
          ).toLocaleString();
          const isSelected = interest.selected;
          const isItemTaken = (item.status as string) === 'TAKEN';

          return (
            <div
              key={interest.userId}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                isSelected ? 'border-green-500 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={interest.user?.image || ''}
                      alt={interest.user?.name || 'User avatar'}
                    />
                    <AvatarFallback>
                      {interest.user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <p className="font-medium">
                    {interest.user?.name || 'Unknown User'}
                    {isSelected && (
                      <Badge className="ml-2 bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/20">
                        Selected ✓
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interested since {timeSinceInterest}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <Badge className={fairness.color}>{fairness.label}</Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {interest.userStats.totalItemsGiven} given /{' '}
                    {interest.userStats.totalItemsReceived} received
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg response: {interest.userStats.averageResponseTime}h
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleSelectRecipient(interest.userId)}
                  disabled={isSelecting || isItemTaken}
                  variant={isSelected ? 'outline' : 'default'}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
