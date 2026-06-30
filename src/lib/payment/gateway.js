// Mock payment gateway abstraction — all transactions are simulated; no real money ever moves.
// EP-03 checkout and EP-06 payment screens route through this layer.
// Amounts/tax always come from EP-05 pricing engine — gateway never recomputes prices.

let txnCounter = 1000;
const txnStore = new Map(); // txnId → transaction record

function nextTxnId() {
  return 'PAY-' + String(++txnCounter).padStart(6, '0');
}

// Core payment processor
export async function processPayment({ method, amount, orderId, customerId, meta = {} }) {
  await delay(method === 'momo' ? 4500 : 1000);

  const txnId  = nextTxnId();
  const status = simulateOutcome(method);

  const record = {
    txnId,
    method,
    amount,
    orderId,
    customerId,
    status,
    createdAt: new Date().toISOString(),
    reference: buildReference(method),
    meta,
  };
  txnStore.set(txnId, record);
  return record;
}

export async function processRefund({ originalTxnId, amount, reason, destination }) {
  await delay(800);
  const original = txnStore.get(originalTxnId);
  const refundId = 'REF-' + String(Date.now()).slice(-6);
  const record = {
    refundId,
    originalTxnId,
    amount,
    reason,
    destination,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
    original,
  };
  // Auto-complete small refunds
  if (amount <= 50) {
    await delay(500);
    record.status = 'COMPLETED';
    record.completedAt = new Date().toISOString();
  }
  return record;
}

export function getTransaction(txnId) {
  return txnStore.get(txnId) ?? null;
}

// Helpers
function simulateOutcome(method) {
  if (method === 'cash' || method === 'pay_on_delivery') return 'SUCCESS';
  return Math.random() > 0.05 ? 'SUCCESS' : 'FAILED';
}

function buildReference(method) {
  const prefix = { momo: 'MM', card: 'CD', cash: 'CS', wallet: 'WL', plan: 'PL' }[method] ?? 'TX';
  return prefix + '-' + Math.random().toString(36).slice(2, 10).toUpperCase();
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
