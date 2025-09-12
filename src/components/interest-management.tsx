'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Check, UserCheck } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
        <CardTitle>Interest Management</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and select who should receive this item. Consider fairness
          scores and response times.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sortedInterests.map((interest, index) => {
          const fairness = getFairnessScore(interest.userStats);
          const timeSinceInterest = new Date(
            interest.timestamp
          ).toLocaleString();
          const isSelected = interest.selected;
          const isItemTaken = (item.status as string) === 'TAKEN';
          const hasAnySelection = sortedInterests.some((i) => i.selected);
          const isDisabled = hasAnySelection && !isSelected;

          return (
            <div
              key={interest.userId}
              className={`flex items-center justify-between space-x-4 ${
                isDisabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={interest.user?.image || ''}
                    alt={interest.user?.name || 'User avatar'}
                  />
                  <AvatarFallback>
                    {interest.user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p
                    className={`text-sm font-medium leading-none ${
                      isDisabled ? 'text-muted-foreground' : ''
                    }`}
                  >
                    {interest.user?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interested since {timeSinceInterest}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`${fairness.color} ${
                        isDisabled ? 'opacity-60' : ''
                      }`}
                      variant="outline"
                    >
                      {fairness.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {interest.userStats.totalItemsGiven} given /{' '}
                      {interest.userStats.totalItemsReceived} received
                    </span>
                  </div>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => handleSelectRecipient(interest.userId)}
                    disabled={isSelecting || isItemTaken || isDisabled}
                    variant="outline"
                    className={
                      isSelected
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isSelected
                      ? 'Selected as Recipient'
                      : isDisabled
                      ? 'Another recipient is selected'
                      : 'Select as Recipient'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
