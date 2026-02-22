/**
 * PortOne V2 Payment Utility
 * KG이니시스 경유 카드결제/계좌이체
 */

const STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID;
const CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY;

/**
 * Request payment via PortOne V2 SDK
 * @param {Object} params
 * @param {string} params.orderId - Order ID (UUID or order number)
 * @param {string} params.orderName - Display name for the order
 * @param {number} params.totalAmount - Total amount in KRW
 * @param {string} params.payMethod - 'CARD' or 'TRANSFER'
 * @param {Object} params.customer - { fullName, email, phoneNumber }
 * @returns {Promise<Object>} Payment result
 */
export const requestPayment = async ({ orderId, orderName, totalAmount, payMethod, customer }) => {
  // Check if PortOne SDK is available
  if (!STORE_ID || !CHANNEL_KEY) {
    console.warn('PortOne credentials not configured. Running in demo mode.');
    // Demo mode: simulate successful payment
    return {
      paymentId: `demo-pay-${Date.now()}`,
      txId: `demo-tx-${Date.now()}`
    };
  }

  try {
    // Dynamic import of PortOne SDK
    const PortOne = await import('@portone/browser-sdk/v2');

    const paymentId = `payment-${crypto.randomUUID()}`;

    const response = await PortOne.requestPayment({
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
      paymentId,
      orderName,
      totalAmount,
      currency: 'CURRENCY_KRW',
      payMethod,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
      },
    });

    return response;
  } catch (err) {
    console.error('PortOne payment error:', err);
    return {
      code: 'PAYMENT_ERROR',
      message: err.message || 'Payment request failed'
    };
  }
};
