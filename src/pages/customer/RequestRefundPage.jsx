import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getOrder } from '../../lib/mock/mockOrders.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const REASONS = [
  'Order cancelled before pickup',
  'Service quality issue',
  'Items damaged during cleaning',
  'Incorrect billing / overcharge',
  'Missing items',
  'Other',
];

const METHODS = [
  { id: 'original',     label: 'Original payment method' },
  { id: 'store_credit', label: 'Store credit (instant)' },
  { id: 'mobile_money', label: 'Mobile Money' },
  { id: 'bank',         label: 'Bank transfer' },
];

export default function RequestRefundPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const order    = getOrder(id);

  const [reason,    setReason]    = useState('');
  const [amount,    setAmount]    = useState(order?.total?.toFixed(2) ?? '0.00');
  const [method,    setMethod]    = useState('original');
  const [momoNo,    setMomoNo]    = useState('');
  const [bankAcct,  setBankAcct]  = useState('');
  const [notes,     setNotes]     = useState('');
  const [submitting,setSubmitting]= useState(false);
  const [done,      setDone]      = useState(false);

  const maxAmt   = order?.total ?? 0;
  const parsedAmt = parseFloat(amount) || 0;
  const valid    = reason && parsedAmt > 0 && parsedAmt <= maxAmt && method &&
    (method !== 'mobile_money' || momoNo.trim().length >= 10) &&
    (method !== 'bank' || bankAcct.trim().length >= 5);

  async function handleSubmit() {
    if (!valid) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <CheckCircle className="h-16 w-16 text-success-text mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Refund Requested</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">
          Your refund of {fmtPrice(parsedAmt)} is {parsedAmt <= 50 ? 'automatically approved and being processed' : 'under review — you\'ll hear back within 2 business days'}.
        </p>
        <button onClick={() => navigate('/app/disputes')} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">Track Refund Status</button>
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
          <p className="text-small font-bold text-neutral-900">Request Refund</p>
          {order && <p className="text-caption text-neutral-400 font-mono">{id} · max {fmtPrice(maxAmt)}</p>}
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Reason */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Reason for Refund</p>
          <div className="space-y-2">
            {REASONS.map(r => (
              <button key={r} onClick={() => setReason(r)} className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-small font-medium transition-all ${reason === r ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold' : 'border-neutral-200 text-neutral-700'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Refund Amount</p>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-100 transition-all">
            <span className="text-small font-semibold text-neutral-500">GH₵</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              max={maxAmt}
              step="0.01"
              className="flex-1 bg-transparent text-body font-bold text-neutral-900 outline-none tabular-nums"
            />
          </div>
          {parsedAmt > maxAmt && (
            <p className="text-caption text-error mt-1">Cannot exceed order total of {fmtPrice(maxAmt)}</p>
          )}
          <button onClick={() => setAmount(maxAmt.toFixed(2))} className="text-caption text-accent-600 font-semibold mt-1.5">Use full amount ({fmtPrice(maxAmt)})</button>
        </div>

        {/* Method */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Refund Method</p>
          <div className="space-y-2">
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-small font-medium transition-all ${method === m.id ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold' : 'border-neutral-200 text-neutral-700'}`}>
                {m.label}
              </button>
            ))}
          </div>

          {method === 'mobile_money' && (
            <div className="mt-3">
              <label className="text-caption text-neutral-500 mb-1 block">Mobile Money Number</label>
              <input type="tel" value={momoNo} onChange={e => setMomoNo(e.target.value)} placeholder="0244 567 890" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
            </div>
          )}
          {method === 'bank' && (
            <div className="mt-3">
              <label className="text-caption text-neutral-500 mb-1 block">Account Number</label>
              <input type="text" value={bankAcct} onChange={e => setBankAcct(e.target.value)} placeholder="Bank account number" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Additional Notes <span className="font-normal text-neutral-300">(Optional)</span></p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any additional context…" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 resize-none placeholder:text-neutral-400" />
        </div>

        {parsedAmt <= 50 && parsedAmt > 0 && (
          <div className="rounded-xl bg-success-bg px-4 py-3 text-caption text-success-text">
            ✓ Refunds under GH₵ 50 are automatically approved.
          </div>
        )}
        {parsedAmt > 50 && (
          <div className="rounded-xl bg-warning-bg px-4 py-3 text-caption text-warning-text">
            Refunds over GH₵ 50 require manual review (1–2 business days).
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
        >
          {submitting ? <span className="animate-pulse">Submitting…</span> : `Request ${fmtPrice(parsedAmt)} Refund`}
        </button>
      </div>
    </div>
  );
}
