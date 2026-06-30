import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Tag } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateItemPrice, getCategoryMeta } from '../../../lib/mock/mockPricing.js';

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

export default function PerItemPricingPage() {
  const [cfg, setCfg] = useState(() => getPricingConfig());
  const [drafts, setDrafts] = useState({});
  const [activeTab, setActiveTab] = useState(() => getPricingConfig().categoryMeta[0].id);
  const [saved, setSaved] = useState(false);

  const categoryMeta = cfg.categoryMeta;
  const activeItems = cfg.itemRules.filter(item => item.categoryId === activeTab);

  function handlePriceChange(itemId, field, value) {
    setDrafts(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }

  function handleToggle(itemId, enabled) {
    updateItemPrice(itemId, { enabled });
    setCfg(getPricingConfig());
  }

  function handleSave() {
    Object.entries(drafts).forEach(([itemId, draft]) => {
      const patch = {};
      if (draft.retail !== undefined) patch.retailPrice = Number(draft.retail);
      if (draft.commercial !== undefined) patch.commercialPrice = Number(draft.commercial);
      updateItemPrice(itemId, patch);
    });
    setCfg(getPricingConfig());
    setDrafts({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Item Pricing</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Item Pricing</h1>
          <p className="mt-1 text-small text-neutral-500">
            Set retail and commercial prices for each laundry service item.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-small font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="flex border-b border-neutral-200 overflow-x-auto">
          {categoryMeta.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                activeTab === cat.id
                  ? 'border-primary-600 text-primary-700 bg-primary-50/30'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Item</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Retail (GH₵)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Commercial (GH₵)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Unit</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map(item => (
                <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="font-medium text-neutral-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.50"
                      value={drafts[item.id]?.retail ?? item.retailPrice}
                      onChange={e => handlePriceChange(item.id, 'retail', e.target.value)}
                      className="w-24 rounded border border-neutral-200 px-2 py-1 text-right font-mono tabular-nums text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.50"
                      value={drafts[item.id]?.commercial ?? item.commercialPrice}
                      onChange={e => handlePriceChange(item.id, 'commercial', e.target.value)}
                      className="w-24 rounded border border-neutral-200 px-2 py-1 text-right font-mono tabular-nums text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500">{item.unit}</td>
                  <td className="px-4 py-2.5 text-center">
                    <Toggle enabled={item.enabled} onChange={v => handleToggle(item.id, v)} />
                  </td>
                </tr>
              ))}
              {activeItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400">
                    No items in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-100 px-6 py-3 bg-neutral-50/50 rounded-b-xl">
          <p className="text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">BR-005:</span> Commercial rates apply to registered business accounts.
            Retail rates apply to all individual customers.
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
