import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, preferredContact } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: phone !== undefined ? phone : undefined,
        preferredContact:
          preferredContact !== undefined ? preferredContact : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        preferredContact: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        pickupInstructions: true,
        availableHours: true,
        preferredPickupMethod: true,
        showContactInfo: true,
        showAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating contact information:', error);
    return NextResponse.json(
      { error: 'Failed to update contact information' },
      { status: 500 }
    );
  }
}
