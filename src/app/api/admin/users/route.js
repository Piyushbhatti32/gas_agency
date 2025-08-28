import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all users with their booking count
    const [users, agencies] = await Promise.all([
      db.user.findMany({
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.agency.findMany({
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Convert agencies to user-like format for the frontend
    const formattedAgencies = agencies.map(agency => ({
      ...agency,
      role: 'AGENCY',
      // Map agency-specific fields to user format
      barrelsRemaining: null,
      address: agency.businessAddress
    }));

    return NextResponse.json({
      users: [...users, ...formattedAgencies]
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}