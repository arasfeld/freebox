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
    if (item.userId !== user.id) {
      return NextResponse.json(
        { error: 'Only the item owner can mark an item as taken' },
        { status: 403 }
      );
    }

    // Check if item is in PENDING status (has a selected recipient)
    if (item.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Item must be in PENDING status to mark as taken' },
        { status: 400 }
      );
    }

    // Check if there's a selected recipient
    const selectedInterest = item.interests.find(
      (interest) => interest.selected
    );
    if (!selectedInterest) {
      return NextResponse.json(
        { error: 'No recipient is currently selected' },
        { status: 400 }
      );
    }

    // Update item status to TAKEN (completed)
    await prisma.item.update({
      where: { id: itemId },
      data: { status: 'TAKEN' },
    });

    // Get the updated item with all the interest data
    const updatedItem = await prisma.item.findUnique({
      where: { id: itemId },
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
    });

    return NextResponse.json({
      message: 'Item marked as successfully taken',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Error marking item as taken:', error);
    return NextResponse.json(
      { error: 'Failed to mark item as taken' },
      { status: 500 }
    );
  }
}
