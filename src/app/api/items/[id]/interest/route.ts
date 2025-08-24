import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: itemId } = await params;
    const userEmail = session.user.email;

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the item
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        user: true,
        interests: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (item.userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot express interest in your own item' },
        { status: 400 }
      );
    }

    // Check if item is still available
    if (item.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Item is no longer available' },
        { status: 400 }
      );
    }

    // Check if user has already expressed interest
    const existingInterest = await prisma.itemInterest.findFirst({
      where: {
        itemId,
        userId: user.id,
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { error: 'Already expressed interest in this item' },
        { status: 400 }
      );
    }

    // Get user stats for fairness calculation
    const userStats = await getUserStats(user.id);

    // Create interest entry
    const interest = await prisma.itemInterest.create({
      data: {
        itemId,
        userId: user.id,
        timestamp: new Date(),
        userStats: userStats,
      },
      include: {
        user: true,
      },
    });

    // Update item status to PENDING if it was AVAILABLE
    if (item.status === 'AVAILABLE') {
      await prisma.item.update({
        where: { id: itemId },
        data: { status: 'PENDING' },
      });
    }

    return NextResponse.json({
      message: 'Interest expressed successfully',
      interest,
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    return NextResponse.json(
      { error: 'Failed to express interest' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: itemId } = await params;
    const userEmail = session.user.email;

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find and delete the interest
    const interest = await prisma.itemInterest.findFirst({
      where: {
        itemId,
        userId: user.id,
      },
    });

    if (!interest) {
      return NextResponse.json(
        { error: 'No interest found for this item' },
        { status: 404 }
      );
    }

    // Delete the interest
    await prisma.itemInterest.delete({
      where: { id: interest.id },
    });

    // Check if this was the last interest for the item
    const remainingInterests = await prisma.itemInterest.count({
      where: { itemId },
    });

    // If no more interests, set item back to AVAILABLE
    if (remainingInterests === 0) {
      await prisma.item.update({
        where: { id: itemId },
        data: { status: 'AVAILABLE' },
      });
    }

    return NextResponse.json({
      message: 'Interest removed successfully',
    });
  } catch (error) {
    console.error('Error removing interest:', error);
    return NextResponse.json(
      { error: 'Failed to remove interest' },
      { status: 500 }
    );
  }
}

async function getUserStats(userId: string) {
  // Get total items received
  const totalItemsReceived = await prisma.item.count({
    where: {
      interests: {
        some: {
          userId,
          selected: true,
        },
      },
    },
  });

  // Get total items given
  const totalItemsGiven = await prisma.item.count({
    where: {
      userId,
      status: 'TAKEN',
    },
  });

  // Calculate average response time (simplified for now)
  const averageResponseTime = 24; // Default 24 hours

  // Get last activity
  const lastActivity = new Date().toISOString();

  return {
    totalItemsReceived,
    totalItemsGiven,
    averageResponseTime,
    lastActivity,
  };
}
