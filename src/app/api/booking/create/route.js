import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export async function POST(request) {
  try {
    const { userId, agencyId, paymentMethod, isExtra = false, notes } = await request.json()

    if (!userId || !paymentMethod) {
      return NextResponse.json(
        { error: 'User ID and payment method are required' },
        { status: 400 }
      )
    }

    // Get user details including default vendor
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { defaultVendor: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has barrels remaining (unless it's an extra request)
    if (!isExtra && user.barrelsRemaining <= 0) {
      return NextResponse.json(
        { error: 'No barrels remaining. Please request an extra cylinder.' },
        { status: 400 }
      )
    }

    // Check if user has any pending bookings
    const pendingBooking = await db.booking.findFirst({
      where: {
        userId,
        status: 'PENDING'
      }
    })

    if (pendingBooking) {
      return NextResponse.json(
        { error: 'You already have a pending booking. Please wait for it to be processed.' },
        { status: 400 }
      )
    }

    // Determine agency for booking
    const bookingAgencyId = agencyId || (user.defaultVendor ? user.defaultVendor.id : null);
    
    if (!bookingAgencyId) {
      return NextResponse.json(
        { error: 'No agency selected and no default agency found for user' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        userId,
        agencyId: bookingAgencyId,
        paymentMethod,
        isExtra,
        notes
      }
    })

    // If not extra, decrement barrels remaining and send notification
    if (!isExtra) {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { barrelsRemaining: user.barrelsRemaining - 1 }
      })

      // Send account balance notification
      try {
        await emailService.sendAccountBalanceNotification(
          user.email,
          user.name,
          updatedUser.barrelsRemaining,
          'used'
        )
        console.log(`[EMAIL] Account balance notification sent to ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send account balance notification:', emailError)
      }
    }

    // Log the booking action
    await db.log.create({
      data: {
        userId,
        action: 'BOOKING_CREATE',
        details: `User ${user.email} created a ${isExtra ? 'extra ' : ''}booking with ${paymentMethod}`
      }
    })

    // Send booking confirmation email
    try {
      await emailService.sendBookingConfirmation(
        user.email,
        user.name,
        booking.id,
        paymentMethod
      )
      console.log(`[EMAIL] Booking confirmation sent to ${user.email}`)
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}