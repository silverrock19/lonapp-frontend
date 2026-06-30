// Mock payment transaction data for EP-06

export const PAYMENT_METHODS = {
  momo:            { label: 'Mobile Money',  icon: 'smartphone' },
  card:            { label: 'Card',          icon: 'credit-card' },
  cash:            { label: 'Cash',          icon: 'banknote' },
  wallet:          { label: 'Wallet',        icon: 'wallet' },
  pay_on_delivery: { label: 'Pay on Delivery', icon: 'clock' },
  bank_transfer:   { label: 'Bank Transfer', icon: 'building' },
};

export const PAYMENT_STATUSES = {
  SUCCESS:    { label: 'Paid',        color: 'text-success-text', bg: 'bg-success-bg'  },
  PENDING:    { label: 'Pending',     color: 'text-warning-text', bg: 'bg-warning-bg'  },
  FAILED:     { label: 'Failed',      color: 'text-error',        bg: 'bg-error-bg'    },
  REFUNDED:   { label: 'Refunded',    color: 'text-accent-600',   bg: 'bg-accent-50'   },
  PARTIAL:    { label: 'Partial',     color: 'text-warning-text', bg: 'bg-warning-bg'  },
  OVERDUE:    { label: 'Overdue',     color: 'text-error',        bg: 'bg-error-bg'    },
};

export const MOCK_TRANSACTIONS = [
  {
    id: 'PAY-001001',
    orderId: 'ORD-2026-06-1001',
    customerId: 'cust-001',
    customerName: 'Adwoa Frimpong',
    method: 'momo',
    provider: 'mtn',
    providerRef: 'MTN-ABC123XY',
    amount: 105.75,
    status: 'SUCCESS',
    createdAt: '2026-06-28T09:15:00',
    settledAt: '2026-06-28T09:15:32',
    note: 'MTN MoMo · +233 24 567 890',
  },
  {
    id: 'PAY-001002',
    orderId: 'ORD-2026-06-1002',
    customerId: 'cust-002',
    customerName: 'GoldCoast Hotels',
    method: 'bank_transfer',
    provider: null,
    providerRef: 'GCB-TXN-88723',
    amount: 1250.00,
    status: 'SUCCESS',
    createdAt: '2026-06-27T14:30:00',
    settledAt: '2026-06-28T10:00:00',
    note: 'GCB Bank Transfer · Acc ****4521',
  },
  {
    id: 'PAY-001003',
    orderId: 'ORD-2026-06-1003',
    customerId: 'cust-003',
    customerName: 'Kweku Mensah',
    method: 'cash',
    provider: null,
    providerRef: null,
    amount: 45.00,
    status: 'SUCCESS',
    createdAt: '2026-06-27T11:00:00',
    settledAt: '2026-06-27T11:00:00',
    note: 'Cash · POS Counter',
  },
  {
    id: 'PAY-001004',
    orderId: 'ORD-2026-06-1004',
    customerId: 'cust-004',
    customerName: 'Abena Sarpong',
    method: 'card',
    provider: 'visa',
    providerRef: 'PSK-CD-99123',
    amount: 320.50,
    status: 'SUCCESS',
    createdAt: '2026-06-26T16:45:00',
    settledAt: '2026-06-26T16:45:58',
    note: 'Visa · ****4521',
  },
  {
    id: 'PAY-001005',
    orderId: 'ORD-2026-06-1005',
    customerId: 'cust-001',
    customerName: 'Adwoa Frimpong',
    method: 'momo',
    provider: 'vodafone',
    providerRef: 'VOD-ERR-00912',
    amount: 55.75,
    status: 'FAILED',
    createdAt: '2026-06-26T16:00:00',
    settledAt: null,
    note: 'Insufficient balance',
    retryCount: 1,
    nextRetry: '2026-06-26T17:00:00',
  },
  {
    id: 'PAY-001006',
    orderId: 'ORD-2026-06-0901',
    customerId: 'cust-005',
    customerName: 'Yaw Boateng',
    method: 'momo',
    provider: 'airteltigo',
    providerRef: 'AT-TXN-22981',
    amount: 75.00,
    status: 'REFUNDED',
    createdAt: '2026-06-20T08:00:00',
    settledAt: '2026-06-20T08:01:10',
    refundedAt: '2026-06-25T14:00:00',
    note: 'AirtelTigo · +233 27 123 456',
  },
  {
    id: 'PAY-001007',
    orderId: 'ORD-2026-06-0802',
    customerId: 'cust-006',
    customerName: 'Ama Darko',
    method: 'wallet',
    provider: null,
    providerRef: 'WLT-TXN-44512',
    amount: 88.25,
    status: 'SUCCESS',
    createdAt: '2026-06-22T13:20:00',
    settledAt: '2026-06-22T13:20:01',
    note: 'Wallet balance',
  },
  {
    id: 'PAY-001008',
    orderId: 'ORD-2026-05-0701',
    customerId: 'cust-002',
    customerName: 'GoldCoast Hotels',
    method: 'bank_transfer',
    provider: null,
    providerRef: null,
    amount: 2100.00,
    status: 'OVERDUE',
    createdAt: '2026-05-28T09:00:00',
    settledAt: null,
    dueDate: '2026-06-05T23:59:00',
    note: 'Invoice INV-2026-000045 overdue',
  },
];

