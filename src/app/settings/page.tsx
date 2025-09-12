'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

import { Layout } from '@/components/layout';
import { ProfileSettings } from '@/components/settings/profile-settings';
import { ContactSettings } from '@/components/settings/contact-settings';
import { AddressSettings } from '@/components/settings/address-settings';
import { PickupSettings } from '@/components/settings/pickup-settings';
import { PrivacySettings } from '@/components/settings/privacy-settings';
import { PreferencesSettings } from '@/components/settings/preferences-settings';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  if (status === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/');
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, contact information, pickup preferences, and
            display settings.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactSettings />
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <AddressSettings />
          </TabsContent>

          <TabsContent value="pickup" className="space-y-6">
            <PickupSettings />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
