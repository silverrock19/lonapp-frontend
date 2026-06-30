import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Plus, Trash2, Pencil, Award, Users, TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getDiscountsConfig, updateLoyaltyTier, addLoyaltyTier, removeLoyaltyTier } from '../../../lib/mock/mockDiscounts.js';

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
  displayLabel: '',
  icon: '⭐',
  color: '#6366F1',
  qualificationType: 'order_count',
  minOrders: 1,
  minSpend: null,
  discountType: 'percentage',
  discountValue: 0,
  minOrderValue: 0,
  maxDiscountCap: null,
  stackableWithBulk: true,
  stackableWithPromos: false,
  isActive: true,
  evaluationPeriod: 'lifetime',
  autoUpgrade: true,
  memberCount: 0,
};

const STACKING_STEPS = [
  { step: '1', label: 'Customer Contract Pricing', desc: 'Negotiated rates (US-0136)', color: 'bg-purple-100 text-purple-700' },
  { step: '2', label: 'Bulk / Volume Discounts',   desc: 'Volume threshold tiers (US-0133)',  color: 'bg-primary-100 text-primary-700' },
  { step: '3', label: 'Promotional Codes',          desc: 'Time-limited campaigns (US-0135)', color: 'bg-warning/20 text-amber-700' },
  { step: '4', label: 'Loyalty Member Discount',    desc: 'Tier-based reward (this page)',    color: 'bg-success/15 text-success' },
];

