import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { 
      razorpay_order_id,
      bookingId,
      error
    } = await request.json();

    if (!razorpay_order_id || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required details' },
        { status: 400 }
      );
    }

    // Update payment record as failed
    await prisma.payment.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'FAILED',
        failureReason: error?.description || 'Payment failed'
      }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'FAILED'
      }
    });

    // Log the failure
    await prisma.log.create({
      data: {
        action: 'PAYMENT_FAILURE',
        details: JSON.stringify({
          bookingId,
          razorpayOrderId: razorpay_order_id,
          error: error?.description || 'Payment failed'
        })
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment failure recorded' 
    });

  } catch (error) {
    console.error('Error handling payment failure:', error);
    return NextResponse.json(
      { error: 'Failed to handle payment failure' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
