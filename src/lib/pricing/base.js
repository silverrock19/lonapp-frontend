import { CUSTOMER_TIER, PRICING_METHOD } from './constants.js';
import { getPricingConfig } from '../mock/mockPricing.js';

export function calcLineItem(item, tier, pricingConfig) {
  const cfg = pricingConfig ?? getPricingConfig();
  const rule = cfg.itemRules.find(r => r.id === item.serviceId);
  const unitPrice = item.unitPrice
    ?? (rule ? (tier === CUSTOMER_TIER.COMMERCIAL ? rule.commercialPrice : rule.retailPrice) : 0);
  const lineTotal = unitPrice * (item.qty || 0);
  return {
    serviceId: item.serviceId,
    name: rule?.name ?? item.serviceId,
    categoryId: rule?.categoryId ?? '',
    unit: rule?.unit ?? 'per item',
    qty: item.qty || 0,
    unitPrice,
    lineTotal,
    pricingMethod: rule?.pricingMethod ?? PRICING_METHOD.PER_ITEM,
  };
}

export function calcSubtotal(cartItems, tier, pricingConfig) {
  const cfg = pricingConfig ?? getPricingConfig();
  const lineItems = cartItems.map(it => calcLineItem(it, tier, cfg));
  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  return { lineItems, subtotal };
}
