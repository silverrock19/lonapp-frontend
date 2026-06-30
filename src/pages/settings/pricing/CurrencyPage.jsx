import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Globe2, Plus, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateCurrency, addCurrency, updateMobileMoneyRounding } from '../../../lib/mock/mockPricing.js';

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

const roundingOptions = [
  { value: 0, label: 'No rounding' },
  { value: 0.5, label: 'Nearest 50p' },
  { value: 1, label: 'Nearest GH₵ 1' },
  { value: 5, label: 'Nearest GH₵ 5' },
];

export default function CurrencyPage() {
  const [currencies, setCurrencies] = useState(() => getPricingConfig().currencies);
  const [rounding, setRounding] = useState(() => getPricingConfig().mobileMoneyRounding);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCurr, setNewCurr] = useState({ code: '', name: '', symbol: '', rate: '' });

  function handleAddCurrency() {
    if (!newCurr.code || !newCurr.name || !newCurr.symbol || !newCurr.rate) return;
    addCurrency({
      code: newCurr.code,
      name: newCurr.name,
      symbol: newCurr.symbol,
      rate: Number(newCurr.rate),
      enabled: true,
    });
    setCurrencies(getPricingConfig().currencies);
    setNewCurr({ code: '', name: '', symbol: '', rate: '' });
    setShowAddForm(false);
  }

  function handleSave() {
    currencies.forEach(c => {
      if (!c.isBase) {
        updateCurrency(c.code, { rate: c.rate, enabled: c.enabled });
      }
    });
    updateMobileMoneyRounding(rounding);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Multi-Currency</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Multi-Currency</h1>
          <p className="mt-1 text-small text-neutral-500">
            Manage exchange rates and mobile money rounding for supported currencies.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-small font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-neutral-900">Supported Currencies</h2>
            <p className="text-xs text-neutral-500 mt-0.5">GH₵ (GHS) is the base currency and cannot be disabled</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Currency
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Currency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Symbol</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Rate (per GH₵)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map(c => (
                <tr key={c.code} className={cn('border-b border-neutral-50', c.isBase && 'bg-primary-50/30')}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-800">{c.name}</span>
                    {c.isBase && (
                      <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                        Base
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-700">{c.code}</td>
                  <td className="px-4 py-3 font-mono text-neutral-700">{c.symbol}</td>
                  <td className="px-4 py-3 text-right">
                    {c.isBase ? (
                      <span className="font-mono tabular-nums text-neutral-400">1.000000</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        step="0.000001"
                        value={c.rate}
                        onChange={e =>
                          setCurrencies(prev =>
                            prev.map(x => (x.code === c.code ? { ...x, rate: Number(e.target.value) } : x))
                          )
                        }
                        className="w-28 rounded border border-neutral-200 px-2 py-1 text-right font-mono tabular-nums text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.isBase ? (
                      <span className="text-xs text-neutral-400">—</span>
                    ) : (
                      <Toggle
                        enabled={c.enabled}
                        onChange={v =>
                          setCurrencies(prev =>
                            prev.map(x => (x.code === c.code ? { ...x, enabled: v } : x))
                          )
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <div className="border-t border-neutral-200 p-4 bg-neutral-50/50">
            <p className="text-xs font-semibold text-neutral-700 mb-3">Add Currency</p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Code</label>
                <input
                  value={newCurr.code}
                  onChange={e => setNewCurr(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  maxLength={3}
                  placeholder="USD"
                  className="block w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Name</label>
                <input
                  value={newCurr.name}
                  onChange={e => setNewCurr(p => ({ ...p, name: e.target.value }))}
                  placeholder="US Dollar"
                  className="block w-36 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Symbol</label>
                <input
                  value={newCurr.symbol}
                  onChange={e => setNewCurr(p => ({ ...p, symbol: e.target.value }))}
                  placeholder="$"
                  className="block w-16 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Rate per GH₵</label>
                <input
                  type="number"
                  min="0"
                  step="0.000001"
                  value={newCurr.rate}
                  onChange={e => setNewCurr(p => ({ ...p, rate: e.target.value }))}
                  placeholder="0.066"
                  className="block w-28 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm tabular-nums font-mono focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <button
                onClick={handleAddCurrency}
                className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t border-neutral-50 bg-neutral-50/30 flex items-start gap-2 rounded-b-xl">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-500">
            Exchange rates are applied at checkout. Rates are set manually — enable auto-update via a payment provider integration.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-semibold text-neutral-900 mb-1">Mobile Money Rounding</h2>
        <p className="text-xs text-neutral-500 mb-4">
          Applied when customers pay via MTN MoMo, Vodafone Cash, or AirtelTigo Money
        </p>
        <div className="flex flex-wrap gap-3">
          {roundingOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRounding(opt.value)}
              className={cn(
                'rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors',
                rounding === opt.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {rounding > 0 && (
          <div className="mt-4 rounded-lg bg-neutral-50 px-4 py-2.5 text-xs text-neutral-600">
            Sample: GH₵ 47.30 →
            <span className="ml-1 font-semibold text-neutral-800">
              GH₵ {(Math.ceil(47.30 / rounding) * rounding).toFixed(2)} (rounded up)
            </span>
          </div>
        )}
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white shadow-lg z-50">
          <Check className="h-4 w-4" /> Changes saved
        </div>
      )}
    </div>
  );
}
