import { useState } from 'react';
import { FlaskConical, Plus, AlertTriangle, TrendingUp, Package, X } from 'lucide-react';
import { getAllChemicalUsage, SHIFT_BUDGET } from '../../lib/mock/mockResources.js';
import { getLowStockItems } from '../../lib/mock/mockInventory.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const KPI = ({ label, value, red }) => (
  <div className={CARD}>
    <p className={LABEL}>{label}</p>
    <p className={cn('mt-1 text-2xl font-bold', red ? 'text-error' : 'text-neutral-900')}>{value}</p>
  </div>
);

export default function ChemicalUsagePage() {
  const all = getAllChemicalUsage();
  const lowStock = getLowStockItems?.() ?? [];
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ shiftDate: '', shift: 'Morning', chemical: '', machineId: '', qtyKg: '', unitCostGhs: '' });

  const TODAY = '2026-06-28';
  const todayRows = all.filter(r => r.shiftDate === TODAY);
  const todayCost = todayRows.reduce((s, r) => s + r.totalCostGhs, 0);
  const detergentKg = todayRows.filter(r => r.chemical.toLowerCase().includes('detergent')).reduce((s, r) => s + r.qtyKg, 0);
  const softenerKg = todayRows.filter(r => r.chemical.toLowerCase().includes('softener')).reduce((s, r) => s + r.qtyKg, 0);
  const budgetLeft = SHIFT_BUDGET.chemicals - todayCost;

  // Group by date
  const byDate = {};
  all.forEach(r => { (byDate[r.shiftDate] ??= []).push(r); });
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  // Cost by chemical
  const byChem = {};
  all.forEach(r => {
    if (!byChem[r.chemical]) byChem[r.chemical] = { qty: 0, cost: 0 };
    byChem[r.chemical].qty += r.qtyKg;
    byChem[r.chemical].cost += r.totalCostGhs;
  });
  const totalChemCost = Object.values(byChem).reduce((s, v) => s + v.cost, 0);

  const handleSubmit = e => {
    e.preventDefault();
    alert('Usage logged: ' + form.chemical);
    setModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical size={20} className="text-neutral-500" />
          <h1 className="text-xl font-bold text-neutral-900">Chemical Usage</h1>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-lg bg-primary-600 text-white px-3 py-2 text-sm font-semibold hover:bg-primary-700 transition-colors">
          <Plus size={14} /> Log Usage
        </button>
      </div>

      {/* Low Stock Banner */}
      {lowStock.length > 0 && (
        <div className="rounded-lg bg-warning-bg border border-warning/20 px-4 py-3 flex items-center gap-2 text-sm text-warning-text font-medium">
          <AlertTriangle size={16} />
          {lowStock.length} chemical{lowStock.length > 1 ? 's' : ''} low or out of stock — view Inventory
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPI label="Today's Chemical Cost" value={<span className="font-mono tabular-nums">{formatGHS(todayCost)}</span>} />
        <KPI label="Detergent Used (kg)" value={`${detergentKg.toFixed(1)} kg`} />
        <KPI label="Softener Used (kg)" value={`${softenerKg.toFixed(1)} kg`} />
        <KPI label="Budget Remaining" value={<span className="font-mono tabular-nums">{formatGHS(budgetLeft)}</span>} red={budgetLeft < 0} />
      </div>

      {/* Usage Log */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Usage Log</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Date','Shift','Chemical','Machine','Qty (kg)','Unit Cost','Total Cost'].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3 text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map(date => (
                <>
                  <tr key={`d-${date}`} className="bg-neutral-50 border-b border-neutral-100">
                    <td colSpan={7} className={cn(LABEL, 'px-4 py-2')}>{date}</td>
                  </tr>
                  {byDate[date].map((row, i) => (
                    <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                      <td className="px-4 py-2.5 text-neutral-400 text-xs">—</td>
                      <td className="px-4 py-2.5 text-neutral-600">{row.shift}</td>
                      <td className="px-4 py-2.5 font-medium text-neutral-800">{row.chemical}</td>
                      <td className="px-4 py-2.5 text-neutral-500">{row.machineId ?? '—'}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700">{row.qtyKg.toFixed(1)}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{formatGHS(row.unitCostGhs)}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums font-medium text-neutral-800">{formatGHS(row.totalCostGhs)}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cost by Chemical */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Cost by Chemical</h2>
        <div className={CARD}>
          <div className="space-y-3">
            {Object.entries(byChem).sort((a, b) => b[1].cost - a[1].cost).map(([chem, { qty, cost }]) => (
              <div key={chem}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">{chem}</span>
                  <span className="font-mono tabular-nums text-neutral-600">{formatGHS(cost)} <span className="text-neutral-400">· {qty.toFixed(1)} kg</span></span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${(cost / Math.max(totalChemCost, 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Low Stock List */}
      {lowStock.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-neutral-700 mb-3">Low Stock Alerts</h2>
          <div className={CARD}>
            <div className="divide-y divide-neutral-100">
              {lowStock.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-700">{item.name}</span>
                    <span className="text-xs text-neutral-400">Stock: {item.currentStock} {item.unit}</span>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', item.currentStock === 0 ? 'bg-error-bg text-error' : 'bg-warning-bg text-warning-text')}>
                    {item.currentStock === 0 ? 'OUT' : 'LOW'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Log Usage Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className={cn(CARD, 'w-full max-w-md')}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-neutral-900">Log Chemical Usage</h2>
              <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Date</label>
                  <input type="date" required value={form.shiftDate} onChange={e => setForm(f => ({ ...f, shiftDate: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className={LABEL}>Shift</label>
                  <select value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {['Morning','Afternoon','Night'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Chemical</label>
                <input required value={form.chemical} onChange={e => setForm(f => ({ ...f, chemical: e.target.value }))}
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Persil Detergent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Qty (kg)</label>
                  <input type="number" min="0" step="0.1" required value={form.qtyKg} onChange={e => setForm(f => ({ ...f, qtyKg: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className={LABEL}>Unit Cost (GH₵)</label>
                  <input type="number" min="0" step="0.01" required value={form.unitCostGhs} onChange={e => setForm(f => ({ ...f, unitCostGhs: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
