// Mock order data for EP-03 History, Track & Modify (US-0063–0086)
import { calcTax } from '../pricing/tax.js';

export const BUSINESS_INFO = {
  name: 'Sparkle Laundry',
  legalName: 'Sparkle Laundry Limited',
  address: '42 Oxford Street, Osu, Accra, Ghana',
  phone: '+233 30 276 5430',
  email: 'info@sparklelaundry.com',
  tin: 'GH-12345678',
  vatReg: 'VATG-001234',
};

export const MOCK_CUSTOMER = {
  name: 'Adwoa Mensah',
  phone: '+233 24 456 7890',
  email: 'adwoa.mensah@gmail.com',
  address: '42 Liberation Road, Osu, Accra',
};

export const ORDER_STATUSES = [
  'PLACED', 'PICKUP_SCHEDULED', 'DRIVER_EN_ROUTE_PICKUP',
  'ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE',
  'AWAITING_PAYMENT', 'IN_PROCESSING', 'QUALITY_CHECK',
  'READY_FOR_DELIVERY', 'DRIVER_EN_ROUTE_DELIVERY',
  'DELIVERED', 'COMPLETED', 'CANCELLED',
];

export const TIMELINE_STAGES = [
  { key: 'placed',     label: 'Order Placed',   statuses: ['PLACED', 'PICKUP_SCHEDULED'] },
  { key: 'pickup',     label: 'Driver en Route', statuses: ['DRIVER_EN_ROUTE_PICKUP'] },
  { key: 'at_outlet',  label: 'At Outlet',       statuses: ['ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE', 'AWAITING_PAYMENT'] },
  { key: 'processing', label: 'Processing',      statuses: ['IN_PROCESSING', 'QUALITY_CHECK'] },
  { key: 'ready',      label: 'Ready',           statuses: ['READY_FOR_DELIVERY'] },
  { key: 'delivery',   label: 'Delivery',        statuses: ['DRIVER_EN_ROUTE_DELIVERY', 'DELIVERED', 'COMPLETED'] },
];

export function getStageIndex(status) {
  return TIMELINE_STAGES.findIndex(s => s.statuses.includes(status));
}

export const canEditItems          = s => ['PLACED', 'PICKUP_SCHEDULED'].includes(s);
export const canReschedulePickup   = s => ['PLACED', 'PICKUP_SCHEDULED'].includes(s);
export const canRescheduleDelivery = s => ['IN_PROCESSING', 'QUALITY_CHECK', 'READY_FOR_DELIVERY'].includes(s);
export const canChangeAddress      = s => ['PLACED', 'PICKUP_SCHEDULED', 'ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE', 'AWAITING_PAYMENT', 'IN_PROCESSING', 'QUALITY_CHECK', 'READY_FOR_DELIVERY'].includes(s);
export const canCancelPrePickup    = s => ['PLACED', 'PICKUP_SCHEDULED'].includes(s);
export const canCancelPostPickup   = s => ['ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE', 'AWAITING_PAYMENT', 'IN_PROCESSING', 'QUALITY_CHECK'].includes(s);
export const canPartialCancel      = s => ['PLACED', 'PICKUP_SCHEDULED', 'ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET'].includes(s);

export const POST_PICKUP_REFUND_RATE = {
  ITEMS_PICKED_UP: 0.70, RECEIVED_AT_OUTLET: 0.65, INSPECTION_COMPLETE: 0.60,
  AWAITING_PAYMENT: 0.60, IN_PROCESSING: 0.40, QUALITY_CHECK: 0.20,
};

export const turnaroundLabel = t =>
  t === 'express' ? 'Express (1 day)' : t === 'same-day' ? 'Same-Day (Today)' : 'Standard (3 days)';

const OUTLET_MOCK = {
  id: 'outlet-001', name: 'CleanPro Osu',
  address: '42 Oxford Street, Osu, Accra',
  phone: '+233 30 276 5430', color: '#0E9AA7', avatar: 'CP',
};

const HOME_ADDRESS   = { id: 'addr-1', label: 'Home',   detail: '42 Liberation Road, Osu, Accra',             gps: 'GA-144-2345' };
const OFFICE_ADDRESS = { id: 'addr-2', label: 'Office', detail: '4 Ringway Estate Close, Cantonments, Accra', gps: 'GA-031-6789' };

