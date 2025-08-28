import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export async function POST(request) {
  try {
    const { bookingId, adminId, deliveryNotes } = await request.json()

    if (!bookingId || !adminId) {
      return NextResponse.json(
        { error: 'Booking ID and Admin ID are required' },
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
        { error: 'Booking must be approved before delivery' },
        { status: 400 }
      )
    }

    // Mark as delivered
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        deliveryNotes: deliveryNotes || booking.deliveryNotes
      }
    })

    // Log the delivery action
    await db.log.create({
      data: {
        userId: adminId,
        action: 'BOOKING_DELIVER',
        details: `Admin marked booking ${bookingId} as delivered for user ${booking.user.email}`
      }
    })

    // Send delivery confirmation email
    try {
      await emailService.sendDeliveryConfirmation(
        booking.user.email,
        booking.user.name,
        booking.id,
        deliveryNotes
      )
      console.log(`[EMAIL] Delivery confirmation sent to ${booking.user.email}`)
    } catch (emailError) {
      console.error('Failed to send delivery confirmation email:', emailError)
      // Don't fail the delivery if email fails
    }

    return NextResponse.json({
      message: 'Delivery marked as complete',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Delivery completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}