import { SURCHARGE_METHOD } from './constants.js';
import { getPricingConfig } from '../mock/mockPricing.js';

export function calcTurnaroundFee(subtotal, turnaroundId, pricingConfig) {
  const cfg = pricingConfig ?? getPricingConfig();
  const option = cfg.turnaround.find(t => t.id === turnaroundId)
    ?? cfg.turnaround.find(t => t.id === 'standard');

  let surchargeAmount = 0;
  if (option.method === SURCHARGE_METHOD.PERCENTAGE) {
    surchargeAmount = Math.round(subtotal * option.surchargeRate * 100) / 100;
  } else if (option.method === SURCHARGE_METHOD.FLAT) {
    surchargeAmount = option.flatSurcharge ?? 0;
  }

  return {
    surchargeAmount,
    surchargeRate: option.surchargeRate,
    method: option.method,
    turnaroundLabel: option.label,
    turnaroundDays: option.turnaroundDays,
    badge: option.badge,
  };
}

export function normaliseTurnaroundId(id) {
  if (!id) return 'standard';
  return id.replace('_', '-');
}
