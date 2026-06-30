// POS / Walk-in mock data and session store
import { calcTax } from '../pricing/tax.js';

const calcTaxFromBase = base => calcTax(base);

// ── Static customers ─────────────────────────────────────────────────────────

export const MOCK_WALK_IN_CUSTOMERS = [
  { id: 'CUS-2024-001234', ref: '10000001', name: 'Kwame Mensah',  phone: '+233241234567', address: '12 Nkrumah Ave, Osu',          city: 'Accra', ordersCount: 8,  lastVisit: '2026-06-20' },
  { id: 'CUS-2024-002345', ref: '10000002', name: 'Ama Asante',    phone: '+233208765432', address: '5 Ring Road, Adabraka',         city: 'Accra', ordersCount: 3,  lastVisit: '2026-06-25' },
  { id: 'CUS-2024-003456', ref: '10000003', name: 'Kofi Boateng',  phone: '+233270112233', address: '8 Liberation Rd, Cantonments',  city: 'Accra', ordersCount: 15, lastVisit: '2026-06-28' },
  { id: 'CUS-2024-004567', ref: '10000004', name: 'Abena Dankwa',  phone: '+233244556677', address: '23 Tema Road, East Legon',      city: 'Accra', ordersCount: 2,  lastVisit: '2026-06-15' },
  { id: 'CUS-2024-005678', ref: '10000005', name: 'Yaw Afriyie',   phone: '+233201122334', address: '45 Airport Rd, Airport Res.',   city: 'Accra', ordersCount: 6,  lastVisit: '2026-06-27' },
];

// ── Item types with per-item base prices ─────────────────────────────────────

export const ITEM_TYPES = [
  { id: 'shirt',    label: 'Shirt / Blouse',        price: 8  },
  { id: 'trouser',  label: 'Trouser / Pants',        price: 10 },
  { id: 'dress',    label: 'Dress / Skirt',          price: 12 },
  { id: 'suit',     label: 'Suit (Jacket + Trouser)', price: 25 },
  { id: 'bedsheet', label: 'Bed Sheet',              price: 15 },
  { id: 'duvet',    label: 'Duvet / Comforter',      price: 35 },
  { id: 'curtain',  label: 'Curtains (per panel)',   price: 20 },
  { id: 'towel',    label: 'Towel',                  price: 6  },
  { id: 'jacket',   label: 'Jacket / Coat',          price: 18 },
  { id: 'iron_only',label: 'Iron Only',              price: 5  },
];

export const TURNAROUND_OPTIONS = [
  { id: 'standard', label: 'Standard', badge: '3 days',  surchargeLabel: '',         surchargeRate: 0,    flatSurcharge: null },
  { id: 'express',  label: 'Express',  badge: '1 day',   surchargeLabel: '+40%',     surchargeRate: 0.40, flatSurcharge: null },
  { id: 'same_day', label: 'Same-Day', badge: 'Today',   surchargeLabel: '+GH₵ 20',  surchargeRate: null, flatSurcharge: 20   },
];

export const POS_SERVICE_TYPES = [
  { id: 'wash_iron',  label: 'Wash & Iron'     },
  { id: 'wash_only',  label: 'Wash Only'        },
  { id: 'iron_only',  label: 'Iron Only'        },
  { id: 'dry_clean',  label: 'Dry Cleaning'     },
  { id: 'specialist', label: 'Specialist Care'  },
];

export const MOMO_PROVIDERS = [
  { id: 'mtn',       label: 'MTN Mobile Money',  short: 'MTN'       },
  { id: 'vodafone',  label: 'Vodafone Cash',      short: 'Vodafone'  },
  { id: 'airteltigo',label: 'AirtelTigo Money',  short: 'AirtelTigo'},
];

// ── Today's orders (pre-seeded) ───────────────────────────────────────────────

const SEED_ORDERS = [
  {
    id: 'ORD-ACC-0629-0001',
    customer: { id: 'CUS-2024-003456', ref: '10000003', name: 'Kofi Boateng', phone: '+233270112233' },
    service: 'Wash & Iron', turnaround: 'express', deliveryType: 'pickup',
    items: [
      { id: 'i1', barcode: 'LA-10000003-000001', type: 'shirt',   typeName: 'Shirt / Blouse', qty: 4, price: 8,  specialCare: false, stainRemoval: false },
      { id: 'i2', barcode: 'LA-10000003-000002', type: 'trouser', typeName: 'Trouser / Pants', qty: 4, price: 10, specialCare: false, stainRemoval: false },
    ],
    subtotal: 72, surcharge: 28.8, deliveryFee: 0, vat: 15.12, total: 115.92,
    paymentMethod: 'cash', paymentStatus: 'paid', amountPaid: 115.92, balanceDue: 0,
    status: 'RECEIVED', receiptId: 'RCP-ACC-0629-0001-001',
    specialInstructions: '', createdAt: '2026-06-29T08:15:00',
  },
  {
    id: 'ORD-ACC-0629-0002',
    customer: { id: 'CUS-2024-002345', ref: '10000002', name: 'Ama Asante', phone: '+233208765432' },
    service: 'Dry Cleaning', turnaround: 'standard', deliveryType: 'pickup',
    items: [
      { id: 'i3', barcode: 'LA-10000002-000001', type: 'suit', typeName: 'Suit (Jacket + Trouser)', qty: 2, price: 25, specialCare: false, stainRemoval: true },
    ],
    subtotal: 50, surcharge: 0, deliveryFee: 0, vat: 9.75, total: 59.75,
    paymentMethod: 'pay_on_delivery', paymentStatus: 'unpaid', amountPaid: 0, balanceDue: 59.75,
    status: 'RECEIVED', receiptId: 'RCP-ACC-0629-0002-001',
    specialInstructions: 'Handle with care — silk lining', createdAt: '2026-06-29T09:30:00',
  },
  {
    id: 'ORD-ACC-0629-0003',
    customer: { id: 'CUS-2024-005678', ref: '10000005', name: 'Yaw Afriyie', phone: '+233201122334' },
    service: 'Wash & Iron', turnaround: 'standard', deliveryType: 'home_delivery',
    items: [
      { id: 'i4', barcode: 'LA-10000005-000001', type: 'shirt',    typeName: 'Shirt / Blouse', qty: 5, price: 8,  specialCare: false, stainRemoval: false },
      { id: 'i5', barcode: 'LA-10000005-000002', type: 'trouser',  typeName: 'Trouser / Pants', qty: 3, price: 10, specialCare: false, stainRemoval: false },
      { id: 'i6', barcode: 'LA-10000005-000003', type: 'bedsheet', typeName: 'Bed Sheet',       qty: 2, price: 15, specialCare: false, stainRemoval: false },
    ],
    subtotal: 100, surcharge: 0, deliveryFee: 10, vat: 16.5, total: 126.5,
    paymentMethod: 'momo', paymentStatus: 'partial', amountPaid: 60, balanceDue: 66.5,
    status: 'RECEIVED', receiptId: 'RCP-ACC-0629-0003-001',
    specialInstructions: '', createdAt: '2026-06-29T10:00:00',
  },
];

