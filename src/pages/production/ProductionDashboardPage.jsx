import { useState } from 'react';
import {
  Activity, Package, CheckCircle, AlertTriangle, Clock,
  TrendingUp, Zap, Wind, Thermometer, Users, BarChart3, RefreshCw, ArrowRight,
} from 'lucide-react';
import { getAllMachines, MACHINE_STATUSES } from '../../lib/mock/mockMachines.js';
import { getAllSensorReadings } from '../../lib/mock/mockEnvironmental.js';
import { getAllEnergyLog, getAllChemicalUsage, getAllProcessingCosts, SHIFT_BUDGET } from '../../lib/mock/mockResources.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

// ─── Inline mock data ────────────────────────────────────────────────────────

const MOCK_PIPELINE = [
  { stage: 'Intake',    count: 8,  avgMinutes: 12, slaAtRisk: 1, route: '/production/intake' },
  { stage: 'Sorting',   count: 14, avgMinutes: 8,  slaAtRisk: 0, route: '/production/sorting/fabric' },
  { stage: 'Pre-Treat', count: 5,  avgMinutes: 25, slaAtRisk: 2, route: '/production/pre-treatment' },
  { stage: 'Washing',   count: 22, avgMinutes: 45, slaAtRisk: 3, route: '/production/washing' },
  { stage: 'Drying',    count: 18, avgMinutes: 35, slaAtRisk: 1, route: '/production/drying' },
  { stage: 'Ironing',   count: 9,  avgMinutes: 20, slaAtRisk: 0, route: '/production/ironing' },
  { stage: 'Packaging', count: 6,  avgMinutes: 10, slaAtRisk: 0, route: '/production/folding' },
  { stage: 'QC',        count: 11, avgMinutes: 15, slaAtRisk: 2, route: '/production/qc' },
  { stage: 'Rework',    count: 3,  avgMinutes: 45, slaAtRisk: 3, route: '/production/rework' },
];

const MOCK_SHIFT = {
  name: 'Morning Shift', staff: 12, startTime: '06:00', endTime: '14:00',
  itemsProcessed: 67, itemsTarget: 120, onTimePct: 84, throughputPerHour: 8.4,
};

const MOCK_PRIORITY_QUEUE = [
  { orderId: 'ORD-2026-06-1001', customer: 'GoldCoast Hotels', priority: 'URGENT', itemCount: 40, slaHours: 2 },
  { orderId: 'ORD-2026-06-1002', customer: 'Adwoa Frimpong',   priority: 'HIGH',   itemCount: 5,  slaHours: 6 },
  { orderId: 'ORD-2026-06-1003', customer: 'Kweku Mensah',     priority: 'NORMAL', itemCount: 3,  slaHours: 24 },
];

