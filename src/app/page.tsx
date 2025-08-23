import { Suspense } from 'react';

import { Button } from '@/components/ui/button';

import LoginBtn from '@/components/login-btn';
import { ModeToggle } from '@/components/mode-toggle';
import { ItemGrid } from '@/components/item-grid';
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Give & Get for Free</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join the community where everything is free. Post items you
            don&apos;t need, find items you want.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="secondary" asChild>
              <a href="/post-item">Post an Item</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-blue-600 backdrop-blur-sm"
            >
              Browse Items
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <SearchFilters />
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Available Items</h3>
            <Button asChild>
              <a href="/post-item">Post an Item</a>
            </Button>
          </div>

          <Suspense
            fallback={<div className="text-center py-8">Loading items...</div>}
          >
            <ItemGrid />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Freebox. A marketplace where everything is free.</p>
        </div>
      </footer>
    </div>
  );
}
