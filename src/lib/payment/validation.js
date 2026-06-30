// Ghana MoMo phone prefix → provider detection
const MOMO_PREFIXES = {
  mtn:       ['024', '054', '055', '059'],
  vodafone:  ['020', '050'],
  airteltigo:['027', '057', '026', '056'],
};

export function detectMomoProvider(phone) {
  const digits = phone.replace(/\D/g, '');
  const local  = digits.startsWith('233') ? '0' + digits.slice(3) : digits;
  const prefix = local.slice(0, 3);
  for (const [provider, prefixes] of Object.entries(MOMO_PREFIXES)) {
    if (prefixes.includes(prefix)) return provider;
  }
  return null;
}

export function validateMomoPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  const local  = digits.startsWith('233') ? '0' + digits.slice(3) : digits;
  if (local.length !== 10 || !local.startsWith('0')) return { valid: false, error: 'Enter a valid 10-digit Ghana number' };
  const provider = detectMomoProvider(local);
  if (!provider) return { valid: false, error: 'Number not recognised as MTN, Vodafone or AirtelTigo' };
  return { valid: true, provider, normalized: '+233' + local.slice(1) };
}

// Luhn algorithm for card number validation
export function luhnCheck(number) {
  const digits = number.replace(/\D/g, '');
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardType(number) {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6[045]/.test(digits)) return 'verve';
  return null;
}

export function validateCard({ number, expiry, cvv, name }) {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return { valid: false, error: 'Invalid card number length' };
  if (!luhnCheck(digits)) return { valid: false, error: 'Invalid card number' };
  const cardType = detectCardType(digits);
  if (!cardType) return { valid: false, error: 'Card type not supported' };

  const [mm, yy] = (expiry || '').split('/').map(s => s?.trim());
  const month = parseInt(mm, 10);
  const year  = 2000 + parseInt(yy, 10);
  const now   = new Date();
  if (isNaN(month) || month < 1 || month > 12) return { valid: false, error: 'Invalid expiry month' };
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return { valid: false, error: 'Card has expired' };
  }
  const cvvLen = cardType === 'amex' ? 4 : 3;
  if (!cvv || cvv.replace(/\D/g, '').length !== cvvLen) return { valid: false, error: `CVV must be ${cvvLen} digits` };
  if (!name || name.trim().length < 2) return { valid: false, error: 'Enter cardholder name' };

  return { valid: true, cardType, last4: digits.slice(-4) };
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}
