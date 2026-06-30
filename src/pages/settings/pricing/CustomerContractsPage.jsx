import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Plus, FileText, Clock, AlertTriangle, Check,
  Building2, Pencil, Trash2, ChevronDown, X,
} from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import {
  getDiscountsConfig, addContract, updateContract, removeContract,
} from '../../../lib/mock/mockDiscounts.js';

function Toggle({ enabled, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={cn('relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', enabled ? 'bg-primary-600' : 'bg-neutral-200')}>
      <span className={cn('pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', enabled ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  );
}

const AGREEMENT_TYPE_COLORS = {
  contract:   'bg-primary-50 text-primary-700',
  vip:        'bg-purple-50 text-purple-700',
  negotiated: 'bg-accent-50 text-accent-700',
  family:     'bg-rose-50 text-rose-700',
};

const EMPTY_CONTRACT = {
  customerName: '',
  customerId: '',
  agreementName: '',
  agreementType: 'contract',
  effectiveDate: '',
  expirationDate: '',
  autoRenew: false,
  pricingOverrideType: 'percentage_discount',
  discountPercentage: 10,
  visibility: 'show_discount',
  stackableWithPromos: false,
  stackableWithLoyalty: false,
  status: 'draft',
  monthlyOrders: 0,
  monthlyRevenue: 0,
  rateCard: null,
};

export default function CustomerContractsPage() {
  const [contracts, setContracts] = useState(() => getDiscountsConfig().contracts);
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const expiringCount = contracts.filter(
    c => c.status === 'active' && c.expirationDate && c.expirationDate <= in30 && c.expirationDate >= today
  ).length;

  const totalMonthlySavings = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.monthlyRevenue * (c.discountPercentage || 0) / 100), 0);

  function openAdd() {
    setModal({ mode: 'add', contract: { ...EMPTY_CONTRACT } });
  }

  function openEdit(contract) {
    setModal({ mode: 'edit', contract: { ...contract } });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSaveModal() {
    if (modal.mode === 'add') {
      addContract(modal.contract);
    } else {
      updateContract(modal.contract.id, modal.contract);
    }
    setContracts(getDiscountsConfig().contracts);
    closeModal();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function setContractField(key, value) {
    setModal(m => ({ ...m, contract: { ...m.contract, [key]: value } }));
  }

  function handleRemove(id) {
    removeContract(id);
    setContracts(getDiscountsConfig().contracts);
    if (expandedId === id) setExpandedId(null);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <Link to="/services" className="hover:text-neutral-700">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Customer Contracts</span>
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customer Contracts</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Negotiated rates for specific customers or corporate accounts. Applied first — highest priority in the discount chain.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Contract
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Active Contracts</p>
          <p className="text-2xl font-bold text-neutral-900">{contracts.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <p className="text-xs text-amber-600">Expiring in 30 days</p>
          <p className="text-2xl font-bold text-amber-700">{expiringCount}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Est. Monthly Savings</p>
          <p className="text-2xl font-bold tabular-nums font-mono text-success">GH₵ {totalMonthlySavings.toFixed(0)}</p>
        </div>
      </div>

      {/* Contract cards */}
      <div className="space-y-3">
        {contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-neutral-300 mb-3" />
            <p className="font-semibold text-neutral-500">No contracts yet</p>
            <p className="text-sm text-neutral-400 mt-1">Create your first contract to get started.</p>
          </div>
        ) : (
          contracts.map(contract => (
            <div key={contract.id} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 flex-shrink-0">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral-900">{contract.agreementName}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                        AGREEMENT_TYPE_COLORS[contract.agreementType] ?? 'bg-neutral-100 text-neutral-600')}>
                        {contract.agreementType}
                      </span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        contract.status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-500')}>
                        {contract.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{contract.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Expiry warning */}
                  {contract.expirationDate && contract.expirationDate <= in30 && contract.status === 'active' && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" /> Expires {contract.expirationDate}
                    </span>
                  )}
                  {/* Discount summary */}
                  <div className="text-right">
                    {contract.pricingOverrideType === 'percentage_discount' && (
                      <p className="text-lg font-bold tabular-nums font-mono text-purple-700">{contract.discountPercentage}% off</p>
                    )}
                    {contract.pricingOverrideType === 'custom_rate_card' && (
                      <p className="text-sm font-semibold text-neutral-700">Custom rate card</p>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(contract)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    >
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expandedId === contract.id && 'rotate-180')} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === contract.id && (
                <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50/50">
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Effective</p>
                      <p className="font-medium text-neutral-800">{contract.effectiveDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Expires</p>
                      <p className="font-medium text-neutral-800">{contract.expirationDate ?? 'No expiry'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Auto-Renew</p>
                      <p className="font-medium text-neutral-800">{contract.autoRenew ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Visibility</p>
                      <p className="font-medium text-neutral-800 capitalize">{contract.visibility.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Monthly Orders</p>
                      <p className="font-bold text-neutral-900">{contract.monthlyOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Monthly Revenue</p>
                      <p className="font-bold tabular-nums font-mono text-neutral-900">GH₵ {contract.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Stack with Promos</p>
                      <p className={cn('font-semibold text-xs', contract.stackableWithPromos ? 'text-success' : 'text-neutral-400')}>
                        {contract.stackableWithPromos ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Stack with Loyalty</p>
                      <p className={cn('font-semibold text-xs', contract.stackableWithLoyalty ? 'text-success' : 'text-neutral-400')}>
                        {contract.stackableWithLoyalty ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {/* Rate card table */}
                  {contract.pricingOverrideType === 'custom_rate_card' && contract.rateCard && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-neutral-600 mb-2 uppercase tracking-wide">Custom Rate Card</p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left py-2 text-xs text-neutral-500 font-semibold">Service</th>
                            <th className="text-right py-2 text-xs text-neutral-500 font-semibold">Standard</th>
                            <th className="text-right py-2 text-xs text-neutral-500 font-semibold">Contract</th>
                            <th className="text-right py-2 text-xs text-neutral-500 font-semibold">Saving</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contract.rateCard.map(row => (
                            <tr key={row.serviceId} className="border-b border-neutral-50">
                              <td className="py-2 text-neutral-800">{row.serviceName}</td>
                              <td className="py-2 text-right font-mono tabular-nums text-neutral-500">GH₵ {row.standardPrice.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono tabular-nums font-semibold text-neutral-900">GH₵ {row.customPrice.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono tabular-nums text-success">-GH₵ {(row.standardPrice - row.customPrice).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleRemove(contract.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-error/20 px-3 py-1.5 text-xs font-medium text-error hover:bg-error/5"
                    >
                      <Trash2 className="h-3 w-3" /> Remove Contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">
                {modal.mode === 'add' ? 'New Contract' : 'Edit Contract'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={modal.contract.customerName}
                    onChange={e => setContractField('customerName', e.target.value)}
                    placeholder="e.g. Kofi Boateng"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Customer ID *</label>
                  <input
                    type="text"
                    value={modal.contract.customerId}
                    onChange={e => setContractField('customerId', e.target.value)}
                    placeholder="e.g. CUS-2024-001234"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Agreement Name *</label>
                  <input
                    type="text"
                    value={modal.contract.agreementName}
                    onChange={e => setContractField('agreementName', e.target.value)}
                    placeholder="e.g. Kofi VIP 2026"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Agreement Type</label>
                  <select
                    value={modal.contract.agreementType}
                    onChange={e => setContractField('agreementType', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="contract">Contract</option>
                    <option value="vip">VIP</option>
                    <option value="negotiated">Negotiated</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Effective Date *</label>
                  <input
                    type="date"
                    value={modal.contract.effectiveDate}
                    onChange={e => setContractField('effectiveDate', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Expiration Date (optional)</label>
                  <input
                    type="date"
                    value={modal.contract.expirationDate ?? ''}
                    onChange={e => setContractField('expirationDate', e.target.value || null)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Auto-renew */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
                <span className="text-sm text-neutral-700">Auto-Renew</span>
                <Toggle enabled={modal.contract.autoRenew} onChange={v => setContractField('autoRenew', v)} />
              </div>

              {/* Pricing override type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-2">Pricing Override Type</label>
                <div className="flex gap-4">
                  {[
                    { value: 'percentage_discount', label: 'Percentage Discount' },
                    { value: 'custom_rate_card', label: 'Custom Rate Card' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingOverrideType"
                        value={opt.value}
                        checked={modal.contract.pricingOverrideType === opt.value}
                        onChange={() => setContractField('pricingOverrideType', opt.value)}
                        className="accent-primary-600"
                      />
                      <span className="text-sm text-neutral-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional: discount percentage */}
              {modal.contract.pricingOverrideType === 'percentage_discount' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={modal.contract.discountPercentage ?? ''}
                    onChange={e => setContractField('discountPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              )}

              {/* Custom rate card notice */}
              {modal.contract.pricingOverrideType === 'custom_rate_card' && (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                  Rate card entries can be added after creating the contract.
                </div>
              )}

              {/* Visibility */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Visibility</label>
                <select
                  value={modal.contract.visibility}
                  onChange={e => setContractField('visibility', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="show_discount">Show discount to customer</option>
                  <option value="show_custom_pricing">Show custom pricing (hide savings)</option>
                  <option value="hide">Hide from customer</option>
                </select>
              </div>

              {/* Stacking */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stacking Rules</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Stackable with Promotions</span>
                  <Toggle enabled={modal.contract.stackableWithPromos} onChange={v => setContractField('stackableWithPromos', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Stackable with Loyalty</span>
                  <Toggle enabled={modal.contract.stackableWithLoyalty} onChange={v => setContractField('stackableWithLoyalty', v)} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Status</label>
                <select
                  value={modal.contract.status}
                  onChange={e => setContractField('status', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100">
              <button onClick={closeModal} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={!modal.contract.customerName || !modal.contract.customerId || !modal.contract.agreementName || !modal.contract.effectiveDate}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {modal.mode === 'add' ? 'Create Contract' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-success text-white rounded-lg px-4 py-3 text-sm flex items-center gap-2 z-50 shadow-lg">
          <Check className="h-4 w-4" />
          Contract saved
        </div>
      )}
    </div>
  );
}
