'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { User, Upload } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { useUpdateProfileMutation } from '@/lib/features/user/userApi';

export function ProfileSettings() {
  const { data: session, update } = useSession();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [name, setName] = useState(session?.user?.name || '');
  const [image, setImage] = useState(session?.user?.image || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        name: name.trim() || null,
        image: image.trim() || null,
      }).unwrap();

      // Update the session to reflect changes
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name.trim() || null,
          image: image.trim() || null,
        },
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your basic profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={image || session?.user?.image || ''} />
              <AvatarFallback>
                {name?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Picture URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  name="photo"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  autoComplete="photo"
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL for your profile picture
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <p className="text-xs text-muted-foreground">
              This is the name that will be displayed to other users
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