const INIT_EXCEPTIONS = [
  { id: 'EX-001', type: 'MACHINE_FAULT', message: 'Washer C fault — belt snapped',         severity: 'HIGH',   stage: 'Washing',     raisedAt: '2026-06-28T08:00:00' },
  { id: 'EX-002', type: 'QC_FAIL',       message: '3 items failed QC — redirected to rework', severity: 'MEDIUM', stage: 'QC',          raisedAt: '2026-06-28T09:45:00' },
  { id: 'EX-003', type: 'SENSOR_ALERT',  message: 'Chemical Storage air quality 85 ppm',   severity: 'HIGH',   stage: 'Environment', raisedAt: '2026-06-28T10:30:00' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(isoString) {
  const diffMs = new Date('2026-06-28T10:30:00') - new Date(isoString);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return mins + 'm ago';
  return Math.floor(mins / 60) + 'h ago';
}

const TODAY = '2026-06-28';

const card = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';
const label = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const mono = 'font-mono tabular-nums';

function StatTile({ title, value, sub, valueClass }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={label}>{title}</span>
      <span className={cn('text-xl font-bold text-neutral-900', valueClass)}>{value}</span>
      {sub && <span className="text-[11px] text-neutral-500">{sub}</span>}
    </div>
  );
}

function ProgressBar({ pct, colorClass = 'bg-primary-500' }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
      <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

function SectionHeader({ title, href, badge }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
        {title}
        {badge !== undefined && (
          <span className="inline-flex items-center justify-center rounded-full bg-error/10 text-error text-[11px] font-bold px-1.5 py-0.5 min-w-[20px]">
            {badge}
          </span>
        )}
      </h3>
      {href && (
        <a href={href} className="text-[11px] text-primary-600 hover:underline flex items-center gap-0.5">
          View all <ArrowRight size={11} />
        </a>
      )}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    URGENT: 'bg-error/10 text-error',
    HIGH:   'bg-warning-bg text-warning-text',
    NORMAL: 'bg-neutral-100 text-neutral-500',
  };
  return (
    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', map[priority] ?? map.NORMAL)}>
      {priority}
    </span>
  );
}

// ─── Column widgets ───────────────────────────────────────────────────────────

function MachineStatusCard() {
  const machines = getAllMachines();
  return (
    <div className={card}>
      <SectionHeader title="Machine Status" href="/production/machines" />
      <ul className="space-y-2">
        {machines.map(m => {
          const st = MACHINE_STATUSES[m.status] ?? {};
          const isFault = m.status === 'FAULT';
          return (
            <li key={m.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', st.dot ?? 'bg-neutral-300')} />
                <span className={cn('text-sm flex-1 truncate', isFault ? 'text-error font-semibold' : 'text-neutral-700')}>
                  {m.name}
                </span>
                <span className={cn('text-[11px]', st.color ?? 'text-neutral-400')}>{st.label ?? m.status}</span>
                <span className="text-[11px] text-neutral-400 font-mono w-8 text-right">{m.utilizationRate}%</span>
              </div>
              <ProgressBar
                pct={m.utilizationRate}
                colorClass={isFault ? 'bg-error' : m.status === 'IDLE' ? 'bg-neutral-200' : 'bg-primary-500'}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PriorityQueueCard() {
  if (!MOCK_PRIORITY_QUEUE.length) {
    return (
      <div className={card}>
        <SectionHeader title="Priority Queue" href="/production/qc" />
        <p className="text-sm text-neutral-400 text-center py-6">No urgent orders</p>
      </div>
    );
  }
  return (
    <div className={card}>
      <SectionHeader title="Priority Queue" href="/production/qc" />
      <ul className="space-y-3">
        {MOCK_PRIORITY_QUEUE.map(o => {
          const urgent = o.slaHours <= 4;
          return (
            <li key={o.orderId} className="flex flex-col gap-1 border-b border-neutral-50 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={o.priority} />
                <span className="text-[11px] text-neutral-500 font-mono">{o.orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-800 truncate">{o.customer}</span>
                <span className="text-[11px] text-neutral-400 flex-shrink-0 ml-2">{o.itemCount} items</span>
              </div>
              <span className={cn('text-[11px] font-semibold', urgent ? 'text-error' : 'text-neutral-400')}>
                {o.slaHours}h left
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExceptionsCard({ exceptions, onResolve }) {
  const highCount = exceptions.filter(e => e.severity === 'HIGH').length;
  return (
    <div className={card}>
      <SectionHeader title="Exceptions" href="/production/exceptions" badge={exceptions.length} />
      {exceptions.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-6">No active exceptions</p>
      ) : (
        <ul className="space-y-3">
          {exceptions.map(ex => (
            <li key={ex.id} className="flex flex-col gap-1 border-b border-neutral-50 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', ex.severity === 'HIGH' ? 'bg-error' : 'bg-warning')} />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide flex-1">{ex.type.replace('_', ' ')}</span>
                <span className="text-[11px] text-neutral-400">{timeAgo(ex.raisedAt)}</span>
              </div>
              <p className="text-xs text-neutral-700 truncate" title={ex.message}>{ex.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">{ex.stage}</span>
                <button
                  onClick={() => onResolve(ex.id)}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Resolve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResourceSnapshotCard() {
  const chemToday = getAllChemicalUsage().filter(r => r.shiftDate === TODAY);
  const energyToday = getAllEnergyLog().filter(r => r.shiftDate === TODAY);

  const chemCost = chemToday.reduce((s, r) => s + r.totalCostGhs, 0);
  const energyKwh = energyToday.reduce((s, r) => s + r.kWh, 0);
  const energyCost = energyToday.reduce((s, r) => s + r.costGhs, 0);
  const chemBudget = SHIFT_BUDGET.chemicals;
  const energyBudget = SHIFT_BUDGET.energy;
  const shiftTotal = chemCost + energyCost;


  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-800">Resources</h3>
        <div className="flex gap-3">
          <a href="/production/chemicals" className="text-[11px] text-primary-600 hover:underline">Chemicals</a>
          <a href="/production/energy" className="text-[11px] text-primary-600 hover:underline">Energy</a>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className={label}>Chemicals</span>
            <span className={cn('text-xs text-neutral-500', mono)}>{formatGHS(chemCost)} / {formatGHS(chemBudget)}</span>
          </div>
          <ProgressBar pct={(chemCost / chemBudget) * 100} colorClass={chemCost / chemBudget > 0.85 ? 'bg-error' : 'bg-primary-500'} />
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className={label}>Energy</span>
            <span className={cn('text-xs text-neutral-500', mono)}>{energyKwh.toFixed(1)} kWh · {formatGHS(energyCost)}</span>
          </div>
          <ProgressBar pct={(energyCost / energyBudget) * 100} colorClass={energyCost / energyBudget > 0.85 ? 'bg-error' : 'bg-success'} />
        </div>

        <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
          <span className={label}>Shift Total</span>
          <span className={cn('text-base font-bold text-neutral-800', mono)}>{formatGHS(shiftTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function SensorStatusCard() {
  const sensors = getAllSensorReadings();
  const dotMap = { OK: 'bg-success', WARN: 'bg-warning', ALERT: 'bg-error' };
  const textMap = { OK: 'text-success-text', WARN: 'text-warning-text', ALERT: 'text-error' };
  const rowBgMap = { ALERT: 'bg-error-bg/20', WARN: '', OK: '' };

  return (
    <div className={card}>
      <SectionHeader title="Sensors" href="/production/environment" />
      <ul className="space-y-2">
        {sensors.map(s => (
          <li key={s.id} className={cn('rounded-lg px-2 py-1.5 flex flex-col gap-0.5', rowBgMap[s.status])}>
            <div className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dotMap[s.status])} />
              <span className="text-xs font-medium text-neutral-700 flex-1 truncate">{s.zone}</span>
              <span className={cn('text-[10px] font-bold uppercase', textMap[s.status])}>{s.status}</span>
            </div>
            <div className="flex gap-4 pl-4">
              <span className="text-[11px] text-neutral-500">{s.tempC}°C</span>
              <span className="text-[11px] text-neutral-500">{s.humidityPct}% RH</span>
              {s.airQualityPpm > 20 && <span className="text-[11px] text-error font-semibold">{s.airQualityPpm} ppm</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CapacityCard() {
  const totalInPipeline = MOCK_PIPELINE.reduce((s, p) => s + p.count, 0);
  const capacityItems = 120;
  const loadPct = Math.round((totalInPipeline / capacityItems) * 100);
  const throughput = MOCK_SHIFT.throughputPerHour;
  const throughputTarget = 10;
  const throughputPct = Math.round((throughput / throughputTarget) * 100);

  const loadColor = loadPct > 90 ? 'bg-error' : loadPct > 70 ? 'bg-warning' : 'bg-success';
  const tpColor = throughputPct < 70 ? 'bg-warning' : 'bg-success';

  return (
    <div className={card}>
      <SectionHeader title="Capacity & Throughput" />
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className={label}>Pipeline Load</span>
            <span className="text-xs text-neutral-600 font-semibold">{totalInPipeline} / {capacityItems} items ({loadPct}%)</span>
          </div>
          <ProgressBar pct={loadPct} colorClass={loadColor} />
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className={label}>Throughput</span>
            <span className="text-xs text-neutral-600 font-semibold">{throughput}/hr vs {throughputTarget}/hr target</span>
          </div>
          <ProgressBar pct={throughputPct} colorClass={tpColor} />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg bg-neutral-50 px-3 py-2">
            <p className={label}>In Pipeline</p>
            <p className="text-lg font-bold text-neutral-800">{totalInPipeline}</p>
          </div>
          <div className="rounded-lg bg-neutral-50 px-3 py-2">
            <p className={label}>Capacity</p>
            <p className="text-lg font-bold text-neutral-800">{capacityItems}</p>
          </div>
        </div>
        <a href="/production/capacity" className="text-[11px] text-primary-600 hover:underline flex items-center gap-1 pt-1">
          View capacity planner <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductionDashboardPage() {
  const [exceptions, setExceptions] = useState(INIT_EXCEPTIONS);

  const handleResolve = id => {
    alert('Resolved: ' + id);
    setExceptions(prev => prev.filter(e => e.id !== id));
  };

  const highExceptions = exceptions.filter(e => e.severity === 'HIGH');

  // Power source detection
  const energyToday = getAllEnergyLog().filter(r => r.shiftDate === TODAY);
  const hasGenerator = energyToday.some(r => r.powerSource === 'GENERATOR');

  // On-time colour
  const onTimePct = MOCK_SHIFT.onTimePct;
  const onTimeColor = onTimePct >= 90 ? 'text-success-text' : onTimePct >= 70 ? 'text-warning-text' : 'text-error';

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-neutral-900">Production Dashboard</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-full px-3 py-1">
            <Activity size={12} className="text-primary-500" />
            {MOCK_SHIFT.name} · {MOCK_SHIFT.startTime}–{MOCK_SHIFT.endTime}
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 border border-neutral-200 bg-white rounded-lg px-4 py-2 hover:bg-neutral-50 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Shift Summary strip */}
      <div className="bg-primary-50 rounded-lg px-6 py-4 flex gap-8 flex-wrap">
        <StatTile
          title="Items Processed"
          value={`${MOCK_SHIFT.itemsProcessed} / ${MOCK_SHIFT.itemsTarget}`}
          sub={`${MOCK_SHIFT.itemsTarget} target`}
        />
        <StatTile
          title="On-Time %"
          value={`${onTimePct}%`}
          valueClass={onTimeColor}
        />
        <StatTile
          title="Throughput"
          value={`${MOCK_SHIFT.throughputPerHour}/hr`}
        />
        <StatTile
          title="Staff On Floor"
          value={MOCK_SHIFT.staff}
          sub="active today"
        />
        <div className="flex flex-col gap-0.5">
          <span className={label}>Power Source</span>
          {hasGenerator ? (
            <span className="text-sm font-bold text-warning-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning inline-block" /> Generator
            </span>
          ) : (
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success inline-block" /> ECG
            </span>
          )}
        </div>
      </div>

      {/* Active Exceptions Banner */}
      {highExceptions.length > 0 && (
        <div className="bg-error-bg border border-error/20 rounded-lg px-5 py-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-error flex-shrink-0" />
            <span className="text-sm font-bold text-error">{highExceptions.length} active alert{highExceptions.length > 1 ? 's' : ''}</span>
          </div>
          <ul className="space-y-1 pl-6">
            {highExceptions.map(e => (
              <li key={e.id} className="text-xs text-error/80">
                <span className="font-semibold">[{e.stage}]</span> {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pipeline */}
      <div className={card}>
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Production Pipeline</h3>
        <div className="flex items-start gap-1 overflow-x-auto pb-2">
          {MOCK_PIPELINE.map((p, i) => (
            <div key={p.stage} className="flex items-center gap-1 flex-shrink-0">
              <a
                href={p.route}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border px-3 py-2 hover:shadow-sm transition-shadow min-w-[80px]',
                  p.slaAtRisk > 0 ? 'border-warning bg-warning-bg/30' : 'border-neutral-100 bg-neutral-50',
                )}
              >
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">{p.stage}</span>
                <span className="text-xl font-bold text-neutral-900">{p.count}</span>
                <span className="text-[10px] text-neutral-400">{p.avgMinutes}m avg</span>
                {p.slaAtRisk > 0 && (
                  <span className="text-[10px] font-bold bg-error/10 text-error rounded-full px-1.5 py-0.5">
                    {p.slaAtRisk} at risk
                  </span>
                )}
              </a>
              {i < MOCK_PIPELINE.length - 1 && (
                <ArrowRight size={14} className="text-neutral-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Machine / Priority / Exceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <MachineStatusCard />
        <PriorityQueueCard />
        <ExceptionsCard exceptions={exceptions} onResolve={handleResolve} />
      </div>

      {/* Row 3: Resources / Sensors / Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ResourceSnapshotCard />
        <SensorStatusCard />
        <CapacityCard />
      </div>

    </div>
  );
}
