import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Timer, Zap, Clock } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateTurnaroundOption } from '../../../lib/mock/mockPricing.js';

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-primary-600' : 'bg-neutral-200'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function getIcon(badge) {
  if (!badge) return <Clock className="h-5 w-5 text-amber-600" />;
  const lower = badge.toLowerCase();
  if (lower.includes('express')) return <Zap className="h-5 w-5 text-amber-600" />;
  if (lower.includes('same') || lower.includes('day')) return <Timer className="h-5 w-5 text-amber-600" />;
  return <Clock className="h-5 w-5 text-amber-600" />;
}

export default function TurnaroundPricingPage() {
  const [options, setOptions] = useState(() => getPricingConfig().turnaround);
  const [saved, setSaved] = useState(false);

  function handleFieldChange(id, field, value) {
    setOptions(prev =>
      prev.map(o => (o.id === id ? { ...o, [field]: value } : o))
    );
  }

  function handleRateChange(id, rate) {
    setOptions(prev =>
      prev.map(o => (o.id === id ? { ...o, surchargeRate: rate } : o))
    );
  }

  function handleSave() {
    options.forEach(o => {
      updateTurnaroundOption(o.id, {
        enabled: o.enabled,
        turnaroundDays: o.turnaroundDays,
        method: o.method,
        surchargeRate: o.surchargeRate,
        flatSurcharge: o.flatSurcharge,
      });
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Turnaround & Surcharges</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Turnaround & Surcharges</h1>
          <p className="mt-1 text-small text-neutral-500">
            Configure Standard, Express, and Same-Day turnaround options and their surcharges.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-small font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="space-y-4">
        {options.map(option => (
          <div key={option.id} className="border border-neutral-200 rounded-xl p-5 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  {getIcon(option.badge)}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{option.label}</h3>
                  <span className="text-xs text-neutral-500">{option.badge}</span>
                </div>
              </div>
              <Toggle
                enabled={option.enabled}
                onChange={v => handleFieldChange(option.id, 'enabled', v)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-600">Turnaround (days)</label>
                <input
                  type="number"
                  min="0"
                  value={option.turnaroundDays}
                  onChange={e => handleFieldChange(option.id, 'turnaroundDays', Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Surcharge Method</label>
                <select
                  value={option.method}
                  onChange={e => handleFieldChange(option.id, 'method', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                >
                  <option value="none">No surcharge</option>
                  <option value="percentage">Percentage of subtotal</option>
                  <option value="flat">Flat fee (GH₵)</option>
                </select>
              </div>

              {option.method === 'percentage' && (
                <div>
                  <label className="text-xs font-medium text-neutral-600">Surcharge Rate (%)</label>
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="5"
                      value={Math.round(option.surchargeRate * 100)}
                      onChange={e => handleRateChange(option.id, Number(e.target.value) / 100)}
                      className="w-20 rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                    />
                    <span className="text-sm text-neutral-500">%</span>
                  </div>
                </div>
              )}

              {option.method === 'flat' && (
                <div>
                  <label className="text-xs font-medium text-neutral-600">Flat Surcharge (GH₵)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={option.flatSurcharge ?? 0}
                    onChange={e => handleFieldChange(option.id, 'flatSurcharge', Number(e.target.value))}
                    className="mt-1 w-28 rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {option.method !== 'none' && (
              <div className="mt-3 rounded-lg bg-neutral-50 px-4 py-2.5 text-xs text-neutral-600">
                Sample: GH₵ 100.00 order →
                <span className="ml-1 font-semibold text-neutral-800">
                  {option.method === 'percentage'
                    ? `+GH₵ ${(100 * option.surchargeRate).toFixed(2)} surcharge`
                    : `+GH₵ ${(option.flatSurcharge ?? 0).toFixed(2)} flat fee`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white shadow-lg z-50">
          <Check className="h-4 w-4" /> Changes saved
        </div>
      )}
    </div>
  );
}
