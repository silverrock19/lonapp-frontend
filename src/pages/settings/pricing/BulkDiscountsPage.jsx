import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Plus, Trash2, Pencil, Layers, AlertCircle, TrendingDown } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getDiscountsConfig, updateBulkTier, addBulkTier, removeBulkTier } from '../../../lib/mock/mockDiscounts.js';

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

const EMPTY_TIER = {
  name: '',
  discountBasis: 'item_count',
  minThreshold: 0,
  maxThreshold: null,
  discountType: 'percentage',
  discountValue: 0,
  appliesToRetail: true,
  appliesToCommercial: true,
  stackable: true,
  isActive: true,
};

const BASIS_LABELS = {
  item_count: 'Item Count',
  total_weight: 'Weight (kg)',
  order_value: 'Order Value (GH₵)',
};

function formatThreshold(tier) {
  const basis = tier.discountBasis;
  const unit = basis === 'item_count' ? 'items' : basis === 'total_weight' ? 'kg' : 'GH₵';
  const range = tier.maxThreshold ? `${tier.minThreshold} – ${tier.maxThreshold}` : `${tier.minThreshold}+`;
  return `${range} ${unit}`;
}

function buildPricingRows(tiers) {
  const itemTiers = tiers.filter(t => t.discountBasis === 'item_count' && t.isActive);
  itemTiers.sort((a, b) => a.minThreshold - b.minThreshold);

  const rows = [];
  const firstMin = itemTiers.length > 0 ? itemTiers[0].minThreshold : null;

  if (firstMin !== null && firstMin > 1) {
    rows.push({ label: `1–${firstMin - 1} items`, discount: 'No discount', example: 'GH₵ 200.00', save: null });
  } else if (firstMin === null) {
    rows.push({ label: '1+ items', discount: 'No discount', example: 'GH₵ 200.00', save: null });
  }

  itemTiers.forEach(t => {
    const label = t.maxThreshold ? `${t.minThreshold}–${t.maxThreshold} items` : `${t.minThreshold}+ items`;
    const sample = 200;
    const savedAmt = t.discountType === 'percentage' ? (sample * t.discountValue) / 100 : t.discountValue;
    const finalAmt = sample - savedAmt;
    const discLabel = t.discountType === 'percentage' ? `${t.discountValue}% off` : `GH₵ ${t.discountValue.toFixed(2)} off`;
    rows.push({
      label,
      discount: discLabel,
      example: `GH₵ ${finalAmt.toFixed(2)} (Save GH₵ ${savedAmt.toFixed(2)})`,
      save: savedAmt,
    });
  });

  return rows;
}

