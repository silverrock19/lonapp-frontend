// EP-04: Per-item records linked to posData SEED_ORDERS

export const ITEM_STATUS = {
  RECEIVED:   'RECEIVED',
  SORTING:    'SORTING',
  TAGGED:     'TAGGED',
  WASHING:    'WASHING',
  DRYING:     'DRYING',
  IRONING:    'IRONING',
  QC:         'QC',
  PACKAGED:   'PACKAGED',
  DISPATCHED: 'DISPATCHED',
  REWORK:     'REWORK',
};

export const ITEM_STATUS_LABELS = {
  RECEIVED:   'Received',
  SORTING:    'Sorting',
  TAGGED:     'Tagged',
  WASHING:    'Washing',
  DRYING:     'Drying',
  IRONING:    'Ironing',
  QC:         'QC Check',
  PACKAGED:   'Packaged',
  DISPATCHED: 'Dispatched',
  REWORK:     'Rework',
};

export const ITEM_STATUS_COLOR = {
  RECEIVED:   'bg-neutral-100 text-neutral-700',
  SORTING:    'bg-blue-50 text-blue-700',
  TAGGED:     'bg-accent-50 text-accent-700',
  WASHING:    'bg-cyan-50 text-cyan-700',
  DRYING:     'bg-orange-50 text-orange-700',
  IRONING:    'bg-amber-50 text-amber-700',
  QC:         'bg-purple-50 text-purple-700',
  PACKAGED:   'bg-success/10 text-success',
  DISPATCHED: 'bg-primary-50 text-primary-700',
  REWORK:     'bg-error/10 text-error',
};

