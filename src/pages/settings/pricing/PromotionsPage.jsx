import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Plus, Ticket, Clock, Check, X, Users,
  Pencil, Trash2, BarChart2, Zap, Calendar,
} from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import {
  getDiscountsConfig, addPromotion, updatePromotion, removePromotion,
} from '../../../lib/mock/mockDiscounts.js';

function Toggle({ enabled, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={cn('relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', enabled ? 'bg-primary-600' : 'bg-neutral-200')}>
      <span className={cn('pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', enabled ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  );
}

const STATUS_COLORS = {
  active:      'bg-success/10 text-success',
  scheduled:   'bg-primary-50 text-primary-700',
  expired:     'bg-neutral-100 text-neutral-500',
  deactivated: 'bg-error/10 text-error',
  draft:       'bg-warning/10 text-amber-700',
};

const EMPTY_PROMO = {
  name: '',
  publicDisplayName: '',
  promoCode: '',
  autoApply: false,
  discountType: 'percentage',
  discountValue: 10,
  maxDiscountCap: '',
  minOrderValue: 0,
  startDate: '',
  endDate: '',
  totalRedemptionLimit: '',
  perCustomerLimit: 1,
  eligibleCustomers: 'all',
  stackableWithLoyalty: false,
  stackableWithBulk: false,
  marketingMessage: '',
  status: 'draft',
};

export default function PromotionsPage() {
  const [promos, setPromos] = useState(() => getDiscountsConfig().promotions);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);

  const visible = filter === 'all' ? promos : promos.filter(p => p.status === filter);

  function openAdd() {
    setModal({ mode: 'add', promo: { ...EMPTY_PROMO } });
  }

  function openEdit(promo) {
    setModal({ mode: 'edit', promo: { ...promo } });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSaveModal() {
    if (modal.mode === 'add') {
      addPromotion(modal.promo);
    } else {
      updatePromotion(modal.promo.id, modal.promo);
    }
    setPromos(getDiscountsConfig().promotions);
    closeModal();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleToggleStatus(promo) {
    updatePromotion(promo.id, { status: promo.status === 'active' ? 'deactivated' : 'active' });
    setPromos(getDiscountsConfig().promotions);
  }

  function setPromoField(key, value) {
    setModal(m => ({ ...m, promo: { ...m.promo, [key]: value } }));
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <Link to="/services" className="hover:text-neutral-700">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Promotions & Coupons</span>
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Promotions & Coupons</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Time-limited campaigns and coupon codes applied before loyalty discounts.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Promotion
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 w-fit">
        {[
          { key: 'all',       label: 'All',       count: promos.length },
          { key: 'active',    label: 'Active',    count: promos.filter(p => p.status === 'active').length },
          { key: 'scheduled', label: 'Scheduled', count: promos.filter(p => p.status === 'scheduled').length },
          { key: 'expired',   label: 'Expired',   count: promos.filter(p => p.status === 'expired').length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === tab.key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700')}>
            {tab.label}
            <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold',
              filter === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600')}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Promotions list */}
      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Ticket className="h-10 w-10 text-neutral-300 mb-3" />
            <p className="font-semibold text-neutral-500">No {filter === 'all' ? '' : filter} promotions</p>
            <p className="text-sm text-neutral-400 mt-1">
              {filter === 'all' ? 'Create your first promotion to get started.' : `No promotions with status "${filter}" yet.`}
            </p>
          </div>
        ) : (
          visible.map(promo => (
            <div key={promo.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-warning/10 text-lg">
                    <Ticket className="h-4.5 w-4.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral-900">{promo.publicDisplayName}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', STATUS_COLORS[promo.status])}>
                        {promo.status}
                      </span>
                      {promo.promoCode && (
                        <code className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-mono font-semibold text-neutral-700">
                          {promo.promoCode}
                        </code>
                      )}
                      {promo.autoApply && (
                        <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700 flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5" /> Auto-Apply
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500 truncate">{promo.marketingMessage}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {promo.startDate}{promo.endDate ? ` – ${promo.endDate}` : ' (no end)'}
                      </span>
                      {promo.minOrderValue > 0 && (
                        <span className="font-mono tabular-nums">Min GH₵ {promo.minOrderValue.toFixed(0)}</span>
                      )}
                      {promo.eligibleCustomers !== 'all' && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {promo.eligibleCustomers === 'new_only' ? 'New customers only' : 'Existing customers only'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Discount amount */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xl font-bold tabular-nums text-success font-mono">
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}%`
                      : `GH₵ ${promo.discountValue.toFixed(2)}`
                    }{' '}off
                  </p>
                  {promo.maxDiscountCap && (
                    <p className="text-xs text-neutral-400 font-mono tabular-nums">cap GH₵ {promo.maxDiscountCap.toFixed(2)}</p>
                  )}
                </div>
              </div>

              {/* Metrics bar */}
              <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-3">
                <div className="flex gap-4 text-xs text-neutral-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <BarChart2 className="h-3 w-3" />
                    {promo.redemptionCount} redeemed{promo.totalRedemptionLimit ? ` / ${promo.totalRedemptionLimit}` : ''}
                  </span>
                  {promo.totalRedemptionLimit && (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${Math.min(100, (promo.redemptionCount / promo.totalRedemptionLimit) * 100)}%` }}
                        />
                      </div>
                      <span>{Math.round((promo.redemptionCount / promo.totalRedemptionLimit) * 100)}%</span>
                    </div>
                  )}
                  <span>
                    1 per customer{promo.perCustomerLimit > 1 ? ` (max ${promo.perCustomerLimit})` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(promo)}
                    className="flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(promo)}
                    className={cn('flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                      promo.status === 'active'
                        ? 'border-error/20 text-error hover:bg-error/5'
                        : 'border-success/20 text-success hover:bg-success/5')}
                  >
                    {promo.status === 'active'
                      ? <><X className="h-3 w-3" /> Deactivate</>
                      : <><Check className="h-3 w-3" /> Activate</>
                    }
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">
                {modal.mode === 'add' ? 'Create Promotion' : 'Edit Promotion'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Promotion Name *</label>
                  <input
                    type="text"
                    value={modal.promo.name}
                    onChange={e => setPromoField('name', e.target.value)}
                    placeholder="e.g. Mid-Year Flash Sale"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Public Display Name *</label>
                  <input
                    type="text"
                    value={modal.promo.publicDisplayName}
                    onChange={e => setPromoField('publicDisplayName', e.target.value)}
                    placeholder="e.g. ⚡ Flash Sale"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Promo code + auto-apply */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={modal.promo.promoCode ?? ''}
                    onChange={e => setPromoField('promoCode', e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER20 — leave blank for automatic"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                {!modal.promo.promoCode && (
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                    <span className="text-sm text-neutral-700">Auto-Apply</span>
                    <Toggle enabled={modal.promo.autoApply} onChange={v => setPromoField('autoApply', v)} />
                  </div>
                )}
              </div>

              {/* Discount type + value */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-2">Discount Type</label>
                <div className="flex gap-3">
                  {['percentage', 'flat_amount'].map(dt => (
                    <label key={dt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discountType"
                        value={dt}
                        checked={modal.promo.discountType === dt}
                        onChange={() => setPromoField('discountType', dt)}
                        className="accent-primary-600"
                      />
                      <span className="text-sm text-neutral-700">{dt === 'percentage' ? 'Percentage (%)' : 'Flat Amount (GH₵)'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Discount Value {modal.promo.discountType === 'percentage' ? '(%)' : '(GH₵)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modal.promo.discountValue}
                    onChange={e => setPromoField('discountValue', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Max Discount Cap (GH₵, optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={modal.promo.maxDiscountCap ?? ''}
                    onChange={e => setPromoField('maxDiscountCap', e.target.value === '' ? null : parseFloat(e.target.value))}
                    placeholder="No cap"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Min Order Value (GH₵)</label>
                  <input
                    type="number"
                    min="0"
                    value={modal.promo.minOrderValue}
                    onChange={e => setPromoField('minOrderValue', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={modal.promo.startDate}
                    onChange={e => setPromoField('startDate', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">End Date (optional)</label>
                  <input
                    type="date"
                    value={modal.promo.endDate ?? ''}
                    onChange={e => setPromoField('endDate', e.target.value || null)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Redemption limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Total Redemption Limit (optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={modal.promo.totalRedemptionLimit ?? ''}
                    onChange={e => setPromoField('totalRedemptionLimit', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                    placeholder="Unlimited"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Per Customer Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={modal.promo.perCustomerLimit}
                    onChange={e => setPromoField('perCustomerLimit', parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Eligible customers */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Eligible Customers</label>
                <select
                  value={modal.promo.eligibleCustomers}
                  onChange={e => setPromoField('eligibleCustomers', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="all">All customers</option>
                  <option value="new_only">New customers only</option>
                  <option value="existing_only">Existing customers only</option>
                </select>
              </div>

              {/* Stacking */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stacking Rules</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Stackable with Loyalty discounts</span>
                  <Toggle enabled={modal.promo.stackableWithLoyalty} onChange={v => setPromoField('stackableWithLoyalty', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Stackable with Bulk discounts</span>
                  <Toggle enabled={modal.promo.stackableWithBulk} onChange={v => setPromoField('stackableWithBulk', v)} />
                </div>
              </div>

              {/* Marketing message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Marketing Message (optional)</label>
                <textarea
                  value={modal.promo.marketingMessage}
                  onChange={e => setPromoField('marketingMessage', e.target.value)}
                  rows={2}
                  placeholder="Shown to customers when the promo is applied..."
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Status</label>
                <select
                  value={modal.promo.status}
                  onChange={e => setPromoField('status', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100">
              <button onClick={closeModal} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={!modal.promo.name || !modal.promo.publicDisplayName || !modal.promo.startDate}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {modal.mode === 'add' ? 'Create Promotion' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-success text-white rounded-lg px-4 py-3 text-sm flex items-center gap-2 z-50 shadow-lg">
          <Check className="h-4 w-4" />
          Promotion saved
        </div>
      )}
    </div>
  );
}
