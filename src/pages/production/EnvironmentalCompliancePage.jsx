import { useState } from 'react';
import { Shield, AlertTriangle, Thermometer, Droplets, Wind, CheckCircle, FileText, X, Plus } from 'lucide-react';
import { getAllSensorReadings, getAllWastewaterLog, getComplianceAlerts, getEPAPermit, SENSOR_THRESHOLDS } from '../../lib/mock/mockEnvironmental.js';
import { cn } from '../../utils/classNames.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const STATUS_STYLE = {
  OK:    { badge: 'bg-success-bg text-success-text', border: 'border-neutral-100' },
  WARN:  { badge: 'bg-warning-bg text-warning-text', border: 'border-warning/30' },
  ALERT: { badge: 'bg-error-bg text-error',          border: 'border-error/30' },
};

const SEV_STYLE = {
  HIGH:   'bg-error-bg text-error',
  MEDIUM: 'bg-warning-bg text-warning-text',
  LOW:    'bg-neutral-100 text-neutral-500',
};

const MiniBar = ({ value, max, status }) => {
  const pct = Math.min((value / max) * 100, 100);
  const color = status === 'ALERT' ? 'bg-error' : status === 'WARN' ? 'bg-warning' : 'bg-success';
  return (
    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden mt-1">
      <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
    </div>
  );
};

