import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Zap, Clock } from 'lucide-react';
import { selectPlaced, upgradeTurnaround } from '../../store/slices/orderSlice.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

export default function UpgradeExpressPage() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const order      = useSelector(selectPlaced);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={Zap}
          title="No active order"
          description="You need a placed order to upgrade its turnaround."
          action={
            <Button variant="accent" onClick={() => navigate('/app/discover')}>
              Start an Order
            </Button>
          }
        />
      </div>
    );
  }

  const isAlreadyExpress = order.turnaround !== 'standard';
  const expressSurchargeRate = order.outlet?.expressSurcharge ?? 0.4;
  const expressExtra = order.subtotal * expressSurchargeRate;
  const newTotal = (order.total - order.surcharge) + expressExtra;

  function handleUpgrade() {
    dispatch(upgradeTurnaround('express'));
    dispatch(showToast({ type: 'success', message: 'Upgraded to Express! Rider has been notified.' }));
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
        <h1 className="text-body font-semibold text-neutral-900">Upgrade to Express</h1>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4 pb-36">

        {/* Hero */}
        <div className="rounded-2xl bg-accent-500 px-5 py-6 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-7 w-7" />
            <h2 className="text-h3 font-bold">Express Turnaround</h2>
          </div>
          <p className="text-body opacity-90">
            Get your laundry back in <strong>{order.outlet?.turnaround?.express ?? 1} day</strong> instead of the standard {order.outlet?.turnaround?.standard ?? 3} days.
          </p>
        </div>

        {/* Order info */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-small font-bold text-neutral-700">Order {order.id}</p>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-small font-medium text-neutral-700">Current: Standard</p>
              <p className="text-caption text-neutral-400">
                {order.outlet?.turnaround?.standard ?? 3}-day turnaround · collected {order.pickupDate}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
              <Zap className="h-5 w-5 text-accent-500" />
            </div>
            <div>
              <p className="text-small font-semibold text-accent-700">After upgrade: Express</p>
              <p className="text-caption text-neutral-400">
                {order.outlet?.turnaround?.express ?? 1}-day turnaround · ready sooner
              </p>
            </div>
          </div>
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
              <span className="text-neutral-500">Express surcharge (+{Math.round(expressSurchargeRate * 100)}%)</span>
              <span className="text-warning-text font-semibold tabular-nums">+{fmtPrice(expressExtra)}</span>
            </div>
            <div className="flex justify-between text-body font-bold border-t border-neutral-100 pt-2 mt-2">
              <span className="text-neutral-900">New total</span>
              <span className="text-accent-600 tabular-nums">{fmtPrice(newTotal)}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-caption text-neutral-400 text-center px-4">
          Upgrade is final. The additional charge will be collected when items are delivered.
          Express is subject to capacity at {order.outlet?.name}.
        </p>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        {isAlreadyExpress ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Zap className="h-4 w-4 text-accent-500" />
            <p className="text-small font-semibold text-accent-600">Already upgraded to Express</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-small text-neutral-500">Upgrade cost</p>
              <p className="text-body font-bold text-warning-text tabular-nums">+{fmtPrice(expressExtra)}</p>
            </div>
            <Button variant="accent" size="lg" className="w-full" onClick={handleUpgrade}>
              Upgrade to Express · {fmtPrice(newTotal)}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
