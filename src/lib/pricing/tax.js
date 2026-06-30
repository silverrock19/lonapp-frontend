import { getPricingConfig } from '../mock/mockPricing.js';

export function calcTax(taxBase, taxConfig) {
  const cfg = taxConfig ?? getPricingConfig().tax;

  if (cfg.mode === 'inclusive') {
    return extractTaxFromInclusive(taxBase, cfg);
  }

  const vatAmount     = cfg.vatEnabled     ? Math.round(taxBase * cfg.vatRate     * 100) / 100 : 0;
  const nhilAmount    = cfg.nhilEnabled    ? Math.round(taxBase * cfg.nhilRate    * 100) / 100 : 0;
  const getfundAmount = cfg.getfundEnabled ? Math.round(taxBase * cfg.getfundRate * 100) / 100 : 0;
  const totalTax = vatAmount + nhilAmount + getfundAmount;

  const breakdown = [
    cfg.vatEnabled     && { label: `VAT (${(cfg.vatRate * 100).toFixed(1)}%)`,      amount: vatAmount },
    cfg.nhilEnabled    && { label: `NHIL (${(cfg.nhilRate * 100).toFixed(1)}%)`,    amount: nhilAmount },
    cfg.getfundEnabled && { label: `GetFund (${(cfg.getfundRate * 100).toFixed(1)}%)`, amount: getfundAmount },
  ].filter(Boolean);

  return { vatAmount, nhilAmount, getfundAmount, totalTax, breakdown };
}

export function extractTaxFromInclusive(grossAmount, taxConfig) {
  const cfg = taxConfig ?? getPricingConfig().tax;
  const totalRate = (cfg.vatEnabled ? cfg.vatRate : 0)
    + (cfg.nhilEnabled ? cfg.nhilRate : 0)
    + (cfg.getfundEnabled ? cfg.getfundRate : 0);
  const taxBase   = Math.round((grossAmount / (1 + totalRate)) * 100) / 100;
  const totalTax  = grossAmount - taxBase;
  const vatAmount     = cfg.vatEnabled     ? Math.round(taxBase * cfg.vatRate     * 100) / 100 : 0;
  const nhilAmount    = cfg.nhilEnabled    ? Math.round(taxBase * cfg.nhilRate    * 100) / 100 : 0;
  const getfundAmount = cfg.getfundEnabled ? Math.round(taxBase * cfg.getfundRate * 100) / 100 : 0;

  const breakdown = [
    cfg.vatEnabled     && { label: `VAT (${(cfg.vatRate * 100).toFixed(1)}%)`,         amount: vatAmount },
    cfg.nhilEnabled    && { label: `NHIL (${(cfg.nhilRate * 100).toFixed(1)}%)`,       amount: nhilAmount },
    cfg.getfundEnabled && { label: `GetFund (${(cfg.getfundRate * 100).toFixed(1)}%)`, amount: getfundAmount },
  ].filter(Boolean);

  return { vatAmount, nhilAmount, getfundAmount, totalTax, taxBase, breakdown };
}
