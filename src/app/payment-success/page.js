'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const paymentId = searchParams.get('payment');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`);
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your gas cylinder booking has been confirmed
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-600">Booking ID:</dt>
                  <dd className="text-gray-900 font-mono">{bookingId}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-600">Payment ID:</dt>
                  <dd className="text-gray-900 font-mono">{paymentId}</dd>
                </div>
                {booking && (
                  <>
                    <div className="flex justify-between text-sm">
                      <dt className="font-medium text-gray-600">Amount Paid:</dt>
                      <dd className="text-gray-900 font-semibold">₹{booking.amount}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="font-medium text-gray-600">Cylinder Type:</dt>
                      <dd className="text-gray-900">{booking.isExtra ? 'Extra' : 'Regular'}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Your booking is now approved and will be processed shortly.</p>
              <p className="mt-1">You will receive updates on your registered email.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
