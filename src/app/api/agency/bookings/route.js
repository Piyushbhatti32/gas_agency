import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    // Get agencyId from query parameters
    const { searchParams } = new URL(request.url)
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      )
    }

    // Get bookings for this agency
    const bookings = await db.booking.findMany({
      where: {
        agencyId: agencyId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      bookings
    })

  } catch (error) {
    console.error('Error fetching agency bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}