// Reconciliation data — matches payments to bank settlements
export const MOCK_RECONCILIATION = [
  { txnId: 'PAY-001001', orderId: 'ORD-2026-06-1001', customer: 'Adwoa Frimpong', amount: 105.75, method: 'momo', settledAt: '2026-06-28T09:15:32', gatewayRef: 'MTN-ABC123XY', status: 'MATCHED' },
  { txnId: 'PAY-001002', orderId: 'ORD-2026-06-1002', customer: 'GoldCoast Hotels', amount: 1250.00, method: 'bank_transfer', settledAt: '2026-06-28T10:00:00', gatewayRef: 'GCB-TXN-88723', status: 'MATCHED' },
  { txnId: 'PAY-001003', orderId: 'ORD-2026-06-1003', customer: 'Kweku Mensah', amount: 45.00, method: 'cash', settledAt: '2026-06-27T11:00:00', gatewayRef: null, status: 'MATCHED' },
  { txnId: 'PAY-001004', orderId: 'ORD-2026-06-1004', customer: 'Abena Sarpong', amount: 320.50, method: 'card', settledAt: '2026-06-26T16:45:58', gatewayRef: 'PSK-CD-99123', status: 'VARIANCE', varianceAmount: 0.50 },
  { txnId: 'PAY-001007', orderId: 'ORD-2026-06-0802', customer: 'Ama Darko', amount: 88.25, method: 'wallet', settledAt: '2026-06-22T13:20:01', gatewayRef: 'WLT-TXN-44512', status: 'MATCHED' },
  { txnId: 'PAY-999991', orderId: null, customer: null, amount: 150.00, method: 'bank_transfer', settledAt: '2026-06-25T09:00:00', gatewayRef: 'GCB-TXN-77654', status: 'UNMATCHED' },
];

