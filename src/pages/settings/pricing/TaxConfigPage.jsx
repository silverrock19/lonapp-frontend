import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Receipt, Info } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateTaxConfig } from '../../../lib/mock/mockPricing.js';

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

export default function TaxConfigPage() {
  const [tax, setTax] = useState(() => getPricingConfig().tax);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateTaxConfig(tax);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const totalTax =
    (tax.vatEnabled ? 100 * tax.vatRate : 0) +
    (tax.nhilEnabled ? 100 * tax.nhilRate : 0) +
    (tax.getfundEnabled ? 100 * tax.getfundRate : 0);

  const levies = [
    {
      key: 'vat',
      enabledKey: 'vatEnabled',
      rateKey: 'vatRate',
      label: 'VAT',
      description: 'Value Added Tax (Ghana Revenue Authority)',
    },
    {
      key: 'nhil',
      enabledKey: 'nhilEnabled',
      rateKey: 'nhilRate',
      label: 'NHIL',
      description: 'National Health Insurance Levy',
    },
    {
      key: 'getfund',
      enabledKey: 'getfundEnabled',
      rateKey: 'getfundRate',
      label: 'GetFund',
      description: 'Ghana Education Trust Fund',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Tax Configuration</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tax Configuration</h1>
          <p className="mt-1 text-small text-neutral-500">
            Configure Ghana VAT, NHIL, and GetFund levy rates for customer invoices.
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
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-700 mb-1">Tax Mode</h2>
          <p className="text-xs text-neutral-500 mb-4">
            Exclusive: tax added on top of prices. Inclusive: tax extracted from quoted prices.
          </p>
          <div className="flex gap-3">
            {['exclusive', 'inclusive'].map(mode => (
              <button
                key={mode}
                onClick={() => setTax(t => ({ ...t, mode }))}
                className={cn(
                  'flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold capitalize transition-colors',
                  tax.mode === mode
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-700 mb-3">Tax Levies</h2>
          <div className="space-y-0">
            {levies.map(levy => (
              <div
                key={levy.key}
                className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Toggle
                    enabled={tax[levy.enabledKey]}
                    onChange={v => setTax(t => ({ ...t, [levy.enabledKey]: v }))}
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{levy.label}</p>
                    <p className="text-xs text-neutral-500">{levy.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={(tax[levy.rateKey] * 100).toFixed(1)}
                    onChange={e => setTax(t => ({ ...t, [levy.rateKey]: Number(e.target.value) / 100 }))}
                    disabled={!tax[levy.enabledKey]}
                    className="w-20 rounded-lg border border-neutral-200 px-3 py-1.5 text-right font-mono tabular-nums text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-neutral-500 w-4">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-neutral-50/50 rounded-b-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
            Sample Calculation — GH₵ 100.00 service
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-mono tabular-nums">GH₵ 100.00</span>
            </div>
            {tax.vatEnabled && (
              <div className="flex justify-between text-neutral-500">
                <span>VAT ({(tax.vatRate * 100).toFixed(1)}%)</span>
                <span className="font-mono tabular-nums">GH₵ {(100 * tax.vatRate).toFixed(2)}</span>
              </div>
            )}
            {tax.nhilEnabled && (
              <div className="flex justify-between text-neutral-500">
                <span>NHIL ({(tax.nhilRate * 100).toFixed(1)}%)</span>
                <span className="font-mono tabular-nums">GH₵ {(100 * tax.nhilRate).toFixed(2)}</span>
              </div>
            )}
            {tax.getfundEnabled && (
              <div className="flex justify-between text-neutral-500">
                <span>GetFund ({(tax.getfundRate * 100).toFixed(1)}%)</span>
                <span className="font-mono tabular-nums">GH₵ {(100 * tax.getfundRate).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
              <span>Total</span>
              <span className="font-mono tabular-nums text-primary-700">
                GH₵ {(100 + totalTax).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Tax Registration</h2>
        <label className="block text-xs font-medium text-neutral-600 mb-1">VAT Registration Number</label>
        <input
          type="text"
          value={tax.taxRegistrationNumber}
          onChange={e => setTax(t => ({ ...t, taxRegistrationNumber: e.target.value }))}
          placeholder="e.g. VATG-001234"
          className="w-full max-w-sm rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-neutral-400">Appears on tax invoices and receipts</p>

        {tax.exemptCategories && tax.exemptCategories.length > 0 && (
          <div className="mt-4 rounded-lg bg-neutral-50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-3.5 w-3.5 text-neutral-500" />
              <p className="text-xs font-semibold text-neutral-700">Exempt Categories</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tax.exemptCategories.map(cat => (
                <span key={cat} className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                  {cat}
                </span>
              ))}
            </div>
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
