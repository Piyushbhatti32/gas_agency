import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the test agency
    const agency = await db.agency.findUnique({
      where: { email: 'agency@test.com' }
    })

    if (!agency) {
      return NextResponse.json({ message: 'No test agency found' })
    }

    // Get users with this agency as default vendor
    const users = await db.user.findMany({
      where: {
        defaultVendorId: agency.id
      },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    // Get bookings for this agency
    const bookings = await db.booking.findMany({
      where: {
        agencyId: agency.id
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({
      agency: {
        id: agency.id,
        email: agency.email,
        businessName: agency.businessName
      },
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        bookingsCount: u._count.bookings
      })),
      bookings: bookings.map(b => ({
        id: b.id,
        userId: b.userId,
        user: b.user.email,
        status: b.status
      })),
      stats: {
        totalUsers: users.length,
        totalBookings: bookings.length
      }
    })
  } catch (error) {
    console.error('Error in test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}