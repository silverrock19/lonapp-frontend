import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { calcTax } from '../../lib/pricing/tax.js';
import { getPricingConfig } from '../../lib/mock/mockPricing.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const fmtPrice = formatGHS;

const RUSH_TYPES = [
  {
    id: 'same_day_4hr',
    label: 'Same-Day 4-Hour',
    sla: '4 hour turnaround',
    surcharge: 2.0,
    maxItems: 20,
    window: 'Order before 10 AM for same-day return',
    color: 'text-warning-text',
    bg: 'bg-warning-bg',
  },
  {
    id: 'express_2hr',
    label: 'Express 2-Hour',
    sla: '2 hour turnaround',
    surcharge: 3.5,
    maxItems: 10,
    window: 'Order before 3 PM',
    color: 'text-error',
    bg: 'bg-error-bg',
  },
  {
    id: 'emergency_90min',
    label: 'Emergency 90-Min',
    sla: '90 minute turnaround',
    surcharge: 5.0,
    maxItems: 5,
    window: 'Available 7 AM – 6 PM only',
    color: 'text-error',
    bg: 'bg-error-bg',
  },
];

const ELIGIBLE_ITEMS = [
  { id: 'shirt', name: 'Shirt / Blouse',  unitPrice: 8  },
  { id: 'trouser', name: 'Trouser / Pants', unitPrice: 10 },
  { id: 'dress', name: 'Dress / Skirt',  unitPrice: 12 },
  { id: 'suit',  name: 'Suit (2-piece)',  unitPrice: 35 },
];

const PAYMENT_METHODS = [
  { id: 'momo', label: 'MTN MoMo'  },
  { id: 'card', label: 'Card'      },
];

export default function RushOrderPage() {
  const navigate = useNavigate();
  const [rushType, setRushType]   = useState('');
  const [itemQtys, setItemQtys]   = useState({});
  const [payment,  setPayment]    = useState('momo');
  const [contact,  setContact]    = useState('');
  const [agreed,   setAgreed]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const selected = RUSH_TYPES.find(r => r.id === rushType);
  const totalItems = Object.values(itemQtys).reduce((s, q) => s + q, 0);
  const subtotal   = ELIGIBLE_ITEMS.reduce((s, it) => s + it.unitPrice * (itemQtys[it.id] ?? 0), 0);
  const surcharge  = selected ? subtotal * selected.surcharge : 0;
  const taxResult  = calcTax(subtotal + surcharge, getPricingConfig().tax);
  const vat        = taxResult.totalTax;
  const total      = subtotal + surcharge + 30 + vat;

  const canPlace = rushType && totalItems > 0 && payment && contact.trim().length >= 10 && agreed;

  function setQty(id, delta) {
    setItemQtys(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  }

  async function handlePlace() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <Zap className="h-16 w-16 text-warning-text mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Rush Order Placed!</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">A driver is being dispatched. You'll receive hourly SMS updates. {selected?.sla} guaranteed.</p>
        <button onClick={() => navigate('/app/orders')} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">Track Order</button>
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
          <p className="text-small font-bold text-neutral-900">Emergency / Rush Order</p>
          <p className="text-caption text-neutral-400">Priority handling · Upfront payment required</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Rush type */}
        <div className="space-y-2">
          {RUSH_TYPES.map(rt => (
            <button key={rt.id} onClick={() => setRushType(rt.id)} className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${rushType === rt.id ? 'border-accent-500 bg-accent-50' : 'border-neutral-100 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap className={`h-4 w-4 ${rt.color}`} />
                  <p className={`text-small font-bold ${rushType === rt.id ? 'text-accent-700' : 'text-neutral-900'}`}>{rt.label}</p>
                </div>
                <span className={`text-caption font-bold px-2 py-0.5 rounded-full ${rt.bg} ${rt.color}`}>×{rt.surcharge} surcharge</span>
              </div>
              <p className="text-caption text-neutral-400">{rt.window} · max {rt.maxItems} items</p>
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Items (no bulky items)</p>
          {ELIGIBLE_ITEMS.map(it => {
            const qty = itemQtys[it.id] ?? 0;
            return (
              <div key={it.id} className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100">
                <div className="flex-1">
                  <p className="text-small font-semibold text-neutral-800">{it.name}</p>
                  <p className="text-caption text-neutral-400">{fmtPrice(it.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(it.id, -1)} disabled={qty === 0} className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 disabled:opacity-30">
                    <span className="font-bold text-neutral-600">−</span>
                  </button>
                  <span className="w-5 text-center text-small font-bold tabular-nums">{qty}</span>
                  <button onClick={() => setQty(it.id, +1)} disabled={selected && totalItems >= selected.maxItems} className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 disabled:opacity-30">
                    <span className="font-bold text-accent-600">+</span>
                  </button>
                </div>
              </div>
            );
          })}
          {selected && totalItems >= selected.maxItems && (
            <p className="px-4 pb-3 text-caption text-warning-text">Max {selected.maxItems} items for {selected.label}.</p>
          )}
        </div>

        {/* Pricing */}
        {subtotal > 0 && selected && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-1.5">
            {[
              { label: 'Subtotal',                    value: subtotal  },
              { label: `${selected.label} surcharge`, value: surcharge },
              { label: 'Pickup + Delivery',           value: 30        },
              ...taxResult.breakdown.map(line => ({ label: line.label, value: line.amount })),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-small text-neutral-600">
                <span>{label}</span><span className="tabular-nums">{fmtPrice(value)}</span>
              </div>
            ))}
            <div className="flex justify-between text-body font-bold pt-2 border-t border-neutral-100">
              <span className="text-neutral-900">Total</span>
              <span className="text-accent-600 tabular-nums">{fmtPrice(total)}</span>
            </div>
          </div>
        )}

        {/* Emergency contact */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Emergency Contact Number</label>
          <input type="tel" value={contact} onChange={e => setContact(e.target.value)} placeholder="+233 24 000 0000" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
          <p className="text-caption text-neutral-400 mt-1">Driver will call this number on arrival.</p>
        </div>

        {/* Payment */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Payment (upfront required)</p>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map(pm => (
              <button key={pm.id} onClick={() => setPayment(pm.id)} className={`flex-1 rounded-xl border-2 py-2.5 text-small font-semibold transition-all ${payment === pm.id ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-neutral-200 text-neutral-600'}`}>
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* SLA acknowledgment */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-accent-500" />
            <p className="text-small text-neutral-700 leading-relaxed">
              I understand the {selected?.sla ?? 'rush'} SLA. If the SLA is missed, I'm entitled to a full refund of the rush surcharge.
              Hourly SMS tracking will be sent to my registered number.
            </p>
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handlePlace}
          disabled={!canPlace || submitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
        >
          <Zap className="h-4 w-4" />
          {submitting ? 'Placing Rush Order…' : `Place Rush Order · ${fmtPrice(total)}`}
        </button>
      </div>
    </div>
  );
}
