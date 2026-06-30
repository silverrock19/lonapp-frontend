const SEED_BULK_TIERS = [
  {
    id: 'BLK-001', name: 'Small Bulk', description: '10–49 items: 5% off',
    isActive: true, discountBasis: 'item_count',
    minThreshold: 10, maxThreshold: 49,
    discountType: 'percentage', discountValue: 5,
    appliesToRetail: true, appliesToCommercial: true,
    stackable: true, displayToCustomer: true,
  },
  {
    id: 'BLK-002', name: 'Medium Bulk', description: '50–99 items: 10% off',
    isActive: true, discountBasis: 'item_count',
    minThreshold: 50, maxThreshold: 99,
    discountType: 'percentage', discountValue: 10,
    appliesToRetail: true, appliesToCommercial: true,
    stackable: true, displayToCustomer: true,
  },
  {
    id: 'BLK-003', name: 'Large Bulk', description: '100+ items: 15% off',
    isActive: true, discountBasis: 'item_count',
    minThreshold: 100, maxThreshold: null,
    discountType: 'percentage', discountValue: 15,
    appliesToRetail: true, appliesToCommercial: true,
    stackable: true, displayToCustomer: true,
  },
  {
    id: 'BLK-004', name: 'Commercial Large Load', description: '50 kg+: 20% off — Commercial only',
    isActive: true, discountBasis: 'total_weight',
    minThreshold: 50, maxThreshold: null,
    discountType: 'percentage', discountValue: 20,
    appliesToRetail: false, appliesToCommercial: true,
    stackable: true, displayToCustomer: true,
  },
  {
    id: 'BLK-005', name: 'High Value Order', description: 'Orders over GH₵500: flat GH₵40 off',
    isActive: true, discountBasis: 'order_value',
    minThreshold: 500, maxThreshold: null,
    discountType: 'flat_amount', discountValue: 40,
    appliesToRetail: true, appliesToCommercial: true,
    stackable: false, displayToCustomer: true,
  },
];

const SEED_LOYALTY_TIERS = [
  {
    id: 'LOY-001', name: 'Bronze', displayLabel: 'Bronze', icon: '🥉', color: '#CD7F32',
    qualificationType: 'order_count', minOrders: 1, minSpend: null,
    discountType: 'percentage', discountValue: 5,
    minOrderValue: 0, maxDiscountCap: null,
    stackableWithPromos: false, stackableWithBulk: true,
    isActive: true, evaluationPeriod: 'lifetime', autoUpgrade: true,
    memberCount: 320,
  },
  {
    id: 'LOY-002', name: 'Silver', displayLabel: 'Silver', icon: '🥈', color: '#9CA3AF',
    qualificationType: 'order_count', minOrders: 10, minSpend: null,
    discountType: 'percentage', discountValue: 10,
    minOrderValue: 15, maxDiscountCap: 75,
    stackableWithPromos: false, stackableWithBulk: true,
    isActive: true, evaluationPeriod: 'lifetime', autoUpgrade: true,
    memberCount: 85,
  },
  {
    id: 'LOY-003', name: 'Gold', displayLabel: 'Gold', icon: '🥇', color: '#EAB308',
    qualificationType: 'total_spend', minOrders: null, minSpend: 2000,
    discountType: 'percentage', discountValue: 15,
    minOrderValue: 20, maxDiscountCap: 50,
    stackableWithPromos: false, stackableWithBulk: true,
    isActive: true, evaluationPeriod: 'lifetime', autoUpgrade: true,
    memberCount: 22,
  },
  {
    id: 'LOY-004', name: 'Platinum', displayLabel: 'Platinum', icon: '💎', color: '#8B5CF6',
    qualificationType: 'total_spend', minOrders: null, minSpend: 5000,
    discountType: 'percentage', discountValue: 20,
    minOrderValue: 50, maxDiscountCap: 100,
    stackableWithPromos: false, stackableWithBulk: true,
    isActive: true, evaluationPeriod: 'lifetime', autoUpgrade: true,
    memberCount: 5,
  },
];

