import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar } from 'lucide-react';
import { getOrder } from '../../lib/mock/mockOrders.js';

const QUALITY_ISSUES = [
  'Stains not removed',
  'Poor pressing / ironing',
  'Incorrect service applied',
  'Colour bleeding',
  'Fabric feels different',
  'Other quality issue',
];

const SLOTS = [
  { id: 'morning',   label: '8 AM – 10 AM'  },
  { id: 'midday',    label: '10 AM – 12 PM' },
  { id: 'afternoon', label: '12 PM – 2 PM'  },
  { id: 'evening',   label: '4 PM – 6 PM'   },
];

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export default function RequestRecleaningPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const order    = getOrder(id);

  const [issue,      setIssue]      = useState('');
  const [desc,       setDesc]       = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [slot,       setSlot]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  const minDate = addDays(1);
  const maxDate = addDays(7);
  const valid   = issue && desc.trim().length >= 20 && pickupDate && slot;

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
        <h2 className="text-h3 font-bold text-neutral-900">Re-clean Scheduled</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">
          Your pickup is scheduled for {new Date(pickupDate).toLocaleDateString('en-GH', { weekday: 'long', month: 'long', day: 'numeric' })} ({SLOTS.find(s => s.id === slot)?.label}). This re-clean is at no charge.
        </p>
        <button onClick={() => navigate(`/app/orders/${id}`)} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">View Order</button>
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
          <p className="text-small font-bold text-neutral-900">Request Re-cleaning</p>
          <p className="text-caption text-neutral-400 font-mono">{id} · Free of charge</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Free badge */}
        <div className="rounded-xl bg-success-bg border border-success-text/20 px-4 py-3 text-small text-success-text font-semibold">
          ✓ Re-cleaning is provided at no charge. Max 2 re-cleans per order.
        </div>

        {/* Quality issue */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Quality Issue</p>
          <div className="space-y-2">
            {QUALITY_ISSUES.map(qi => (
              <button key={qi} onClick={() => setIssue(qi)} className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-small font-medium transition-all ${issue === qi ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold' : 'border-neutral-200 text-neutral-700'}`}>
                {qi}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Description</p>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={4}
            placeholder="Describe the quality issue in detail…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 resize-none placeholder:text-neutral-400"
          />
          <p className={`text-caption mt-1 ${desc.trim().length < 20 ? 'text-neutral-400' : 'text-success-text'}`}>{desc.trim().length}/20 min characters</p>
        </div>

        {/* Pickup date */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Pickup Date</p>
          </div>
          <input
            type="date"
            value={pickupDate}
            onChange={e => setPickupDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400"
          />
          <p className="text-caption text-neutral-400 mt-1">Available within the next 7 days.</p>
        </div>

        {/* Time slot */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Pickup Window</p>
          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map(s => (
              <button key={s.id} onClick={() => setSlot(s.id)} className={`rounded-xl border-2 py-2.5 text-small font-semibold transition-all ${slot === s.id ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-neutral-200 text-neutral-600'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
        >
          {submitting ? <span className="animate-pulse">Scheduling…</span> : 'Schedule Re-cleaning'}
        </button>
      </div>
    </div>
  );
}
