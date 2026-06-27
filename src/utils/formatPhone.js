// Format a phone number to E.164 with Ghana (+233) as default country code.
export function toE164(phone, countryCode = '233') {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(countryCode)) return `+${digits}`;
  if (digits.startsWith('0')) return `+${countryCode}${digits.slice(1)}`;
  return `+${countryCode}${digits}`;
}

export function displayPhone(e164) {
  if (!e164) return '';
  return e164.replace(/^\+233/, '0');
}
