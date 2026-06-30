import { validateMomoPhone, detectMomoProvider } from './validation.js';

export const MOMO_PROVIDERS = [
  { id: 'mtn',        label: 'MTN Mobile Money',   short: 'MTN',         color: '#FFCC00', ussd: '*170#' },
  { id: 'vodafone',   label: 'Vodafone Cash',       short: 'Vodafone',    color: '#E60028', ussd: '*110#' },
  { id: 'airteltigo', label: 'AirtelTigo Money',    short: 'AirtelTigo',  color: '#E4002B', ussd: '*127#' },
];

export function getMomoProvider(id) {
  return MOMO_PROVIDERS.find(p => p.id === id) ?? null;
}

// Simulate MoMo STK-push flow
// Returns a promise that resolves to { success, txnId, reference } after delay
export function initiateMomoPayment({ phone, provider, amount, orderId }) {
  const validation = validateMomoPhone(phone);
  if (!validation.valid) return Promise.reject(new Error(validation.error));

  const detectedProvider = detectMomoProvider(phone);
  const resolvedProvider = provider || detectedProvider;

  return new Promise((resolve, reject) => {
    // Simulate network send (1.2s), then await approval (4s total)
    setTimeout(() => {
      const txnId = 'TXN-' + Math.random().toString(36).slice(2, 10).toUpperCase();
      const ref   = resolvedProvider.toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      // 95% success rate in mock
      const succeed = Math.random() > 0.05;
      setTimeout(() => {
        if (succeed) {
          resolve({ success: true, txnId, reference: ref, provider: resolvedProvider, amount, phone: validation.normalized });
        } else {
          reject(new Error('Payment declined — insufficient balance'));
        }
      }, 3500);
    }, 1200);
  });
}

export function getMomoUssdCode(provider) {
  return MOMO_PROVIDERS.find(p => p.id === provider)?.ussd ?? '*170#';
}
