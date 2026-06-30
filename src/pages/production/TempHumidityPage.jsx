import { useState } from 'react';
import { Thermometer, Droplets, Wind, RefreshCw, AlertTriangle } from 'lucide-react';
import { getAllSensorReadings, SENSOR_THRESHOLDS } from '../../lib/mock/mockEnvironmental.js';
import { cn } from '../../utils/classNames.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const STATUS_STYLE = {
  OK:    { badge: 'bg-success-bg text-success-text', border: 'border-neutral-100', bar: 'bg-success' },
  WARN:  { badge: 'bg-warning-bg text-warning-text', border: 'border-warning/30',  bar: 'bg-warning' },
  ALERT: { badge: 'bg-error-bg text-error',          border: 'border-error/40',    bar: 'bg-error' },
};

const MetricBar = ({ value, warn, alert }) => {
  const pct = Math.min((value / alert) * 100, 100);
  const color = value >= alert ? 'bg-error' : value >= warn ? 'bg-warning' : 'bg-success';
  return (
    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden mt-1">
      <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
    </div>
  );
};

const Metric = ({ icon: Icon, label, value, unit, warn, alert }) => (
  <div>
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-neutral-500">
        <Icon size={13} /> {label}
      </span>
      <span className="font-mono tabular-nums font-bold text-neutral-800">{value}{unit}</span>
    </div>
    <MetricBar value={value} warn={warn} alert={alert} />
  </div>
);

export default function TempHumidityPage() {
  const sensors = getAllSensorReadings();
  const [lastRefresh] = useState('10:30 AM');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer size={20} className="text-neutral-500" />
          <h1 className="text-xl font-bold text-neutral-900">Temperature & Humidity Monitor</h1>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors">
          <RefreshCw size={14} /> Refresh
          <span className="ml-1 text-neutral-400 text-xs">Last updated: {lastRefresh}</span>
        </button>
      </div>

      {/* Zone Cards 2×2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sensors.map(s => {
          const style = STATUS_STYLE[s.status] ?? STATUS_STYLE.OK;
          return (
            <div key={s.zone} className={cn(CARD, 'border', style.border)}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-base font-bold text-neutral-900">{s.zone}</p>
                <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', style.badge)}>{s.status}</span>
              </div>

              <div className="space-y-3">
                <Metric
                  icon={Thermometer} label="Temperature" value={s.tempC} unit="°C"
                  warn={SENSOR_THRESHOLDS.tempC.warn} alert={SENSOR_THRESHOLDS.tempC.alert}
                />
                <Metric
                  icon={Droplets} label="Humidity" value={s.humidityPct} unit="%"
                  warn={SENSOR_THRESHOLDS.humidityPct.warn} alert={SENSOR_THRESHOLDS.humidityPct.alert}
                />
                <Metric
                  icon={Wind} label="Air Quality" value={s.airQualityPpm} unit=" ppm"
                  warn={SENSOR_THRESHOLDS.airQualityPpm.warn} alert={SENSOR_THRESHOLDS.airQualityPpm.alert}
                />
              </div>

              {(s.status === 'ALERT' || s.status === 'WARN') && (
                <div className={cn('mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs font-medium',
                  s.status === 'ALERT' ? 'bg-error-bg text-error' : 'bg-warning-bg text-warning-text')}>
                  <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                  {s.status === 'ALERT'
                    ? 'Alert: one or more readings above critical threshold — immediate action required'
                    : 'Warning: one or more readings above warning threshold — monitor closely'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Threshold Reference */}
      <section>
        <h2 className="text-sm font-bold text-neutral-700 mb-3">Threshold Reference</h2>
        <div className={CARD}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className={cn(LABEL, 'pb-2 text-left')}>Metric</th>
                <th className={cn(LABEL, 'pb-2 text-left')}>Warning Threshold</th>
                <th className={cn(LABEL, 'pb-2 text-left')}>Alert Threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              <tr>
                <td className="py-2.5 flex items-center gap-1.5 text-neutral-700"><Thermometer size={13} className="text-neutral-400" /> Temperature</td>
                <td className="py-2.5 font-mono tabular-nums text-warning-text font-medium">≥ {SENSOR_THRESHOLDS.tempC.warn}°C</td>
                <td className="py-2.5 font-mono tabular-nums text-error font-medium">≥ {SENSOR_THRESHOLDS.tempC.alert}°C</td>
              </tr>
              <tr>
                <td className="py-2.5 flex items-center gap-1.5 text-neutral-700"><Droplets size={13} className="text-neutral-400" /> Humidity</td>
                <td className="py-2.5 font-mono tabular-nums text-warning-text font-medium">≥ {SENSOR_THRESHOLDS.humidityPct.warn}%</td>
                <td className="py-2.5 font-mono tabular-nums text-error font-medium">≥ {SENSOR_THRESHOLDS.humidityPct.alert}%</td>
              </tr>
              <tr>
                <td className="py-2.5 flex items-center gap-1.5 text-neutral-700"><Wind size={13} className="text-neutral-400" /> Air Quality</td>
                <td className="py-2.5 font-mono tabular-nums text-warning-text font-medium">≥ {SENSOR_THRESHOLDS.airQualityPpm.warn} ppm</td>
                <td className="py-2.5 font-mono tabular-nums text-error font-medium">≥ {SENSOR_THRESHOLDS.airQualityPpm.alert} ppm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
