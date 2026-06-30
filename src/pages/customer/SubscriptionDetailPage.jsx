import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Pause, Play, SkipForward, Pencil, X, Package, Clock } from 'lucide-react';
import { getSubscription, FREQ_LABELS, DAY_LABELS, SUB_STATUS_LABELS } from '../../lib/mock/mockSubscriptions.js';
import EmptyState from '../../components/ui/EmptyState.jsx';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { weekday: 'short', month: 'short', day: 'numeric' });
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const STATUS_STYLE = {
  ACTIVE:    { bg: 'bg-success-bg',  text: 'text-success-text' },
  PAUSED:    { bg: 'bg-warning-bg',  text: 'text-warning-text' },
  CANCELLED: { bg: 'bg-neutral-100', text: 'text-neutral-500'  },
};

const ORDER_STATUS_BADGE = { COMPLETED: { bg: 'bg-success-bg', text: 'text-success-text' }, ACTIVE: { bg: 'bg-accent-50', text: 'text-accent-600' } };

export default function SubscriptionDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const sub      = getSubscription(id);
  const [status, setStatus] = useState(sub?.status ?? 'ACTIVE');
  const [confirm, setConfirm] = useState(null); // 'pause'|'resume'|'cancel'

  if (!sub) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="Subscription not found" action={
          <button onClick={() => navigate('/app/subscriptions')} className="text-accent-600 text-small font-semibold">Back to Subscriptions</button>
        } />
      </div>
    );
  }

  const style = STATUS_STYLE[status] ?? STATUS_STYLE.ACTIVE;

  function performAction(action) {
    if (action === 'pause')  setStatus('PAUSED');
    if (action === 'resume') setStatus('ACTIVE');
    if (action === 'cancel') setStatus('CANCELLED');
    setConfirm(null);
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-small font-bold text-neutral-900 truncate">{sub.name}</p>
          <p className="text-caption text-neutral-400">{FREQ_LABELS[sub.frequency]} · {sub.outletName}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${style.bg} ${style.text}`}>
          {SUB_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Next order */}
        {status === 'ACTIVE' && (
          <div className="rounded-2xl bg-accent-500 text-white p-4">
            <p className="text-caption opacity-80 mb-1">Next order</p>
            <p className="text-h3 font-bold">{fmtDate(sub.nextOrderDate)}</p>
            <p className="text-caption opacity-70 mt-1">{FREQ_LABELS[sub.frequency]} · every {DAY_LABELS[sub.preferredDay]}</p>
          </div>
        )}
        {status === 'PAUSED' && (
          <div className="rounded-2xl bg-warning-bg border border-warning-text/20 p-4">
            <p className="text-small font-bold text-warning-text">Subscription Paused</p>
            <p className="text-caption text-warning-text/80 mt-0.5">Resume to continue recurring orders.</p>
          </div>
        )}

        {/* Items */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Items per Order</p>
          <div className="space-y-2">
            {sub.items.map((item, i) => (
              <div key={i} className="flex justify-between text-small">
                <span className="text-neutral-700">{item.name} × {item.qty}</span>
                <span className="font-semibold tabular-nums text-neutral-800">{fmtPrice(item.unitPrice * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between text-small font-bold pt-2 border-t border-neutral-100">
              <span className="text-neutral-900">Est. per order</span>
              <span className="text-accent-600 tabular-nums">{fmtPrice(sub.estimatedPerOrder)}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-2">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Details</p>
          {[
            { label: 'Frequency',  value: FREQ_LABELS[sub.frequency] },
            { label: 'Preferred Day', value: DAY_LABELS[sub.preferredDay] },
            { label: 'Delivery',   value: `${sub.deliveryAddress.label} · ${sub.deliveryAddress.detail}` },
            { label: 'Payment',    value: `${sub.paymentMethod.label} ${sub.paymentMethod.sub}` },
            { label: 'Auto-renew', value: sub.autoRenew ? 'On' : 'Off' },
            { label: 'Skip holidays', value: sub.skipHolidays ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-small">
              <span className="text-neutral-500">{label}</span>
              <span className="text-neutral-800 font-medium text-right max-w-[60%] truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Orders placed',   value: sub.ordersPlaced },
            { label: 'Mo. spend',       value: fmtPrice(sub.estimatedMonthlySpend) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white border border-neutral-100 shadow-sm p-3 text-center">
              <p className="text-body font-bold text-neutral-900">{value}</p>
              <p className="text-caption text-neutral-400">{label}</p>
            </div>
          ))}
        </div>

        {/* History */}
        {sub.history.length > 0 && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Order History</p>
            {sub.history.map(h => {
              const badge = ORDER_STATUS_BADGE[h.status] ?? ORDER_STATUS_BADGE.COMPLETED;
              return (
                <button
                  key={h.orderId}
                  onClick={() => navigate(`/app/orders/${h.orderId}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border-t border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <p className="text-small font-semibold text-neutral-800 font-mono">{h.orderId}</p>
                    <p className="text-caption text-neutral-400">{fmtDate(h.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>{h.status}</span>
                    <span className="text-small font-bold text-neutral-700 tabular-nums">{fmtPrice(h.total)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        {status !== 'CANCELLED' && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Actions</p>
            <div className="divide-y divide-neutral-100">
              <button onClick={() => navigate(`/app/subscriptions/${id}/edit`)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50">
                <Pencil className="h-4 w-4 text-neutral-500" />
                <span className="text-small font-semibold text-neutral-800">Edit Subscription</span>
              </button>
              {status === 'ACTIVE'
                ? <button onClick={() => setConfirm('pause')} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50">
                    <Pause className="h-4 w-4 text-warning-text" />
                    <span className="text-small font-semibold text-warning-text">Pause Subscription</span>
                  </button>
                : <button onClick={() => setConfirm('resume')} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50">
                    <Play className="h-4 w-4 text-success-text" />
                    <span className="text-small font-semibold text-success-text">Resume Subscription</span>
                  </button>
              }
              <button onClick={() => navigate(`/app/subscriptions/${id}/skip`)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50">
                <SkipForward className="h-4 w-4 text-neutral-500" />
                <span className="text-small font-semibold text-neutral-800">Skip Next Order</span>
              </button>
              <button onClick={() => setConfirm('cancel')} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50">
                <X className="h-4 w-4 text-error" />
                <span className="text-small font-semibold text-error">Cancel Subscription</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation overlay */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 space-y-4">
            <p className="text-body font-bold text-neutral-900">
              {confirm === 'pause'  && 'Pause subscription?'}
              {confirm === 'resume' && 'Resume subscription?'}
              {confirm === 'cancel' && 'Cancel subscription?'}
            </p>
            <p className="text-small text-neutral-500">
              {confirm === 'pause'  && 'No orders will be placed until you resume.'}
              {confirm === 'resume' && `Your next order will be scheduled for the next ${DAY_LABELS[sub.preferredDay]}.`}
              {confirm === 'cancel' && 'This cannot be undone. Your subscription will be permanently cancelled.'}
            </p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirm(null)} className="flex-1 py-3 rounded-xl border-2 border-neutral-200 text-small font-semibold text-neutral-700">Keep</button>
              <button
                onClick={() => performAction(confirm)}
                className={`flex-1 py-3 rounded-xl text-small font-semibold text-white ${confirm === 'cancel' ? 'bg-error' : confirm === 'pause' ? 'bg-warning-text' : 'bg-success-text'}`}
              >
                {confirm === 'pause' ? 'Pause' : confirm === 'resume' ? 'Resume' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