const SEED_PROMOTIONS = [
  {
    id: 'PRO-001', name: 'New Year 2026', publicDisplayName: '🎉 New Year Special',
    type: 'discount_code', promoCode: 'NEWYEAR20',
    discountType: 'percentage', discountValue: 20, maxDiscountCap: 100,
    appliesTo: 'all_services', minOrderValue: 0,
    startDate: '2026-01-01', endDate: '2026-01-31',
    totalRedemptionLimit: 500, perCustomerLimit: 1, redemptionCount: 147,
    eligibleCustomers: 'all',
    stackableWithLoyalty: false, stackableWithBulk: false,
    autoApply: false, status: 'expired',
    marketingMessage: 'Start 2026 fresh! 20% off all laundry services.',
  },
  {
    id: 'PRO-002', name: 'Mid-Year Flash Sale', publicDisplayName: '⚡ Flash Sale',
    type: 'discount_code', promoCode: 'FLASH15',
    discountType: 'percentage', discountValue: 15, maxDiscountCap: 50,
    appliesTo: 'all_services', minOrderValue: 50,
    startDate: '2026-06-25', endDate: '2026-07-10',
    totalRedemptionLimit: 200, perCustomerLimit: 2, redemptionCount: 43,
    eligibleCustomers: 'all',
    stackableWithLoyalty: false, stackableWithBulk: false,
    autoApply: false, status: 'active',
    marketingMessage: 'Limited time! 15% off orders over GH₵ 50.',
  },
  {
    id: 'PRO-003', name: 'First Order Welcome', publicDisplayName: '👋 Welcome Discount',
    type: 'automatic', promoCode: null,
    discountType: 'percentage', discountValue: 10, maxDiscountCap: null,
    appliesTo: 'all_services', minOrderValue: 30,
    startDate: '2026-01-01', endDate: null,
    totalRedemptionLimit: null, perCustomerLimit: 1, redemptionCount: 218,
    eligibleCustomers: 'new_only',
    stackableWithLoyalty: false, stackableWithBulk: false,
    autoApply: true, status: 'active',
    marketingMessage: 'Welcome! 10% off your first order.',
  },
  {
    id: 'PRO-004', name: 'Back to School', publicDisplayName: '🎒 Back-to-School',
    type: 'discount_code', promoCode: 'SCHOOL25',
    discountType: 'percentage', discountValue: 25, maxDiscountCap: 60,
    appliesTo: 'all_services', minOrderValue: 80,
    startDate: '2026-08-15', endDate: '2026-09-15',
    totalRedemptionLimit: 150, perCustomerLimit: 1, redemptionCount: 0,
    eligibleCustomers: 'all',
    stackableWithLoyalty: false, stackableWithBulk: false,
    autoApply: false, status: 'scheduled',
    marketingMessage: '25% off for the new school term!',
  },
];

