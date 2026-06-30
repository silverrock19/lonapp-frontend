import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Plus, Trash2, Calculator, Tag, RotateCcw,
  Timer, Truck, Package,
} from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { generateQuote } from '../../../lib/pricing/engine.js';
import { getPricingConfig } from '../../../lib/mock/mockPricing.js';
import { getDiscountsConfig } from '../../../lib/mock/mockDiscounts.js';

const pricingConfig = getPricingConfig();
const discountsConfig = getDiscountsConfig();

const SERVICE_CATALOG = pricingConfig.itemRules
  .filter(r => r.enabled)
  .map(r => ({
    serviceId: r.id,
    name: r.name,
    category: r.categoryId,
    retailPrice: r.retailPrice,
    commercialPrice: r.commercialPrice,
    unit: r.unit,
  }));

export default function QuoteCalculatorPage() {
  const [cartItems, setCartItems] = useState([
    { serviceId: 'shirt',   name: 'Shirt / Blouse', qty: 5, category: 'washing' },
    { serviceId: 'trouser', name: 'Trouser / Pants', qty: 3, category: 'washing' },
  ]);
  const [turnaroundId, setTurnaroundId] = useState('standard');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [customerTier, setCustomerTier] = useState('retail');
  const [loyaltyTierId, setLoyaltyTierId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoInput, setPromoInput] = useState('');

  const customer = loyaltyTierId
    ? { loyaltyTierId, tier: customerTier, ordersCount: 5, totalSpend: 500 }
    : null;

  const quote = useMemo(() => {
    const items = cartItems.filter(i => i.qty > 0 && i.serviceId);
    if (!items.length) return null;
    try {
      return generateQuote({
        cartItems: items.map(i => ({ ...i, unitPrice: undefined })),
        turnaroundId,
        deliveryMethod,
        customerTier,
        customer,
        promoCode: promoCode || null,
        pricingConfig,
        discountsConfig,
        bundlesEnabled: true,
      });
    } catch {
      return null;
    }
  }, [cartItems, turnaroundId, deliveryMethod, customerTier, loyaltyTierId, promoCode]);

  function handleReset() {
    setCartItems([{ serviceId: 'shirt', name: 'Shirt / Blouse', qty: 1, category: 'washing' }]);
    setTurnaroundId('standard');
    setDeliveryMethod('pickup');
    setCustomerTier('retail');
    setLoyaltyTierId('');
    setPromoCode('');
    setPromoInput('');
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Quote Calculator</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Quote Calculator</h1>
        <p className="mt-1 text-small text-neutral-500">
          Test pricing rule combinations. Changes here are preview-only and do not affect live pricing.
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg bg-primary-50 border border-primary-100 px-4 py-3 text-sm text-primary-700 flex items-center gap-2">
        <Calculator className="h-4 w-4 flex-shrink-0" />
        This calculator uses the live pricing engine — all configured rules (bulk tiers, loyalty, promo codes, taxes) apply in real time.
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* LEFT: Cart builder */}
        <div className="space-y-4">
          {/* Cart items */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary-500" /> Cart Items
            </h2>
            <div className="space-y-2 mb-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.serviceId}
                    onChange={e => {
                      const cat = SERVICE_CATALOG.find(s => s.serviceId === e.target.value);
                      setCartItems(prev =>
                        prev.map((it, i) =>
                          i === idx
                            ? { ...it, serviceId: e.target.value, name: cat?.name ?? e.target.value, category: cat?.category ?? it.category }
                            : it
                        )
                      );
                    }}
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:border-primary-400 focus:outline-none"
                  >
                    <option value="">— select item —</option>
                    {SERVICE_CATALOG.map(s => (
                      <option key={s.serviceId} value={s.serviceId}>{s.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={item.qty}
                    onChange={e =>
                      setCartItems(prev =>
                        prev.map((it, i) => i === idx ? { ...it, qty: Number(e.target.value) } : it)
                      )
                    }
                    className="w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-center text-sm tabular-nums focus:border-primary-400 focus:outline-none"
                    placeholder="Qty"
                  />
                  <button
                    onClick={() => setCartItems(prev => prev.filter((_, i) => i !== idx))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-error/5 hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCartItems(prev => [...prev, { serviceId: '', name: '', qty: 1, category: '' }])}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </div>

          {/* Turnaround */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-500" /> Turnaround
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'Standard', sub: '3 days' },
                { id: 'express',  label: 'Express',  sub: '1 day'  },
                { id: 'same-day', label: 'Same-Day', sub: 'Today'  },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTurnaroundId(t.id)}
                  className={cn(
                    'flex flex-col items-center rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-colors',
                    turnaroundId === t.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  )}
                >
                  {t.label}
                  <span className="text-xs font-normal text-neutral-400 mt-0.5">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent-600" /> Delivery Method
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'pickup',        label: 'Walk-in / Pickup', sub: 'No fee'     },
                { id: 'home_delivery', label: 'Home Delivery',    sub: 'GH₵ 15.00' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDeliveryMethod(d.id)}
                  className={cn(
                    'flex flex-col items-center rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-colors',
                    deliveryMethod === d.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  )}
                >
                  {d.label}
                  <span className="text-xs font-normal text-neutral-400 mt-0.5">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer context */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-500" /> Customer Context
            </h2>
            {/* Tier */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Customer Tier</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'retail', label: 'Retail' }, { id: 'commercial', label: 'Commercial' }].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setCustomerTier(t.id)}
                    className={cn(
                      'rounded-lg border-2 py-2 text-sm font-semibold transition-colors',
                      customerTier === t.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Loyalty */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Loyalty Tier (optional)</label>
              <select
                value={loyaltyTierId}
                onChange={e => setLoyaltyTierId(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              >
                <option value="">None (no loyalty discount)</option>
                {discountsConfig.loyaltyTiers.filter(t => t.isActive).map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.displayLabel} — {t.discountValue}% off</option>
                ))}
              </select>
            </div>
            {/* Promo code */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Promo Code (optional)</label>
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && setPromoCode(promoInput)}
                  placeholder="e.g. FLASH15"
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums focus:border-primary-400 focus:outline-none"
                />
                <button
                  onClick={() => setPromoCode(promoInput)}
                  className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Apply
                </button>
                {promoCode && (
                  <button
                    onClick={() => { setPromoCode(''); setPromoInput(''); }}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50"
                  >
                    Clear
                  </button>
                )}
              </div>
              {promoCode && (
                <p className="mt-1 text-xs text-neutral-500">
                  Applied: <code className="font-mono font-semibold text-primary-700">{promoCode}</code>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Live quote breakdown */}
        <div className="sticky top-6 space-y-4 self-start">
          {!quote ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-400">
              <Calculator className="mx-auto mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm">Add items to see a live quote</p>
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="bg-primary-600 px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Live Quote — {quote.quoteId}</span>
                <span className="text-xs text-primary-200">
                  {quote.customerTier === 'commercial' ? 'Commercial' : 'Retail'} · {quote.turnaroundLabel}
                </span>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                {/* Line items */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Line Items</p>
                {quote.lineItems?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-neutral-600">
                      {item.name} <span className="text-neutral-400">× {item.qty}</span>
                    </span>
                    <span className="font-mono tabular-nums text-neutral-800">GH₵ {item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-neutral-100 pt-2 font-medium">
                  <span className="text-neutral-700">Subtotal</span>
                  <span className="font-mono tabular-nums">GH₵ {quote.subtotal.toFixed(2)}</span>
                </div>

                {/* Turnaround surcharge */}
                {quote.surchargeAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-amber-600">{quote.turnaroundBadge ?? quote.turnaroundLabel} surcharge</span>
                    <span className="font-mono tabular-nums text-amber-700">+GH₵ {quote.surchargeAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Delivery fee */}
                {quote.deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery fee</span>
                    <span className="font-mono tabular-nums">GH₵ {quote.deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                {/* Subtotal with fees */}
                {(quote.surchargeAmount > 0 || quote.deliveryFee > 0) && (
                  <div className="flex justify-between border-t border-neutral-100 pt-2 text-neutral-600">
                    <span>Subtotal with fees</span>
                    <span className="font-mono tabular-nums">GH₵ {quote.subtotalWithFees.toFixed(2)}</span>
                  </div>
                )}

                {/* Discount steps */}
                {quote.discountSteps?.filter(s => s.discountAmount > 0).length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
                      Discounts
                    </p>
                    {quote.discountSteps.filter(s => s.discountAmount > 0).map((step, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-success">{step.label}</span>
                        <span className="font-mono tabular-nums text-success">-GH₵ {step.discountAmount.toFixed(2)}</span>
                      </div>
                    ))}
                    {quote.discountSteps.filter(s => s.type === 'promo_error').map((step, i) => (
                      <div key={`err-${i}`} className="rounded-lg bg-error/5 border border-error/10 px-3 py-2 text-xs text-error">
                        {step.message}
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-neutral-100 pt-2 font-medium text-neutral-700">
                      <span>After discounts</span>
                      <span className="font-mono tabular-nums">GH₵ {quote.subtotalAfterDiscounts.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {/* Tax */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mt-3 pt-3 border-t border-neutral-100">
                  Tax
                </p>
                {quote.taxBreakdown?.map((t, i) => (
                  <div key={i} className="flex justify-between text-neutral-500">
                    <span>{t.label}</span>
                    <span className="font-mono tabular-nums">GH₵ {t.amount.toFixed(2)}</span>
                  </div>
                ))}

                {/* Grand total */}
                <div className="flex justify-between border-t-2 border-neutral-200 pt-3 text-base font-bold">
                  <span className="text-neutral-900">Grand Total</span>
                  <span className="font-mono tabular-nums text-primary-700">GH₵ {quote.grandTotal.toFixed(2)}</span>
                </div>

                {/* Total savings */}
                {quote.totalDiscount > 0 && (
                  <div className="rounded-lg bg-success/5 border border-success/20 px-3 py-2 text-center text-xs font-semibold text-success">
                    You saved GH₵ {quote.totalDiscount.toFixed(2)} ({((quote.totalDiscount / quote.subtotalWithFees) * 100).toFixed(0)}% off)
                  </div>
                )}

                {/* Bundle suggestions */}
                {quote.bundleSuggestions?.length > 0 && (
                  <div className="rounded-lg bg-accent-50 border border-accent-200 px-3 py-2 mt-2">
                    <p className="text-xs font-semibold text-accent-700 mb-1">Bundle suggestion</p>
                    {quote.bundleSuggestions.map((b, i) => (
                      <p key={i} className="text-xs text-accent-600">{b.bundleName}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-500 hover:bg-neutral-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset calculator
          </button>
        </div>
      </div>
    </div>
  );
}
