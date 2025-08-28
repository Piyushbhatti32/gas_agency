'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const reason = searchParams.get('reason');
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

  const retryPayment = () => {
    // Redirect back to the booking page or payment page
    window.location.href = `/dashboard?retry=${bookingId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-red-600">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-600">Booking ID:</dt>
                  <dd className="text-gray-900 font-mono">{bookingId}</dd>
                </div>
                {reason && (
                  <div className="flex justify-between text-sm">
                    <dt className="font-medium text-gray-600">Reason:</dt>
                    <dd className="text-gray-900">{decodeURIComponent(reason)}</dd>
                  </div>
                )}
                {booking && (
                  <>
                    <div className="flex justify-between text-sm">
                      <dt className="font-medium text-gray-600">Amount:</dt>
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
              <p>Your booking is still pending and no amount has been charged.</p>
              <p className="mt-1">You can try paying again or choose a different payment method.</p>
            </div>

            <div className="space-y-3">
              <Button onClick={retryPayment} className="w-full bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Payment Again
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
