// EP-04: Tagging mock data — print queue, replacements, RFID, hydro, sequences

export const REPLACEMENT_REASONS = [
  { id: 'damaged_barcode', label: 'Barcode damaged / unreadable' },
  { id: 'damaged_hydro',   label: 'Hydro tag damaged or detached' },
  { id: 'lost_tag',        label: 'Tag lost during processing' },
  { id: 'wrong_item',      label: 'Wrong item was tagged' },
  { id: 'faded_ink',       label: 'Ink faded or smudged' },
  { id: 'other',           label: 'Other (see notes)' },
];

export const HYDRO_MATERIALS = [
  { id: 'standard', label: 'Standard Paper',       waterproof: false, icon: '📄' },
  { id: 'coated',   label: 'Coated Paper',          waterproof: false, icon: '🗒️' },
  { id: 'tyvek',    label: 'Tyvek (Waterproof)',    waterproof: true,  icon: '💧' },
  { id: 'vinyl',    label: 'Vinyl Adhesive Label',  waterproof: true,  icon: '🏷️' },
];

export const TAG_FORMATS = [
  { id: 'barcode', label: 'Barcode (Code128)' },
  { id: 'qr',      label: 'QR Code' },
];

// ── Barcode sequences (per customer ref) ────────────────────────────────────

let _barcodeSeqs = {
  '10000001': 0,
  '10000002': 1,
  '10000003': 2,
  '10000004': 0,
  '10000005': 3,
};

export function nextBarcodeValue(custRef) {
  _barcodeSeqs[custRef] = (_barcodeSeqs[custRef] ?? 0) + 1;
  return `LA-${custRef}-${String(_barcodeSeqs[custRef]).padStart(6, '0')}`;
}

export function peekNextBarcodeValue(custRef) {
  const next = (_barcodeSeqs[custRef] ?? 0) + 1;
  return `LA-${custRef}-${String(next).padStart(6, '0')}`;
}

// ── Print queue ──────────────────────────────────────────────────────────────

const SEED_PRINT_QUEUE = [
  {
    id: 'PQ-001',
    barcode: 'LA-10000003-000001',
    itemId: 'ITM-0001',
    orderId: 'ORD-ACC-0629-0001',
    customerName: 'Kofi Boateng',
    typeName: 'Shirt / Blouse',
    qty: 4,
    service: 'Wash & Iron',
    copies: 1,
    format: 'barcode',
    status: 'printed',
    queuedAt: '2026-06-29T08:28:00',
    printedAt: '2026-06-29T08:30:00',
    printedBy: 'Ama Otu',
  },
  {
    id: 'PQ-002',
    barcode: 'LA-10000003-000002',
    itemId: 'ITM-0002',
    orderId: 'ORD-ACC-0629-0001',
    customerName: 'Kofi Boateng',
    typeName: 'Trouser / Pants',
    qty: 4,
    service: 'Wash & Iron',
    copies: 1,
    format: 'barcode',
    status: 'printed',
    queuedAt: '2026-06-29T08:28:00',
    printedAt: '2026-06-29T08:31:00',
    printedBy: 'Ama Otu',
  },
];

let _printQueue = SEED_PRINT_QUEUE.map(e => ({ ...e }));
let _pqSeq = 2;

export const getPrintQueue        = ()       => [..._printQueue];
export const getPendingPrintQueue = ()       => _printQueue.filter(e => e.status === 'pending');

export function addToPrintQueue(entry) {
  const item = {
    ...entry,
    id: `PQ-${String(++_pqSeq).padStart(3, '0')}`,
    status: 'pending',
    queuedAt: new Date().toISOString(),
    printedAt: null,
    printedBy: null,
  };
  _printQueue.push(item);
  return item;
}

export function markPrintQueueItemPrinted(id, by) {
  const idx = _printQueue.findIndex(e => e.id === id);
  if (idx >= 0) {
    _printQueue[idx] = { ..._printQueue[idx], status: 'printed', printedAt: new Date().toISOString(), printedBy: by };
  }
}

export function removePrintQueueItem(id) {
  _printQueue = _printQueue.filter(e => e.id !== id);
}

// ── Tag replacement history ──────────────────────────────────────────────────

const SEED_REPLACEMENTS = [
  {
    id: 'REPLACEMENT-2026-00001',
    originalBarcode: 'LA-10000003-000001',
    newBarcode: 'LA-10000003-000001',
    itemId: 'ITM-0001',
    orderId: 'ORD-ACC-0629-0001',
    customerName: 'Kofi Boateng',
    typeName: 'Shirt / Blouse',
    reason: 'damaged_barcode',
    reasonLabel: 'Barcode damaged / unreadable',
    replacedBy: 'Ama Otu',
    replacedAt: '2026-06-28T14:20:00',
    confirmScanned: true,
    notes: 'Tag detached during sorting',
  },
];

let _replacements = SEED_REPLACEMENTS.map(r => ({ ...r }));
let _replSeq = 1;

export const getReplacements = () => [..._replacements];

export function addReplacement(entry) {
  const id = `REPLACEMENT-2026-${String(++_replSeq).padStart(5, '0')}`;
  const item = { ...entry, id, replacedAt: new Date().toISOString() };
  _replacements.unshift(item);
  return item;
}

// ── RFID assignments (post-MVP) ──────────────────────────────────────────────

let _rfidAssignments = [];

export const getRFIDAssignments = () => [..._rfidAssignments];

export function addRFIDAssignment(entry) {
  _rfidAssignments.unshift({ ...entry, assignedAt: new Date().toISOString() });
}

// ── Today's stats ────────────────────────────────────────────────────────────

export function getTaggingStats() {
  return {
    taggedToday:    2,
    pendingTag:     4,
    printQueueSize: _printQueue.filter(e => e.status === 'pending').length,
    replacedToday:  _replacements.filter(r => r.replacedAt.startsWith('2026-06-29')).length,
    hydroToday:     0,
    rfidToday:      0,
  };
}
