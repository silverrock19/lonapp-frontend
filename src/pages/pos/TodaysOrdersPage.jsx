import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Printer, CreditCard, Search, ChevronRight } from 'lucide-react';
import { getAllTodayOrders } from '../../lib/mock/posData.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const fmtTime  = iso => new Date(iso).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });

const PAYMENT_BADGE = {
  paid:            { label: 'Paid',         cls: 'bg-success-bg text-success-text'  },
  unpaid:          { label: 'Unpaid',        cls: 'bg-neutral-100 text-neutral-500'   },
  partial:         { label: 'Part paid',     cls: 'bg-warning-bg text-warning-text'   },
  pay_on_delivery: { label: 'Pay on delivery', cls: 'bg-blue-50 text-blue-600'        },
};

const TURNAROUND_BADGE = {
  standard: { label: 'Std',      cls: 'bg-neutral-100 text-neutral-600' },
  express:  { label: 'Express',  cls: 'bg-purple-50 text-purple-600'    },
  same_day: { label: 'Same-Day', cls: 'bg-warning-bg text-warning-text' },
};

export default function TodaysOrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const orders   = getAllTodayOrders();

  const filtered = search.trim()
    ? orders.filter(o =>
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.phone.includes(search) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const revenue       = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.amountPaid, 0);
  const unpaidOrders  = orders.filter(o => o.paymentStatus === 'unpaid' || o.paymentStatus === 'partial');
  const unpaidTotal   = unpaidOrders.reduce((s, o) => s + (o.balanceDue || 0), 0);

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-5">

      {/* Header + search */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 shrink-0">
          <ClipboardList className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-body font-bold text-neutral-900">Today's Orders</p>
          <p className="text-caption text-neutral-400">{orders.length} walk-ins · {formatGHS(revenue)} collected · {formatGHS(unpaidTotal)} outstanding</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, phone, order ID…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 bg-white text-small outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              {['Time', 'Order ID', 'Customer', 'Service', 'Items', 'Total', 'Payment', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-small text-neutral-400">
                  {search ? 'No orders matching your search' : 'No orders today yet'}
                </td>
              </tr>
            )}
            {filtered.map(order => {
              const payBadge = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.unpaid;
              const turBadge = TURNAROUND_BADGE[order.turnaround]  ?? TURNAROUND_BADGE.standard;
              const qty      = order.items.reduce((s, i) => s + i.qty, 0);
              return (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 text-caption text-neutral-400 whitespace-nowrap">{fmtTime(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="text-caption font-mono font-semibold text-neutral-600">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-small font-semibold text-neutral-800">{order.customer.name}</p>
                    <p className="text-caption text-neutral-400">{order.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-small text-neutral-700">{order.service}</p>
                    <span className={`inline-block text-caption font-semibold px-1.5 py-0.5 rounded-md ${turBadge.cls}`}>
                      {turBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-small text-neutral-600 tabular-nums">{qty}</td>
                  <td className="px-4 py-3">
                    <p className="text-small font-bold text-neutral-800 tabular-nums">{formatGHS(order.total)}</p>
                    {order.balanceDue > 0 && (
                      <p className="text-caption text-warning-text tabular-nums">Due: {formatGHS(order.balanceDue)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-caption font-semibold px-2 py-0.5 rounded-full ${payBadge.cls}`}>
                      {payBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {order.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => navigate(`/pos/order/${order.id}/payment`)}
                          title="Take payment"
                          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary-50 text-primary-500 transition-colors p-2"
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/pos/order/${order.id}/receipt`)}
                        title="Print receipt"
                        className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors p-2"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
