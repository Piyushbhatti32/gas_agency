import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';
import { CreditCard, Loader2 } from 'lucide-react';

export function PaymentButton({ 
  bookingId, 
  amount, 
  userDetails,
  className = '',
  disabled = false,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentFailure
}) {
  const { initiatePayment, loading, error } = useRazorpay();

  const handlePayment = async () => {
    try {
      onPaymentStart?.();
      await initiatePayment(bookingId, userDetails);
      onPaymentSuccess?.();
    } catch (err) {
      onPaymentFailure?.(err);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={disabled || loading}
        className={`w-full ${className}`}
        variant="default"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Online ₹{amount}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
