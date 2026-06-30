import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInvoice, getAllInvoices } from '../../lib/mock/mockInvoices.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const REASONS = [
  'Incorrect Amount',
  'Duplicate Charge',
  'Service Not Received',
  'Quality Issue — request re-service',
  'Discount Not Applied',
  'Other',
];

const RESOLUTIONS = ['Full Refund', 'Partial Refund', 'Credit to Wallet', 'Re-Service at No Charge'];
const CONTACTS   = ['Phone', 'Email', 'WhatsApp', 'In-App'];

const STATUS_STYLES = {
  PAID:    'bg-green-100 text-green-700',
  UNPAID:  'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
  PARTIAL: 'bg-blue-100 text-blue-700',
};

function Radio({ label, checked, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border px-4 py-3 text-sm transition-all',
        checked
          ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold'
          : 'border-neutral-200 text-neutral-700'
      )}
    >
      {label}
    </button>
  );
}

export default function BillingDisputePage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const allInvoices = useMemo(() => getAllInvoices(), []);

  const defaultInvoice = useMemo(
    () => invoiceId
      ? getInvoice(invoiceId)
      : allInvoices.find(i => i.status === 'OVERDUE') ?? allInvoices[0],
    [invoiceId, allInvoices]
  );

  const [selectedId, setSelectedId] = useState(defaultInvoice?.id ?? '');
  const invoice = useMemo(
    () => allInvoices.find(i => i.id === selectedId) ?? defaultInvoice,
    [selectedId, allInvoices, defaultInvoice]
  );

  const [reason, setReason]         = useState('');
  const [disputed, setDisputed]     = useState('');
  const [description, setDesc]      = useState('');
  const [resolution, setResolution] = useState('');
  const [contact, setContact]       = useState('Phone');
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [disputeRef, setDisputeRef] = useState('');

  const amount = invoice?.totalAmount ?? 0;
  const descOk = description.trim().length >= 20;
  const canSubmit = reason && descOk && resolution;

  function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const rand  = Math.floor(1000 + Math.random() * 9000);
      setDisputeRef(`DSP-${today}-${rand}`);
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  if (allInvoices.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">No invoices found to dispute.</div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ background: '#FAFAF8' }}>
        <CheckCircle className="text-accent-500" size={72} strokeWidth={1.5} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Dispute Submitted</h1>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Your dispute <span className="font-mono font-semibold text-neutral-800">{disputeRef}</span> has been submitted.
            Our team will review within 2 business days.
          </p>
        </div>
        <button
          onClick={() => navigate('/app/disputes')}
          className="w-full max-w-xs bg-accent-500 text-white rounded-xl py-3.5 font-semibold text-sm"
        >
          View My Disputes
        </button>
        <button onClick={() => navigate('/app')} className="text-accent-600 text-sm font-medium">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-neutral-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-neutral-900">Billing Dispute</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Invoice selector */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Invoice</p>
          {!invoiceId && (
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 bg-white mb-3"
            >
              {allInvoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — {inv.customerName} — {formatGHS(inv.totalAmount ?? 0)}
                </option>
              ))}
            </select>
          )}
          {invoice && (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Invoice #</span><span className="font-mono font-semibold text-neutral-800">{invoice.id}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Order</span><span className="font-mono text-neutral-700">{invoice.orderId}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Amount</span><span className="font-mono tabular-nums font-bold text-neutral-900">{formatGHS(amount)}</span></div>
              <div className="flex justify-between items-center"><span className="text-neutral-500">Status</span><span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_STYLES[invoice.status] ?? 'bg-neutral-100 text-neutral-600')}>{invoice.status}</span></div>
            </div>
          )}
        </div>

        {/* Dispute reason */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Dispute Reason</p>
          <div className="space-y-2">
            {REASONS.map(r => <Radio key={r} label={r} checked={reason === r} onSelect={() => setReason(r)} />)}
          </div>
        </div>

        {/* Disputed amount */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Disputed Amount</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-mono">GH₵</span>
            <input
              type="number"
              step="0.01"
              value={disputed || amount.toFixed(2)}
              onChange={e => setDisputed(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-mono tabular-nums text-neutral-800"
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">vs. Invoice total: {formatGHS(amount)}</p>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Description</p>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe the billing issue in detail (minimum 20 characters)…"
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 resize-none"
          />
          <p className={cn('text-xs mt-1', descOk ? 'text-neutral-400' : 'text-warning-text')}>
            {description.trim().length} / 20 min
          </p>
        </div>

        {/* Preferred resolution */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Preferred Resolution</p>
          <div className="space-y-2">
            {RESOLUTIONS.map(r => <Radio key={r} label={r} checked={resolution === r} onSelect={() => setResolution(r)} />)}
          </div>
        </div>

        {/* Contact preference */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Contact Preference</p>
          <div className="grid grid-cols-4 gap-2">
            {CONTACTS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setContact(c)}
                className={cn(
                  'rounded-xl border py-2 text-xs font-medium transition-all',
                  contact === c
                    ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold'
                    : 'border-neutral-200 text-neutral-700'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 pt-3 pb-6 space-y-2">
        {!descOk && description.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-warning-text">
            <AlertCircle size={13} />
            Description needs at least 20 characters.
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={cn(
            'w-full rounded-xl py-3.5 font-semibold text-sm text-white transition-all',
            canSubmit && !loading ? 'bg-accent-500' : 'bg-neutral-300 cursor-not-allowed'
          )}
        >
          {loading ? 'Submitting…' : 'Submit Dispute'}
        </button>
      </div>
    </div>
  );
}