// Payment plans
export const MOCK_PAYMENT_PLANS = [
  {
    id: 'plan-001',
    orderId: 'ORD-2026-06-1002',
    customerId: 'cust-002',
    customerName: 'GoldCoast Hotels',
    totalAmount: 1250.00,
    instalments: [
      { num: 1, amount: 625.00, dueDate: '2026-06-01', status: 'PAID', paidAt: '2026-06-01T10:00:00' },
      { num: 2, amount: 625.00, dueDate: '2026-07-01', status: 'PENDING', paidAt: null },
    ],
    frequency: 'monthly',
    status: 'ACTIVE',
    createdAt: '2026-05-28T09:00:00',
  },
  {
    id: 'plan-002',
    orderId: 'ORD-2026-05-0801',
    customerId: 'cust-007',
    customerName: 'Faustina Osei',
    totalAmount: 420.00,
    instalments: [
      { num: 1, amount: 140.00, dueDate: '2026-05-15', status: 'PAID',    paidAt: '2026-05-15T09:00:00' },
      { num: 2, amount: 140.00, dueDate: '2026-06-01', status: 'PAID',    paidAt: '2026-06-02T11:30:00' },
      { num: 3, amount: 140.00, dueDate: '2026-06-15', status: 'OVERDUE', paidAt: null },
    ],
    frequency: 'bi-weekly',
    status: 'AT_RISK',
    createdAt: '2026-05-10T08:00:00',
  },
];

// Reminders config
export const DEFAULT_REMINDER_CONFIG = {
  enabled: true,
  gracePeriodDays: 3,
  schedule: [3, 7, 14],
  autoSuspendDays: 30,
  channels: ['sms', 'email'],
  excludeVip: true,
  excludeSmallBalances: true,
  smallBalanceThreshold: 20,
};

// Wallet balances
export const MOCK_WALLET_BALANCES = [
  { customerId: 'cust-001', customerName: 'Adwoa Frimpong',  balance: 42.50, currency: 'GHS', lastTopUp: '2026-06-20T10:00:00', lastTopUpAmount: 50.00 },
  { customerId: 'cust-002', customerName: 'GoldCoast Hotels', balance: 0.00, currency: 'GHS', lastTopUp: null,                  lastTopUpAmount: 0 },
  { customerId: 'cust-006', customerName: 'Ama Darko',        balance: 18.75, currency: 'GHS', lastTopUp: '2026-06-22T13:20:01', lastTopUpAmount: 100.00 },
];

export const MOCK_WALLET_TOPUPS = [
  { id: 'topup-001', customerId: 'cust-001', amount: 50.00, method: 'momo', ref: 'MTN-TOP-77701', createdAt: '2026-06-20T10:00:00' },
  { id: 'topup-002', customerId: 'cust-006', amount: 100.00, method: 'card', ref: 'PSK-TOP-88202', createdAt: '2026-06-22T13:20:01' },
];

// Revenue trend — last 7 days (for analytics sparkline)
export const MOCK_REVENUE_TREND = [
  { day: 'Mon', date: '2026-06-23', revenue: 820.50,  txns: 4 },
  { day: 'Tue', date: '2026-06-24', revenue: 1240.00, txns: 6 },
  { day: 'Wed', date: '2026-06-25', revenue: 390.25,  txns: 2 },
  { day: 'Thu', date: '2026-06-26', revenue: 975.75,  txns: 5 },
  { day: 'Fri', date: '2026-06-27', revenue: 1295.00, txns: 7 },
  { day: 'Sat', date: '2026-06-28', revenue: 1809.50, txns: 8 },
  { day: 'Sun', date: '2026-06-29', revenue: 0,        txns: 0 },
];

// Accessors
export const getTransaction    = id  => MOCK_TRANSACTIONS.find(t => t.id === id) ?? null;
export const getAllTransactions = ()  => [...MOCK_TRANSACTIONS];
export const getTransactionsForOrder = orderId => MOCK_TRANSACTIONS.filter(t => t.orderId === orderId);
export const getTransactionsForCustomer = custId => MOCK_TRANSACTIONS.filter(t => t.customerId === custId);
export const getAllPaymentPlans = () => [...MOCK_PAYMENT_PLANS];
export const getPaymentPlan    = id  => MOCK_PAYMENT_PLANS.find(p => p.id === id) ?? null;
export const getWalletBalance  = custId => MOCK_WALLET_BALANCES.find(w => w.customerId === custId) ?? null;
export const getAllWalletBalances = () => [...MOCK_WALLET_BALANCES];
