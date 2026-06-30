import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, MapPin, CheckCircle } from 'lucide-react';
import { getOrder } from '../../lib/mock/mockOrders.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';
const DELIVERY_FEE_PER = 15;

const SAVED_ADDRESSES = [
  { id: 'addr-1', label: 'Home',   detail: '42 Liberation Road, Osu, Accra'             },
  { id: 'addr-2', label: 'Office', detail: '4 Ringway Estate Close, Cantonments, Accra'  },
];

export default function SplitDeliveryPage() {
  const navigate = useNavigate();

  // Demo: use ORD-2026-06-1001's items
  const items = [
    { id: 'i1', name: 'Shirt / Blouse',   qty: 3, unitPrice: 8  },
    { id: 'i2', name: 'Trouser / Pants',  qty: 2, unitPrice: 10 },
    { id: 'i3', name: 'Shirt (Iron Only)', qty: 2, unitPrice: 5  },
  ];

  const [addresses, setAddresses] = useState([
    { id: 'split-1', addrId: 'addr-1', recipName: '', recipPhone: '', notes: '', allocation: {} },
  ]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function addAddress() {
    if (addresses.length >= 5) return;
    setAddresses(prev => [...prev, { id: `split-${Date.now()}`, addrId: '', recipName: '', recipPhone: '', notes: '', allocation: {} }]);
  }

  function removeAddress(id) {
    setAddresses(prev => prev.filter(a => a.id !== id));
  }

  function updateAddress(id, field, value) {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  function setAlloc(addrId, itemId, qty) {
    setAddresses(prev => prev.map(a => a.id === addrId ? { ...a, allocation: { ...a.allocation, [itemId]: Math.max(0, qty) } } : a));
  }

  const totalDeliveryFees = addresses.length * DELIVERY_FEE_PER;

  const valid = addresses.length >= 2 &&
    addresses.every(a => a.addrId && a.recipName.trim() && a.recipPhone.trim().length >= 10);

  async function handlePlace() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <CheckCircle className="h-16 w-16 text-success-text mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Split Delivery Confirmed</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">Items will be delivered to {addresses.length} addresses. Each recipient will receive an SMS when their items are on the way.</p>
        <button onClick={() => navigate('/app/orders')} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">Track Orders</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-bold text-neutral-900">Split Delivery</p>
          <p className="text-caption text-neutral-400">Deliver items to 2–5 addresses · {fmtPrice(DELIVERY_FEE_PER)}/address</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Info */}
        <div className="rounded-xl bg-accent-50 px-4 py-3 text-caption text-accent-600">
          <p className="font-semibold mb-0.5">How split delivery works</p>
          <p>Assign items to each delivery address. Each recipient gets a separate SMS tracking link.</p>
        </div>

        {/* Items summary */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Items in Order</p>
          {items.map(it => (
            <div key={it.id} className="flex justify-between text-small text-neutral-700 py-1">
              <span>{it.name}</span><span className="font-semibold">× {it.qty}</span>
            </div>
          ))}
        </div>

        {/* Addresses */}
        {addresses.map((addr, idx) => (
          <div key={addr.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">{idx + 1}</div>
                <p className="text-small font-bold text-neutral-900">Delivery Address {idx + 1}</p>
              </div>
              {addresses.length > 1 && (
                <button onClick={() => removeAddress(addr.id)} className="text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={addr.addrId}
              onChange={e => updateAddress(addr.id, 'addrId', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400"
            >
              <option value="">Select address…</option>
              {SAVED_ADDRESSES.map(a => (
                <option key={a.id} value={a.id}>{a.label} — {a.detail}</option>
              ))}
            </select>

            <input type="text" value={addr.recipName} onChange={e => updateAddress(addr.id, 'recipName', e.target.value)} placeholder="Recipient name" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
            <input type="tel" value={addr.recipPhone} onChange={e => updateAddress(addr.id, 'recipPhone', e.target.value)} placeholder="Recipient phone" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
            <input type="text" value={addr.notes} onChange={e => updateAddress(addr.id, 'notes', e.target.value)} placeholder="Notes (gate code, building, etc.)" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
          </div>
        ))}

        {addresses.length < 5 && (
          <button onClick={addAddress} className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 py-4 text-small text-accent-600 font-semibold hover:bg-accent-50 transition-colors">
            <Plus className="h-4 w-4" /> Add Delivery Address ({addresses.length}/5)
          </button>
        )}

        {/* Fee summary */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <div className="flex justify-between text-small text-neutral-600">
            <span>Delivery fees ({addresses.length} × {fmtPrice(DELIVERY_FEE_PER)})</span>
            <span className="font-bold tabular-nums">{fmtPrice(totalDeliveryFees)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handlePlace}
          disabled={!valid || submitting}
          className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
        >
          {submitting ? 'Confirming…' : `Confirm Split Delivery to ${addresses.length} Addresses`}
        </button>
      </div>
    </div>
  );
}
