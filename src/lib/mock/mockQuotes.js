const SEED_QUOTES = [
  {
    id: 'QT-000001',
    quoteNumber: 'QT-2026-06-0001',
    customerId: 'CUS-2024-001234',
    customerName: 'Kwame Mensah',
    customerTier: 'commercial',
    createdAt: '2026-06-29T08:00:00Z',
    validUntil: '2026-06-30T08:00:00Z',  // active
    status: 'active',
    lineItems: [
      { serviceId: 'shirt',    name: 'Shirt / Blouse',  qty: 25, unitPrice: 5.5,  lineTotal: 137.5,  pricingMethod: 'per_item' },
      { serviceId: 'trouser',  name: 'Trouser / Pants', qty: 10, unitPrice: 8.0,  lineTotal: 80.0,   pricingMethod: 'per_item' },
      { serviceId: 'dry-suit', name: 'Dry Clean Suit',  qty: 5,  unitPrice: 48.0, lineTotal: 240.0,  pricingMethod: 'per_item' },
    ],
    subtotal: 457.5,
    surchargeAmount: 0,
    turnaroundId: 'standard',
    turnaroundLabel: 'Standard (3 days)',
    turnaroundDays: 3,
    deliveryFee: 0,
    pickupFee: 0,
    subtotalWithFees: 457.5,
    discountSteps: [
      { type: 'customer_contract', label: 'Osu Medical Centre Contract', badge: 'contract', discountAmount: 91.5 },
    ],
    totalDiscount: 91.5,
    subtotalAfterDiscounts: 366.0,
    vatAmount: 45.75,
    nhilAmount: 9.15,
    getfundAmount: 0,
    totalTax: 54.9,
    taxBreakdown: [
      { label: 'VAT (12.5%)', rate: 0.125, amount: 45.75 },
      { label: 'NHIL (2.5%)', rate: 0.025, amount: 9.15 },
    ],
    grandTotal: 420.9,
    currency: 'GHS',
    customerTierApplied: 'commercial',
  },
  {
    id: 'QT-000002',
    quoteNumber: 'QT-2026-06-0002',
    customerId: 'CUS-2024-003456',
    customerName: 'Kofi Boateng',
    customerTier: 'commercial',
    createdAt: '2026-06-29T07:00:00Z',
    validUntil: '2026-06-29T11:00:00Z',  // expiring soon (< 4 hours from now)
    status: 'expiring_soon',
    lineItems: [
      { serviceId: 'shirt',        name: 'Shirt / Blouse',     qty: 40, unitPrice: 6.4,  lineTotal: 256.0, pricingMethod: 'per_item' },
      { serviceId: 'bedsheet-dbl', name: 'Bed Sheet (Double)', qty: 10, unitPrice: 20.0, lineTotal: 200.0, pricingMethod: 'per_item' },
    ],
    subtotal: 456.0,
    surchargeAmount: 182.4,
    turnaroundId: 'express',
    turnaroundLabel: 'Express (1 day)',
    turnaroundDays: 1,
    deliveryFee: 0,
    pickupFee: 0,
    subtotalWithFees: 638.4,
    discountSteps: [
      { type: 'customer_contract', label: 'Kofi VIP 2026',          badge: 'vip',    discountAmount: 127.68 },
      { type: 'bulk',              label: 'Medium Bulk (50 items)',  badge: '10% off', discountAmount: 51.07 },
    ],
    totalDiscount: 178.75,
    subtotalAfterDiscounts: 459.65,
    vatAmount: 57.46,
    nhilAmount: 11.49,
    getfundAmount: 0,
    totalTax: 68.95,
    taxBreakdown: [
      { label: 'VAT (12.5%)', rate: 0.125, amount: 57.46 },
      { label: 'NHIL (2.5%)', rate: 0.025, amount: 11.49 },
    ],
    grandTotal: 528.6,
    currency: 'GHS',
    customerTierApplied: 'commercial',
  },
  {
    id: 'QT-000003',
    quoteNumber: 'QT-2026-06-0003',
    customerId: 'CUS-2024-005678',
    customerName: 'Yaw Afriyie',
    customerTier: 'retail',
    createdAt: '2026-06-28T14:00:00Z',
    validUntil: '2026-06-29T06:00:00Z',  // expired
    status: 'expired',
    lineItems: [
      { serviceId: 'shirt',   name: 'Shirt / Blouse',  qty: 5, unitPrice: 8.0,  lineTotal: 40.0, pricingMethod: 'per_item' },
      { serviceId: 'trouser', name: 'Trouser / Pants', qty: 3, unitPrice: 10.0, lineTotal: 30.0, pricingMethod: 'per_item' },
    ],
    subtotal: 70.0,
    surchargeAmount: 0,
    turnaroundId: 'standard',
    turnaroundLabel: 'Standard (3 days)',
    turnaroundDays: 3,
    deliveryFee: 15,
    pickupFee: 0,
    subtotalWithFees: 85.0,
    discountSteps: [
      { type: 'loyalty', label: 'Family Member Discount', badge: 'Bronze', discountAmount: 4.25 },
    ],
    totalDiscount: 4.25,
    subtotalAfterDiscounts: 80.75,
    vatAmount: 10.09,
    nhilAmount: 2.02,
    getfundAmount: 0,
    totalTax: 12.11,
    taxBreakdown: [
      { label: 'VAT (12.5%)', rate: 0.125, amount: 10.09 },
      { label: 'NHIL (2.5%)', rate: 0.025, amount: 2.02  },
    ],
    grandTotal: 92.86,
    currency: 'GHS',
    customerTierApplied: 'retail',
    expiredAt: '2026-06-29T06:00:00Z',
  },
];

let _quotes = SEED_QUOTES.map(q => ({ ...q }));

export const getAllQuotes  = ()          => [..._quotes];
export const getQuoteById = (id)         => _quotes.find(q => q.id === id) ?? null;
export const addQuote     = (q)          => { _quotes = [{ id: `QT-${String(Date.now()).slice(-6)}`, ...q }, ..._quotes]; };
export const updateQuote  = (id, patch)  => { _quotes = _quotes.map(q => q.id === id ? { ...q, ...patch } : q); };
export const removeQuote  = (id)         => { _quotes = _quotes.filter(q => q.id !== id); };

export function checkQuoteStatus(quote) {
  const now = Date.now();
  const expiry = new Date(quote.validUntil).getTime();
  const msRemaining = expiry - now;
  if (msRemaining <= 0) return 'expired';
  if (msRemaining < 4 * 60 * 60 * 1000) return 'expiring_soon';
  return 'active';
}
