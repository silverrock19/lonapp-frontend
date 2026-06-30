import { useState } from 'react';
import {
  Wallet, CreditCard, Banknote, Smartphone, BarChart3, AlertCircle,
  Clock, RefreshCw, FileText, ChevronRight, TrendingUp,
  Bell, Settings, Download, RotateCcw,
} from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';
import {
  getAllTransactions, PAYMENT_STATUSES, PAYMENT_METHODS,
  MOCK_RECONCILIATION, MOCK_PAYMENT_PLANS, DEFAULT_REMINDER_CONFIG,
  MOCK_REVENUE_TREND, getAllWalletBalances, MOCK_WALLET_TOPUPS,
} from '../../lib/mock/mockPayments.js';
import { getAllInvoices } from '../../lib/mock/mockInvoices.js';
import { MOCK_REFUNDS, REFUND_STATUSES } from '../../lib/mock/mockDisputes.js';

const fmtDate = s => s ? new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';
const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const BADGE = 'rounded-full px-2.5 py-0.5 text-[11px] font-bold';

// Simple SVG sparkline — no external library
function Sparkline({ data, color = '#0EA5E9', height = 40 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 100, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const TABS = ['Overview', 'Transactions', 'Refunds', 'Reconciliation', 'Plans', 'Wallet', 'Reminders'];

const METHOD_STYLES = {
  momo: 'bg-accent-50 text-accent-600',
  cash: 'bg-success-bg text-success-text',
  card: 'bg-primary-50 text-primary-700',
  wallet: 'bg-neutral-100 text-neutral-700',
  bank_transfer: 'bg-neutral-100 text-neutral-600',
  pay_on_delivery: 'bg-neutral-100 text-neutral-600',
};

function StatusBadge({ statusKey, map }) {
  const s = map[statusKey] || { label: statusKey, color: 'text-neutral-600', bg: 'bg-neutral-100' };
  return <span className={cn(BADGE, s.bg, s.color)}>{s.label}</span>;
}

function MethodBadge({ method }) {
  const m = PAYMENT_METHODS[method];
  return (
    <span className={cn(BADGE, METHOD_STYLES[method] || 'bg-neutral-100 text-neutral-600')}>
      {m ? m.label : method}
    </span>
  );
}

// ── Tab 1: Overview ──────────────────────────────────────────────────────────
function OverviewTab({ txns }) {
  const success = txns.filter(t => t.status === 'SUCCESS');
  const totalRevenue = success.reduce((a, t) => a + t.amount, 0);
  const today = new Date().toDateString();
  const todayCount = txns.filter(t => new Date(t.createdAt).toDateString() === today).length;
  const pending = txns.filter(t => t.status === 'PENDING' || t.status === 'OVERDUE').length;
  const failed  = txns.filter(t => t.status === 'FAILED');
  const avgTxn = success.length ? totalRevenue / success.length : 0;

  const methods = ['momo', 'cash', 'card', 'wallet', 'bank_transfer'];
  const methodCounts = methods.map(m => ({ m, count: txns.filter(t => t.method === m).length }));
  const total = methodCounts.reduce((a, x) => a + x.count, 0) || 1;

  const METHOD_COLORS = { momo: 'bg-accent-400', cash: 'bg-success-text', card: 'bg-primary-400', wallet: 'bg-neutral-400', bank_transfer: 'bg-neutral-500' };
  const METHOD_SVG    = { momo: '#0E9AA7',        cash: '#059669',         card: '#0EA5E9',        wallet: '#94A3B8',      bank_transfer: '#64748B' };

  const revData  = MOCK_REVENUE_TREND.map(d => d.revenue);
  const txnData  = MOCK_REVENUE_TREND.map(d => d.txns);
  const refunds  = txns.filter(t => t.status === 'REFUNDED').length;
  const outstanding = txns.filter(t => ['PENDING','OVERDUE'].includes(t.status)).reduce((a, t) => a + t.amount, 0);

  const kpis = [
    { label: 'Total Revenue',       value: formatGHS(totalRevenue), sub: '+12.4% vs last week', icon: TrendingUp, up: true, spark: revData, sparkColor: '#0EA5E9' },
    { label: 'Transactions Today',  value: todayCount,              sub: 'this calendar day',  icon: BarChart3,  spark: txnData, sparkColor: '#0E9AA7' },
    { label: 'Pending / Overdue',   value: pending,                 sub: 'need attention',     icon: AlertCircle, warn: true },
    { label: 'Avg Transaction',     value: formatGHS(avgTxn),       sub: 'per success txn',    icon: CreditCard },
  ];

  return (
    <div className="space-y-5">
      {/* KPI cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={CARD}>
            <div className="flex items-start justify-between">
              <p className={LABEL}>{k.label}</p>
              <k.icon size={16} className={k.warn ? 'text-error' : 'text-primary-400'} />
            </div>
            <p className={cn('text-2xl font-bold font-mono tabular-nums mt-2', k.warn ? 'text-error' : 'text-neutral-900')}>{k.value}</p>
            {k.spark && (
              <div className="mt-2 opacity-60">
                <Sparkline data={k.spark} color={k.sparkColor} height={28} />
              </div>
            )}
            {k.sub && (
              <span className={cn('mt-1 inline-flex items-center gap-1 text-[11px] font-semibold', k.up ? 'text-success-text' : 'text-neutral-400')}>
                {k.up && <TrendingUp size={10} />}{k.sub}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cn(CARD, 'lg:col-span-2')}>
          <p className={cn(LABEL, 'mb-3')}>Revenue — Last 7 Days</p>
          <div className="flex items-end gap-1 h-24">
            {MOCK_REVENUE_TREND.map(d => {
              const maxRev = Math.max(...MOCK_REVENUE_TREND.map(x => x.revenue), 1);
              const pct = d.revenue / maxRev;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t" style={{ height: `${Math.max(pct * 80, 2)}px`, background: pct > 0 ? '#0EA5E9' : '#E2E8F0', opacity: d.day === 'Sun' ? 0.35 : 1 }} />
                  <span className="text-[9px] text-neutral-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={CARD}>
          <p className={cn(LABEL, 'mb-3')}>Quick Stats</p>
          <div className="space-y-2.5">
            {[
              { label: 'Refunds issued',    value: refunds },
              { label: 'Outstanding',       value: formatGHS(outstanding), highlight: outstanding > 0 },
              { label: 'Failed payments',   value: failed.length, warn: failed.length > 0 },
              { label: 'Refund rate',       value: txns.length ? `${((refunds / txns.length) * 100).toFixed(1)}%` : '0%' },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-sm">
                <span className="text-neutral-500">{s.label}</span>
                <span className={cn('font-semibold tabular-nums', s.warn ? 'text-error' : s.highlight ? 'text-warning-text' : 'text-neutral-800')}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions with retry on failed */}
      <div className={CARD}>
        <p className={cn(LABEL, 'mb-3')}>Recent Transactions</p>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-neutral-50">
            {txns.slice(0, 5).map(t => (
              <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-2.5 pr-3">
                  <p className="font-medium text-neutral-800">{t.customerName}</p>
                  <p className="text-[11px] text-neutral-400">{t.id}</p>
                </td>
                <td className="py-2.5 pr-3 w-[130px]">
                  <MethodBadge method={t.method} />
                </td>
                <td className="py-2.5 pr-3 w-[110px] text-right font-mono tabular-nums font-semibold text-neutral-800">
                  {formatGHS(t.amount)}
                </td>
                <td className="py-2.5 w-[90px] text-right">
                  {t.status === 'FAILED' ? (
                    <button
                      onClick={() => console.log('retry', t.id)}
                      className="text-[11px] font-semibold text-primary-600 border border-primary-200 rounded-lg px-2 py-0.5 hover:bg-primary-50 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <RotateCcw size={10} /> Retry
                    </button>
                  ) : (
                    <StatusBadge statusKey={t.status} map={PAYMENT_STATUSES} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Method Breakdown */}
      <div className={CARD}>
        <p className={cn(LABEL, 'mb-3')}>Payment Method Breakdown</p>
        <div className="flex rounded-full overflow-hidden h-3 gap-px mb-3">
          {methodCounts.filter(x => x.count).map(x => (
            <div
              key={x.m}
              className={cn(METHOD_COLORS[x.m] || 'bg-neutral-300')}
              style={{ width: `${(x.count / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {methodCounts.filter(x => x.count).map(x => (
            <span key={x.m} className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className={cn('inline-block w-2.5 h-2.5 rounded-full', METHOD_COLORS[x.m])} />
              {PAYMENT_METHODS[x.m]?.label} ({x.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 2: Transactions ──────────────────────────────────────────────────────
function TransactionsTab({ txns }) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [methodF, setMethodF] = useState('');

  const filtered = txns.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.customerName.toLowerCase().includes(q) || t.orderId.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus = !statusF || t.status === statusF;
    const matchMethod = !methodF || t.method === methodF;
    return matchSearch && matchStatus && matchMethod;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search customer, order, TXN ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200"
        />
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none">
          <option value="">All Statuses</option>
          {Object.entries(PAYMENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={methodF} onChange={e => setMethodF(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none">
          <option value="">All Methods</option>
          {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button
          onClick={() => {
            const rows = [['TXN ID','Date','Customer','Method','Amount','Status']].concat(
              filtered.map(t => [t.id, fmtDate(t.createdAt), t.customerName, PAYMENT_METHODS[t.method]?.label ?? t.method, t.amount.toFixed(2), PAYMENT_STATUSES[t.status]?.label ?? t.status])
            ).map(r => r.join(',')).join('\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
            a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
          }}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className={cn(CARD, 'p-0 overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr className="text-left">
                {['TXN ID', 'Date', 'Customer', 'Method', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3', h === 'Amount' && 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400">No transactions found</td></tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{t.id}</td>
                  <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-neutral-800">{t.customerName}</td>
                  <td className="px-4 py-3"><MethodBadge method={t.method} /></td>
                  <td className="px-4 py-3 font-mono tabular-nums font-semibold text-neutral-800 text-right">{formatGHS(t.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge statusKey={t.status} map={PAYMENT_STATUSES} /></td>
                  <td className="px-4 py-3">
                    {t.status === 'FAILED' ? (
                      <button
                        onClick={() => console.log('retry', t.id)}
                        className="flex items-center gap-1 text-xs text-primary-600 font-semibold border border-primary-200 rounded-lg px-2 py-0.5 hover:bg-primary-50 transition-colors"
                      >
                        <RotateCcw size={10} /> Retry
                      </button>
                    ) : (
                      <button onClick={() => console.log('view', t.id)} className="text-xs text-primary-600 font-semibold hover:underline">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 3: Refunds ───────────────────────────────────────────────────────────
function RefundsTab({ txns }) {
  const [refunds, setRefunds] = useState(MOCK_REFUNDS.map(r => ({ ...r })));

  const process = id => setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'PROCESSING' } : r));

  const stats = [
    { label: 'Total Refunds', val: refunds.length },
    { label: 'Pending Approval', val: refunds.filter(r => r.status === 'REQUESTED').length },
    { label: 'Processing', val: refunds.filter(r => r.status === 'PROCESSING').length },
    { label: 'Completed', val: refunds.filter(r => r.status === 'COMPLETED').length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={CARD}>
            <p className={LABEL}>{s.label}</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">{s.val}</p>
          </div>
        ))}
      </div>
      <div className={cn(CARD, 'p-0 overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr className="text-left">
                {['Refund ID', 'Order', 'Customer', 'Amount', 'Method', 'Status', 'Created', ''].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3', h === 'Amount' && 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {refunds.map(r => {
                const t = txns.find(x => x.orderId === r.orderId);
                return (
                  <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
                    <td className="px-4 py-3 text-neutral-600 text-xs">{r.orderId}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{t?.customerName || '—'}</td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-right">{formatGHS(r.amount)}</td>
                    <td className="px-4 py-3"><span className={cn(BADGE, 'bg-neutral-100 text-neutral-600')}>{r.method}</span></td>
                    <td className="px-4 py-3"><StatusBadge statusKey={r.status} map={REFUND_STATUSES} /></td>
                    <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      {r.status === 'REQUESTED' && (
                        <button
                          onClick={() => process(r.id)}
                          className="text-xs bg-primary-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                        >
                          Process
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 4: Reconciliation ────────────────────────────────────────────────────
function ReconciliationTab() {
  const [rows, setRows] = useState(MOCK_RECONCILIATION.map(r => ({ ...r })));

  const resolve = txnId => setRows(prev => prev.map(r => r.txnId === txnId ? { ...r, status: 'MATCHED' } : r));

  const RECON_STYLES = {
    MATCHED:   { label: 'Matched',   bg: 'bg-success-bg',  color: 'text-success-text' },
    UNMATCHED: { label: 'Unmatched', bg: 'bg-error-bg',    color: 'text-error'         },
    VARIANCE:  { label: 'Variance',  bg: 'bg-warning-bg',  color: 'text-warning-text'  },
  };

  const matched   = rows.filter(r => r.status === 'MATCHED').length;
  const unmatched = rows.filter(r => r.status === 'UNMATCHED').length;
  const variance  = rows.filter(r => r.status === 'VARIANCE').length;
  const totalAmt  = rows.filter(r => r.status === 'MATCHED').reduce((a, r) => a + r.amount, 0);

  return (
    <div className="space-y-5">
      <div className={cn(CARD, 'flex flex-wrap gap-6')}>
        {[
          { label: 'Matched', val: matched, cls: 'text-success-text' },
          { label: 'Unmatched', val: unmatched, cls: 'text-error' },
          { label: 'Variance', val: variance, cls: 'text-warning-text' },
          { label: 'Total Reconciled', val: formatGHS(totalAmt), cls: 'text-neutral-800 font-mono tabular-nums' },
        ].map(s => (
          <div key={s.label}>
            <p className={LABEL}>{s.label}</p>
            <p className={cn('text-xl font-bold mt-0.5', s.cls)}>{s.val}</p>
          </div>
        ))}
      </div>
      <div className={cn(CARD, 'p-0 overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100">
              <tr className="text-left">
                {['TXN ID', 'Order', 'Customer', 'Amount', 'Method', 'Settlement Date', 'Ref', 'Status', ''].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3', h === 'Amount' && 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {rows.map(r => {
                const st = RECON_STYLES[r.status] || RECON_STYLES.MATCHED;
                return (
                  <tr key={r.txnId} className={cn('hover:bg-neutral-50 transition-colors', r.status === 'UNMATCHED' && 'bg-error-bg/30')}>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{r.txnId}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{r.orderId || '—'}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{r.customer || '—'}</td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-right">{formatGHS(r.amount)}</td>
                    <td className="px-4 py-3"><MethodBadge method={r.method} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600">{fmtDate(r.settledAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-400">{r.gatewayRef || '—'}</td>
                    <td className="px-4 py-3"><span className={cn(BADGE, st.bg, st.color)}>{st.label}</span></td>
                    <td className="px-4 py-3">
                      {(r.status === 'UNMATCHED' || r.status === 'VARIANCE') && (
                        <button
                          onClick={() => resolve(r.txnId)}
                          className="text-xs text-primary-600 font-semibold border border-primary-200 rounded-lg px-2.5 py-1 hover:bg-primary-50 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 5: Plans ─────────────────────────────────────────────────────────────
function PlansTab() {
  const PLAN_STATUS = {
    ACTIVE:   { label: 'Active',   bg: 'bg-success-bg',  color: 'text-success-text' },
    AT_RISK:  { label: 'At Risk',  bg: 'bg-warning-bg',  color: 'text-warning-text' },
    COMPLETE: { label: 'Complete', bg: 'bg-neutral-100',  color: 'text-neutral-600' },
  };
  const INST_STATUS = {
    PAID:    { bg: 'bg-success-bg',  color: 'text-success-text' },
    PENDING: { bg: 'bg-neutral-100', color: 'text-neutral-600' },
    OVERDUE: { bg: 'bg-error-bg',    color: 'text-error' },
  };

  return (
    <div className="space-y-5">
      {MOCK_PAYMENT_PLANS.map(plan => {
        const ps = PLAN_STATUS[plan.status] || PLAN_STATUS.ACTIVE;
        const isRisk = plan.status === 'AT_RISK';
        return (
          <div key={plan.id} className={cn(CARD, isRisk && 'border-warning')}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-neutral-800">{plan.customerName}</p>
                <p className="text-xs text-neutral-400">{plan.orderId} · {plan.frequency}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono tabular-nums text-lg font-bold text-neutral-800">{formatGHS(plan.totalAmount)}</span>
                <span className={cn(BADGE, ps.bg, ps.color)}>{ps.label}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-neutral-100">
                    {['#', 'Due Date', 'Amount', 'Status'].map(h => (
                      <th key={h} className={cn(LABEL, 'py-2 pr-4')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {plan.instalments.map(inst => {
                    const is = INST_STATUS[inst.status] || INST_STATUS.PENDING;
                    return (
                      <tr key={inst.num}>
                        <td className="py-2 pr-4 text-neutral-500">{inst.num}</td>
                        <td className="py-2 pr-4 text-neutral-600">{fmtDate(inst.dueDate)}</td>
                        <td className="py-2 pr-4 font-mono tabular-nums font-semibold">{formatGHS(inst.amount)}</td>
                        <td className="py-2"><span className={cn(BADGE, is.bg, is.color)}>{inst.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 6: Wallet ────────────────────────────────────────────────────────────
function WalletTab() {
  const balances = getAllWalletBalances();
  const topups   = MOCK_WALLET_TOPUPS;
  const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-GH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="space-y-4">
      <div className={CARD}>
        <p className={cn(LABEL, 'mb-4')}>Customer Wallet Balances</p>
        <div className="divide-y divide-neutral-100">
          {balances.map(w => (
            <div key={w.customerId} className="flex items-center gap-3 py-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <Wallet className="h-4 w-4 text-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{w.customerName}</p>
                <p className="text-xs text-neutral-400">Last top-up: {fmtDate(w.lastTopUp)}</p>
              </div>
              <div className="text-right">
                <p className={cn('text-sm font-bold tabular-nums', w.balance > 0 ? 'text-success-text' : 'text-neutral-400')}>
                  {formatGHS(w.balance)}
                </p>
                {w.lastTopUpAmount > 0 && (
                  <p className="text-xs text-neutral-400">+{formatGHS(w.lastTopUpAmount)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <p className={cn(LABEL, 'mb-4')}>Top-Up History</p>
        <div className="divide-y divide-neutral-100">
          {topups.map(t => (
            <div key={t.id} className="flex items-center justify-between py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-neutral-800 truncate">{t.ref}</p>
                <p className="text-xs text-neutral-400">{PAYMENT_METHODS[t.method]?.label ?? t.method} · {fmtDate(t.createdAt)}</p>
              </div>
              <span className="font-semibold text-success-text tabular-nums ml-4">{formatGHS(t.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 7: Reminders ─────────────────────────────────────────────────────────
function RemindersTab() {
  const cfg = DEFAULT_REMINDER_CONFIG;
  return (
    <div className="max-w-lg space-y-4">
      <div className={CARD}>
        <p className={cn(LABEL, 'mb-4')}>Reminder Configuration</p>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">Reminders enabled</span>
            <span className={cn(BADGE, cfg.enabled ? 'bg-success-bg text-success-text' : 'bg-neutral-100 text-neutral-500')}>
              {cfg.enabled ? 'On' : 'Off'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">Grace period</span>
            <span className="text-neutral-500">{cfg.gracePeriodDays} days</span>
          </div>
          <div>
            <span className="font-medium text-neutral-700 block mb-2">Reminder schedule</span>
            <div className="flex gap-2">
              {cfg.schedule.map(d => (
                <span key={d} className="rounded-full px-3 py-1 text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  Day {d}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">Auto-suspend after</span>
            <span className="text-neutral-500">{cfg.autoSuspendDays} days overdue</span>
          </div>
          <div>
            <span className="font-medium text-neutral-700 block mb-2">Channels</span>
            <div className="flex gap-2">
              {cfg.channels.map(ch => (
                <span key={ch} className={cn(BADGE, 'bg-accent-50 text-accent-600 uppercase')}>{ch}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">Exclude VIP customers</span>
            <span className={cn(BADGE, cfg.excludeVip ? 'bg-success-bg text-success-text' : 'bg-neutral-100 text-neutral-500')}>{cfg.excludeVip ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">Skip small balances</span>
            <span className="text-neutral-500">Under {formatGHS(cfg.smallBalanceThreshold)}</span>
          </div>
        </div>
      </div>
      <div title="Coming soon" className="inline-block">
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-400 bg-neutral-50 cursor-not-allowed"
        >
          <Settings size={14} />
          Edit Settings
          <span className="text-[10px] bg-neutral-200 text-neutral-500 rounded px-1.5 py-0.5">Coming soon</span>
        </button>
      </div>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────
export default function PaymentsHubPage() {
  const [tab, setTab] = useState('Overview');
  const txns = getAllTransactions();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Payments Hub</h1>
          <p className="text-caption text-neutral-500 mt-0.5">Finance overview, transactions, reconciliation & plans</p>
        </div>
        <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Bell size={18} />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-neutral-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-primary-500 text-primary-700 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700',
              )}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {tab === 'Overview'        && <OverviewTab txns={txns} />}
      {tab === 'Transactions'    && <TransactionsTab txns={txns} />}
      {tab === 'Refunds'         && <RefundsTab txns={txns} />}
      {tab === 'Reconciliation'  && <ReconciliationTab />}
      {tab === 'Plans'           && <PlansTab />}
      {tab === 'Wallet'          && <WalletTab />}
      {tab === 'Reminders'       && <RemindersTab />}
    </div>
  );
}