// Item records linked to EP-03 mockOrders seed data
// ORD-2026-06-1001 = active order (IN_PROCESSING) — shows items on customer order page
// ORD-2026-06-1002 = active order (QUALITY_CHECK)
const SEED_ITEMS = [
  {
    id: 'ITM-0001',
    barcode: 'LA-10000003-000001',
    orderId: 'ORD-2026-06-1001',
    customerId: 'CUS-2024-003456',
    customerName: 'Kofi Boateng',
    customerRef: '10000003',
    type: 'shirt',
    typeName: 'Shirt / Blouse',
    qty: 4,
    service: 'Wash & Iron',
    status: 'TAGGED',
    location: 'Factory Floor — Sorting Bay',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: 'Good condition', rating: 'good' },
    tags: {
      barcode: { value: 'LA-10000003-000001', printedAt: '2026-06-29T08:30:00', printedBy: 'Ama Otu' },
      hydro: null,
      rfid: null,
    },
    specialCare: false,
    stainRemoval: false,
    flags: [],
    photos: [],
    history: [
      { at: '2026-06-29T08:15:00', event: 'RECEIVED', by: 'Ama Otu', note: 'Item received at intake' },
      { at: '2026-06-29T08:30:00', event: 'TAGGED',   by: 'Ama Otu', note: 'Barcode printed and attached' },
    ],
    createdAt: '2026-06-29T08:15:00',
    updatedAt: '2026-06-29T08:30:00',
  },
  {
    id: 'ITM-0002',
    barcode: 'LA-10000003-000002',
    orderId: 'ORD-2026-06-1001',
    customerId: 'CUS-2024-003456',
    customerName: 'Kofi Boateng',
    customerRef: '10000003',
    type: 'trouser',
    typeName: 'Trouser / Pants',
    qty: 4,
    service: 'Wash & Iron',
    status: 'TAGGED',
    location: 'Factory Floor — Sorting Bay',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: '', rating: 'good' },
    tags: {
      barcode: { value: 'LA-10000003-000002', printedAt: '2026-06-29T08:31:00', printedBy: 'Ama Otu' },
      hydro: null,
      rfid: null,
    },
    specialCare: false,
    stainRemoval: false,
    flags: [],
    photos: [],
    history: [
      { at: '2026-06-29T08:15:00', event: 'RECEIVED', by: 'Ama Otu', note: 'Item received at intake' },
      { at: '2026-06-29T08:31:00', event: 'TAGGED',   by: 'Ama Otu', note: 'Barcode printed and attached' },
    ],
    createdAt: '2026-06-29T08:15:00',
    updatedAt: '2026-06-29T08:31:00',
  },
  {
    id: 'ITM-0003',
    barcode: 'LA-10000002-000001',
    orderId: 'ORD-2026-06-1002',
    customerId: 'CUS-2024-002345',
    customerName: 'Ama Asante',
    customerRef: '10000002',
    type: 'suit',
    typeName: 'Suit (Jacket + Trouser)',
    qty: 2,
    service: 'Dry Cleaning',
    status: 'RECEIVED',
    location: 'Intake Counter',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: 'Silk lining — handle with care', rating: 'good' },
    tags: { barcode: null, hydro: null, rfid: null },
    specialCare: false,
    stainRemoval: true,
    flags: ['STAIN_REMOVAL', 'SPECIAL_INSTRUCTIONS'],
    photos: [],
    history: [
      { at: '2026-06-29T09:30:00', event: 'RECEIVED', by: 'Ama Otu', note: 'Received. Special: silk lining.' },
    ],
    createdAt: '2026-06-29T09:30:00',
    updatedAt: '2026-06-29T09:30:00',
  },
  {
    id: 'ITM-0004',
    barcode: 'LA-10000005-000001',
    orderId: 'ORD-2026-06-1003',
    customerId: 'CUS-2024-005678',
    customerName: 'Yaw Afriyie',
    customerRef: '10000005',
    type: 'shirt',
    typeName: 'Shirt / Blouse',
    qty: 5,
    service: 'Wash & Iron',
    status: 'RECEIVED',
    location: 'Intake Counter',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: '', rating: 'good' },
    tags: { barcode: null, hydro: null, rfid: null },
    specialCare: false,
    stainRemoval: false,
    flags: [],
    photos: [],
    history: [
      { at: '2026-06-29T10:00:00', event: 'RECEIVED', by: 'Kojo Mensah', note: 'Item received at intake' },
    ],
    createdAt: '2026-06-29T10:00:00',
    updatedAt: '2026-06-29T10:00:00',
  },
  {
    id: 'ITM-0005',
    barcode: 'LA-10000005-000002',
    orderId: 'ORD-2026-06-1003',
    customerId: 'CUS-2024-005678',
    customerName: 'Yaw Afriyie',
    customerRef: '10000005',
    type: 'trouser',
    typeName: 'Trouser / Pants',
    qty: 3,
    service: 'Wash & Iron',
    status: 'RECEIVED',
    location: 'Intake Counter',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: '', rating: 'good' },
    tags: { barcode: null, hydro: null, rfid: null },
    specialCare: false,
    stainRemoval: false,
    flags: [],
    photos: [],
    history: [
      { at: '2026-06-29T10:00:00', event: 'RECEIVED', by: 'Kojo Mensah', note: 'Item received at intake' },
    ],
    createdAt: '2026-06-29T10:00:00',
    updatedAt: '2026-06-29T10:00:00',
  },
  {
    id: 'ITM-0006',
    barcode: 'LA-10000005-000003',
    orderId: 'ORD-2026-06-1003',
    customerId: 'CUS-2024-005678',
    customerName: 'Yaw Afriyie',
    customerRef: '10000005',
    type: 'bedsheet',
    typeName: 'Bed Sheet',
    qty: 2,
    service: 'Wash & Iron',
    status: 'RECEIVED',
    location: 'Intake Counter',
    outletId: 'outlet-001',
    outletName: 'CleanPro Osu',
    outletAbbrev: 'OSU',
    condition: { notes: '', rating: 'good' },
    tags: { barcode: null, hydro: null, rfid: null },
    specialCare: false,
    stainRemoval: false,
    flags: [],
    photos: [],
    history: [
      { at: '2026-06-29T10:00:00', event: 'RECEIVED', by: 'Kojo Mensah', note: 'Item received at intake' },
    ],
    createdAt: '2026-06-29T10:00:00',
    updatedAt: '2026-06-29T10:00:00',
  },
];

let _items = SEED_ITEMS.map(i => ({ ...i }));

export const getAllItems        = ()          => [..._items];
export const getItemById       = (id)        => _items.find(i => i.id === id) ?? null;
export const getItemByBarcode  = (barcode)   => _items.find(i => i.barcode === barcode) ?? null;
export const getItemsByOrderId = (orderId)   => _items.filter(i => i.orderId === orderId);
export const getUntaggedItems  = ()          => _items.filter(i => !i.tags.barcode);

export function updateItem(id, patch) {
  const idx = _items.findIndex(i => i.id === id);
  if (idx >= 0) _items[idx] = { ..._items[idx], ...patch, updatedAt: new Date().toISOString() };
  return _items[idx] ?? null;
}

export function addItemEvent(id, event, by, note = '') {
  const item = _items.find(i => i.id === id);
  if (!item) return;
  item.history = [...item.history, { at: new Date().toISOString(), event, by, note }];
  item.updatedAt = new Date().toISOString();
}
