import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export async function POST(request) {
  try {
    const { bookingId, adminId, reason } = await request.json()

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

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Booking is not in pending status' },
        { status: 400 }
      )
    }

    // If this was not an extra booking, return the barrel to user and send balance notification
    if (!booking.isExtra) {
      const updatedUser = await db.user.update({
        where: { id: booking.userId },
        data: { barrelsRemaining: { increment: 1 } }
      })

      // Send account balance notification for returned barrel
      try {
        await emailService.sendAccountBalanceNotification(
          booking.user.email,
          booking.user.name,
          updatedUser.barrelsRemaining,
          'restored due to booking rejection'
        )
        console.log(`[EMAIL] Account balance notification sent to ${booking.user.email} (barrel restored)`)
      } catch (emailError) {
        console.error('Failed to send account balance notification:', emailError)
      }
    }

    // Reject booking
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        notes: reason || booking.notes
      }
    })

    // Log the rejection action
    await db.log.create({
      data: {
        userId: adminId,
        action: 'BOOKING_REJECT',
        details: `Admin rejected booking ${bookingId} for user ${booking.user.email}. Reason: ${reason || 'Not specified'}`
      }
    })

    // Send booking rejection email
    try {
      await emailService.sendBookingRejection(
        booking.user.email,
        booking.user.name,
        booking.id,
        reason || 'Your booking could not be processed at this time. Please contact support for more information.'
      )
      console.log(`[EMAIL] Booking rejection sent to ${booking.user.email}`)
    } catch (emailError) {
      console.error('Failed to send booking rejection email:', emailError)
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({
      message: 'Booking rejected successfully',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Booking rejection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}