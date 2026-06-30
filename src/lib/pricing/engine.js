import { calcSubtotal } from './base.js';
import { calcTurnaroundFee, normaliseTurnaroundId } from './turnaround.js';
import { calcTax } from './tax.js';
import { matchBundles } from './bundle.js';
import { convertAmount } from './currency.js';
import { DEFAULT_DELIVERY_FEE, DEFAULT_PICKUP_FEE, CUSTOMER_TIER } from './constants.js';
import { getPricingConfig } from '../mock/mockPricing.js';
import { applyDiscounts, getAutoApplyPromo } from './discounts.js';

let _quoteSeq = 0;

export function generateQuote({
  cartItems = [],
  turnaroundId = 'standard',
  deliveryMethod = 'pickup',
  customerTier = CUSTOMER_TIER.RETAIL,
  customer = null,
  promoCode = null,
  discountsConfig,
  pricingConfig,
  currencyCode,
  bundlesEnabled = true,
}) {
  const cfg = pricingConfig ?? getPricingConfig();
  const normTurnaround = normaliseTurnaroundId(turnaroundId);

  const { lineItems, subtotal } = calcSubtotal(cartItems, customerTier, cfg);
  const { surchargeAmount, turnaroundLabel, turnaroundDays, badge } = calcTurnaroundFee(subtotal, normTurnaround, cfg);

  const deliveryFee = deliveryMethod === 'home_delivery' ? (cfg.outlet?.deliveryFee ?? DEFAULT_DELIVERY_FEE) : 0;
  const pickupFee   = deliveryMethod === 'pickup'        ? 0                                                  : 0;

  const subtotalWithFees = subtotal + surchargeAmount + deliveryFee + pickupFee;

  const autoPromo = !promoCode ? getAutoApplyPromo(subtotalWithFees, customer, discountsConfig) : null;
  const effectivePromoCode = promoCode ?? autoPromo?.promoCode ?? null;
  const discountResult = applyDiscounts({
    subtotal: subtotalWithFees,
    cartItems,
    customer: customer ? { ...customer, tier: customerTier } : null,
    promoCode: effectivePromoCode,
    discountsConfig,
  });
  const subtotalAfterDiscounts = discountResult.subtotalAfterDiscounts;

  const tax = calcTax(subtotalAfterDiscounts, cfg.tax);
  const grandTotal = Math.round((subtotalAfterDiscounts + tax.totalTax) * 100) / 100;

  const bundleResult = bundlesEnabled ? matchBundles(cartItems, customerTier, cfg) : { activeBundles: [], suggestions: [] };
  const convertedTotal = currencyCode ? convertAmount(grandTotal, currencyCode, cfg) : null;

  const quoteId = `QT-${String(++_quoteSeq).padStart(6, '0')}`;
  const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    quoteId,
    validUntil,
    lineItems,
    subtotal,
    surchargeAmount,
    turnaroundId: normTurnaround,
    turnaroundLabel,
    turnaroundDays,
    turnaroundBadge: badge,
    deliveryFee,
    pickupFee,
    subtotalWithFees,
    discountSteps: discountResult.steps,
    totalDiscount: discountResult.totalDiscount,
    subtotalAfterDiscounts,
    autoPromoApplied: autoPromo?.promoCode ?? null,
    vatAmount: tax.vatAmount,
    nhilAmount: tax.nhilAmount,
    getfundAmount: tax.getfundAmount,
    totalTax: tax.totalTax,
    taxBreakdown: tax.breakdown,
    grandTotal,
    currency: currencyCode ?? 'GHS',
    convertedTotal,
    bundleSuggestions: bundleResult.suggestions,
    activeBundles: bundleResult.activeBundles,
    customerTier,
  };
}

export function checkQuoteExpiry(quote) {
  const now = Date.now();
  const expiry = new Date(quote.validUntil).getTime();
  const msRemaining = expiry - now;
  const hoursRemaining = Math.max(0, msRemaining / (1000 * 60 * 60));
  return {
    valid: msRemaining > 0,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    expiringSoon: msRemaining > 0 && msRemaining < 4 * 60 * 60 * 1000,
  };
}

export function calcPricing(items, turnaround, outlet) {
  const cartItems = items.map(i => ({ serviceId: i.id, qty: i.qty || 0, unitPrice: i.unitPrice }));
  const quote = generateQuote({
    cartItems,
    turnaroundId: turnaround,
    deliveryMethod: 'home_delivery',
    pricingConfig: outlet ? { ...getPricingConfig(), outlet } : undefined,
  });
  return {
    subtotal: quote.subtotal,
    surcharge: quote.surchargeAmount,
    pickupFee: outlet?.pickupFee ?? DEFAULT_PICKUP_FEE,
    deliveryFee: quote.deliveryFee,
    vat: quote.vatAmount + quote.nhilAmount + quote.getfundAmount,
    total: quote.grandTotal,
  };
}
