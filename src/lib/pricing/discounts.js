import { getDiscountsConfig } from '../mock/mockDiscounts.js';

function round(n) { return Math.round(n * 100) / 100; }

function findActiveContract(customerId, contracts) {
  if (!customerId) return null;
  const today = new Date().toISOString().slice(0, 10);
  return contracts.find(c =>
    c.customerId === customerId &&
    c.status === 'active' &&
    c.effectiveDate <= today &&
    (!c.expirationDate || c.expirationDate >= today)
  ) ?? null;
}

function calcContractDiscount(subtotal, contract, cartItems) {
  if (contract.pricingOverrideType === 'percentage_discount') {
    return round(subtotal * contract.discountPercentage / 100);
  }
  if (contract.pricingOverrideType === 'custom_rate_card' && contract.rateCard) {
    let savings = 0;
    for (const item of cartItems) {
      const rule = contract.rateCard.find(r => r.serviceId === item.serviceId);
      if (rule) savings += (rule.standardPrice - rule.customPrice) * (item.qty || 0);
    }
    return round(Math.max(0, savings));
  }
  return 0;
}

function findBulkTier(totalItems, orderValue, customerTier, tiers) {
  const active = tiers.filter(t => {
    if (!t.isActive) return false;
    if (customerTier === 'retail'     && !t.appliesToRetail)     return false;
    if (customerTier === 'commercial' && !t.appliesToCommercial) return false;
    const vol = t.discountBasis === 'item_count' ? totalItems : orderValue;
    if (vol < t.minThreshold) return false;
    if (t.maxThreshold !== null && vol > t.maxThreshold) return false;
    return true;
  });
  return active.sort((a, b) => b.discountValue - a.discountValue)[0] ?? null;
}

function findNextBulkTier(currentTier, totalItems, tiers) {
  if (!currentTier || currentTier.discountBasis !== 'item_count') return null;
  return tiers
    .filter(t => t.isActive && t.discountBasis === 'item_count' && t.minThreshold > totalItems)
    .sort((a, b) => a.minThreshold - b.minThreshold)[0] ?? null;
}

function validatePromo(code, subtotal, customer, promos) {
  const today = new Date().toISOString().slice(0, 10);
  const promo = promos.find(p => p.promoCode && p.promoCode.toLowerCase() === code.toLowerCase());
  if (!promo)
    return { valid: false, reason: 'not_found', message: `"${code}" is not a valid promo code.` };
  if (promo.status !== 'active')
    return { valid: false, reason: 'not_active', message: `Promo code "${code}" is ${promo.status}.` };
  if (promo.endDate && promo.endDate < today)
    return { valid: false, reason: 'expired', message: `Promo code "${code}" expired on ${promo.endDate}.` };
  if (promo.totalRedemptionLimit && promo.redemptionCount >= promo.totalRedemptionLimit)
    return { valid: false, reason: 'limit_reached', message: `Promo code "${code}" has reached its redemption limit.` };
  if (promo.minOrderValue && subtotal < promo.minOrderValue)
    return { valid: false, reason: 'min_order', message: `"${code}" requires a minimum order of GH₵ ${promo.minOrderValue.toFixed(2)}.`, shortfall: round(promo.minOrderValue - subtotal) };
  if (promo.eligibleCustomers === 'new_only' && customer?.ordersCount > 0)
    return { valid: false, reason: 'not_new', message: `"${code}" is for new customers only.` };
  if (promo.eligibleCustomers === 'existing_only' && (!customer || customer.ordersCount === 0))
    return { valid: false, reason: 'not_existing', message: `"${code}" is for existing customers only.` };

  let amount = promo.discountType === 'percentage'
    ? round(subtotal * promo.discountValue / 100)
    : promo.discountValue;
  if (promo.maxDiscountCap) amount = Math.min(amount, promo.maxDiscountCap);
  return { valid: true, promo, amount };
}