function calcTotals(items, turnaround, outlet = {}) {
  const subtotal    = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const surchRate   = turnaround === 'express' ? (outlet.expressSurcharge ?? 0.4) : turnaround === 'same-day' ? 1.75 : 0;
  const surcharge   = subtotal * surchRate;
  const pickupFee   = outlet.pickupFee   ?? 15;
  const deliveryFee = outlet.deliveryFee ?? 15;
  const { totalTax: vat } = calcTax(subtotal + surcharge);
  return { subtotal, surcharge, pickupFee, deliveryFee, vat, total: subtotal + surcharge + pickupFee + deliveryFee + vat };
}

const o4c = { expressSurcharge: 0.4, pickupFee: 15, deliveryFee: 15 };

const ORDERS_ARRAY = [
  // ── Active / recent ──────────────────────────────────────────────────────────
  {
    id: 'ORD-2026-06-1001', invoiceNumber: 'INV-2026-06-1001', receiptNumber: 'RCP-2026-06-1001-001',
    status: 'PICKUP_SCHEDULED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse',   qty: 3, unitPrice: 8,  category: 'washing' },
      { id: 'i2', name: 'Trouser / Pants',  qty: 2, unitPrice: 10, category: 'washing' },
      { id: 'i3', name: 'Shirt (Iron Only)',qty: 2, unitPrice: 5,  category: 'ironing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-07-02', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-07-05', deliverySlot: { id: 'afternoon', label: '12 PM – 2 PM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: 'Handle shirts with care.', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-07-01T10:00:00', completedAt: null, paidAt: null,
    ...calcTotals([{ qty: 3, unitPrice: 8 }, { qty: 2, unitPrice: 10 }, { qty: 2, unitPrice: 5 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-06-1002', invoiceNumber: 'INV-2026-06-1002', receiptNumber: 'RCP-2026-06-1002-001',
    status: 'ITEMS_PICKED_UP', turnaround: 'express',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Suit Jacket',   qty: 1, unitPrice: 25, category: 'dry-cleaning' },
      { id: 'i2', name: 'Evening Dress', qty: 1, unitPrice: 20, category: 'dry-cleaning' },
    ],
    pickupAddress: OFFICE_ADDRESS, pickupDate: '2026-06-29', pickupSlot: { id: 'morning', label: '9 AM – 11 AM' },
    deliveryAddress: OFFICE_ADDRESS, deliveryDate: '2026-06-30', deliverySlot: { id: 'afternoon', label: '2 PM – 4 PM' },
    paymentMethod: { label: 'Visa •••• 4521', sub: 'Expires 09/27' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-06-27T14:30:00', completedAt: null, paidAt: null,
    ...calcTotals([{ qty: 1, unitPrice: 25 }, { qty: 1, unitPrice: 20 }], 'express', o4c),
  },
  {
    id: 'ORD-2026-06-1003', invoiceNumber: 'INV-2026-06-1003', receiptNumber: 'RCP-2026-06-1003-001',
    status: 'IN_PROCESSING', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse', qty: 5, unitPrice: 8,  category: 'washing' },
      { id: 'i2', name: 'Trouser / Pants',qty: 3, unitPrice: 10, category: 'washing' },
      { id: 'i3', name: 'T-Shirt',        qty: 4, unitPrice: 6,  category: 'washing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-06-28', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-07-01', deliverySlot: { id: 'midaft', label: '2 PM – 4 PM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: 'Separate whites from colours.', rescheduleCount: 1, editCount: 0,
    placedAt: '2026-06-26T09:15:00', completedAt: null, paidAt: null,
    ...calcTotals([{ qty: 5, unitPrice: 8 }, { qty: 3, unitPrice: 10 }, { qty: 4, unitPrice: 6 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-06-1004', invoiceNumber: 'INV-2026-06-1004', receiptNumber: 'RCP-2026-06-1004-001',
    status: 'READY_FOR_DELIVERY', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Duvet / Comforter', qty: 1, unitPrice: 35, category: 'bedding' },
      { id: 'i2', name: 'Pillow',            qty: 2, unitPrice: 12, category: 'bedding' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-06-25', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-06-30', deliverySlot: { id: 'evening', label: '4 PM – 6 PM' },
    paymentMethod: { label: 'Vodafone Cash', sub: '0201 234 567' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-06-23T11:00:00', completedAt: null, paidAt: null,
    ...calcTotals([{ qty: 1, unitPrice: 35 }, { qty: 2, unitPrice: 12 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-06-1005', invoiceNumber: 'INV-2026-06-1005', receiptNumber: 'RCP-2026-06-1005-001',
    status: 'DELIVERED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse', qty: 4, unitPrice: 8, category: 'washing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-06-20', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-06-23', deliverySlot: { id: 'morning', label: '8 AM – 10 AM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-06-18T08:00:00', completedAt: '2026-06-23T09:30:00', paidAt: '2026-06-23T09:30:00',
    ...calcTotals([{ qty: 4, unitPrice: 8 }], 'standard', o4c),
  },
  // ── History orders (completed / cancelled) ────────────────────────────────────
  {
    id: 'ORD-2026-05-0901', invoiceNumber: 'INV-2026-05-0901', receiptNumber: 'RCP-2026-05-0901-001',
    status: 'COMPLETED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse', qty: 6, unitPrice: 8,  category: 'washing' },
      { id: 'i2', name: 'Trouser / Pants',qty: 2, unitPrice: 10, category: 'washing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-05-20', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-05-23', deliverySlot: { id: 'midaft', label: '2 PM – 4 PM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-05-18T10:00:00', completedAt: '2026-05-23T14:45:00', paidAt: '2026-05-23T14:45:00',
    ...calcTotals([{ qty: 6, unitPrice: 8 }, { qty: 2, unitPrice: 10 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-05-0902', invoiceNumber: 'INV-2026-05-0902', receiptNumber: 'RCP-2026-05-0902-001',
    status: 'COMPLETED', turnaround: 'express',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Suit (Full)',   qty: 1, unitPrice: 35, category: 'dry-cleaning' },
      { id: 'i2', name: 'Evening Dress', qty: 1, unitPrice: 20, category: 'dry-cleaning' },
      { id: 'i3', name: 'Silk Blouse',   qty: 2, unitPrice: 15, category: 'dry-cleaning' },
    ],
    pickupAddress: OFFICE_ADDRESS, pickupDate: '2026-05-10', pickupSlot: { id: 'morning', label: '9 AM – 11 AM' },
    deliveryAddress: OFFICE_ADDRESS, deliveryDate: '2026-05-11', deliverySlot: { id: 'afternoon', label: '2 PM – 4 PM' },
    paymentMethod: { label: 'Visa •••• 4521', sub: 'Expires 09/27' },
    notes: 'Extra care on silk blouses.', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-05-09T15:30:00', completedAt: '2026-05-11T15:20:00', paidAt: '2026-05-11T15:20:00',
    ...calcTotals([{ qty: 1, unitPrice: 35 }, { qty: 1, unitPrice: 20 }, { qty: 2, unitPrice: 15 }], 'express', o4c),
  },
  {
    id: 'ORD-2026-04-0801', invoiceNumber: 'INV-2026-04-0801', receiptNumber: 'RCP-2026-04-0801-001',
    status: 'COMPLETED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse', qty: 3, unitPrice: 8,  category: 'washing' },
      { id: 'i2', name: 'Trouser / Pants',qty: 2, unitPrice: 10, category: 'washing' },
      { id: 'i3', name: 'Jacket / Coat',  qty: 1, unitPrice: 18, category: 'washing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-04-15', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-04-18', deliverySlot: { id: 'morning', label: '8 AM – 10 AM' },
    paymentMethod: { label: 'Vodafone Cash', sub: '0201 234 567' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-04-13T09:00:00', completedAt: '2026-04-18T10:15:00', paidAt: '2026-04-18T10:15:00',
    ...calcTotals([{ qty: 3, unitPrice: 8 }, { qty: 2, unitPrice: 10 }, { qty: 1, unitPrice: 18 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-03-0701', invoiceNumber: 'INV-2026-03-0701', receiptNumber: 'RCP-2026-03-0701-001',
    status: 'COMPLETED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt (Iron Only)',   qty: 5, unitPrice: 5, category: 'ironing' },
      { id: 'i2', name: 'Trouser (Iron Only)', qty: 4, unitPrice: 7, category: 'ironing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-03-05', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-03-08', deliverySlot: { id: 'afternoon', label: '12 PM – 2 PM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: 'Starch the shirts please.', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-03-03T11:30:00', completedAt: '2026-03-08T13:00:00', paidAt: '2026-03-08T13:00:00',
    ...calcTotals([{ qty: 5, unitPrice: 5 }, { qty: 4, unitPrice: 7 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-02-0601', invoiceNumber: 'INV-2026-02-0601', receiptNumber: 'RCP-2026-02-0601-001',
    status: 'COMPLETED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Duvet / Comforter', qty: 2, unitPrice: 35, category: 'bedding' },
      { id: 'i2', name: 'Pillow',            qty: 4, unitPrice: 12, category: 'bedding' },
      { id: 'i3', name: 'Bed Sheet',         qty: 2, unitPrice: 15, category: 'bedding' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-02-20', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-02-23', deliverySlot: { id: 'morning', label: '8 AM – 10 AM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: 'Deep clean the duvets.', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-02-18T10:00:00', completedAt: '2026-02-23T09:00:00', paidAt: '2026-02-23T09:00:00',
    ...calcTotals([{ qty: 2, unitPrice: 35 }, { qty: 4, unitPrice: 12 }, { qty: 2, unitPrice: 15 }], 'standard', o4c),
  },
  {
    id: 'ORD-2026-01-0501', invoiceNumber: 'INV-2026-01-0501', receiptNumber: 'RCP-2026-01-0501-001',
    status: 'CANCELLED', turnaround: 'standard',
    outlet: OUTLET_MOCK, customer: MOCK_CUSTOMER,
    items: [
      { id: 'i1', name: 'Shirt / Blouse', qty: 3, unitPrice: 8, category: 'washing' },
    ],
    pickupAddress: HOME_ADDRESS, pickupDate: '2026-01-10', pickupSlot: { id: 'morning', label: '8 AM – 10 AM' },
    deliveryAddress: HOME_ADDRESS, deliveryDate: '2026-01-13', deliverySlot: { id: 'afternoon', label: '12 PM – 2 PM' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    notes: '', rescheduleCount: 0, editCount: 0,
    placedAt: '2026-01-08T09:00:00', completedAt: null, paidAt: null,
    ...calcTotals([{ qty: 3, unitPrice: 8 }], 'standard', o4c),
  },
];

const ORDERS_MAP = Object.fromEntries(ORDERS_ARRAY.map(o => [o.id, { ...o }]));

export function getAllOrders() {
  return [...ORDERS_ARRAY].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
}

export function getOrder(id) {
  return ORDERS_MAP[id] ?? null;
}

export function getOrdersByIds(ids) {
  return ids.map(id => ORDERS_MAP[id]).filter(Boolean);
}

export function searchOrders(query) {
  const all = getAllOrders();
  if (!query.trim()) return all;
  const q = query.toLowerCase();
  return all.filter(o =>
    o.id.toLowerCase().includes(q) ||
    o.outlet.name.toLowerCase().includes(q) ||
    o.items.some(i => i.name.toLowerCase().includes(q)) ||
    (STATUS_LABELS[o.status] ?? '').toLowerCase().includes(q)
  );
}

export function filterOrders({ statuses = [], dateFrom = null, dateTo = null } = {}) {
  let orders = getAllOrders();
  if (statuses.length) orders = orders.filter(o => statuses.includes(o.status));
  if (dateFrom) orders = orders.filter(o => new Date(o.placedAt) >= new Date(dateFrom));
  if (dateTo)   orders = orders.filter(o => new Date(o.placedAt) <= new Date(dateTo + 'T23:59:59'));
  return orders;
}

export const STATUS_LABELS = {
  PLACED:                   'Order Placed',
  PICKUP_SCHEDULED:         'Pickup Scheduled',
  DRIVER_EN_ROUTE_PICKUP:   'Driver en Route',
  ITEMS_PICKED_UP:          'Items Picked Up',
  RECEIVED_AT_OUTLET:       'At Outlet',
  INSPECTION_COMPLETE:      'Inspection Done',
  AWAITING_PAYMENT:         'Awaiting Payment',
  IN_PROCESSING:            'In Processing',
  QUALITY_CHECK:            'Quality Check',
  READY_FOR_DELIVERY:       'Ready for Delivery',
  DRIVER_EN_ROUTE_DELIVERY: 'Driver en Route',
  DELIVERED:                'Delivered',
  COMPLETED:                'Completed',
  CANCELLED:                'Cancelled',
};

export const CANCEL_REASONS = [
  'Changed my mind', 'Found a better price elsewhere', 'Duplicate order',
  'Unable to be home for pickup', 'Emergency / unexpected event',
  'Order taking too long', 'Wrong items selected', 'Other',
];

export const REMOVAL_REASONS = [
  'Found damaged', 'Wrong item added', 'Different care required',
  'No longer needed', 'Already clean', 'Too expensive', 'Other',
];
