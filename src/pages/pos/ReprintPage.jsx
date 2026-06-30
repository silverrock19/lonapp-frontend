import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Search, Phone, Hash } from 'lucide-react';
import { getAllTodayOrders, searchCustomers } from '../../lib/mock/posData.js';
import Button from '../../components/ui/Button.jsx';
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const PAYMENT_BADGE = {
  paid:            { label: 'Paid',         cls: 'bg-success-bg text-success-text'  },
  unpaid:          { label: 'Unpaid',        cls: 'bg-neutral-100 text-neutral-500'  },
  partial:         { label: 'Part paid',     cls: 'bg-warning-bg text-warning-text'  },
  pay_on_delivery: { label: 'Pay on delivery', cls: 'bg-blue-50 text-blue-600'        },
};

export default function ReprintPage() {
  const navigate   = useNavigate();
  const [tab,      setTab]   = useState('orderId'); // orderId | phone
  const [query,    setQuery] = useState('');
  const [results,  setResults] = useState(null); // null = not searched yet

  const orders = getAllTodayOrders();

  function doSearch() {
    if (!query.trim()) return;
    if (tab === 'orderId') {
      const match = orders.filter(o => o.id.toLowerCase().includes(query.toLowerCase()));
      setResults(match);
    } else {
      const q = query.replace(/\D/g, '');
      const match = orders.filter(o => o.customer.phone.replace(/\D/g, '').includes(q));
      setResults(match);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
          <Printer className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="text-body font-bold text-neutral-900">Reprint Receipt</p>
          <p className="text-caption text-neutral-400">Search today's orders by order ID or customer phone</p>
        </div>
      </div>

      {/* Search tabs */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-5 space-y-4">
        <div className="flex gap-2">
          {[
            { id: 'orderId', label: 'Order ID',     icon: Hash  },
            { id: 'phone',   label: 'Phone number', icon: Phone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setQuery(''); setResults(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-small font-semibold transition-all ${
                tab === id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder={tab === 'orderId' ? 'e.g. ORD-ACC-0629-0001' : 'e.g. 024 123 4567'}
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              autoFocus
            />
          </div>
          <Button variant="primary" onClick={doSearch}>Search</Button>
        </div>

        {/* Results */}
        {results !== null && results.length === 0 && (
          <div className="text-center py-6 text-neutral-400">
            <p className="text-small">No orders found for "{query}"</p>
            <p className="text-caption mt-1">Only today's orders are searchable here</p>
          </div>
        )}

        {results !== null && results.length > 0 && (
          <div className="space-y-2">
            <p className="text-caption font-semibold text-neutral-400">{results.length} order{results.length !== 1 ? 's' : ''} found</p>
            {results.map(order => {
              const badge = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.unpaid;
              const qty   = order.items.reduce((s, i) => s + i.qty, 0);
              return (
                <div key={order.id} className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-small font-semibold text-neutral-800">{order.customer.name}</p>
                      <span className={`text-caption px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <p className="text-caption text-neutral-400 font-mono">{order.id} · {qty} items · {fmtPrice(order.total)}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/pos/order/${order.id}/receipt`)}
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" /> Reprint
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
