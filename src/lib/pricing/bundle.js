import { CUSTOMER_TIER } from './constants.js';
import { getPricingConfig } from '../mock/mockPricing.js';

export function matchBundles(cartItems, tier, pricingConfig) {
  const cfg = pricingConfig ?? getPricingConfig();
  const bundles = cfg.bundles.filter(b => b.enabled);

  const activeBundles = [];
  const suggestions = [];

  for (const bundle of bundles) {
    const matchCount = bundle.services.filter(svc => {
      const cartItem = cartItems.find(ci => ci.serviceId === svc.serviceId);
      return cartItem && cartItem.qty >= svc.qty;
    }).length;

    if (matchCount === bundle.services.length) {
      activeBundles.push({
        ...bundle,
        price: tier === CUSTOMER_TIER.COMMERCIAL ? bundle.commercialPrice : bundle.retailPrice,
        savings: tier === CUSTOMER_TIER.COMMERCIAL ? bundle.commercialSavings : bundle.retailSavings,
      });
    } else if (matchCount > 0) {
      suggestions.push({
        ...bundle,
        matchCount,
        requiredCount: bundle.services.length,
        price: tier === CUSTOMER_TIER.COMMERCIAL ? bundle.commercialPrice : bundle.retailPrice,
      });
    }
  }

  return { activeBundles, suggestions };
}

export function applyBundleDiscount(lineItems, bundle, tier) {
  const bundlePrice = tier === CUSTOMER_TIER.COMMERCIAL ? bundle.commercialPrice : bundle.retailPrice;
  const originalTotal = bundle.services.reduce((sum, svc) => {
    const li = lineItems.find(l => l.serviceId === svc.serviceId);
    return sum + (li ? li.unitPrice * svc.qty : 0);
  }, 0);
  const discount = originalTotal - bundlePrice;
  return { bundlePrice, originalTotal, discount, bundleId: bundle.id, bundleName: bundle.name };
}
