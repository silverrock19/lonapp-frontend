import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, ChevronRight, Calendar, Pause, Play } from 'lucide-react';
import { getAllSubscriptions, FREQ_LABELS, SUB_STATUS_LABELS } from '../../lib/mock/mockSubscriptions.js';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const STATUS_STYLE = {
  ACTIVE:    { bg: 'bg-success-bg',  text: 'text-success-text' },
  PAUSED:    { bg: 'bg-warning-bg',  text: 'text-warning-text' },
  CANCELLED: { bg: 'bg-neutral-100', text: 'text-neutral-500'  },
  COMPLETED: { bg: 'bg-neutral-100', text: 'text-neutral-500'  },
};

export default function SubscriptionsPage() {
  const navigate      = useNavigate();
  const subscriptions = getAllSubscriptions();

  const active   = subscriptions.filter(s => s.status === 'ACTIVE');
  const inactive = subscriptions.filter(s => s.status !== 'ACTIVE');

  const totalMonthly = active.reduce((s, sub) => s + (sub.estimatedMonthlySpend ?? 0), 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white border-b border-neutral-100 px-4 shadow-sm">
        <h1 className="text-h3 font-bold text-neutral-900">Subscriptions</h1>
        <button
          onClick={() => navigate('/app/subscriptions/new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500 text-white text-caption font-semibold hover:bg-accent-600 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Summary */}
        {subscriptions.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Active',   value: active.length },
              { label: 'Mo. spend', value: fmtPrice(totalMonthly) },
              { label: 'Total',    value: subscriptions.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white border border-neutral-100 shadow-sm p-3 text-center">
                <p className="text-body font-bold text-neutral-900 tabular-nums">{value}</p>
                <p className="text-caption text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        {subscriptions.length === 0 && (
          <div className="text-center py-20">
            <RefreshCw className="h-12 w-12 mx-auto mb-3 text-neutral-200" />
            <p className="text-small font-semibold text-neutral-500">No subscriptions yet</p>
            <p className="text-caption text-neutral-400 mt-1">Set up recurring laundry to save time.</p>
            <button onClick={() => navigate('/app/subscriptions/new')} className="mt-4 px-4 py-2 rounded-xl bg-accent-500 text-white text-small font-semibold">
              Set Up Recurring Order
            </button>
          </div>
        )}

        {active.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active ({active.length})</p>
            {active.map(s => <SubCard key={s.id} sub={s} navigate={navigate} />)}
          </div>
        )}

        {inactive.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Inactive ({inactive.length})</p>
            {inactive.map(s => <SubCard key={s.id} sub={s} navigate={navigate} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function SubCard({ sub, navigate }) {
  const style = STATUS_STYLE[sub.status] ?? STATUS_STYLE.ACTIVE;
  const totalItems = sub.items.reduce((s, i) => s + i.qty, 0);

  return (
    <button
      onClick={() => navigate(`/app/subscriptions/${sub.id}`)}
      className="w-full text-left rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 hover:shadow-md transition-all active:opacity-70"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-small font-bold text-neutral-900 truncate">{sub.name}</p>
          <p className="text-caption text-neutral-400">{FREQ_LABELS[sub.frequency]} · {totalItems} items</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-caption font-semibold ${style.bg} ${style.text}`}>
            {SUB_STATUS_LABELS[sub.status]}
          </span>
          <ChevronRight className="h-4 w-4 text-neutral-300" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-caption text-neutral-400">
          <Calendar className="h-3.5 w-3.5" />
          {sub.status === 'ACTIVE'
            ? <>Next: <span className="font-semibold text-neutral-700 ml-0.5">{fmtDate(sub.nextOrderDate)}</span></>
            : sub.status === 'PAUSED'
            ? <>Paused {fmtDate(sub.pausedAt)}</>
            : '—'
          }
        </div>
        <p className="text-small font-bold text-neutral-800 tabular-nums">{fmtPrice(sub.estimatedPerOrder)}<span className="text-caption font-normal text-neutral-400">/order</span></p>
      </div>
    </button>
  );
}
