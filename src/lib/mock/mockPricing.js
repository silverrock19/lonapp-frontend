// EP-05 — single pricing config store

const SEED_ITEM_RULES = [
  // Washing
  { categoryId: 'washing', id: 'shirt',           name: 'Shirt / Blouse',          retailPrice:  8,   commercialPrice:  6.5,  unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 't-shirt',          name: 'T-Shirt',                 retailPrice:  6,   commercialPrice:  5,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'trouser',          name: 'Trouser / Pants',         retailPrice: 10,   commercialPrice:  8,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'jeans',            name: 'Jeans',                   retailPrice: 12,   commercialPrice: 10,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'dress',            name: 'Dress',                   retailPrice: 18,   commercialPrice: 15,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'suit-jacket',      name: 'Suit Jacket',             retailPrice: 25,   commercialPrice: 20,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'shorts',           name: 'Shorts',                  retailPrice:  6,   commercialPrice:  5,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'washing', id: 'underwear',        name: 'Underwear / Socks',       retailPrice:  3,   commercialPrice:  2.5,  unit: 'per item', pricingMethod: 'per_item', enabled: true },
  // Bedding
  { categoryId: 'bedding', id: 'bedsheet-single',  name: 'Bed Sheet (Single)',      retailPrice: 18,   commercialPrice: 14,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'bedding', id: 'bedsheet-double',  name: 'Bed Sheet (Double)',      retailPrice: 25,   commercialPrice: 20,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'bedding', id: 'pillowcase',       name: 'Pillowcase',              retailPrice:  5,   commercialPrice:  4,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'bedding', id: 'duvet-single',     name: 'Duvet Cover (Single)',    retailPrice: 30,   commercialPrice: 24,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'bedding', id: 'duvet-double',     name: 'Duvet Cover (Double)',    retailPrice: 40,   commercialPrice: 32,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'bedding', id: 'towel',            name: 'Towel',                   retailPrice:  8,   commercialPrice:  6.5,  unit: 'per item', pricingMethod: 'per_item', enabled: true },
  // Ironing
  { categoryId: 'ironing', id: 'iron-shirt',       name: 'Iron Shirt / Blouse',     retailPrice:  4,   commercialPrice:  3.5,  unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'ironing', id: 'iron-trouser',     name: 'Iron Trouser',            retailPrice:  5,   commercialPrice:  4,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'ironing', id: 'iron-dress',       name: 'Iron Dress',              retailPrice:  8,   commercialPrice:  6.5,  unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'ironing', id: 'iron-suit',        name: 'Iron Suit (2-piece)',     retailPrice: 15,   commercialPrice: 12,    unit: 'per set',  pricingMethod: 'per_item', enabled: true },
  // Dry Cleaning
  { categoryId: 'dry-cleaning', id: 'dry-shirt',   name: 'Dry Clean Shirt',         retailPrice: 20,   commercialPrice: 17,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'dry-cleaning', id: 'dry-suit',    name: 'Dry Clean Suit',          retailPrice: 60,   commercialPrice: 50,    unit: 'per set',  pricingMethod: 'per_item', enabled: true },
  { categoryId: 'dry-cleaning', id: 'dry-dress',   name: 'Dry Clean Dress',         retailPrice: 35,   commercialPrice: 30,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'dry-cleaning', id: 'dry-coat',    name: 'Dry Clean Coat / Jacket', retailPrice: 45,   commercialPrice: 38,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'dry-cleaning', id: 'dry-tie',     name: 'Dry Clean Tie',           retailPrice: 12,   commercialPrice: 10,    unit: 'per item', pricingMethod: 'per_item', enabled: true },
  // Specialist
  { categoryId: 'specialist', id: 'wedding-dress', name: 'Wedding Dress',           retailPrice: 120,  commercialPrice: 100,   unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'specialist', id: 'leather',       name: 'Leather Jacket',          retailPrice:  80,  commercialPrice:  68,   unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'specialist', id: 'curtain',       name: 'Curtains (per panel)',    retailPrice:  25,  commercialPrice:  20,   unit: 'per item', pricingMethod: 'per_item', enabled: true },
  { categoryId: 'specialist', id: 'carpet-sm',     name: 'Carpet (small)',          retailPrice:  50,  commercialPrice:  42,   unit: 'per item', pricingMethod: 'per_item', enabled: true },
];

