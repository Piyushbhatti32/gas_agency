import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in INR (will be converted to paise)
 * @param {string} receipt - Unique receipt ID
 * @param {string} notes - Additional notes
 * @returns {Promise<Object>} Razorpay order object
 */
export async function createRazorpayOrder(amount, receipt, notes = {}) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: notes,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
export function verifyRazorpaySignature(orderId, paymentId, signature) {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return false;
  }
}

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund in paise (optional, full refund if not provided)
 * @returns {Promise<Object>} Refund details
 */
export async function refundPayment(paymentId, amount = null) {
  try {
    const refundData = {};
    if (amount) {
      refundData.amount = amount;
    }
    
    const refund = await razorpay.payments.refund(paymentId, refundData);
    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
}

/**
 * Calculate gas cylinder price
 * @param {boolean} isExtra - Whether it's an extra cylinder
 * @returns {number} Price in INR
 */
export function calculateGasPrice(isExtra = false) {
  const basePrice = 850; // Base price for regular cylinder
  const extraPrice = 950; // Price for extra cylinder
  
  return isExtra ? extraPrice : basePrice;
}