const SEED_CONTRACTS = [
  {
    id: 'CON-001',
    customerId: 'CUS-2024-003456', customerName: 'Kofi Boateng',
    agreementName: 'Kofi VIP 2026',
    agreementType: 'vip',
    effectiveDate: '2026-01-01', expirationDate: '2026-12-31',
    autoRenew: true,
    pricingOverrideType: 'percentage_discount',
    discountPercentage: 20, rateCard: null,
    appliesTo: 'all_services',
    stackableWithPromos: false, stackableWithLoyalty: false,
    visibility: 'show_discount',
    status: 'active',
    monthlyOrders: 8, monthlyRevenue: 320,
  },
  {
    id: 'CON-002',
    customerId: 'CUS-2024-001234', customerName: 'Kwame Mensah',
    agreementName: 'Osu Medical Centre Contract',
    agreementType: 'contract',
    effectiveDate: '2026-01-01', expirationDate: '2026-08-31',
    autoRenew: false,
    pricingOverrideType: 'custom_rate_card',
    discountPercentage: null,
    rateCard: [
      { serviceId: 'shirt',           serviceName: 'Shirt / Blouse',      standardPrice:  8, customPrice: 5.5 },
      { serviceId: 'bedsheet-double', serviceName: 'Bed Sheet (Double)',   standardPrice: 25, customPrice: 18  },
      { serviceId: 'towel',           serviceName: 'Towel',               standardPrice:  8, customPrice:  6  },
      { serviceId: 'dry-suit',        serviceName: 'Dry Clean Suit',      standardPrice: 60, customPrice: 48  },
    ],
    appliesTo: 'selected_services',
    stackableWithPromos: false, stackableWithLoyalty: false,
    visibility: 'show_custom_pricing',
    status: 'active',
    monthlyOrders: 45, monthlyRevenue: 1800,
  },
  {
    id: 'CON-003',
    customerId: 'CUS-2024-005678', customerName: 'Yaw Afriyie',
    agreementName: 'Yaw Family Discount',
    agreementType: 'family',
    effectiveDate: '2026-03-01', expirationDate: '2027-02-28',
    autoRenew: true,
    pricingOverrideType: 'percentage_discount',
    discountPercentage: 12, rateCard: null,
    appliesTo: 'all_services',
    stackableWithPromos: false, stackableWithLoyalty: true,
    visibility: 'show_discount',
    status: 'active',
    monthlyOrders: 3, monthlyRevenue: 280,
  },
];

let _state = {
  bulkTiers:    SEED_BULK_TIERS.map(t => ({ ...t })),
  loyaltyTiers: SEED_LOYALTY_TIERS.map(t => ({ ...t })),
  promotions:   SEED_PROMOTIONS.map(p => ({ ...p })),
  contracts:    SEED_CONTRACTS.map(c => ({ ...c })),
};

export const getDiscountsConfig = () => ({
  bulkTiers:    [..._state.bulkTiers],
  loyaltyTiers: [..._state.loyaltyTiers],
  promotions:   [..._state.promotions],
  contracts:    [..._state.contracts],
});

export const updateBulkTier    = (id, patch) => { _state.bulkTiers    = _state.bulkTiers.map(t => t.id === id ? { ...t, ...patch } : t); };
export const addBulkTier       = (tier)       => { _state.bulkTiers    = [..._state.bulkTiers, { id: `BLK-${String(Date.now()).slice(-5)}`, ...tier }]; };
export const removeBulkTier    = (id)         => { _state.bulkTiers    = _state.bulkTiers.filter(t => t.id !== id); };

export const updateLoyaltyTier = (id, patch) => { _state.loyaltyTiers = _state.loyaltyTiers.map(t => t.id === id ? { ...t, ...patch } : t); };
export const addLoyaltyTier    = (tier)       => { _state.loyaltyTiers = [..._state.loyaltyTiers, { id: `LOY-${String(Date.now()).slice(-5)}`, ...tier }]; };
export const removeLoyaltyTier = (id)         => { _state.loyaltyTiers = _state.loyaltyTiers.filter(t => t.id !== id); };

export const updatePromotion   = (id, patch) => { _state.promotions   = _state.promotions.map(p => p.id === id ? { ...p, ...patch } : p); };
export const addPromotion      = (promo)      => { _state.promotions   = [..._state.promotions, { id: `PRO-${String(Date.now()).slice(-5)}`, redemptionCount: 0, ...promo }]; };
export const removePromotion   = (id)         => { _state.promotions   = _state.promotions.filter(p => p.id !== id); };

export const updateContract    = (id, patch) => { _state.contracts    = _state.contracts.map(c => c.id === id ? { ...c, ...patch } : c); };
export const addContract       = (contract)   => { _state.contracts    = [..._state.contracts, { id: `CON-${String(Date.now()).slice(-5)}`, monthlyOrders: 0, monthlyRevenue: 0, ...contract }]; };
export const removeContract    = (id)         => { _state.contracts    = _state.contracts.filter(c => c.id !== id); };
