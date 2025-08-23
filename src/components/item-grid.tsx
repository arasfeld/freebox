'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useSearch } from '@/hooks/use-search';

interface Item {
  id: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  location?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'TAKEN';
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

export function ItemGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useSearch();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.location !== 'all') {
        params.append('location', filters.location);
      }

      const url = `/api/items${
        params.toString() ? `?${params.toString()}` : ''
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce the API call to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'TAKEN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchItems}>Try Again</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          {filters.search ||
          filters.category !== 'all' ||
          filters.location !== 'all'
            ? 'No items found'
            : 'No items available'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {filters.search ||
          filters.category !== 'all' ||
          filters.location !== 'all'
            ? 'Try adjusting your search criteria or browse all items.'
            : 'Be the first to post an item in your community!'}
        </p>
        <div className="flex justify-center gap-2">
          {(filters.search ||
            filters.category !== 'all' ||
            filters.location !== 'all') && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Browse All Items
            </Button>
          )}
          <Button asChild>
            <Link href="/post-item">Post an Item</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!loading && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
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
                <p className="text-sm text-muted-foreground">
                  📍 {item.location}
                </p>
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
                <Button size="sm" asChild>
                  <Link href={`/items/${item.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
