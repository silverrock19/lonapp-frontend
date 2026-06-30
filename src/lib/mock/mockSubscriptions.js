// Mock subscriptions for US-0090–0091 Recurring Orders

export const FREQ_LABELS = {
  weekly:   'Weekly',
  biweekly: 'Every 2 Weeks',
  monthly:  'Monthly',
};

export const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
};

export const SUB_STATUS_LABELS = {
  ACTIVE:    'Active',
  PAUSED:    'Paused',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

const MOCK_SUBSCRIPTIONS = [
  {
    id: 'sub-001',
    name: 'Weekly Laundry',
    status: 'ACTIVE',
    templateId: 'tmpl-001',
    templateName: 'Weekly Shirts & Trousers',
    frequency: 'weekly',
    preferredDay: 'monday',
    startDate: '2026-01-12',
    nextOrderDate: '2026-07-06',
    outletName: 'CleanPro Osu',
    turnaround: 'standard',
    items: [
      { name: 'Shirt / Blouse',  qty: 5, unitPrice: 8  },
      { name: 'Trouser / Pants', qty: 3, unitPrice: 10 },
    ],
    deliveryAddress: { label: 'Home', detail: '42 Liberation Road, Osu, Accra' },
    paymentMethod: { label: 'MTN MoMo', sub: '0244 567 890' },
    autoRenew: true,
    skipHolidays: true,
    estimatedPerOrder: 96.6,
    estimatedMonthlySpend: 386.4,
    ordersPlaced: 24,
    history: [
      { date: '2026-06-22', orderId: 'ORD-2026-06-1001', total: 96.6, status: 'COMPLETED' },
      { date: '2026-06-15', orderId: 'ORD-2026-06-0901', total: 96.6, status: 'COMPLETED' },
      { date: '2026-06-08', orderId: 'ORD-2026-06-0801', total: 96.6, status: 'COMPLETED' },
      { date: '2026-06-01', orderId: 'ORD-2026-06-0701', total: 96.6, status: 'COMPLETED' },
    ],
    skippedDates: ['2026-03-06'],
    createdAt: '2026-01-12',
  },
  {
    id: 'sub-002',
    name: 'Monthly Dry Cleaning',
    status: 'PAUSED',
    templateId: 'tmpl-002',
    templateName: 'Monthly Dry Cleaning',
    frequency: 'monthly',
    preferredDay: 'friday',
    startDate: '2026-02-20',
    nextOrderDate: null,
    outletName: 'CleanPro Osu',
    turnaround: 'express',
    items: [
      { name: 'Suit (2-piece)', qty: 1, unitPrice: 35 },
      { name: 'Dress Shirt',    qty: 3, unitPrice: 10 },
    ],
    deliveryAddress: { label: 'Office', detail: '4 Ringway Estate Close, Cantonments, Accra' },
    paymentMethod: { label: 'Visa Card', sub: '•••• 4242' },
    autoRenew: true,
    skipHolidays: false,
    estimatedPerOrder: 95.3,
    estimatedMonthlySpend: 95.3,
    ordersPlaced: 4,
    history: [
      { date: '2026-05-28', orderId: 'ORD-2026-05-0902', total: 95.3, status: 'COMPLETED' },
      { date: '2026-04-25', orderId: 'ORD-2026-04-0801', total: 95.3, status: 'COMPLETED' },
    ],
    skippedDates: [],
    pausedAt: '2026-06-10',
    createdAt: '2026-02-20',
  },
];

const MAP = Object.fromEntries(MOCK_SUBSCRIPTIONS.map(s => [s.id, s]));

export const getAllSubscriptions = () => [...MOCK_SUBSCRIPTIONS];
export const getSubscription    = id => MAP[id] ?? null;
