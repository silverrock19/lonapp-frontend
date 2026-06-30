import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { selectDraft, placeOrder } from '../../store/slices/orderSlice.js';
import { useAppDispatch } from '../../hooks/useAppDispatch.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../../components/ui/Button.jsx';
import { formatGHS, getTaxLabel } from '../../utils/formatCurrency.js';

const PAYMENT_METHODS = [
  { id: 'momo-mtn',  label: 'MTN MoMo',        sub: '0244 567 890',  icon: '📱' },
  { id: 'momo-voda', label: 'Vodafone Cash',     sub: '0201 234 567',  icon: '📱' },
  { id: 'card',      label: 'Visa •••• 4521',    sub: 'Expires 09/27', icon: '💳' },
];

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GH', { weekday: 'short', month: 'short', day: 'numeric' });
};

const fmtPrice = formatGHS;

function Section({ title, onEdit, children }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <p className="text-small font-bold text-neutral-700">{title}</p>
        {onEdit && (
          <button onClick={onEdit} className="text-caption font-semibold text-accent-600 hover:text-accent-700 transition-colors">
            Edit
          </button>
        )}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

export default function OrderReviewPage() {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const dispatchUi  = useAppDispatch();
  const draft       = useSelector(selectDraft);
  const [paymentId, setPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [placing,   setPlacing]   = useState(false);
  const [placed,    setPlaced]    = useState(false);

  const turnaroundLabel =
    draft.turnaround === 'standard' ? 'Standard' :
    draft.turnaround === 'express'  ? 'Express'  : 'Same-Day';

  async function handlePlace() {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlaced(true);
    dispatch(placeOrder());
    dispatchUi(showToast({
      type: 'success',
      message: 'Order placed! We\'ll notify you when pickup is confirmed.',
    }));
    setPlacing(false);
  }

  if (!draft.outlet && !placed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center" style={{ background: '#FAFAF8' }}>
        <p className="text-body text-neutral-500">No order in progress.</p>
        <button onClick={() => navigate('/app/discover')} className="mt-4 text-accent-600 text-small font-medium">
          Start an order
        </button>
      </div>
    );
  }

  if (placed) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4 pb-24 text-center animate-fade-in"
        style={{ background: '#FAFAF8' }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-bg mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-h3 font-bold text-neutral-900">Order Placed!</h2>
        <p className="text-body text-neutral-500 mt-2 max-w-xs">
          Pickup scheduled for {fmtDate(draft.pickupDate)}. You'll get SMS updates.
        </p>
        <div className="mt-6 space-y-3 w-full max-w-xs">
          <Button variant="accent" className="w-full" onClick={() => navigate('/app')}>
            Back to Home
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/app/orders')}>
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <h1 className="text-body font-semibold text-neutral-900 flex-1">Review Order</h1>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-caption text-neutral-500 font-medium">
          DRAFT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 px-4 py-4 space-y-3">

        {/* Order header */}
        <div className="flex items-center justify-between rounded-xl bg-white border border-neutral-100 px-4 py-3 shadow-sm">
          <div>
            <p className="text-caption text-neutral-400">Order reference</p>
            <p className="text-small font-bold text-neutral-800 font-mono">{draft.id}</p>
          </div>
          <span className="text-caption text-neutral-400">{draft.outlet.name}</span>
        </div>

        {/* Items */}
        <Section title={`Items · ${turnaroundLabel}`} onEdit={() => navigate('/app/order/new')}>
          <div className="space-y-2">
            {draft.items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-small text-neutral-700">{item.name} × {item.qty}</span>
                <span className="text-small font-semibold text-neutral-800 tabular-nums">
                  {fmtPrice(item.unitPrice * item.qty)}
                </span>
              </div>
            ))}
          </div>
          {draft.notes ? (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-start gap-2">
              <FileText className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
              <p className="text-caption text-neutral-500">{draft.notes}</p>
            </div>
          ) : null}
        </Section>

        {/* Pickup */}
        <Section title="Pickup" onEdit={() => navigate('/app/order/new')}>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-small font-medium text-neutral-800">{draft.pickupAddress?.label ?? '—'}</p>
                <p className="text-caption text-neutral-500">{draft.pickupAddress?.detail ?? ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <p className="text-small text-neutral-700">{fmtDate(draft.pickupDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <p className="text-small text-neutral-700">{draft.pickupSlot?.label ?? '—'}</p>
            </div>
          </div>
        </Section>

        {/* Delivery */}
        <Section title="Delivery" onEdit={() => navigate('/app/order/new')}>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-small font-medium text-neutral-800">{draft.deliveryAddress?.label ?? '—'}</p>
                <p className="text-caption text-neutral-500">{draft.deliveryAddress?.detail ?? ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <p className="text-small text-neutral-700">{fmtDate(draft.deliveryDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <p className="text-small text-neutral-700">{draft.deliverySlot?.label ?? '—'}</p>
            </div>
          </div>
        </Section>

        {/* Payment */}
        <Section title="Payment method">
          <div className="space-y-2">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentId(pm.id)}
                className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150 ${
                  paymentId === pm.id
                    ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-100'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <span className="text-body">{pm.icon}</span>
                <div className="flex-1">
                  <p className="text-small font-semibold text-neutral-800">{pm.label}</p>
                  <p className="text-caption text-neutral-400">{pm.sub}</p>
                </div>
                {paymentId === pm.id && (
                  <div className="h-4 w-4 rounded-full bg-accent-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* Price breakdown */}
        <Section title="Price breakdown">
          <div className="space-y-1.5">
            <div className="flex justify-between text-small">
              <span className="text-neutral-600">Items subtotal</span>
              <span className="font-semibold text-neutral-800 tabular-nums">{fmtPrice(draft.subtotal)}</span>
            </div>
            {draft.surcharge > 0 && (
              <div className="flex justify-between text-small">
                <span className="text-neutral-600">{turnaroundLabel} surcharge</span>
                <span className="font-semibold text-warning-text tabular-nums">+{fmtPrice(draft.surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-small">
              <span className="text-neutral-600">Pickup fee</span>
              <span className="font-semibold text-neutral-800 tabular-nums">{fmtPrice(draft.pickupFee)}</span>
            </div>
            <div className="flex justify-between text-small">
              <span className="text-neutral-600">Delivery fee</span>
              <span className="font-semibold text-neutral-800 tabular-nums">{fmtPrice(draft.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-small">
              <span className="text-neutral-600">{getTaxLabel()}</span>
              <span className="font-semibold text-neutral-800 tabular-nums">{fmtPrice(draft.vat)}</span>
            </div>
            <div className="flex justify-between text-body font-bold border-t border-neutral-100 pt-2 mt-2">
              <span className="text-neutral-900">Total</span>
              <span className="text-accent-600 tabular-nums">{fmtPrice(draft.total)}</span>
            </div>
          </div>
        </Section>

        <p className="text-caption text-neutral-400 text-center pb-2">
          Payment is collected after items are picked up. LonApp terms apply.
        </p>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-small text-neutral-500">Total to pay</p>
          <p className="text-h4 font-bold text-accent-600 tabular-nums">{fmtPrice(draft.total)}</p>
        </div>
        <Button variant="accent" size="lg" className="w-full" loading={placing} onClick={handlePlace}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
