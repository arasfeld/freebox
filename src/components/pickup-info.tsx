'use client';

import { Phone, Mail, MapPin, Clock, Package, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { UserProfile } from '@/types/user';

interface PickupInfoProps {
  user: UserProfile;
  itemTitle: string;
}

export function PickupInfo({ user, itemTitle }: PickupInfoProps) {
  const formatAddress = () => {
    const parts = [user.address, user.city, user.state, user.zipCode].filter(
      Boolean
    );
    return parts.join(', ');
  };

  const getContactMethod = () => {
    switch (user.preferredContact) {
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'both':
        return 'Email or Phone';
      default:
        return 'Email';
    }
  };

  const getPickupMethod = () => {
    switch (user.preferredPickupMethod) {
      case 'curbside':
        return 'Curbside Pickup';
      case 'door':
        return 'Door Pickup';
      case 'meet':
        return 'Meet in Person';
      case 'other':
        return 'Other (see instructions)';
      default:
        return 'Meet in Person';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Pickup Information
        </CardTitle>
        <CardDescription>
          Contact and pickup details for "{itemTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user.name || 'Anonymous'}</span>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        {user.showContactInfo && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Contact Information</h4>
            <div className="space-y-2">
              {user.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Preferred contact: {getContactMethod()}
              </div>
            </div>
          </div>
        )}

        {/* Address */}
        {user.showAddress && user.address && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Pickup Location</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{formatAddress()}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pickup Preferences */}
        {(user.pickupInstructions ||
          user.availableHours ||
          user.preferredPickupMethod) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Pickup Details</h4>
              <div className="space-y-2">
                {user.preferredPickupMethod && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getPickupMethod()}
                    </Badge>
                  </div>
                )}
                {user.availableHours && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{user.availableHours}</span>
                  </div>
                )}
                {user.pickupInstructions && (
                  <div className="text-sm">
                    <div className="font-medium mb-1">Instructions:</div>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {user.pickupInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Privacy Notice */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p>
            This information is shared to help coordinate the pickup. Please be
            respectful and contact the user to arrange a convenient time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
