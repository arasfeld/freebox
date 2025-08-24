import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/items - List all available items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const status = searchParams.get('status');

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.email
      ? (
          await prisma.user.findUnique({
            where: { email: session.user.email },
          })
        )?.id
      : null;

    const where: {
      category?: string;
      location?: { contains: string; mode: 'insensitive' };
      status?: 'AVAILABLE' | 'PENDING' | 'TAKEN';
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (location && location !== 'all') {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (
      status &&
      status !== 'all' &&
      (status === 'AVAILABLE' || status === 'PENDING' || status === 'TAKEN')
    ) {
      where.status = status as 'AVAILABLE' | 'PENDING' | 'TAKEN';
    }
    // If status is 'all' or not provided, show all items

    const items = await prisma.item.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        interests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add additional fields for the frontend
    const itemsWithMetadata = items.map((item) => ({
      ...item,
      isOwner: currentUserId === item.userId,
      hasExpressedInterest: currentUserId
        ? item.interests.some((interest) => interest.userId === currentUserId)
        : false,
    }));

    return NextResponse.json(itemsWithMetadata);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, images, category, location } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        images: images || [],
        category,
        location,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
