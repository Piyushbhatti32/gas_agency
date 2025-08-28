import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const { bookingId, adminId, scheduledFor, deliveryAddress, contactNumber } = await request.json()

    if (!bookingId || !adminId || !scheduledFor) {
      return NextResponse.json(
        { error: 'Booking ID, Admin ID, and scheduled date are required' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { user: true }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Booking must be approved before scheduling' },
        { status: 400 }
      )
    }

    // Schedule the delivery
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        scheduledFor: new Date(scheduledFor),
        deliveryAddress: deliveryAddress || booking.user.email, // Default to user's email as address placeholder
        contactNumber: contactNumber
      }
    })

    // Log the scheduling action
    await db.log.create({
      data: {
        userId: adminId,
        action: 'BOOKING_SCHEDULE',
        details: `Admin scheduled delivery for booking ${bookingId} on ${scheduledFor}`
      }
    })

    return NextResponse.json({
      message: 'Delivery scheduled successfully',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Delivery scheduling error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}