const SEED_WEIGHT_TIERS = [
  { id: 'wt-1', label: '0 – 2 kg',  minKg: 0,  maxKg: 2,    retailPerKg: 12,  commercialPerKg: 10,  enabled: true },
  { id: 'wt-2', label: '2 – 5 kg',  minKg: 2,  maxKg: 5,    retailPerKg: 10,  commercialPerKg: 8.5, enabled: true },
  { id: 'wt-3', label: '5 – 10 kg', minKg: 5,  maxKg: 10,   retailPerKg:  8,  commercialPerKg: 7,   enabled: true },
  { id: 'wt-4', label: '10 kg +',   minKg: 10, maxKg: null,  retailPerKg:  7,  commercialPerKg: 6,   enabled: true },
];

const SEED_TURNAROUND = [
  { id: 'standard', label: 'Standard', turnaroundDays: 3, badge: '3 days', method: 'none',       surchargeRate: 0,    flatSurcharge: null, enabled: true },
  { id: 'express',  label: 'Express',  turnaroundDays: 1, badge: '24 hrs', method: 'percentage',  surchargeRate: 0.40, flatSurcharge: null, enabled: true },
  { id: 'same-day', label: 'Same-Day', turnaroundDays: 0, badge: 'Today',  method: 'percentage',  surchargeRate: 0.75, flatSurcharge: null, enabled: true },
];

const SEED_BUNDLES = [
  {
    id: 'BND-001',
    name: 'Weekend Wardrobe',
    description: '5 shirts + 3 trousers — Wash & Iron',
    services: [
      { serviceId: 'shirt',   qty: 5 },
      { serviceId: 'trouser', qty: 3 },
    ],
    retailPrice: 55,     retailSavings: 15,
    commercialPrice: 44, commercialSavings: 10.5,
    enabled: true,
  },
  {
    id: 'BND-002',
    name: 'Executive Dry-Clean',
    description: '5 dry-clean shirts + 1 suit',
    services: [
      { serviceId: 'dry-shirt', qty: 5 },
      { serviceId: 'dry-suit',  qty: 1 },
    ],
    retailPrice: 155,     retailSavings: 25,
    commercialPrice: 130, commercialSavings: 20,
    enabled: true,
  },
  {
    id: 'BND-003',
    name: 'Bed & Bath',
    description: '2 double bedsheets + 4 pillowcases + 4 towels',
    services: [
      { serviceId: 'bedsheet-double', qty: 2 },
      { serviceId: 'pillowcase',      qty: 4 },
      { serviceId: 'towel',           qty: 4 },
    ],
    retailPrice: 100,    retailSavings: 12,
    commercialPrice: 80, commercialSavings: 9,
    enabled: true,
  },
];

const SEED_CURRENCIES = [
  { code: 'GHS', name: 'Ghana Cedi',    symbol: 'GH₵', rate: 1,       enabled: true,  isBase: true  },
  { code: 'USD', name: 'US Dollar',     symbol: '$',    rate: 0.066,   enabled: true,  isBase: false },
  { code: 'EUR', name: 'Euro',          symbol: '€',    rate: 0.062,   enabled: false, isBase: false },
  { code: 'GBP', name: 'British Pound', symbol: '£',    rate: 0.052,   enabled: false, isBase: false },
  { code: 'NGN', name: 'Nigerian Naira',symbol: '₦',    rate: 105.5,   enabled: false, isBase: false },
];

