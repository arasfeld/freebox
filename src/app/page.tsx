import { Suspense } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { ItemGrid } from '@/components/item-grid';
import { LoginBtn } from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';
import { SearchFilters } from '@/components/search-filters';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Freebox</h1>
            <p className="text-muted-foreground">Everything is free</p>
          </div>
          <div className="flex items-center space-x-4">
            <LoginBtn />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters />
        </div>

        {/* Items Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Available Items</h2>
          <Button asChild>
            <Link href="/post-item" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post an Item
            </Link>
          </Button>
        </div>

        <Suspense
          fallback={<div className="text-center py-8">Loading items...</div>}
        >
          <ItemGrid />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Freebox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
