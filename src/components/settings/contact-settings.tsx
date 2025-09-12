'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Phone, Mail, MessageSquare } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useGetUserProfileQuery,
  useUpdateContactMutation,
} from '@/lib/features/user/userApi';

export function ContactSettings() {
  const { data: session } = useSession();
  const { data: userProfile, isLoading } = useGetUserProfileQuery(
    session?.user?.id
  );
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');

  useEffect(() => {
    if (userProfile) {
      setPhone(userProfile.phone || '');
      setPreferredContact(userProfile.preferredContact || 'email');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateContact({
        phone: phone.trim() || null,
        preferredContact: preferredContact as 'email' | 'phone' | 'both',
      }).unwrap();

      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Failed to update contact information:', error);
      toast.error('Failed to update contact information');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Manage your contact information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
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
          <Phone className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Manage your contact information and preferences for item pickups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="tel"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
            <p className="text-xs text-muted-foreground">
              Your phone number will be shared with users picking up your items
            </p>
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-2">
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select
              value={preferredContact}
              onValueChange={setPreferredContact}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email only
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone only
                  </div>
                </SelectItem>
                <SelectItem value="both">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Both email and phone
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How would you prefer to be contacted for item pickups?
            </p>
          </div>

          {/* Current Email Display */}
          <div className="space-y-2">
            <Label>Current Email</Label>
            <Input
              name="email"
              type="email"
              value={session?.user?.email || ''}
              disabled
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground">
              Email address is managed through your authentication provider
            </p>
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Contact Information'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
