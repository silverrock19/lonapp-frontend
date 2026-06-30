import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, AlertTriangle, CheckCircle, Minus, Plus, Info } from 'lucide-react';
import {
  getOrder, STATUS_LABELS, CANCEL_REASONS,
  canCancelPrePickup, canCancelPostPickup, canPartialCancel,
  POST_PICKUP_REFUND_RATE,
} from '../../lib/mock/mockOrders.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { cn } from '../../utils/classNames.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

// Which cancel mode applies
function getCancelMode(status) {
  if (canCancelPrePickup(status))  return 'pre_pickup';
  if (canCancelPostPickup(status)) return 'post_pickup';
  if (canPartialCancel(status))    return 'partial';
  return null;
}

export default function CancelOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  const [mode, setModeState]       = useState(null); // 'full' | 'partial'
  const [reason, setReason]        = useState('');
  const [otherText, setOtherText]  = useState('');
  const [acknowledged, setAck]     = useState(false);
  const [cancelledItems, setCancelledItems] = useState({});
  const [cancelling, setCancelling]= useState(false);
  const [done, setDone]            = useState(false);

  if (!order) {
    return <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
      <EmptyState icon={X} title="Order not found" />
    </div>;
  }

  const cancelMode = getCancelMode(order.status);

  if (!cancelMode) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Cancellation not available"
          description={`Orders with status "${STATUS_LABELS[order.status]}" cannot be cancelled through self-service. Please contact support.`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  // Refund calculation
  const refundRate = cancelMode === 'pre_pickup' ? 1.0 : (POST_PICKUP_REFUND_RATE[order.status] ?? 0.4);
  const refundAmount = order.total * refundRate;

  // Partial cancel calc
  const partialItems = order.items.filter(i => cancelledItems[i.id]);
  const partialSubtotal = partialItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const partialRefundRate = canCancelPrePickup(order.status) ? 1.0 : 0.80;
  const partialRefund = partialSubtotal * partialRefundRate;

  const effectiveMode = mode ?? (cancelMode === 'post_pickup' ? 'full' : null);
  const validReason = reason && (reason !== 'Other' || otherText.length >= 10);
  const canSubmit = validReason && acknowledged && (
    effectiveMode === 'full'
      ? true
      : partialItems.length > 0 && partialItems.length < order.items.length
  );

  async function handleSubmit() {
    setCancelling(true);
    await new Promise(r => setTimeout(r, 1000));
    setCancelling(false);
    setDone(true);
  }

  const isPrePickup = cancelMode === 'pre_pickup';
  const isPostPickup = cancelMode === 'post_pickup';

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4 pb-24 text-center animate-fade-in" style={{ background: '#FAFAF8' }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-bg mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-h3 font-bold text-neutral-900">
          {effectiveMode === 'partial' ? 'Partial Cancellation Submitted' : isPostPickup ? 'Cancellation Requested' : 'Order Cancelled'}
        </h2>
        <p className="text-body text-neutral-500 mt-2 max-w-xs">
          {isPostPickup
            ? 'Your request has been sent for CS review. Expect a response within 24 hours.'
            : effectiveMode === 'partial'
            ? `Cancellation request for ${partialItems.length} item(s) submitted.`
            : `Your order has been cancelled. Refund of ${fmtPrice(refundAmount)} will be processed.`
          }
        </p>
        <div className="mt-6 space-y-3 w-full max-w-xs">
          {isPrePickup && (
            <div className="rounded-xl bg-success-bg border border-success/20 p-3 text-left">
              <p className="text-small font-semibold text-success-text">Refund: {fmtPrice(refundAmount)}</p>
              <p className="text-caption text-success-text/80 mt-0.5">Mobile Money: 1–3 hours · Card: 3–5 business days</p>
            </div>
          )}
          <Button variant="accent" className="w-full" onClick={() => navigate('/app')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FAFAF8' }}>

      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-semibold text-neutral-900">
            {isPostPickup ? 'Request Cancellation' : 'Cancel Order'}
          </p>
          <p className="text-caption text-neutral-400 font-mono">{order.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 py-4 space-y-4">

        {/* Refund / policy banner */}
        {isPrePickup && (
          <div className="rounded-2xl bg-success-bg border border-success/20 p-4">
            <p className="text-small font-bold text-success-text mb-0.5">100% Refund</p>
            <p className="text-caption text-success-text/80">
              Since your order hasn't been picked up yet, you'll receive a full refund of <strong>{fmtPrice(order.total)}</strong>.
              Processed within 1–3 hours for Mobile Money, 3–5 days for cards.
            </p>
          </div>
        )}

        {isPostPickup && (
          <div className="rounded-2xl bg-warning-bg border border-warning/20 p-4">
            <p className="text-small font-bold text-warning-text mb-0.5">
              Partial refund — CS review required
            </p>
            <p className="text-caption text-warning-text/80 mb-3">
              Your items have been picked up and are being processed. Refund amount depends on processing stage.
            </p>
            <div className="rounded-xl bg-white/60 p-3 space-y-1">
              <div className="flex justify-between text-small">
                <span className="text-neutral-600">Order total</span>
                <span className="font-semibold tabular-nums">{fmtPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-neutral-600">Refund rate ({Math.round(refundRate * 100)}% — {STATUS_LABELS[order.status]})</span>
                <span className="font-semibold text-warning-text tabular-nums">{fmtPrice(refundAmount)}</span>
              </div>
              <p className="text-caption text-neutral-400 pt-1">Final amount confirmed by CS agent within 24 hours.</p>
            </div>
          </div>
        )}

        {/* Mode selector — only for pre-pickup where partial is available */}
        {isPrePickup && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
            <p className="text-small font-bold text-neutral-700 mb-3">Cancellation type</p>
            <div className="space-y-2">
              {[
                { id: 'full',    label: 'Cancel entire order',   sub: `Full refund — ${fmtPrice(order.total)}` },
                { id: 'partial', label: 'Cancel selected items', sub: 'Keep some items, refund the rest' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setModeState(opt.id)}
                  className={cn(
                    'w-full text-left rounded-xl border p-3 transition-all duration-150',
                    effectiveMode === opt.id ? 'border-error bg-red-50 ring-2 ring-red-100' : 'border-neutral-200 bg-white hover:border-neutral-300',
                  )}
                >
                  <p className={cn('text-small font-semibold', effectiveMode === opt.id ? 'text-error' : 'text-neutral-800')}>{opt.label}</p>
                  <p className="text-caption text-neutral-400 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Partial: item selector */}
        {effectiveMode === 'partial' && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-small font-bold text-neutral-700 px-4 pt-4 pb-2">Select items to cancel</p>
            <div className="divide-y divide-neutral-100 px-4 pb-4 space-y-2">
              {order.items.map(item => {
                const checked = !!cancelledItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => setCancelledItems(m => ({ ...m, [item.id]: !m[item.id] }))}
                    className={cn(
                      'w-full flex items-center gap-3 text-left rounded-xl border p-3 transition-all duration-150',
                      checked ? 'border-error bg-red-50' : 'border-neutral-200 bg-white hover:border-neutral-300',
                    )}
                  >
                    <div className={cn('h-5 w-5 rounded border-2 flex-shrink-0 flex items-center justify-center', checked ? 'border-error bg-error' : 'border-neutral-300')}>
                      {checked && <X className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-small font-medium text-neutral-800">{item.name} × {item.qty}</p>
                      <p className="text-caption text-neutral-400">{fmtPrice(item.unitPrice * item.qty)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {partialItems.length > 0 && (
              <div className="mx-4 mb-4 rounded-xl bg-neutral-50 p-3 animate-fade-in">
                <div className="flex justify-between text-small">
                  <span className="text-neutral-600">Cancelled items ({partialItems.length})</span>
                  <span className="tabular-nums">{fmtPrice(partialSubtotal)}</span>
                </div>
                <div className="flex justify-between text-small font-bold pt-1">
                  <span className="text-neutral-800">Refund ({Math.round(partialRefundRate * 100)}%)</span>
                  <span className="text-success-text tabular-nums">{fmtPrice(partialRefund)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post-pickup: CS info */}
        {isPostPickup && (
          <div className="flex items-start gap-2.5 rounded-xl bg-info-bg border border-primary-100 p-3">
            <Info className="h-4 w-4 flex-shrink-0 text-primary-500 mt-0.5" />
            <p className="text-caption text-primary-700">
              All post-pickup cancellations require CS agent review. A support agent will contact you within 24 hours (urgent requests: 2 hours).
              Items will be returned to your pickup address unless you specify otherwise.
            </p>
          </div>
        )}

        {/* Reason */}
        {(effectiveMode || isPostPickup) && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
            <p className="text-small font-bold text-neutral-700 mb-3">Reason for cancellation</p>
            <div className="space-y-1.5">
              {CANCEL_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={cn(
                    'w-full text-left text-small px-3 py-2.5 rounded-xl border transition-all duration-150',
                    reason === r ? 'border-accent-400 bg-accent-50 text-accent-700 font-medium' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea
                className="mt-3 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all resize-none"
                rows={3}
                placeholder="Please provide at least 10 characters of detail…"
                value={otherText}
                onChange={e => setOtherText(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Acknowledgement */}
        {(effectiveMode || isPostPickup) && (
          <button
            onClick={() => setAck(v => !v)}
            className="flex items-start gap-3 w-full text-left"
          >
            <div className={cn('mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors', acknowledged ? 'bg-error border-error' : 'border-neutral-300 bg-white')}>
              {acknowledged && <X className="h-3 w-3 text-white" />}
            </div>
            <p className="text-small text-neutral-600">
              {isPostPickup
                ? `I understand this is a post-pickup cancellation and the refund (up to ${Math.round(refundRate * 100)}% of ${fmtPrice(order.total)}) is subject to CS review and processing stage.`
                : effectiveMode === 'partial'
                ? `I confirm I want to cancel the selected ${partialItems.length} item(s) and will keep the remaining items in my order.`
                : `I confirm I want to cancel this order and understand the refund of ${fmtPrice(order.total)} will be returned to my original payment method.`
              }
            </p>
          </button>
        )}
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        <Button
          variant="primary"
          size="lg"
          className="w-full !bg-error hover:!bg-error/90 disabled:!bg-neutral-200"
          disabled={!canSubmit}
          loading={cancelling}
          onClick={handleSubmit}
        >
          {isPostPickup
            ? 'Submit Cancellation Request'
            : effectiveMode === 'partial'
            ? `Cancel ${partialItems.length} Item${partialItems.length !== 1 ? 's' : ''}`
            : 'Cancel Order'
          }
        </Button>
      </div>
    </div>
  );
}
