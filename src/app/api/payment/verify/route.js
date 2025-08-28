import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyRazorpaySignature, getPaymentDetails } from '@/lib/razorpay';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { 
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: 'FAILED',
          failureReason: 'Invalid signature'
        }
      });
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'FAILED' }
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await getPaymentDetails(razorpay_payment_id);
    
    // Update payment record in database
    const updatedPayment = await prisma.payment.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'COMPLETED',
        paymentMethod: paymentDetails.method
      }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'APPROVED'
      }
    });
    
    return NextResponse.json({ success: true, message: 'Payment successful' });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
