import { NextRequest, NextResponse } from 'next/server';

// In-memory cache (in production, use Redis or similar)
const CACHE_DURATION = 24 * 60 * 60; // 24 hours
const cache = new Map<string, { data: unknown; timestamp: number }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '5';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter required' },
      { status: 400 }
    );
  }

  // Check cache first
  const cacheKey = `location:${query}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch from Nominatim with optimized parameters
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('q', query);
    nominatimUrl.searchParams.set('limit', limit);
    nominatimUrl.searchParams.set('addressdetails', '1');
    nominatimUrl.searchParams.set(
      'countrycodes',
      'us,ca,gb,de,fr,es,it,nl,au,nz'
    );
    nominatimUrl.searchParams.set('dedupe', '1');

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'FreeBox-App/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
