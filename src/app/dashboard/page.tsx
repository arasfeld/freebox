'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { DeleteModal } from '@/components/delete-modal';
import { ItemCard } from '@/components/item-card';
import { LoginBtn } from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Package } from 'lucide-react';

import type { Item } from '@/lib/features/items/itemsApi';

interface DashboardItem {
  category: string | null;
  createdAt: string | Date;
  description: string | null;
  id: string;
  images: string[];
  interests: Array<{
    id: string;
    selected: boolean;
    timestamp: string | Date;
    userStats: Record<string, unknown>;
    userId: string;
  }>;
  location: string | null;
  status: string;
  title: string;
  updatedAt: string | Date;
  userId: string;
}

// Transform dashboard item to Item type for the ItemCard component
const transformDashboardItemToItem = (dashboardItem: DashboardItem): Item => ({
  category: dashboardItem.category || undefined,
  createdAt:
    typeof dashboardItem.createdAt === 'string'
      ? dashboardItem.createdAt
      : dashboardItem.createdAt.toISOString(),
  description: dashboardItem.description || undefined,
  hasExpressedInterest: false,
  id: dashboardItem.id,
  images: dashboardItem.images,
  isOwner: true,
  location: dashboardItem.location || undefined,
  status: dashboardItem.status as 'AVAILABLE' | 'PENDING' | 'TAKEN',
  title: dashboardItem.title,
  user: {
    email: undefined,
    id: dashboardItem.userId,
    image: undefined,
    name: 'You',
  },
});

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DashboardItem | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.id) {
      redirect('/');
      return;
    }

    fetchUserItems();
  }, [session, status]);

  const fetchUserItems = async () => {
    try {
      const response = await fetch('/api/items/user');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemDelete = async (itemId: string) => {
    const item = items.find((item) => item.id === itemId);
    if (!item) return;

    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/items/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemToDelete.id));
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleStatusChange = async (
    itemId: string,
    newStatus: 'AVAILABLE' | 'PENDING' | 'TAKEN'
  ) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setItems(
          items.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        console.error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Will redirect
  }

  const availableItems = items.filter((item) => item.status === 'AVAILABLE');
  const pendingItems = items.filter((item) => item.status === 'PENDING');
  const takenItems = items.filter((item) => item.status === 'TAKEN');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              Freebox
            </Link>
            <p className="text-muted-foreground">Everything is free</p>
          </div>
          <div className="flex items-center space-x-4">
            <LoginBtn />
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your items and track their status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableItems.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Interests Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {items.reduce(
                  (total, item) => total + item.interests.length,
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">
              Available ({availableItems.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="taken">Taken ({takenItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No available items.{' '}
                    <a
                      href="/post-item"
                      className="text-blue-600 hover:underline"
                    >
                      Post your first item!
                    </a>
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={transformDashboardItemToItem(item)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleItemDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No pending items.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={transformDashboardItemToItem(item)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleItemDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="taken" className="space-y-4">
            {takenItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No taken items.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {takenItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={transformDashboardItemToItem(item)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleItemDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Item"
        description="This action cannot be undone."
        itemName={itemToDelete?.title}
      />
    </div>
  );
}
