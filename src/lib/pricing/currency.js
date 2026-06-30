import { BASE_CURRENCY, DEFAULT_MOBILE_MONEY_ROUNDING } from './constants.js';
import { getPricingConfig } from '../mock/mockPricing.js';

export function convertAmount(amountGHS, targetCurrencyCode, pricingConfig) {
  if (!targetCurrencyCode || targetCurrencyCode === BASE_CURRENCY) {
    return { amount: amountGHS, symbol: 'GH₵', code: BASE_CURRENCY, formatted: `GH₵ ${amountGHS.toFixed(2)}` };
  }
  const cfg = pricingConfig ?? getPricingConfig();
  const currency = cfg.currencies.find(c => c.code === targetCurrencyCode);
  if (!currency) return { amount: amountGHS, symbol: 'GH₵', code: BASE_CURRENCY, formatted: `GH₵ ${amountGHS.toFixed(2)}` };
  const amount = Math.round(amountGHS * currency.rate * 100) / 100;
  return { amount, symbol: currency.symbol, code: currency.code, formatted: `${currency.symbol} ${amount.toFixed(2)}` };
}

export function formatCurrency(amount, currencyCode, pricingConfig) {
  const cfg = pricingConfig ?? getPricingConfig();
  if (!currencyCode || currencyCode === BASE_CURRENCY) return `GH₵ ${amount.toFixed(2)}`;
  const currency = cfg.currencies.find(c => c.code === currencyCode);
  if (!currency) return `GH₵ ${amount.toFixed(2)}`;
  return `${currency.symbol} ${amount.toFixed(2)}`;
}

export function roundForMobileMoney(amount, rounding) {
  const r = rounding ?? DEFAULT_MOBILE_MONEY_ROUNDING;
  return Math.ceil(amount / r) * r;
}