export default function BulkDiscountsPage() {
  const [tiers, setTiers] = useState(() => getDiscountsConfig().bulkTiers);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null);

  function refresh() {
    setTiers(getDiscountsConfig().bulkTiers);
  }

  function showToast() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDeleteTier(id) {
    removeBulkTier(id);
    refresh();
  }

  function handleToggleActive(tier) {
    updateBulkTier(tier.id, { isActive: !tier.isActive });
    refresh();
  }

  function updateField(key, value) {
    setModal(prev => ({ ...prev, tier: { ...prev.tier, [key]: value } }));
  }

  function handleSaveModal() {
    if (modal.mode === 'add') {
      addBulkTier(modal.tier);
    } else {
      updateBulkTier(modal.tier.id, modal.tier);
    }
    refresh();
    setModal(null);
    showToast();
  }

  const pricingRows = buildPricingRows(tiers);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/settings/pricing" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-neutral-800">Bulk Order Discounts</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary-500" />
            Bulk Order Discounts
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configure volume thresholds that automatically discount large orders.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', tier: { ...EMPTY_TIER } })}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Tier
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Tier Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Basis</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Threshold</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Applies To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Stackable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {tiers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-neutral-400">
                    No bulk discount tiers yet. Add one to get started.
                  </td>
                </tr>
              )}
              {tiers.map(tier => (
                <tr key={tier.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{tier.name}</div>
                    {tier.description && (
                      <div className="text-xs text-neutral-400 mt-0.5">{tier.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{BASIS_LABELS[tier.discountBasis]}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatThreshold(tier)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        tier.discountType === 'percentage'
                          ? 'bg-success/10 text-success'
                          : 'bg-primary-50 text-primary-700'
                      )}
                    >
                      {tier.discountValue}{tier.discountType === 'percentage' ? '%' : ' GH₵'} off
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {tier.appliesToRetail && (
                        <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">R</span>
                      )}
                      {tier.appliesToCommercial && (
                        <span className="rounded-full bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold text-accent-700">C</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {tier.stackable ? (
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">Stackable</span>
                    ) : (
                      <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-amber-700">Exclusive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle enabled={tier.isActive} onChange={() => handleToggleActive(tier)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ mode: 'edit', tier: { ...tier } })}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTier(tier.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-error/20 text-error hover:bg-error/5 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="border-b border-neutral-100 px-6 py-4 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary-500" />
          <h2 className="font-semibold text-neutral-800">Public Pricing Table — Item Count Tiers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Example (GH₵ 200 order)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pricingRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-sm text-neutral-400">
                    No item-count tiers configured.
                  </td>
                </tr>
              ) : (
                pricingRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="px-6 py-3 font-medium text-neutral-800">{row.label}</td>
                    <td className="px-6 py-3 text-neutral-600">{row.discount}</td>
                    <td className="px-6 py-3 font-mono tabular-nums text-neutral-700">{row.example}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-neutral-100 px-6 py-4">
          <div className="flex items-start gap-2 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              Next-tier incentive messages are shown to customers at checkout. Example: "Add 25 more items to unlock 10% off."
            </span>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-neutral-900">
                {modal.mode === 'add' ? 'Add Bulk Discount Tier' : 'Edit Tier'}
              </h2>
              <button onClick={() => setModal(null)} className="text-neutral-400 hover:text-neutral-700 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Tier Name *</label>
                <input
                  value={modal.tier.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="e.g. Small Bulk"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Discount Basis *</label>
                <select
                  value={modal.tier.discountBasis}
                  onChange={e => updateField('discountBasis', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                >
                  <option value="item_count">Item Count</option>
                  <option value="total_weight">Total Weight (kg)</option>
                  <option value="order_value">Order Value (GH₵)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Minimum *</label>
                  <input
                    type="number"
                    min="0"
                    value={modal.tier.minThreshold}
                    onChange={e => updateField('minThreshold', Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Maximum <span className="text-neutral-400">(leave blank for "and above")</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modal.tier.maxThreshold ?? ''}
                    onChange={e => updateField('maxThreshold', e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Discount Type *</label>
                  <select
                    value={modal.tier.discountType}
                    onChange={e => updateField('discountType', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat_amount">Flat Amount (GH₵)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Value *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max={modal.tier.discountType === 'percentage' ? 99 : undefined}
                      step={modal.tier.discountType === 'percentage' ? 1 : 0.5}
                      value={modal.tier.discountValue}
                      onChange={e => updateField('discountValue', Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                    />
                    <span className="text-sm text-neutral-500 w-6 flex-shrink-0">
                      {modal.tier.discountType === 'percentage' ? '%' : 'GH₵'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Applies To *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modal.tier.appliesToRetail}
                      onChange={e => updateField('appliesToRetail', e.target.checked)}
                      className="rounded"
                    />
                    Retail
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modal.tier.appliesToCommercial}
                      onChange={e => updateField('appliesToCommercial', e.target.checked)}
                      className="rounded"
                    />
                    Commercial
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Stackable with other discounts</p>
                  <p className="text-xs text-neutral-500">When off, no other discount applies after this tier</p>
                </div>
                <Toggle enabled={modal.tier.stackable} onChange={v => updateField('stackable', v)} />
              </div>

              {modal.tier.discountType === 'percentage' && modal.tier.discountValue > 0 && (
                <div className="rounded-lg bg-success/5 border border-success/20 px-4 py-2.5 text-xs text-neutral-600">
                  Preview: GH₵ 200.00 order →{' '}
                  <span className="font-semibold text-success">
                    -GH₵ {(200 * modal.tier.discountValue / 100).toFixed(2)}
                  </span>{' '}
                  → GH₵ {(200 - 200 * modal.tier.discountValue / 100).toFixed(2)}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-neutral-100 px-6 py-4 sticky bottom-0 bg-white">
              <button
                onClick={() => setModal(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                {modal.mode === 'add' ? 'Add Tier' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-6 right-6 bg-success text-white rounded-lg px-4 py-3 text-sm flex items-center gap-2 z-50 shadow-lg">
          <Check className="h-4 w-4" /> Saved
        </div>
      )}
    </div>
  );
}
