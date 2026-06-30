import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Zap, Clock, AlertTriangle } from 'lucide-react';
import { selectPlaced, upgradeTurnaround } from '../../store/slices/orderSlice.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

export default function SameDayRequestPage() {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const order       = useSelector(selectPlaced);
  const [confirmed, setConfirmed] = useState(false);
  const [requesting, setRequesting] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={Zap}
          title="No active order"
          description="You need a placed order to request same-day service."
          action={
            <Button variant="accent" onClick={() => navigate('/app/discover')}>
              Start an Order
            </Button>
          }
        />
      </div>
    );
  }

  const outletSupportsSameDay = order.outlet?.sameDayAvailable ?? false;
  const isSameDay = order.turnaround === 'same-day';
  const surchargeRate = order.outlet?.sameDaySurcharge ?? 1.75;
  const sameDayExtra = order.subtotal * surchargeRate;
  const newTotal = (order.total - order.surcharge) + sameDayExtra;

  async function handleRequest() {
    setRequesting(true);
    await new Promise(r => setTimeout(r, 1000));
    dispatch(upgradeTurnaround('same-day'));
    dispatch(showToast({
      type: 'success',
      message: 'Same-day request sent! Outlet will confirm within 15 min.',
    }));
    setRequesting(false);
    navigate(-1);
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
        <h1 className="text-body font-semibold text-neutral-900">Same-Day Request</h1>
        <span className="ml-auto rounded-full bg-warning px-2.5 py-0.5 text-caption font-bold text-white">
          RUSH
        </span>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4 pb-36">

        {!outletSupportsSameDay ? (
          /* Outlet doesn't support same-day */
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-neutral-400" />
            </div>
            <p className="text-body font-semibold text-neutral-800">Not available at this outlet</p>
            <p className="text-small text-neutral-500 mt-1 max-w-xs mx-auto">
              {order.outlet?.name} doesn't offer same-day service. Consider upgrading to Express instead.
            </p>
            <Button
              variant="accent"
              className="mt-4"
              onClick={() => navigate('/app/order/upgrade')}
            >
              View Express Upgrade
            </Button>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="rounded-2xl bg-warning px-5 py-6 text-white shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-7 w-7" />
                <h2 className="text-h3 font-bold">Same-Day Service</h2>
              </div>
              <p className="text-body opacity-90">
                Order by <strong>{order.outlet?.sameDayCutoff ?? '10 AM'}</strong>.
                Ready by <strong>{order.outlet?.sameDayGuaranteedDelivery ?? '6 PM'}</strong> today.
              </p>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
              <p className="text-small font-bold text-neutral-700">Order {order.id}</p>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                  <Clock className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-small font-medium text-neutral-700">
                    Current: {order.turnaround === 'express' ? 'Express' : 'Standard'}
                  </p>
                  <p className="text-caption text-neutral-400">
                    {order.turnaround === 'express'
                      ? `${order.outlet?.turnaround?.express ?? 1}-day express`
                      : `${order.outlet?.turnaround?.standard ?? 3}-day standard`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <Zap className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-small font-semibold text-warning-text">After: Same-Day Rush</p>
                  <p className="text-caption text-neutral-400">
                    Back by {order.outlet?.sameDayGuaranteedDelivery ?? '6 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cutoff warning */}
            <div className="flex items-start gap-2.5 rounded-xl bg-warning-bg border border-warning/20 p-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning mt-0.5" />
              <p className="text-caption text-warning-text">
                Same-day orders must be dropped off before <strong>{order.outlet?.sameDayCutoff ?? '10 AM'}</strong>.
                The outlet will confirm acceptance within 15 minutes.
              </p>
            </div>

            {/* Price diff */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-3">Price change</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-small">
                  <span className="text-neutral-500">Current total</span>
                  <span className="text-neutral-700 tabular-nums">{fmtPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-neutral-500">Same-day surcharge (+{Math.round(surchargeRate * 100)}%)</span>
                  <span className="text-warning-text font-semibold tabular-nums">+{fmtPrice(sameDayExtra)}</span>
                </div>
                <div className="flex justify-between text-body font-bold border-t border-neutral-100 pt-2 mt-2">
                  <span className="text-neutral-900">New total</span>
                  <span className="text-warning-text tabular-nums">{fmtPrice(newTotal)}</span>
                </div>
              </div>
            </div>

            {/* Acknowledgement */}
            <button
              onClick={() => setConfirmed(v => !v)}
              className="flex items-start gap-3 w-full text-left"
            >
              <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                confirmed ? 'bg-accent-500 border-accent-500' : 'border-neutral-300 bg-white'
              }`}>
                {confirmed && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <p className="text-small text-neutral-600">
                I understand this is a rush service. The additional charge of {fmtPrice(sameDayExtra)} will be collected on delivery.
                This request is subject to outlet capacity.
              </p>
            </button>
          </>
        )}
      </div>

      {/* Fixed CTA */}
      {outletSupportsSameDay && !isSameDay && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-small text-neutral-500">Rush surcharge</p>
            <p className="text-body font-bold text-warning-text tabular-nums">+{fmtPrice(sameDayExtra)}</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full !bg-warning hover:!bg-warning/90"
            disabled={!confirmed}
            loading={requesting}
            onClick={handleRequest}
          >
            Request Same-Day · {fmtPrice(newTotal)}
          </Button>
        </div>
      )}

      {isSameDay && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-4 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-warning" />
            <p className="text-small font-semibold text-warning-text">Same-Day already active</p>
          </div>
        </div>
      )}
    </div>
  );
}
