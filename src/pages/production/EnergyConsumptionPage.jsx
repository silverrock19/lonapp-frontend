import { useState } from 'react';
import { Zap, Battery, TrendingDown, AlertTriangle } from 'lucide-react';
import { getAllEnergyLog, getAllDumsorEvents, SHIFT_BUDGET } from '../../lib/mock/mockResources.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const KPI = ({ label, value, sub }) => (
  <div className={CARD}>
    <p className={LABEL}>{label}</p>
    <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
    {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
  </div>
);

const SourceBadge = ({ source }) => source === 'ECG'
  ? <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-success-bg text-success-text">ECG</span>
  : <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-warning-bg text-warning-text">Generator</span>;

export default function EnergyConsumptionPage() {
  const log = getAllEnergyLog();
  const dumsor = getAllDumsorEvents();

  const TODAY = '2026-06-28';
  const todayLog = log.filter(r => r.shiftDate === TODAY);
  const todayKwh = todayLog.reduce((s, r) => s + r.kWh, 0);
  const todayCost = todayLog.reduce((s, r) => s + r.costGhs, 0);
  const todayDiesel = todayLog.reduce((s, r) => s + r.dieselLitres, 0);
  const genCostMonth = dumsor.reduce((s, d) => s + d.dieselCostGhs, 0);

  const hasECG = todayLog.some(r => r.powerSource === 'ECG');
  const hasGen = todayLog.some(r => r.powerSource === 'GENERATOR');

  // Group log by date
  const byDate = {};
  log.forEach(r => { (byDate[r.shiftDate] ??= []).push(r); });
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  // Cost by machine
  const byMachine = {};
  log.forEach(r => {
    if (!byMachine[r.machineName]) byMachine[r.machineName] = 0;
    byMachine[r.machineName] += r.costGhs;
  });
  const maxMachineCost = Math.max(...Object.values(byMachine), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap size={20} className="text-neutral-500" />
        <h1 className="text-xl font-bold text-neutral-900">Energy Consumption</h1>
      </div>

      {/* Power Source Strip */}
      <div className="flex items-center gap-4 flex-wrap">
        {hasECG && (
          <div className="flex items-center gap-2 rounded-lg bg-success-bg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm font-medium text-success-text">ECG — Active</span>
          </div>
        )}
        {hasGen && (
          <div className="flex items-center gap-2 rounded-lg bg-warning-bg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-sm font-medium text-warning-text">Generator — Active</span>
          </div>
        )}
        <span className="text-sm text-neutral-500">Dumsor events this month: <strong className="text-neutral-700">{dumsor.length}</strong></span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPI label="Today's kWh" value={`${todayKwh.toFixed(1)} kWh`} />
        <KPI label="Today's Energy Cost" value={<span className="font-mono tabular-nums">{formatGHS(todayCost)}</span>} />
        <KPI label="Diesel Used Today (L)" value={`${todayDiesel.toFixed(1)} L`} />
        <KPI label="Generator Cost (Month)" value={<span className="font-mono tabular-nums">{formatGHS(genCostMonth)}</span>} />
      </div>

      {/* Dumsor Events */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Dumsor Events</h2>
        <div className="space-y-3">
          {dumsor.map(ev => (
            <div key={ev.id} className={cn(CARD, 'flex flex-col sm:flex-row sm:items-center gap-4')}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning-text" />
                <span className="font-bold text-neutral-800">{ev.date}</span>
                <span className="text-sm text-neutral-500">{ev.outageStart} – {ev.outageEnd} ({ev.durationHours}h)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {ev.machinesAffected.map(id => (
                  <span key={id} className="rounded-full px-2 py-0.5 text-[11px] font-bold bg-neutral-100 text-neutral-600">{id}</span>
                ))}
              </div>
              <div className="text-sm text-neutral-600 flex-shrink-0">
                Diesel: <span className="font-mono tabular-nums">{ev.dieselUsedLitres} L</span>
                <span className="mx-2 text-neutral-300">·</span>
                Cost: <span className="font-mono tabular-nums font-medium text-neutral-800">{formatGHS(ev.dieselCostGhs)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Energy Log Table */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Energy Log</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Date','Shift','Machine','kWh','Power Source','Diesel (L)','Cost'].map(h => (
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
                  {byDate[date].map(row => (
                    <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                      <td className="px-4 py-2.5 text-neutral-400 text-xs">—</td>
                      <td className="px-4 py-2.5 text-neutral-600">{row.shift}</td>
                      <td className="px-4 py-2.5 font-medium text-neutral-800">{row.machineName}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700">{row.kWh.toFixed(1)}</td>
                      <td className="px-4 py-2.5"><SourceBadge source={row.powerSource} /></td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{row.dieselLitres > 0 ? row.dieselLitres.toFixed(1) : '—'}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums font-medium text-neutral-800">{formatGHS(row.costGhs)}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cost by Machine */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Cost by Machine</h2>
        <div className={CARD}>
          <div className="space-y-3">
            {Object.entries(byMachine).sort((a, b) => b[1] - a[1]).map(([name, cost]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">{name}</span>
                  <span className="font-mono tabular-nums text-neutral-600">{formatGHS(cost)}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-warning" style={{ width: `${(cost / maxMachineCost) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
