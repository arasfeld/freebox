import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';

import { ItemGrid } from '@/components/item-grid';
import { Layout } from '@/components/layout';
import { SearchFilters } from '@/components/search-filters';

export default function HomePage() {
  return (
    <Layout>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
      </div>
    </Layout>
  );
}
