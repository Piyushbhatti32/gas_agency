import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export async function POST(request) {
  try {
    const { bookingId, adminId } = await request.json()

    if (!bookingId || !adminId) {
      return NextResponse.json(
        { error: 'Booking ID and admin ID are required' },
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

    // Update booking status
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date()
      }
    })

    // Log the approval action
    await db.log.create({
      data: {
        userId: booking.userId,
        action: 'BOOKING_APPROVE',
        details: `Admin approved booking for user ${booking.user.email}`
      }
    })

    // Send approval email notification
    try {
      await emailService.sendBookingApproval(
        booking.user.email,
        booking.user.name,
        booking.id
      )
      console.log(`[EMAIL] Booking approval notification sent to ${booking.user.email}`)
    } catch (emailError) {
      console.error('Failed to send booking approval email:', emailError)
    }

    // Send transaction acknowledgment
    try {
      await emailService.sendTransactionAcknowledgment(
        booking.user.email,
        booking.user.name,
        {
          bookingId: booking.id,
          action: 'Booking Approved',
          paymentMethod: booking.paymentMethod,
          status: 'APPROVED'
        }
      )
      console.log(`[EMAIL] Transaction acknowledgment sent to ${booking.user.email}`)
    } catch (emailError) {
      console.error('Failed to send transaction acknowledgment:', emailError)
    }

    return NextResponse.json({
      message: 'Booking approved successfully',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Booking approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}