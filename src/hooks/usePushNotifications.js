import { useState, useCallback } from 'react';

// In production, replace with a real VAPID public key from the backend.
// This mock key causes the subscribe() call to fail gracefully — we catch
// and fall back to showing a local notification instead.
const MOCK_VAPID_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser.');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setLoading(false);
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      let sub;
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(MOCK_VAPID_KEY),
        });
        setSubscription(sub);
        // In production, POST sub to backend here
        console.log('[PWA] Push subscription active:', JSON.stringify(sub));
      } catch {
        // Mock: VAPID key is fake — fall back to direct SW notification delivery
        console.log('[PWA] Push subscription skipped (mock env). Direct delivery enabled.');
        setSubscription({ mock: true });
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (subscription && subscription.unsubscribe) {
      await subscription.unsubscribe();
    }
    setSubscription(null);
    setPermission('default');
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    isSubscribed: !!subscription,
    loading,
    error,
    subscribe,
    unsubscribe,
  };
}
