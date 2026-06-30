// Mock wallet data for EP-06 US-0152

export const MOCK_WALLETS = {
  'cust-001': {
    id: 'WLT-0001-AF01',
    customerId: 'cust-001',
    customerName: 'Adwoa Frimpong',
    balance: 45.50,
    pendingHolds: 0,
    totalCreditsEarned: 12.50,
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00',
    lastTxnAt: '2026-06-22T13:20:01',
    autoTopUp: false,
    autoTopUpThreshold: 20,
    autoTopUpAmount: 50,
  },
  'cust-002': {
    id: 'WLT-0002-GC01',
    customerId: 'cust-002',
    customerName: 'GoldCoast Hotels',
    balance: 500.00,
    pendingHolds: 0,
    totalCreditsEarned: 75.00,
    status: 'ACTIVE',
    createdAt: '2025-11-01T08:00:00',
    lastTxnAt: '2026-06-15T09:00:00',
    autoTopUp: true,
    autoTopUpThreshold: 100,
    autoTopUpAmount: 500,
  },
};

export const MOCK_WALLET_TRANSACTIONS = [
  {
    id: 'TXN-WALL-0001',
    walletId: 'WLT-0001-AF01',
    customerId: 'cust-001',
    type: 'TOPUP',
    amount: 50.00,
    description: 'Top-up via MTN MoMo',
    method: 'momo',
    status: 'SUCCESS',
    createdAt: '2026-06-10T09:00:00',
    balanceAfter: 133.75,
  },
  {
    id: 'TXN-WALL-0002',
    walletId: 'WLT-0001-AF01',
    customerId: 'cust-001',
    type: 'DEBIT',
    amount: -88.25,
    description: 'Payment for ORD-2026-06-0802',
    method: 'wallet',
    status: 'SUCCESS',
    createdAt: '2026-06-22T13:20:01',
    balanceAfter: 45.50,
  },
  {
    id: 'TXN-WALL-0003',
    walletId: 'WLT-0001-AF01',
    customerId: 'cust-001',
    type: 'CREDIT',
    amount: 12.50,
    description: 'Loyalty reward credit',
    method: null,
    status: 'SUCCESS',
    createdAt: '2026-06-01T00:00:00',
    balanceAfter: 58.00,
  },
  {
    id: 'TXN-WALL-0004',
    walletId: 'WLT-0001-AF01',
    customerId: 'cust-001',
    type: 'TOPUP',
    amount: 100.00,
    description: 'Top-up via Visa ****4521',
    method: 'card',
    status: 'SUCCESS',
    createdAt: '2026-05-15T11:30:00',
    balanceAfter: 183.75,
  },
  {
    id: 'TXN-WALL-0005',
    walletId: 'WLT-0001-AF01',
    customerId: 'cust-001',
    type: 'REFUND',
    amount: 55.75,
    description: 'Refund for ORD-2026-05-0701',
    method: null,
    status: 'SUCCESS',
    createdAt: '2026-05-28T14:00:00',
    balanceAfter: 121.50,
  },
];

export const TXN_TYPE_LABELS = {
  TOPUP:  { label: 'Top-up',  color: 'text-success-text', sign: '+' },
  DEBIT:  { label: 'Payment', color: 'text-neutral-700',  sign: '-' },
  CREDIT: { label: 'Credit',  color: 'text-accent-600',   sign: '+' },
  REFUND: { label: 'Refund',  color: 'text-accent-600',   sign: '+' },
  HOLD:   { label: 'Hold',    color: 'text-warning-text', sign: '~' },
};

export function getWallet(customerId) {
  return MOCK_WALLETS[customerId] ?? null;
}

export function getWalletTransactions(customerId) {
  return MOCK_WALLET_TRANSACTIONS.filter(t => t.customerId === customerId);
}

export function getDefaultWallet() {
  return MOCK_WALLETS['cust-001'];
}