export function applyDiscounts({ subtotal, cartItems = [], customer = null, promoCode = null, discountsConfig }) {
  const dcfg = discountsConfig ?? getDiscountsConfig();
  const steps = [];
  let running = subtotal;
  const totalItems = cartItems.reduce((s, i) => s + (i.qty || 0), 0);
  const customerTier = customer?.tier ?? 'retail';

  const contract = findActiveContract(customer?.id, dcfg.contracts);
  if (contract) {
    const amount = calcContractDiscount(running, contract, cartItems);
    if (amount > 0) {
      running = round(Math.max(0, running - amount));
      steps.push({ type: 'customer_contract', label: contract.agreementName, badge: contract.agreementType, discountAmount: amount, visibility: contract.visibility });
    }
    if (!contract.stackableWithPromos && !contract.stackableWithLoyalty) {
      return { steps, totalDiscount: round(subtotal - running), subtotalAfterDiscounts: running };
    }
  }

  const bulk = findBulkTier(totalItems, running, customerTier, dcfg.bulkTiers);
  if (bulk) {
    const amount = bulk.discountType === 'percentage'
      ? round(running * bulk.discountValue / 100)
      : Math.min(bulk.discountValue, running);
    const nextTier = findNextBulkTier(bulk, totalItems, dcfg.bulkTiers);
    running = round(Math.max(0, running - amount));
    steps.push({
      type: 'bulk', label: bulk.name,
      badge: bulk.discountType === 'percentage' ? `${bulk.discountValue}% off` : `GH₵ ${bulk.discountValue} off`,
      discountAmount: amount,
      nextTierHint: nextTier
        ? `Add ${nextTier.minThreshold - totalItems} more item${nextTier.minThreshold - totalItems !== 1 ? 's' : ''} to unlock ${nextTier.discountValue}% off`
        : null,
    });
    if (!bulk.stackable) {
      return { steps, totalDiscount: round(subtotal - running), subtotalAfterDiscounts: running };
    }
  }

  if (promoCode) {
    const result = validatePromo(promoCode, running, customer, dcfg.promotions);
    if (result.valid) {
      running = round(Math.max(0, running - result.amount));
      steps.push({ type: 'promo', label: result.promo.publicDisplayName, code: promoCode, discountAmount: result.amount });
      if (!result.promo.stackableWithLoyalty) {
        return { steps, totalDiscount: round(subtotal - running), subtotalAfterDiscounts: running };
      }
    } else {
      steps.push({ type: 'promo_error', code: promoCode, reason: result.reason, message: result.message, shortfall: result.shortfall });
    }
  }

  if (customer?.loyaltyTierId) {
    const tier = dcfg.loyaltyTiers.find(t => t.id === customer.loyaltyTierId && t.isActive);
    if (tier) {
      if (running >= (tier.minOrderValue || 0)) {
        let amount = tier.discountType === 'percentage'
          ? round(running * tier.discountValue / 100)
          : tier.discountValue;
        if (tier.maxDiscountCap) amount = Math.min(amount, tier.maxDiscountCap);
        running = round(Math.max(0, running - amount));
        steps.push({ type: 'loyalty', label: `${tier.displayLabel} Member Discount`, badge: tier.name, icon: tier.icon, color: tier.color, discountAmount: amount });
      } else {
        steps.push({ type: 'loyalty_ineligible', label: tier.displayLabel, badge: tier.name, icon: tier.icon, minOrderValue: tier.minOrderValue, shortfall: round(tier.minOrderValue - running) });
      }
    }
  }

  return { steps, totalDiscount: round(subtotal - running), subtotalAfterDiscounts: running };
}

export function validatePromoCode(code, subtotal, customer, discountsConfig) {
  const dcfg = discountsConfig ?? getDiscountsConfig();
  return validatePromo(code, subtotal, customer, dcfg.promotions);
}

export function getAutoApplyPromo(subtotal, customer, discountsConfig) {
  const dcfg = discountsConfig ?? getDiscountsConfig();
  const today = new Date().toISOString().slice(0, 10);
  return dcfg.promotions.find(p =>
    p.autoApply &&
    p.status === 'active' &&
    (!p.endDate || p.endDate >= today) &&
    subtotal >= (p.minOrderValue || 0) &&
    (p.eligibleCustomers === 'all' || (p.eligibleCustomers === 'new_only' && (!customer || customer.ordersCount === 0)))
  ) ?? null;
}
