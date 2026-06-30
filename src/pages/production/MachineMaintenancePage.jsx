import { useState } from 'react';
import { Settings, AlertTriangle, CheckCircle, Clock, Wrench, X } from 'lucide-react';
import { getAllMachines, getMaintenanceSchedule, MACHINE_STATUSES, MACHINE_TYPES } from '../../lib/mock/mockMachines.js';
import { cn } from '../../utils/classNames.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const StatusBadge = ({ status }) => {
  const s = MACHINE_STATUSES[status] ?? MACHINE_STATUSES.IDLE;
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold flex items-center gap-1.5 w-fit', s.bg, s.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
};

const MaintenanceBadge = ({ status }) => {
  const map = {
    PENDING:     'bg-warning-bg text-warning-text',
    SCHEDULED:   'bg-warning-bg text-warning-text',
    IN_PROGRESS: 'bg-accent-50 text-accent-600',
    COMPLETED:   'bg-success-bg text-success-text',
  };
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', map[status] ?? 'bg-neutral-100 text-neutral-500')}>
      {status.replace('_', ' ')}
    </span>
  );
};

const KPI = ({ label, value, sub }) => (
  <div className={CARD}>
    <p className={LABEL}>{label}</p>
    <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
    {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
  </div>
);

const UtilBar = ({ pct }) => (
  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden mt-1">
    <div
      className={cn('h-full rounded-full', pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-neutral-300')}
      style={{ width: `${Math.min(pct, 100)}%` }}
    />
  </div>
);

export default function MachineMaintenancePage() {
  const machines = getAllMachines();
  const schedule = getMaintenanceSchedule();
  const faults = machines.filter(m => m.status === 'FAULT');
  const [modal, setModal] = useState(false);
  const [faultForm, setFaultForm] = useState({ machineId: '', description: '', severity: 'Medium', downtime: '' });

  const kpis = [
    { label: 'Total Machines', value: machines.length },
    { label: 'Running', value: machines.filter(m => m.status === 'RUNNING').length },
    { label: 'Faults', value: faults.length, sub: faults.map(f => f.name).join(', ') || '—' },
    { label: 'In Maintenance', value: machines.filter(m => m.status === 'MAINTENANCE').length },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    const m = machines.find(x => x.id === faultForm.machineId);
    alert('Fault logged for: ' + (m?.name ?? faultForm.machineId));
    setModal(false);
    setFaultForm({ machineId: '', description: '', severity: 'Medium', downtime: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench size={20} className="text-neutral-500" />
          <h1 className="text-xl font-bold text-neutral-900">Machine Maintenance</h1>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-error/40 text-error px-3 py-2 text-sm font-semibold hover:bg-error-bg transition-colors"
        >
          <AlertTriangle size={14} /> Log Fault
        </button>
      </div>

      {/* Fault Banner */}
      {faults.length > 0 && (
        <div className="rounded-lg bg-error-bg border border-error/20 px-4 py-3 flex items-center gap-2 text-sm text-error font-medium">
          <AlertTriangle size={16} />
          {faults.length} machine{faults.length > 1 ? 's' : ''} in fault state — {faults.map(f => f.name).join(', ')}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map(k => <KPI key={k.label} {...k} />)}
      </div>

      {/* Machines Grid */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Machines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map(m => {
            const type = MACHINE_TYPES[m.type];
            const isFault = m.status === 'FAULT';
            return (
              <div key={m.id} className={cn(CARD, isFault && 'border-2 border-error')}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-neutral-900">{m.name}</p>
                    <p className={cn(LABEL, 'mt-0.5')}>{type.label}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-xs text-neutral-400 mb-2">{m.location}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-0.5">
                    <span>Utilisation</span>
                    <span>{m.utilizationRate}%</span>
                  </div>
                  <UtilBar pct={m.utilizationRate} />
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-2">
                  <span>{m.totalCycles.toLocaleString()} cycles</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {m.nextService}</span>
                </div>
                {m.faultLog.length > 0 && (
                  <p className="mt-2 text-[11px] text-error bg-error-bg rounded-lg px-2 py-1">{m.faultLog[0]}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Maintenance Schedule */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Maintenance Schedule</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Machine','Type','Description','Scheduled','Technician','Status','Est. Hrs'].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3 text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={row.id} className={cn('border-b border-neutral-50', i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50')}>
                  <td className="px-4 py-3 font-medium text-neutral-800">{row.machineName}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', row.type === 'CORRECTIVE' ? 'bg-error-bg text-error' : 'bg-neutral-100 text-neutral-500')}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 max-w-[220px]">{row.description}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-neutral-600">{row.scheduledDate}</td>
                  <td className="px-4 py-3 text-neutral-600">{row.technicianName}</td>
                  <td className="px-4 py-3"><MaintenanceBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-neutral-600">{row.estimatedHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Log Fault Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className={cn(CARD, 'w-full max-w-md')}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-neutral-900">Log Fault</h2>
              <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Machine</label>
                <select required value={faultForm.machineId} onChange={e => setFaultForm(f => ({ ...f, machineId: e.target.value }))}
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select machine…</option>
                  {machines.map(m => <option key={m.id} value={m.id}>{m.name} — {m.location}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Fault Description</label>
                <textarea required rows={3} value={faultForm.description} onChange={e => setFaultForm(f => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe the fault…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Severity</label>
                  <select value={faultForm.severity} onChange={e => setFaultForm(f => ({ ...f, severity: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {['Low','Medium','High','Critical'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Est. Downtime (hrs)</label>
                  <input type="number" min="0" step="0.5" value={faultForm.downtime} onChange={e => setFaultForm(f => ({ ...f, downtime: e.target.value }))}
                    className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold bg-error text-white rounded-lg hover:bg-error/90 transition-colors">Log Fault</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
