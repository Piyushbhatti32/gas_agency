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

    // Get users who have this agency as their default vendor
    const users = await db.user.findMany({
      where: {
        defaultVendorId: agencyId
      },
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

    return NextResponse.json({
      users
    })

  } catch (error) {
    console.error('Error fetching agency users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}