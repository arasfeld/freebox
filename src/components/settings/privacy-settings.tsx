'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import {
  useGetUserProfileQuery,
  useUpdatePrivacyMutation,
} from '@/lib/features/user/userApi';

export function PrivacySettings() {
  const { data: session } = useSession();
  const { data: userProfile, isLoading } = useGetUserProfileQuery(
    session?.user?.id
  );
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setShowContactInfo(userProfile.showContactInfo || false);
      setShowAddress(userProfile.showAddress || false);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePrivacy({
        showContactInfo,
        showAddress,
      }).unwrap();

      toast.success('Privacy settings updated successfully');
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      toast.error('Failed to update privacy settings');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control what information is shared with other users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control what information is shared with other users when they're
          interested in your items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Privacy */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="showContactInfo" className="text-base">
                Share Contact Information
              </Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {showContactInfo ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {showContactInfo ? 'Visible to others' : 'Hidden from others'}
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, users can see your phone number and preferred
                contact method
              </p>
            </div>
            <Switch
              id="showContactInfo"
              checked={showContactInfo}
              onCheckedChange={setShowContactInfo}
            />
          </div>

          {/* Address Privacy */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="showAddress" className="text-base">
                Share Address
              </Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {showAddress ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {showAddress ? 'Visible to others' : 'Hidden from others'}
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, users can see your address for pickup coordination
              </p>
            </div>
            <Switch
              id="showAddress"
              checked={showAddress}
              onCheckedChange={setShowAddress}
            />
          </div>

          {/* Privacy Information */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <h4 className="font-medium text-sm">How Privacy Works</h4>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                • <strong>Contact Information:</strong> When shared, users can
                see your phone number and how you prefer to be contacted
              </p>
              <p>
                • <strong>Address:</strong> When shared, users can see your
                address to coordinate pickup location
              </p>
              <p>
                • <strong>Pickup Instructions:</strong> Always shared when you
                have them set up
              </p>
              <p>
                • <strong>Profile Name:</strong> Always visible to help identify
                you
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <h4 className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-2">
              Recommendations
            </h4>
            <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <p>
                • Enable contact information sharing for faster pickup
                coordination
              </p>
              <p>
                • Enable address sharing if you're comfortable with users
                knowing your location
              </p>
              <p>
                • You can always change these settings before each item pickup
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Privacy Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
