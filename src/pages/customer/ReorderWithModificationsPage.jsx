import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Package } from 'lucide-react';
import { getOrder, turnaroundLabel } from '../../lib/mock/mockOrders.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { generateQuote } from '../../lib/pricing/engine.js';
import { calcTax } from '../../lib/pricing/tax.js';
import { formatGHS, getTaxLabel } from '../../utils/formatCurrency.js';

const fmtPrice = formatGHS;

function calcTotals(items, turnaround) {
  try {
    const q = generateQuote({
      cartItems: items.map(i => ({
        serviceId: i.id ?? i.serviceId,
        name: i.name,
        qty: i.qty,
        unitPrice: i.unitPrice,
        category: 'washing',
      })),
      turnaroundId: turnaround,
      deliveryMethod: 'home_delivery',
      customerTier: 'retail',
    });
    return { subtotal: q.subtotal, surcharge: q.surchargeAmount, vat: q.totalTax, total: q.grandTotal };
  } catch {
    const sub = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const { totalTax } = calcTax(sub);
    return { subtotal: sub, surcharge: 0, vat: totalTax, total: sub + totalTax };
  }
}

export default function ReorderWithModificationsPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const order    = getOrder(id);

  const [items,      setItems]      = useState(order?.items.map(i => ({ ...i })) ?? []);
  const [turnaround, setTurnaround] = useState(order?.turnaround ?? 'standard');
  const [notes,      setNotes]      = useState(order?.notes ?? '');

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="Order not found" action={
          <button onClick={() => navigate('/app/orders')} className="text-accent-600 text-small font-semibold">Back to Orders</button>
        } />
      </div>
    );
  }

  function changeQty(idx, delta) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(0, it.qty + delta) } : it).filter(it => it.qty > 0));
  }

  const totals = calcTotals(items, turnaround);
  const canPlace = items.length > 0;

  function handlePlace() {
    navigate('/app/order/review');
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-bold text-neutral-900">Reorder with Edits</p>
          <p className="text-caption text-neutral-400 font-mono">Cloned from {id}</p>
        </div>
        <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-caption font-semibold text-accent-600">DRAFT</span>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Turnaround */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Service Speed</p>
          <div className="flex gap-2">
            {['standard', 'express'].map(t => (
              <button
                key={t}
                onClick={() => setTurnaround(t)}
                className={`flex-1 rounded-xl border-2 py-2.5 text-small font-semibold transition-all ${
                  turnaround === t ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-neutral-200 text-neutral-600'
                }`}
              >
                {turnaroundLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Items</p>
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100 first:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-small font-semibold text-neutral-800">{item.name}</p>
                <p className="text-caption text-neutral-400">{fmtPrice(item.unitPrice)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => changeQty(idx, -1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                  <Minus className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <span className="w-6 text-center text-small font-bold text-neutral-900 tabular-nums">{item.qty}</span>
                <button onClick={() => changeQty(idx, +1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 hover:bg-accent-100 transition-colors">
                  <Plus className="h-3.5 w-3.5 text-accent-600" />
                </button>
              </div>
              <p className="w-16 text-right text-small font-bold text-neutral-800 tabular-nums">{fmtPrice(item.unitPrice * item.qty)}</p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="px-4 py-4 text-small text-neutral-400 italic">All items removed — add items to continue.</p>
          )}
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Special Instructions</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any special care instructions…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 resize-none placeholder:text-neutral-400 transition-all"
          />
        </div>

        {/* Pricing */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-1.5">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Pricing Estimate</p>
          {[
            { label: 'Subtotal',          value: totals.subtotal  },
            turnaround !== 'standard' && { label: 'Speed surcharge',  value: totals.surcharge },
            { label: 'Pickup + Delivery', value: 30               },
            { label: getTaxLabel(),        value: totals.vat       },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} className="flex justify-between text-small text-neutral-600">
              <span>{label}</span>
              <span className="tabular-nums">{fmtPrice(value)}</span>
            </div>
          ))}
          <div className="flex justify-between text-body font-bold pt-2 border-t border-neutral-100">
            <span className="text-neutral-900">Total</span>
            <span className="text-accent-600 tabular-nums">{fmtPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handlePlace}
          disabled={!canPlace}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600 active:opacity-70 transition-all"
        >
          Continue to Schedule & Pay
        </button>
      </div>
    </div>
  );
}
