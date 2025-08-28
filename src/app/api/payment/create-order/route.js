import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createRazorpayOrder, calculateGasPrice } from '@/lib/razorpay';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, payment: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists
    if (booking.payment) {
      return NextResponse.json(
        { error: 'Payment already exists for this booking' },
        { status: 400 }
      );
    }

    // Calculate amount
    const amount = calculateGasPrice(booking.isExtra);
    
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      amount,
      `booking_${bookingId}`,
      {
        bookingId: bookingId,
        userId: booking.userId,
        userName: booking.user.name,
        userEmail: booking.user.email,
        isExtra: booking.isExtra.toString()
      }
    );

    // Save payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId,
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        currency: 'INR',
        status: 'PENDING'
      }
    });

    // Update booking with amount and payment method
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        amount: amount,
        paymentMethod: 'ONLINE',
        paymentStatus: 'PROCESSING'
      }
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      bookingId: bookingId,
      paymentId: payment.id
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
