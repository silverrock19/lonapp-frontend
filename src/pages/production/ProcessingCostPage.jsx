import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { getAllProcessingCosts, SHIFT_BUDGET } from '../../lib/mock/mockResources.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const KPI = ({ label, value, red, green }) => (
  <div className={CARD}>
    <p className={LABEL}>{label}</p>
    <p className={cn('mt-1 text-2xl font-bold', red ? 'text-error' : green ? 'text-success-text' : 'text-neutral-900')}>{value}</p>
  </div>
);

const BudgetBar = ({ label, actual, budget }) => {
  const pct = Math.min((actual / budget) * 100, 100);
  const over = actual > budget;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className={cn('font-mono tabular-nums text-xs', over ? 'text-error' : 'text-neutral-500')}>
          {formatGHS(actual)} / {formatGHS(budget)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
        <div className={cn('h-full rounded-full', over ? 'bg-error' : 'bg-primary-500')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default function ProcessingCostPage() {
  const costs = getAllProcessingCosts();

  const totals = costs.reduce((acc, r) => ({
    chemicals: acc.chemicals + r.chemicals,
    energy: acc.energy + r.energy,
    labour: acc.labour + r.labour,
    packaging: acc.packaging + r.packaging,
    totalCost: acc.totalCost + r.totalCost,
    revenue: acc.revenue + r.revenue,
    margin: acc.margin + r.margin,
  }), { chemicals: 0, energy: 0, labour: 0, packaging: 0, totalCost: 0, revenue: 0, margin: 0 });

  const avgCost = totals.totalCost / costs.length;
  const mostProfitable = costs.reduce((a, b) => a.margin > b.margin ? a : b);
  const lossmaking = costs.filter(r => r.margin < 0).sort((a, b) => a.margin - b.margin)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 size={20} className="text-neutral-500" />
        <h1 className="text-xl font-bold text-neutral-900">Processing Costs</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPI label="Total Cost Today" value={<span className="font-mono tabular-nums">{formatGHS(totals.totalCost)}</span>} />
        <KPI label="Total Revenue Today" value={<span className="font-mono tabular-nums">{formatGHS(totals.revenue)}</span>} green />
        <KPI label="Net Margin Today" value={<span className="font-mono tabular-nums">{formatGHS(totals.margin)}</span>} red={totals.margin < 0} green={totals.margin > 0} />
        <KPI label="Avg Cost per Order" value={<span className="font-mono tabular-nums">{formatGHS(avgCost)}</span>} />
      </div>

      {/* Budget vs Actual */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Budget vs Actual</h2>
        <div className={cn(CARD, 'grid grid-cols-1 sm:grid-cols-2 gap-5')}>
          <BudgetBar label="Chemicals" actual={totals.chemicals} budget={SHIFT_BUDGET.chemicals} />
          <BudgetBar label="Energy" actual={totals.energy} budget={SHIFT_BUDGET.energy} />
          <BudgetBar label="Labour" actual={totals.labour} budget={SHIFT_BUDGET.labour} />
          <BudgetBar label="Packaging" actual={totals.packaging} budget={SHIFT_BUDGET.packaging} />
        </div>
      </section>

      {/* Cost Breakdown Table */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Cost Breakdown per Order</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Order ID','Chemicals','Energy','Labour','Packaging','Total Cost','Revenue','Margin'].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3 text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costs.map((row, i) => (
                <tr key={row.id} className={cn('border-b border-neutral-50 hover:bg-neutral-50/50', i % 2 !== 0 && 'bg-neutral-50/30')}>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700 text-xs">{row.orderId}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{formatGHS(row.chemicals)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{formatGHS(row.energy)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{formatGHS(row.labour)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{formatGHS(row.packaging)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums font-medium text-neutral-800">{formatGHS(row.totalCost)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700">{formatGHS(row.revenue)}</td>
                  <td className={cn('px-4 py-2.5 font-mono tabular-nums font-bold', row.margin < 0 ? 'text-error' : 'text-success-text')}>
                    {row.margin < 0 ? '−' : '+'}{formatGHS(Math.abs(row.margin))}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="border-t-2 border-neutral-200 bg-neutral-50 font-bold">
                <td className="px-4 py-3 text-neutral-800">TOTAL</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatGHS(totals.chemicals)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatGHS(totals.energy)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatGHS(totals.labour)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatGHS(totals.packaging)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-900">{formatGHS(totals.totalCost)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-900">{formatGHS(totals.revenue)}</td>
                <td className={cn('px-4 py-3 font-mono tabular-nums', totals.margin < 0 ? 'text-error' : 'text-success-text')}>
                  {totals.margin < 0 ? '−' : '+'}{formatGHS(Math.abs(totals.margin))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Margin Insight */}
        <div className={cn(CARD, 'mt-3 flex flex-col sm:flex-row gap-4')}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-success-text flex-shrink-0" />
            <p className="text-sm text-neutral-700">
              Most profitable: <span className="font-mono font-bold text-neutral-900">{mostProfitable.orderId}</span>
              <span className="ml-2 text-success-text font-mono tabular-nums">+{formatGHS(mostProfitable.margin)}</span>
            </p>
          </div>
          {lossmaking && (
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-neutral-700">
                Loss-making: <span className="font-mono font-bold text-neutral-900">{lossmaking.orderId}</span>
                <span className="ml-2 text-error font-mono tabular-nums">−{formatGHS(Math.abs(lossmaking.margin))}</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
