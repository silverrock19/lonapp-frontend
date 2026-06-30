// Mock push-notification delivery — bypasses the push server entirely.
// In production these payloads would come from the backend via Web Push.
// Use triggerMockNotification() during development to test the SW handler.

export const PUSH_TEMPLATES = {
  orderPickedUp: (orderId) => ({
    title: 'LonApp · Order Picked Up',
    body: `Your items have been collected. We'll start cleaning right away!`,
    tag: `order-${orderId}`,
    data: { url: `/app/orders/${orderId}` },
  }),
  orderReady: (orderId) => ({
    title: 'LonApp · Ready for Delivery',
    body: `Your laundry is fresh and ready. Delivery is on its way!`,
    tag: `order-${orderId}`,
    data: { url: `/app/orders/${orderId}` },
  }),
  orderDelivered: (orderId) => ({
    title: 'LonApp · Delivered',
    body: `Your order has been delivered. Enjoy your fresh laundry!`,
    tag: `order-${orderId}`,
    data: { url: `/app/orders/${orderId}` },
  }),
  paymentConfirmed: (amount) => ({
    title: 'LonApp · Payment Confirmed',
    body: `Payment of ${amount} received. Thank you!`,
    tag: 'payment',
    data: { url: '/app/wallet' },
  }),
  paymentFailed: () => ({
    title: 'LonApp · Payment Issue',
    body: `We couldn't process your last payment. Tap to update your method.`,
    tag: 'payment-failed',
    data: { url: '/app/payments' },
  }),
};

/**
 * Trigger a notification directly via the service worker (mock-only).
 * Skips the push server — useful for testing the notification UI/UX.
 */
export async function triggerMockNotification(template) {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service worker not available');
    return;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(template.title, {
      body: template.body,
      tag: template.tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      data: template.data,
      vibrate: [100, 50, 100],
    });
  } catch (err) {
    console.error('[PWA] Mock notification failed:', err);
  }
}