let _todayOrders = [...SEED_ORDERS];

export const getAllTodayOrders  = ()      => [..._todayOrders];
export const getPOSOrderById    = (id)    => _todayOrders.find(o => o.id === id) ?? null;
export const addTodayOrder      = (order) => { _todayOrders.push(order); };
export const updateTodayOrder   = (id, patch) => {
  const idx = _todayOrders.findIndex(o => o.id === id);
  if (idx >= 0) _todayOrders[idx] = { ..._todayOrders[idx], ...patch };
};

// ── Counters ─────────────────────────────────────────────────────────────────

let _orderSeq    = 3;
let _custSeq     = 5678;
let _receiptSeq  = 3;
let _itemSeq     = 6;

export const genOrderId    = ()           => `ORD-ACC-0629-${String(++_orderSeq).padStart(4, '0')}`;
export const genCustomerId = ()           => `CUS-2026-0${String(++_custSeq).padStart(5, '0')}`;
export const genReceiptId  = (orderId)    => `RCP-ACC-0629-${String(++_receiptSeq).padStart(4, '0')}-001`;
export const genItemId     = ()           => String(++_itemSeq);
export const genBarcode    = (custRef)    => `LA-${custRef}-${String(_itemSeq).padStart(6, '0')}`;

// ── Pricing calculation ───────────────────────────────────────────────────────

export function calcPOSPricing(items, turnaround, deliveryType) {
  const baseSubtotal = items.reduce((s, i) => {
    let itemTotal = i.price * i.qty;
    if (i.specialCare)  itemTotal += 5;
    if (i.stainRemoval) itemTotal += 15;
    return s + itemTotal;
  }, 0);

  let surcharge = 0;
  if (turnaround === 'express')  surcharge = Math.round(baseSubtotal * 0.40 * 100) / 100;
  if (turnaround === 'same_day') surcharge = 20;

  const deliveryFee    = deliveryType === 'home_delivery' ? 10 : 0;
  const { totalTax: vat, breakdown: taxBreakdown } = calcTaxFromBase(baseSubtotal + surcharge + deliveryFee);
  const total          = baseSubtotal + surcharge + deliveryFee + vat;

  return { subtotal: baseSubtotal, surcharge, deliveryFee, vat, taxBreakdown, total };
}

// ── Customer search ───────────────────────────────────────────────────────────

let _registeredCustomers = [];

export function searchCustomers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = [...MOCK_WALK_IN_CUSTOMERS, ..._registeredCustomers];
  return all.filter(c =>
    c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
    c.name.toLowerCase().includes(q)
  ).slice(0, 6);
}

export function registerNewCustomer(fields) {
  const phone = fields.phone.startsWith('+233')
    ? fields.phone
    : fields.phone.replace(/^0/, '+233');
  const customer = {
    id:        genCustomerId(),
    ref:       String(Date.now()).slice(-8),
    name:      `${fields.firstName} ${fields.lastName}`,
    phone,
    address:   fields.address,
    city:      fields.city || 'Accra',
    email:     fields.email || null,
    ordersCount: 0,
    lastVisit: '2026-06-29',
    isNew:     true,
  };
  _registeredCustomers.push(customer);
  return customer;
}

// ── Active POS session ────────────────────────────────────────────────────────

const EMPTY_SESSION = {
  customer:            null,
  orderId:             null,
  service:             '',
  turnaround:          'standard',
  deliveryType:        'pickup',
  deliveryAddress:     null,
  specialInstructions: '',
  items:               [],
  subtotal:            0,
  surcharge:           0,
  deliveryFee:         0,
  vat:                 0,
  total:               0,
  paymentMethod:       'cash',
  momoProvider:        'mtn',
  momoPhone:           '',
  splitSecondMethod:   'momo',
  splitAmounts:        { first: '', second: '' },
  amountTendered:      '',
  paymentStatus:       'unpaid',
  amountPaid:          0,
  balanceDue:          0,
  changeGiven:         0,
  paymentRef:          null,
  receiptId:           null,
  status:              'draft',
};

let _session = { ...EMPTY_SESSION };

export const getPOSSession    = ()      => ({ ..._session });
export const updatePOSSession = (patch) => { _session = { ..._session, ...patch }; };
export const clearPOSSession  = ()      => { _session = { ...EMPTY_SESSION }; };
