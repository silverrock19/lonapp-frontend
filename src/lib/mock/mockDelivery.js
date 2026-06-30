// EP-04: Delivery & Dispatch — US-0116

export const BUNDLE_STATUSES = {
  pending:    { label: 'Pending Verification', color: 'bg-amber-50 text-amber-700'   },
  verified:   { label: 'Verified — Ready',     color: 'bg-blue-50 text-blue-700'     },
  dispatched: { label: 'Dispatched',           color: 'bg-success/10 text-success'   },
};

const SEED_BUNDLES = [
  {
    id: 'BND-2026-0001',
    orderId: 'ORD-2026-06-1001',
    customerName: 'Kofi Boateng',
    customerPhone: '+233 24 000 0001',
    itemIds: ['ITM-0001', 'ITM-0002'],
    verifiedItemIds: [],
    status: 'pending',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    createdAt: '2026-06-29T10:00:00',
    verifiedAt: null,
    verifiedBy: null,
    dispatchedAt: null,
    dispatchedBy: null,
    notes: '',
    deliveryAddress: '42 Independence Ave, Osu, Accra',
    deliveryMethod: 'pickup',
    gpsCode: 'GA-044-7829',
    isCOD: false,
    codAmount: 0,
    packagingMethod: 'folded',
  },
  {
    id: 'BND-2026-0002',
    orderId: 'ORD-2026-06-1003',
    customerName: 'Kwame Asante',
    customerPhone: '+233 24 000 0002',
    itemIds: ['ITM-0004', 'ITM-0005', 'ITM-0006'],
    verifiedItemIds: ['ITM-0004'],
    status: 'pending',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    createdAt: '2026-06-29T09:30:00',
    verifiedAt: null,
    verifiedBy: null,
    dispatchedAt: null,
    dispatchedBy: null,
    notes: 'ITM-0005 quarantined, ITM-0006 in transit from FreshPress Cantonments.',
    deliveryAddress: '15 Liberation Road, Cantonments, Accra',
    deliveryMethod: 'delivery',
    gpsCode: 'GA-181-3204',
    isCOD: true,
    codAmount: 85.00,
    packagingMethod: 'hung',
  },
];

let _bundles = SEED_BUNDLES.map(b => ({ ...b, itemIds: [...b.itemIds], verifiedItemIds: [...b.verifiedItemIds] }));
let _bundleSeq = 2;

export const getAllBundles     = ()         => [..._bundles];
export const getBundleById     = (id)       => _bundles.find(b => b.id === id) ?? null;
export const getBundleForOrder = (orderId)  => _bundles.find(b => b.orderId === orderId) ?? null;
export const getPendingBundles = ()         => _bundles.filter(b => b.status !== 'dispatched');

export function createBundle(data) {
  const id = `BND-2026-${String(++_bundleSeq).padStart(4, '0')}`;
  const bundle = {
    gpsCode: '',
    isCOD: false,
    codAmount: 0,
    packagingMethod: 'folded',
    ...data,
    id,
    verifiedItemIds: [],
    status: 'pending',
    createdAt: '2026-06-29T12:00:00',
    verifiedAt: null,
    verifiedBy: null,
    dispatchedAt: null,
    dispatchedBy: null,
  };
  _bundles = [bundle, ..._bundles];
  return bundle;
}

export function toggleItemVerified(bundleId, itemId) {
  _bundles = _bundles.map(b => {
    if (b.id !== bundleId) return b;
    const has = b.verifiedItemIds.includes(itemId);
    const verifiedItemIds = has
      ? b.verifiedItemIds.filter(i => i !== itemId)
      : [...b.verifiedItemIds, itemId];
    return { ...b, verifiedItemIds };
  });
}

export function verifyBundle(id, verifiedBy) {
  _bundles = _bundles.map(b =>
    b.id === id ? { ...b, status: 'verified', verifiedAt: '2026-06-29T12:00:00', verifiedBy, verifiedItemIds: [...b.itemIds] } : b
  );
}

export function dispatchBundle(id, dispatchedBy) {
  _bundles = _bundles.map(b =>
    b.id === id ? { ...b, status: 'dispatched', dispatchedAt: '2026-06-29T12:30:00', dispatchedBy } : b
  );
}

export function getDeliveryStats() {
  return {
    pendingVerification: _bundles.filter(b => b.status === 'pending').length,
    verifiedReady:       _bundles.filter(b => b.status === 'verified').length,
    dispatchedToday:     _bundles.filter(b => b.status === 'dispatched').length,
    totalBundles:        _bundles.length,
  };
}