export default function EnvironmentalCompliancePage() {
  const sensors = getAllSensorReadings();
  const wastewater = getAllWastewaterLog();
  const alerts = getComplianceAlerts();
  const permit = getEPAPermit();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ zone: 'Washing Floor', tempC: '', humidityPct: '', airQualityPpm: '' });

  const unresolvedAlerts = alerts.filter(a => !a.resolved);

  const handleSubmit = e => {
    e.preventDefault();
    alert('Reading logged for: ' + form.zone);
    setModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-neutral-500" />
          <h1 className="text-xl font-bold text-neutral-900">Environmental Compliance</h1>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-lg bg-primary-600 text-white px-3 py-2 text-sm font-semibold hover:bg-primary-700 transition-colors">
          <Plus size={14} /> Log Reading
        </button>
      </div>

      {/* Active Alerts Banner */}
      {unresolvedAlerts.length > 0 && (
        <div className="rounded-lg bg-error-bg border border-error/20 px-4 py-3 space-y-1">
          <div className="flex items-center gap-2 font-bold text-error text-sm">
            <AlertTriangle size={16} />
            {unresolvedAlerts.length} active compliance alert{unresolvedAlerts.length > 1 ? 's' : ''}
          </div>
          {unresolvedAlerts.map(a => (
            <p key={a.id} className="text-xs text-error ml-6">{a.zone}: {a.message}</p>
          ))}
        </div>
      )}

      {/* EPA Permit Card */}
      <div className={CARD}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-neutral-400" />
            <p className="font-bold text-neutral-900">EPA Permit</p>
          </div>
          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', permit.status === 'VALID' ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error')}>
            {permit.status}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><p className={LABEL}>Permit No.</p><p className="text-sm font-mono text-neutral-700 mt-0.5">{permit.permitNumber}</p></div>
          <div><p className={LABEL}>Category</p><p className="text-sm text-neutral-700 mt-0.5">{permit.category}</p></div>
          <div><p className={LABEL}>Issued / Expiry</p><p className="text-sm font-mono tabular-nums text-neutral-700 mt-0.5">{permit.issuedDate} → {permit.expiryDate}</p></div>
          <div><p className={LABEL}>Next Inspection</p><p className="text-sm font-mono tabular-nums text-neutral-700 mt-0.5">{permit.nextInspection}</p></div>
        </div>
        <p className="text-xs text-neutral-400 mt-2">Inspector: {permit.inspector}</p>
      </div>

      {/* Zone Sensor Cards */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Zone Sensor Readings <span className="font-normal text-neutral-400">(mocked — static)</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sensors.map(s => {
            const style = STATUS_STYLE[s.status] ?? STATUS_STYLE.OK;
            return (
              <div key={s.zone} className={cn(CARD, 'border', style.border)}>
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-neutral-900">{s.zone}</p>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', style.badge)}>{s.status}</span>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-neutral-500"><Thermometer size={12} /> Temperature</span>
                      <span className="font-mono tabular-nums font-medium text-neutral-800">{s.tempC}°C</span>
                    </div>
                    <MiniBar value={s.tempC} max={SENSOR_THRESHOLDS.tempC.alert} status={s.tempC >= SENSOR_THRESHOLDS.tempC.alert ? 'ALERT' : s.tempC >= SENSOR_THRESHOLDS.tempC.warn ? 'WARN' : 'OK'} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-neutral-500"><Droplets size={12} /> Humidity</span>
                      <span className="font-mono tabular-nums font-medium text-neutral-800">{s.humidityPct}%</span>
                    </div>
                    <MiniBar value={s.humidityPct} max={SENSOR_THRESHOLDS.humidityPct.alert} status={s.humidityPct >= SENSOR_THRESHOLDS.humidityPct.alert ? 'ALERT' : s.humidityPct >= SENSOR_THRESHOLDS.humidityPct.warn ? 'WARN' : 'OK'} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-neutral-500"><Wind size={12} /> Air Quality</span>
                      <span className="font-mono tabular-nums font-medium text-neutral-800">{s.airQualityPpm} ppm</span>
                    </div>
                    <MiniBar value={s.airQualityPpm} max={SENSOR_THRESHOLDS.airQualityPpm.alert} status={s.airQualityPpm >= SENSOR_THRESHOLDS.airQualityPpm.alert ? 'ALERT' : s.airQualityPpm >= SENSOR_THRESHOLDS.airQualityPpm.warn ? 'WARN' : 'OK'} />
                  </div>
                </div>
                {(s.status === 'ALERT' || s.status === 'WARN') && (
                  <p className="mt-3 text-xs text-warning-text bg-warning-bg rounded-lg px-2.5 py-1.5">
                    {s.status === 'ALERT' ? 'Alert' : 'Warning'}: readings above threshold — check zone
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Compliance Alerts Table */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Compliance Alerts</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Type','Zone','Message','Severity','Raised At','Resolved'].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3 text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr key={a.id} className={cn('border-b border-neutral-50', i % 2 !== 0 && 'bg-neutral-50/30')}>
                  <td className="px-4 py-2.5 font-medium text-neutral-700">{a.type}</td>
                  <td className="px-4 py-2.5 text-neutral-600">{a.zone}</td>
                  <td className="px-4 py-2.5 text-neutral-600 max-w-[220px] text-xs">{a.message}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', SEV_STYLE[a.severity] ?? SEV_STYLE.LOW)}>{a.severity}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-xs text-neutral-500">{a.raisedAt.replace('T', ' ').substring(0, 16)}</td>
                  <td className="px-4 py-2.5">
                    {a.resolved
                      ? <span className="flex items-center gap-1 text-success-text text-xs font-bold"><CheckCircle size={12} /> Resolved</span>
                      : <span className="text-error text-xs font-bold">Open</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Wastewater Log */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Wastewater Log</h2>
        <div className={cn(CARD, 'p-0 overflow-hidden')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Date','Volume (L)','pH','Temp (°C)','Disposal Method','Compliant'].map(h => (
                  <th key={h} className={cn(LABEL, 'px-4 py-3 text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wastewater.map((row, i) => (
                <tr key={row.id} className={cn('border-b border-neutral-50', !row.compliant && 'bg-error-bg/20')}>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700">{row.date}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{row.volumeLitres.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-700 font-medium">{row.phLevel}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-neutral-600">{row.tempC}°C</td>
                  <td className="px-4 py-2.5 text-neutral-600">{row.disposalMethod}</td>
                  <td className="px-4 py-2.5">
                    {row.compliant
                      ? <span className="flex items-center gap-1 text-success-text font-bold text-xs"><CheckCircle size={12} /> Yes</span>
                      : (
                        <div>
                          <span className="flex items-center gap-1 text-error font-bold text-xs"><X size={12} /> No</span>
                          {row.nonCompliantReason && <p className="text-[10px] text-error/70 mt-0.5">{row.nonCompliantReason}</p>}
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Log Reading Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className={cn(CARD, 'w-full max-w-sm')}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-neutral-900">Log Sensor Reading</h2>
              <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={LABEL}>Zone</label>
                <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                  className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['Washing Floor','Drying Area','Ironing Station','Chemical Storage'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['Temp (°C)', 'tempC'], ['Humidity (%)', 'humidityPct'], ['Air (ppm)', 'airQualityPpm']].map(([lbl, key]) => (
                  <div key={key}>
                    <label className={LABEL}>{lbl}</label>
                    <input type="number" required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