export default function LoyaltyPricingPage() {
  const [tiers, setTiers] = useState(() => getDiscountsConfig().loyaltyTiers);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null);

  function refresh() {
    setTiers(getDiscountsConfig().loyaltyTiers);
  }

  function showToast() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateField(key, value) {
    setModal(prev => ({ ...prev, tier: { ...prev.tier, [key]: value } }));
  }

  function handleSaveModal() {
    if (modal.mode === 'add') {
      addLoyaltyTier(modal.tier);
    } else {
      updateLoyaltyTier(modal.tier.id, modal.tier);
    }
    refresh();
    setModal(null);
    showToast();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/settings/pricing" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-neutral-800">Loyalty Program Pricing</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary-500" />
            Loyalty Program Pricing
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Reward repeat customers with tier-based discounts. Tiers are applied after bulk discounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiers.map(t => (
          <div key={t.id} className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className="text-xs text-neutral-500">{t.displayLabel}</p>
              <p className="text-lg font-bold text-neutral-900">{t.memberCount ?? 0}</p>
              <p className="text-xs text-neutral-400">members</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tiers.map(tier => (
          <div
            key={tier.id}
            className="rounded-xl border-2 bg-white p-5"
            style={{ borderColor: tier.color + '40' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <h3 className="font-bold text-neutral-900">{tier.displayLabel}</h3>
                  <p className="text-xs text-neutral-500">{tier.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal({ mode: 'edit', tier: { ...tier } })}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <Toggle
                  enabled={tier.isActive}
                  onChange={v => {
                    updateLoyaltyTier(tier.id, { isActive: v });
                    setTiers(getDiscountsConfig().loyaltyTiers);
                  }}
                />
              </div>
            </div>

            <div className="rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: tier.color + '15' }}>
              <p className="text-2xl font-bold tabular-nums" style={{ color: tier.color }}>
                {tier.discountValue}{tier.discountType === 'percentage' ? '%' : ' GH₵'} off
              </p>
              {tier.maxDiscountCap && (
                <p className="text-xs text-neutral-500 mt-0.5">Capped at GH₵ {tier.maxDiscountCap.toFixed(2)}</p>
              )}
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Qualifies with</span>
                <span className="font-medium text-neutral-800">
                  {tier.qualificationType === 'order_count'
                    ? `${tier.minOrders}+ orders`
                    : `GH₵ ${tier.minSpend?.toLocaleString()} total spend`}
                </span>
              </div>
              {tier.minOrderValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Min order</span>
                  <span className="font-mono tabular-nums text-neutral-800">GH₵ {tier.minOrderValue.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Stack with bulk</span>
                <span className={cn('text-xs font-semibold', tier.stackableWithBulk ? 'text-success' : 'text-neutral-400')}>
                  {tier.stackableWithBulk ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Stack with promos</span>
                <span className={cn('text-xs font-semibold', tier.stackableWithPromos ? 'text-success' : 'text-neutral-400')}>
                  {tier.stackableWithPromos ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <button
          onClick={() => setModal({ mode: 'add', tier: { ...EMPTY_TIER } })}
          className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Custom Tier
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary-500" /> Discount Stacking Order
        </h2>
        <div className="space-y-2">
          {STACKING_STEPS.map(s => (
            <div key={s.step} className="flex items-center gap-3 text-sm">
              <span className={cn('flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold', s.color)}>
                {s.step}
              </span>
              <div>
                <span className="font-medium text-neutral-800">{s.label}</span>
                <span className="ml-2 text-xs text-neutral-400">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Each step only applies if the previous step's discount is stackable. A non-stackable discount ends the chain.
        </p>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-neutral-900">
                {modal.mode === 'add' ? 'Add Loyalty Tier' : 'Edit Tier'}
              </h2>
              <button onClick={() => setModal(null)} className="text-neutral-400 hover:text-neutral-700 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Display Label *</label>
                  <input
                    value={modal.tier.displayLabel}
                    onChange={e => updateField('displayLabel', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="e.g. Gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Icon (emoji)</label>
                  <input
                    value={modal.tier.icon}
                    onChange={e => updateField('icon', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="🥇"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={modal.tier.color}
                      onChange={e => updateField('color', e.target.value)}
                      className="h-9 w-14 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                    />
                    <span className="text-sm font-mono text-neutral-500">{modal.tier.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Qualification Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="qualificationType"
                      value="order_count"
                      checked={modal.tier.qualificationType === 'order_count'}
                      onChange={() => updateField('qualificationType', 'order_count')}
                    />
                    Order Count
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="qualificationType"
                      value="total_spend"
                      checked={modal.tier.qualificationType === 'total_spend'}
                      onChange={() => updateField('qualificationType', 'total_spend')}
                    />
                    Total Spend
                  </label>
                </div>
              </div>

              {modal.tier.qualificationType === 'order_count' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Minimum Orders *</label>
                  <input
                    type="number"
                    min="1"
                    value={modal.tier.minOrders ?? ''}
                    onChange={e => updateField('minOrders', Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              )}

              {modal.tier.qualificationType === 'total_spend' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Minimum Spend (GH₵) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={modal.tier.minSpend ?? ''}
                    onChange={e => updateField('minSpend', e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Discount Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="discountType"
                      value="percentage"
                      checked={modal.tier.discountType === 'percentage'}
                      onChange={() => updateField('discountType', 'percentage')}
                    />
                    Percentage (%)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="discountType"
                      value="fixed_amount"
                      checked={modal.tier.discountType === 'fixed_amount'}
                      onChange={() => updateField('discountType', 'fixed_amount')}
                    />
                    Fixed Amount (GH₵)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Discount Value *{' '}
                  <span className="text-neutral-400 font-normal">
                    ({modal.tier.discountType === 'percentage' ? '%' : 'GH₵'})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={modal.tier.discountType === 'percentage' ? 99 : undefined}
                  step={modal.tier.discountType === 'percentage' ? 1 : 0.5}
                  value={modal.tier.discountValue}
                  onChange={e => updateField('discountValue', Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Min Order Value (GH₵) <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={modal.tier.minOrderValue ?? ''}
                    onChange={e => updateField('minOrderValue', e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Max Discount Cap (GH₵) <span className="text-neutral-400 font-normal">(leave blank for no cap)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={modal.tier.maxDiscountCap ?? ''}
                    onChange={e => updateField('maxDiscountCap', e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Stackable with bulk discounts</p>
                    <p className="text-xs text-neutral-500">Apply loyalty discount on top of bulk tier discounts</p>
                  </div>
                  <Toggle enabled={modal.tier.stackableWithBulk} onChange={v => updateField('stackableWithBulk', v)} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Stackable with promotional codes</p>
                    <p className="text-xs text-neutral-500">Apply loyalty discount alongside active promo codes</p>
                  </div>
                  <Toggle enabled={modal.tier.stackableWithPromos} onChange={v => updateField('stackableWithPromos', v)} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Active</p>
                    <p className="text-xs text-neutral-500">Disable to pause this loyalty tier without deleting it</p>
                  </div>
                  <Toggle enabled={modal.tier.isActive} onChange={v => updateField('isActive', v)} />
                </div>
              </div>

              {modal.tier.discountType === 'percentage' && modal.tier.discountValue > 0 && (
                <div className="rounded-lg bg-success/5 border border-success/20 px-4 py-2.5 text-xs text-neutral-600">
                  Preview: GH₵ 200.00 order →{' '}
                  <span className="font-semibold text-success">
                    -GH₵ {(200 * modal.tier.discountValue / 100).toFixed(2)}
                  </span>{' '}
                  → GH₵ {(200 - 200 * modal.tier.discountValue / 100).toFixed(2)}
                  {modal.tier.maxDiscountCap && (200 * modal.tier.discountValue / 100) > modal.tier.maxDiscountCap && (
                    <span className="text-amber-600"> (capped at GH₵ {modal.tier.maxDiscountCap.toFixed(2)})</span>
                  )}
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
