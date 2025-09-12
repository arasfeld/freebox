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
    const { recipientUserId } = await request.json();

    if (!recipientUserId) {
      return NextResponse.json(
        { error: 'Recipient user ID is required' },
        { status: 400 }
      );
    }

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
        { error: 'Only the item owner can select a recipient' },
        { status: 403 }
      );
    }

    // Check if item is still available
    if (item.status === 'TAKEN') {
      return NextResponse.json(
        { error: 'Item has already been given away' },
        { status: 400 }
      );
    }

    // Check if the recipient has expressed interest
    const interest = await prisma.itemInterest.findFirst({
      where: {
        itemId,
        userId: recipientUserId,
      },
    });

    if (!interest) {
      return NextResponse.json(
        { error: 'Selected user has not expressed interest in this item' },
        { status: 400 }
      );
    }

    // Mark the interest as selected
    await prisma.itemInterest.update({
      where: { id: interest.id },
      data: { selected: true },
    });

    // Update item status to PENDING (not TAKEN yet)
    await prisma.item.update({
      where: { id: itemId },
      data: { status: 'PENDING' },
    });

    // Clear other interests (optional - you might want to keep them for analytics)
    await prisma.itemInterest.updateMany({
      where: {
        itemId,
        userId: { not: recipientUserId },
      },
      data: { selected: false },
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
      message: 'Recipient selected successfully',
      recipientUserId,
      item: updatedItem,
    });
  } catch (error) {
    console.error('Error selecting recipient:', error);
    return NextResponse.json(
      { error: 'Failed to select recipient' },
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
        { error: 'Only the item owner can unselect a recipient' },
        { status: 403 }
      );
    }

    // Check if item has a selected recipient
    const selectedInterest = item.interests.find(
      (interest) => interest.selected
    );
    if (!selectedInterest) {
      return NextResponse.json(
        { error: 'No recipient is currently selected' },
        { status: 400 }
      );
    }

    // Clear the selection
    await prisma.itemInterest.update({
      where: { id: selectedInterest.id },
      data: { selected: false },
    });

    // Update item status back to AVAILABLE
    await prisma.item.update({
      where: { id: itemId },
      data: { status: 'AVAILABLE' },
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
      message: 'Recipient unselected successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Error unselecting recipient:', error);
    return NextResponse.json(
      { error: 'Failed to unselect recipient' },
      { status: 500 }
    );
  }
}
