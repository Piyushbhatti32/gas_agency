import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all active agencies
    const agencies = await db.agency.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        businessName: true,
        city: true,
        cylinderPrice: true
      },
      orderBy: {
        businessName: 'asc'
      }
    });

    return NextResponse.json({
      agencies
    });
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}