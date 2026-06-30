import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Scale, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateWeightTier, addWeightTier, removeWeightTier } from '../../../lib/mock/mockPricing.js';

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

export default function PerWeightPricingPage() {
  const [tiers, setTiers] = useState(() => getPricingConfig().weightTiers);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTier, setNewTier] = useState({ minKg: '', maxKg: '', retailPerKg: '', commercialPerKg: '' });

  function handleFieldChange(id, field, value) {
    setTiers(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: field === 'enabled' ? value : Number(value) } : t))
    );
  }

  function handleToggle(id, enabled) {
    setTiers(prev => prev.map(t => (t.id === id ? { ...t, enabled } : t)));
  }

  function handleDelete(id) {
    if (tiers.length <= 1) return;
    removeWeightTier(id);
    setTiers(getPricingConfig().weightTiers);
  }

  function handleAddTier() {
    if (!newTier.minKg || !newTier.retailPerKg || !newTier.commercialPerKg) return;
    addWeightTier({
      minKg: Number(newTier.minKg),
      maxKg: newTier.maxKg !== '' ? Number(newTier.maxKg) : null,
      retailPerKg: Number(newTier.retailPerKg),
      commercialPerKg: Number(newTier.commercialPerKg),
      enabled: true,
    });
    setTiers(getPricingConfig().weightTiers);
    setNewTier({ minKg: '', maxKg: '', retailPerKg: '', commercialPerKg: '' });
    setShowAddForm(false);
  }

  function handleSave() {
    tiers.forEach(t => {
      updateWeightTier(t.id, {
        retailPerKg: t.retailPerKg,
        commercialPerKg: t.commercialPerKg,
        enabled: t.enabled,
      });
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass =
    'w-24 rounded border border-neutral-200 px-2 py-1 text-right font-mono tabular-nums text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const addInputClass =
    'mt-1 block rounded-lg border border-neutral-200 px-2 py-1.5 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Weight Pricing</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Weight Pricing</h1>
          <p className="mt-1 text-small text-neutral-500">
            Define tiered per-kg rates for weight-based laundry orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-small font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Tier
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-small font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Weight Range</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Retail (GH₵/kg)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Commercial (GH₵/kg)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">Enabled</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map(tier => (
                <tr key={tier.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Scale className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="font-medium text-neutral-800">
                        {tier.minKg} – {tier.maxKg != null ? `${tier.maxKg}` : '∞'} kg
                      </span>
                    </div>
                    <p className="ml-5.5 text-xs text-neutral-400">{tier.label}</p>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.50"
                      value={tier.retailPerKg}
                      onChange={e => handleFieldChange(tier.id, 'retailPerKg', e.target.value)}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.50"
                      value={tier.commercialPerKg}
                      onChange={e => handleFieldChange(tier.id, 'commercialPerKg', e.target.value)}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Toggle enabled={tier.enabled} onChange={v => handleToggle(tier.id, v)} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(tier.id)}
                      disabled={tiers.length <= 1}
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-neutral-400 hover:text-error hover:bg-error/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <div className="border-t border-neutral-100 p-4 bg-neutral-50/50">
            <p className="text-xs font-semibold text-neutral-700 mb-3">New Weight Tier</p>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Min kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newTier.minKg}
                  onChange={e => setNewTier(p => ({ ...p, minKg: e.target.value }))}
                  placeholder="0"
                  className={cn(addInputClass, 'w-20')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Max kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newTier.maxKg}
                  onChange={e => setNewTier(p => ({ ...p, maxKg: e.target.value }))}
                  placeholder="Leave empty for ∞"
                  className={cn(addInputClass, 'w-36')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Retail GH₵/kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={newTier.retailPerKg}
                  onChange={e => setNewTier(p => ({ ...p, retailPerKg: e.target.value }))}
                  placeholder="0.00"
                  className={cn(addInputClass, 'w-28')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Commercial GH₵/kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={newTier.commercialPerKg}
                  onChange={e => setNewTier(p => ({ ...p, commercialPerKg: e.target.value }))}
                  placeholder="0.00"
                  className={cn(addInputClass, 'w-28')}
                />
              </div>
              <button
                onClick={handleAddTier}
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

        <div className="border-t border-neutral-100 px-6 py-3 bg-neutral-50/50 rounded-b-xl">
          <p className="text-xs text-neutral-500">
            Weight pricing applies when the order is submitted as a per-weight service. Item-level pricing takes precedence for standard services.
          </p>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white shadow-lg z-50">
          <Check className="h-4 w-4" /> Changes saved
        </div>
      )}
    </div>
  );
}
