import { TrendingUp, TrendingDown, Minus, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { kpiData, recentOrders, setupChecklist } from '../../data/mock.js';

const ORDER_STATUS = {
  Processing: { dot: '#C77700', bg: '#FFF4E0', text: '#945800' },
  Pickup:     { dot: '#0C5FC5', bg: '#EAF2FC', text: '#093F84' },
  Delivered:  { dot: '#1F9D57', bg: '#E6F6EE', text: '#13753F' },
  Pending:    { dot: '#6B7280', bg: '#F3F4F6', text: '#374151' },
  Cancelled:  { dot: '#D92D20', bg: '#FDECEA', text: '#A31C12' },
};

function OrderBadge({ status }) {
  const s = ORDER_STATUS[status] ?? ORDER_STATUS.Pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function KPICard({ label, value, trend, up, down }) {
  const trendColor = up ? '#1F9D57' : down ? '#D92D20' : '#6B7280';
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-caption font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="mt-3 text-[28px] font-extrabold tabular-nums leading-none text-neutral-900">{value}</p>
      <div className="mt-2.5 flex items-center gap-1 text-caption font-semibold" style={{ color: trendColor }}>
        {up   && <TrendingUp   className="h-3 w-3 flex-shrink-0" />}
        {down && <TrendingDown className="h-3 w-3 flex-shrink-0" />}
        {!up && !down && <Minus className="h-3 w-3 flex-shrink-0" />}
        <span>{trend}</span>
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const user = useSelector(s => s.auth.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const done = setupChecklist.filter(i => i.done).length;
  const setupComplete = done === setupChecklist.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Good morning, {firstName}</h1>
          <p className="mt-0.5 text-small text-neutral-500">Saturday, 28 June 2026 · Sparkle Laundry Ltd</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-semibold"
          style={{ background: '#E6F6EE', color: '#13753F' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#1F9D57' }} />
          Active
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map(k => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>

      {/* Two-col: recent orders + setup checklist */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>

        {/* Recent orders */}
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
            <h2 className="text-h4 font-semibold text-neutral-900">Recent orders</h2>
            <Link
              to="/orders"
              className="flex items-center gap-1 text-small font-medium text-primary-600 hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                  {['Order', 'Customer', 'Service', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-caption font-semibold uppercase tracking-wide text-neutral-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5 font-mono text-caption font-semibold text-neutral-700">{order.id}</td>
                    <td className="px-5 py-3.5 text-small text-neutral-700">{order.customer}</td>
                    <td className="px-5 py-3.5 text-small text-neutral-600">{order.service}</td>
                    <td className="px-5 py-3.5 tabular-nums text-small font-semibold text-neutral-900">{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <OrderBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Setup checklist */}
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-3.5">
            <h2 className="text-h4 font-semibold text-neutral-900">Setup checklist</h2>
            <p className="mt-0.5 text-caption text-neutral-500">{done} of {setupChecklist.length} steps complete</p>
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(done / setupChecklist.length) * 100}%`, background: '#1F9D57' }}
              />
            </div>
          </div>

          <ul className="flex-1 divide-y divide-neutral-100 px-5 py-2">
            {setupChecklist.map(item => (
              <li key={item.label} className="flex items-center gap-3 py-3">
                {item.done
                  ? <CheckCircle2 className="h-[18px] w-[18px] flex-shrink-0 text-success" />
                  : <Circle      className="h-[18px] w-[18px] flex-shrink-0 text-neutral-300" />
                }
                <span className={item.done
                  ? 'text-small text-neutral-400 line-through decoration-neutral-300'
                  : 'text-small font-medium text-neutral-800'
                }>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {!setupComplete && (
            <div className="px-5 pb-5 pt-2">
              <Link
                to="/business"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-small font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Complete setup <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

