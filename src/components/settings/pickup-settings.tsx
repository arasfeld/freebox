'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Package, Clock, MapPin } from 'lucide-react';

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

import {
  useGetUserProfileQuery,
  useUpdatePickupMutation,
} from '@/lib/features/user/userApi';

export function PickupSettings() {
  const { data: session } = useSession();
  const { data: userProfile, isLoading } = useGetUserProfileQuery(
    session?.user?.id
  );
  const [updatePickup, { isLoading: isUpdating }] = useUpdatePickupMutation();

  const [pickupInstructions, setPickupInstructions] = useState('');
  const [availableHours, setAvailableHours] = useState('');
  const [preferredPickupMethod, setPreferredPickupMethod] = useState('meet');

  useEffect(() => {
    if (userProfile) {
      setPickupInstructions(userProfile.pickupInstructions || '');
      setAvailableHours(userProfile.availableHours || '');
      setPreferredPickupMethod(userProfile.preferredPickupMethod || 'meet');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePickup({
        pickupInstructions: pickupInstructions.trim() || null,
        availableHours: availableHours.trim() || null,
        preferredPickupMethod: preferredPickupMethod as
          | 'curbside'
          | 'door'
          | 'meet'
          | 'other',
      }).unwrap();

      toast.success('Pickup preferences updated successfully');
    } catch (error) {
      console.error('Failed to update pickup preferences:', error);
      toast.error('Failed to update pickup preferences');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pickup Preferences
          </CardTitle>
          <CardDescription>
            Configure how you prefer to handle item pickups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Pickup Preferences
        </CardTitle>
        <CardDescription>
          Configure how you prefer to handle item pickups and provide
          instructions for users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferred Pickup Method */}
          <div className="space-y-2">
            <Label htmlFor="pickupMethod">Preferred Pickup Method</Label>
            <Select
              value={preferredPickupMethod}
              onValueChange={setPreferredPickupMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pickup method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meet">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Meet in person
                  </div>
                </SelectItem>
                <SelectItem value="curbside">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Curbside pickup
                  </div>
                </SelectItem>
                <SelectItem value="door">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Door pickup
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Other (specify in instructions)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How would you prefer to hand off items to users?
            </p>
          </div>

          {/* Available Hours */}
          <div className="space-y-2">
            <Label htmlFor="availableHours">Available Hours</Label>
            <Input
              id="availableHours"
              name="available-hours"
              type="text"
              placeholder="e.g., Weekdays 6-8pm, Weekends 10am-4pm"
              value={availableHours}
              onChange={(e) => setAvailableHours(e.target.value)}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              When are you typically available for pickups?
            </p>
          </div>

          {/* Pickup Instructions */}
          <div className="space-y-2">
            <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
            <Textarea
              id="pickupInstructions"
              name="pickup-instructions"
              placeholder="Enter any special instructions for pickup, such as parking information, building access, or specific meeting points..."
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              rows={4}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Provide any additional details that would help users find you or
              understand the pickup process
            </p>
          </div>

          {/* Example Instructions */}
          <div className="space-y-2">
            <Label>Example Instructions</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• "Park in visitor spots near the main entrance"</p>
              <p>• "Call when you arrive and I'll meet you downstairs"</p>
              <p>• "Enter through the side door, I'm in apartment 3B"</p>
              <p>• "Meet at the coffee shop next door"</p>
            </div>
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Pickup Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
