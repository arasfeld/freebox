import { NextRequest, NextResponse } from 'next/server';

// In-memory cache (in production, use Redis or similar)
const CACHE_DURATION = 24 * 60 * 60; // 24 hours
const cache = new Map<string, { data: unknown; timestamp: number }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude parameters required' },
      { status: 400 }
    );
  }

  // Check cache first
  const cacheKey = `reverse:${lat}:${lng}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch from Nominatim with more detailed parameters
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('lat', lat);
    nominatimUrl.searchParams.set('lon', lng);
    nominatimUrl.searchParams.set('addressdetails', '1');
    nominatimUrl.searchParams.set('zoom', '14'); // More detailed zoom level
    nominatimUrl.searchParams.set('extratags', '1'); // Get extra tags
    nominatimUrl.searchParams.set('namedetails', '1'); // Get named details

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
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location' },
      { status: 500 }
    );
  }
}
