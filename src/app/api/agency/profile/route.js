import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get agencyId from query parameters or use test email as fallback
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('id');
    
    let agency;
    if (agencyId) {
      agency = await db.agency.findUnique({
        where: { id: agencyId },
        include: {
          defaultUsers: true,
          bookings: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      // Fallback for test data
      agency = await db.agency.findUnique({
        where: {
          email: 'agency@test.com'
        },
        include: {
          defaultUsers: true,
          bookings: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...agencyData } = agency;

    return NextResponse.json({ agency: agencyData });
  } catch (error) {
    console.error('Failed to fetch agency profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { agencyId, ...updateData } = await request.json();

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      );
    }

    // Remove sensitive fields that shouldn't be updated
    const { password, email, ...allowedUpdates } = updateData;

    // Update agency profile
    const updatedAgency = await db.agency.update({
      where: { id: agencyId },
      data: allowedUpdates
    });

    // Remove sensitive data from response
    const { password: pwd, ...agencyData } = updatedAgency;

    return NextResponse.json({
      message: 'Profile updated successfully',
      agency: agencyData
    });
  } catch (error) {
    console.error('Failed to update agency profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
