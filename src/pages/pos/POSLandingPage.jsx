import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ClipboardList, Printer, UserPlus, TrendingUp, Clock } from 'lucide-react';
import { getAllTodayOrders } from '../../lib/mock/posData.js';
import { clearPOSSession } from '../../lib/mock/posData.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const PAYMENT_BADGE = {
  paid:           { label: 'Paid',         bg: 'bg-success-bg',   text: 'text-success-text'  },
  unpaid:         { label: 'Unpaid',        bg: 'bg-neutral-100',  text: 'text-neutral-500'   },
  partial:        { label: 'Part paid',     bg: 'bg-warning-bg',   text: 'text-warning-text'  },
  pay_on_delivery:{ label: 'Pay on delivery',bg: 'bg-blue-50',    text: 'text-blue-600'       },
};

const fmtTime = iso => new Date(iso).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });

export default function POSLandingPage() {
  const navigate = useNavigate();
  const orders   = getAllTodayOrders();

  const totalRevenue  = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.amountPaid, 0);
  const unpaidCount   = orders.filter(o => o.paymentStatus === 'unpaid' || o.paymentStatus === 'partial').length;
  const totalItems    = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0);

  function startNewOrder() {
    clearPOSSession();
    navigate('/pos/order/new');
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: ShoppingCart, label: "Today's Orders",   value: orders.length,        sub: 'walk-ins',       color: 'text-primary-600', bg: 'bg-primary-50'  },
          { icon: TrendingUp,   label: 'Revenue Collected', value: fmtPrice(totalRevenue), sub: 'cash + MoMo', color: 'text-success-text', bg: 'bg-success-bg'  },
          { icon: Clock,        label: 'Awaiting Payment',  value: unpaidCount,          sub: 'orders',         color: 'text-warning-text', bg: 'bg-warning-bg'  },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-caption text-neutral-400">{label}</p>
              <p className={`text-h3 font-bold tabular-nums ${color}`}>{value}</p>
              <p className="text-caption text-neutral-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={startNewOrder}
          className="flex items-center gap-3 rounded-2xl bg-primary-600 p-5 text-left hover:bg-primary-700 active:scale-[0.98] transition-all shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-body font-bold text-white">New Walk-in Order</p>
            <p className="text-caption text-white/70">Search customer or register</p>
          </div>
          <kbd className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-white/20 text-[11px] font-bold text-white">N</kbd>
        </button>

        <button
          onClick={() => navigate('/pos/orders')}
          className="flex items-center gap-3 rounded-2xl bg-white border border-neutral-200 p-5 text-left hover:bg-neutral-50 active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <ClipboardList className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <p className="text-body font-bold text-neutral-800">Today's Orders</p>
            <p className="text-caption text-neutral-400">{orders.length} orders · {totalItems} items</p>
          </div>
          <kbd className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-neutral-100 text-[11px] font-bold text-neutral-500">T</kbd>
        </button>

        <button
          onClick={() => navigate('/pos/receipt')}
          className="flex items-center gap-3 rounded-2xl bg-white border border-neutral-200 p-5 text-left hover:bg-neutral-50 active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <Printer className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <p className="text-body font-bold text-neutral-800">Reprint Receipt</p>
            <p className="text-caption text-neutral-400">Search by order ID or phone</p>
          </div>
          <kbd className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-neutral-100 text-[11px] font-bold text-neutral-500">R</kbd>
        </button>
      </div>

      {/* ── Today's orders list ── */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <p className="text-small font-bold text-neutral-800">Today's Walk-in Orders</p>
          <button onClick={() => navigate('/pos/orders')} className="flex items-center gap-1 text-caption text-primary-600 hover:text-primary-700 font-medium">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-400 text-small">No orders yet today</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {orders.map(order => {
              const badge = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.unpaid;
              const qty   = order.items.reduce((s, i) => s + i.qty, 0);
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-small font-semibold text-neutral-800">{order.customer.name}</p>
                      <span className={`text-caption px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-caption text-neutral-400">
                      {order.id} · {qty} item{qty !== 1 ? 's' : ''} · {order.service} · {fmtTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-small font-bold text-neutral-800 tabular-nums">{fmtPrice(order.total)}</p>
                    {order.balanceDue > 0 && (
                      <p className="text-caption text-warning-text tabular-nums">Due: {fmtPrice(order.balanceDue)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/pos/order/${order.id}/receipt`)}
                    className="shrink-0 flex items-center gap-1 text-caption text-primary-500 hover:text-primary-700 font-medium"
                  >
                    <Printer className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
