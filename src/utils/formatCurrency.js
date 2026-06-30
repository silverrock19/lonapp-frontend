import { getPricingConfig } from '../lib/mock/mockPricing.js';

/**
 * Formats a number as Ghana Cedi — always "GH₵ 1,809.50" (space + thousands).
 * Uses en-US for reliable thousands separators across all runtimes.
 */
export function formatGHS(amount) {
  const n = typeof amount === 'number' ? amount : Number(amount) || 0;
  return `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Returns a human-readable combined tax label based on the current pricing config.
 * e.g. "VAT (12.5%) + NHIL (2.5%)"
 */
export function getTaxLabel() {
  const cfg = getPricingConfig().tax;
  const parts = [
    cfg.vatEnabled     && `VAT (${(cfg.vatRate     * 100).toFixed(1)}%)`,
    cfg.nhilEnabled    && `NHIL (${(cfg.nhilRate    * 100).toFixed(1)}%)`,
    cfg.getfundEnabled && `GetFund (${(cfg.getfundRate * 100).toFixed(1)}%)`,
  ].filter(Boolean);
  return parts.join(' + ') || 'Tax';
}
