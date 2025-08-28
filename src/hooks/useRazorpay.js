import { useState, useCallback } from 'react';

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = useCallback(async (bookingId, userDetails = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay script
      await loadRazorpayScript();

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Gas Agency',
        description: 'Gas Cylinder Booking Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful
              window.location.href = `/payment-success?booking=${bookingId}&payment=${response.razorpay_payment_id}`;
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            await handlePaymentFailure(orderData.orderId, bookingId, { description: error.message });
          }
        },
        modal: {
          ondismiss: async function() {
            await handlePaymentFailure(orderData.orderId, bookingId, { description: 'Payment cancelled by user' });
          }
        },
        prefill: {
          name: userDetails.name || '',
          email: userDetails.email || '',
          contact: userDetails.phone || '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePaymentFailure = async (orderId, bookingId, error) => {
    try {
      await fetch('/api/payment/failure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          bookingId: bookingId,
          error: error,
        }),
      });
      
      // Redirect to failure page
      window.location.href = `/payment-failed?booking=${bookingId}&reason=${encodeURIComponent(error.description)}`;
    } catch (err) {
      console.error('Error handling payment failure:', err);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
}

// Helper function to load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.head.appendChild(script);
  });
}