const SEED_TAX = {
  mode: 'exclusive',
  vatEnabled: true,     vatRate: 0.125,
  nhilEnabled: true,    nhilRate: 0.025,
  getfundEnabled: false, getfundRate: 0.025,
  taxRegistrationNumber: 'VATG-001234',
  exemptCategories: [],
};

const CATEGORY_META = [
  { id: 'washing',     label: 'Washing',      icon: '🫧' },
  { id: 'bedding',     label: 'Bedding',       icon: '🛏️' },
  { id: 'ironing',     label: 'Ironing Only',  icon: '👔' },
  { id: 'dry-cleaning',label: 'Dry Cleaning',  icon: '✨' },
  { id: 'specialist',  label: 'Specialist',    icon: '⭐' },
];

let _state = {
  itemRules:    SEED_ITEM_RULES.map(r => ({ ...r })),
  weightTiers:  SEED_WEIGHT_TIERS.map(t => ({ ...t })),
  turnaround:   SEED_TURNAROUND.map(t => ({ ...t })),
  bundles:      SEED_BUNDLES.map(b => ({ ...b })),
  currencies:   SEED_CURRENCIES.map(c => ({ ...c })),
  tax:          { ...SEED_TAX },
  mobileMoneyRounding: 0.5,
  outlet:       null,
  lastUpdatedBy: 'System',
  lastUpdatedAt: '2026-06-29T08:00:00',
};

export const getPricingConfig = () => ({
  itemRules:           [..._state.itemRules],
  weightTiers:         [..._state.weightTiers],
  turnaround:          [..._state.turnaround],
  bundles:             [..._state.bundles],
  currencies:          [..._state.currencies],
  tax:                 { ..._state.tax },
  mobileMoneyRounding: _state.mobileMoneyRounding,
  outlet:              _state.outlet,
  lastUpdatedBy:       _state.lastUpdatedBy,
  lastUpdatedAt:       _state.lastUpdatedAt,
  categoryMeta:        CATEGORY_META,
});

export const getCategoryMeta = () => CATEGORY_META;

export function updateItemPrice(id, patch) {
  _state.itemRules = _state.itemRules.map(r => r.id === id ? { ...r, ...patch } : r);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateWeightTier(id, patch) {
  _state.weightTiers = _state.weightTiers.map(t => t.id === id ? { ...t, ...patch } : t);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function addWeightTier(tier) {
  _state.weightTiers = [..._state.weightTiers, { id: `wt-${Date.now()}`, ...tier }];
  _state.lastUpdatedAt = new Date().toISOString();
}

export function removeWeightTier(id) {
  _state.weightTiers = _state.weightTiers.filter(t => t.id !== id);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateTurnaroundOption(id, patch) {
  _state.turnaround = _state.turnaround.map(t => t.id === id ? { ...t, ...patch } : t);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateBundle(id, patch) {
  _state.bundles = _state.bundles.map(b => b.id === id ? { ...b, ...patch } : b);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function addBundle(bundle) {
  _state.bundles = [..._state.bundles, { id: `BND-${String(Date.now()).slice(-5)}`, ...bundle }];
  _state.lastUpdatedAt = new Date().toISOString();
}

export function removeBundle(id) {
  _state.bundles = _state.bundles.filter(b => b.id !== id);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateCurrency(code, patch) {
  _state.currencies = _state.currencies.map(c => c.code === code ? { ...c, ...patch } : c);
  _state.lastUpdatedAt = new Date().toISOString();
}

export function addCurrency(currency) {
  if (_state.currencies.find(c => c.code === currency.code)) return;
  _state.currencies = [..._state.currencies, { isBase: false, enabled: false, ...currency }];
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateTaxConfig(patch) {
  _state.tax = { ..._state.tax, ...patch };
  _state.lastUpdatedAt = new Date().toISOString();
}

export function updateMobileMoneyRounding(value) {
  _state.mobileMoneyRounding = value;
  _state.lastUpdatedAt = new Date().toISOString();
}
