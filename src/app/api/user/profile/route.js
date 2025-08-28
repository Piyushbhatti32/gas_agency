import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get userId from query parameters or use test email as fallback
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    let user;
    if (userId) {
      user = await db.user.findUnique({
        where: { id: userId },
        include: {
          defaultVendor: true,
          bookings: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      // Fallback for test data
      user = await db.user.findUnique({
        where: {
          email: 'user@test.com',
          role: 'USER'
        },
        include: {
          defaultVendor: true,
          bookings: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...userData } = user;

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { userId, ...updateData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove sensitive fields that shouldn't be updated
    const { password, email, role, ...allowedUpdates } = updateData;

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: allowedUpdates
    });

    // Remove sensitive data from response
    const { password: pwd, ...userData } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
