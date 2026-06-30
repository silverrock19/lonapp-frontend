// EP-04: Exceptions — US-0113/0114/0115/0125

export const LOST_STATUSES = {
  reported:     { label: 'Reported',      color: 'bg-amber-50 text-amber-700'   },
  investigating:{ label: 'Investigating', color: 'bg-blue-50 text-blue-700'     },
  found:        { label: 'Found',         color: 'bg-success/10 text-success'   },
  unresolved:   { label: 'Unresolved',    color: 'bg-error/10 text-error'       },
  compensation: { label: 'Compensation',  color: 'bg-purple-50 text-purple-700' },
};

export const DAMAGE_STAGES = [
  { id: 'intake',  label: 'Intake'    },
  { id: 'sorting', label: 'Sorting'   },
  { id: 'washing', label: 'Washing'   },
  { id: 'drying',  label: 'Drying'    },
  { id: 'ironing', label: 'Ironing'   },
  { id: 'qc',      label: 'QC Check'  },
  { id: 'transit', label: 'In Transit'},
];

export const DAMAGE_SEVERITY = [
  { id: 'minor',    label: 'Minor',    color: 'bg-amber-50 text-amber-700 border-amber-200'    },
  { id: 'moderate', label: 'Moderate', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'severe',   label: 'Severe',   color: 'bg-error/10 text-error border-error/30'         },
];

export const DAMAGE_TYPES = [
  'Shrinkage', 'Color bleed', 'Tear / rip', 'Stain (processing)',
  'Burn / scorch', 'Fabric thinning', 'Button / zip damage',
  'Missing item part', 'Mold / mildew', 'Other',
];

export const QUARANTINE_REASONS = [
  { id: 'contamination',         label: 'Contamination'          },
  { id: 'unresolved_damage',     label: 'Unresolved Damage'      },
  { id: 'wrong_item',            label: 'Wrong / Unknown Item'   },
  { id: 'customer_dispute',      label: 'Customer Dispute'       },
  { id: 'awaiting_instructions', label: 'Awaiting Instructions'  },
  { id: 'pest_risk',             label: 'Pest / Bio Risk'        },
];

export const QUARANTINE_STATUSES = {
  held:         { label: 'Held',         color: 'bg-amber-50 text-amber-700'    },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700'      },
  released:     { label: 'Released',     color: 'bg-success/10 text-success'    },
  disposed:     { label: 'Disposed',     color: 'bg-neutral-100 text-neutral-500'},
};

export const QUARANTINE_DISPOSITIONS = [
  { id: 'returned', label: 'Return to customer' },
  { id: 'rewash',   label: 'Send for re-wash'   },
  { id: 'disposed', label: 'Dispose / destroy'  },
  { id: 'refund',   label: 'Refund issued'      },
];

// ── Seed data ─────────────────────────────────────────────

const SEED_LOST = [
  {
    id: 'LOST-2026-0001',
    itemId: 'ITM-0003',
    barcode: 'LA-10000005-000003',
    itemDesc: 'Silk Suit × 1',
    orderId: 'ORD-2026-06-1003',
    customerId: '10000005',
    customerName: 'Kwame Asante',
    reportedBy: 'Ama Otu',
    reportedAt: '2026-06-29T09:00:00',
    status: 'investigating',
    lastSeen: 'Sorting Bay — CleanPro Osu',
    notes: [
      { author: 'Ama Otu', at: '2026-06-29T09:00:00', text: 'Item could not be located after sorting. Barcode last scanned at sorting bay at 08:31.' },
      { author: 'Kojo Mensah', at: '2026-06-29T10:30:00', text: 'Checked all racks and bins in sorting area — not found. Escalating to ops manager.' },
    ],
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: null,
  },
];

const SEED_FOUND = [
  {
    id: 'FOUND-2026-0001',
    description: "Dark grey men's suit jacket, no visible tag, found in drying area between Dryer 1 and Dryer 2",
    foundBy: 'Kojo Mensah',
    foundAt: '2026-06-29T11:00:00',
    foundLocation: 'Drying Area — CleanPro Osu',
    photos: [],
    matchedLostId: null,
    status: 'unmatched',
    notes: 'Fabric feels like silk / wool blend. High-value item.',
  },
];

const SEED_DAMAGE = [
  {
    id: 'DMG-2026-0001',
    itemId: 'ITM-0004',
    barcode: 'LA-10000005-000001',
    itemDesc: 'Dress Shirt × 2',
    orderId: 'ORD-2026-06-1003',
    customerId: '10000005',
    customerName: 'Kwame Asante',
    stage: 'washing',
    damageType: 'Color bleed',
    severity: 'moderate',
    description: 'Color bleed from blue stripe onto white areas during cotton wash cycle.',
    photos: [],
    recordedBy: 'Ama Otu',
    recordedAt: '2026-06-29T10:45:00',
    disputeId: null,
    resolved: false,
  },
  {
    id: 'DMG-2026-0002',
    itemId: 'ITM-0002',
    barcode: 'LA-10000003-000002',
    itemDesc: 'Trouser × 1',
    orderId: 'ORD-2026-06-1001',
    customerId: '10000003',
    customerName: 'Kofi Boateng',
    stage: 'ironing',
    damageType: 'Burn / scorch',
    severity: 'minor',
    description: 'Small scorch mark on inner left leg from ironing station 2.',
    photos: [],
    recordedBy: 'Kojo Mensah',
    recordedAt: '2026-06-28T14:20:00',
    disputeId: null,
    resolved: false,
  },
];

const SEED_QUARANTINE = [
  {
    id: 'QRT-2026-0001',
    itemId: 'ITM-0005',
    barcode: 'LA-10000005-000002',
    itemDesc: 'Bed Linen × 3',
    orderId: 'ORD-2026-06-1003',
    customerId: '10000005',
    customerName: 'Kwame Asante',
    reason: 'contamination',
    notes: 'Found signs of mold on one sheet. Item isolated pending hygiene inspection.',
    heldBy: 'Ama Otu',
    heldAt: '2026-06-29T08:30:00',
    status: 'under_review',
    releasedBy: null,
    releasedAt: null,
    disposition: null,
  },
];

let _lost       = SEED_LOST.map(r  => ({ ...r, notes: [...r.notes] }));
let _found      = [...SEED_FOUND];
let _damage     = [...SEED_DAMAGE];
let _quarantine = [...SEED_QUARANTINE];
let _lostSeq = 1, _foundSeq = 1, _dmgSeq = 2, _qrtSeq = 1;

// ── Lost items ────────────────────────────────────────────
export const getAllLostItems    = ()       => [..._lost];
export const getLostItemById   = (id)     => _lost.find(r => r.id === id)     ?? null;
export const getOpenLostItems  = ()       => _lost.filter(r => r.status === 'reported' || r.status === 'investigating');
export const getLostForItem    = (itemId) => _lost.find(r => r.itemId === itemId) ?? null;

export function reportLostItem(data) {
  const id = `LOST-2026-${String(++_lostSeq).padStart(4, '0')}`;
  const rec = { ...data, id, status: 'reported', notes: [], reportedAt: '2026-06-29T12:00:00', resolvedAt: null, resolvedBy: null, resolutionNote: null };
  _lost = [rec, ..._lost];
  return rec;
}

export function updateLostItem(id, patch) {
  _lost = _lost.map(r => r.id === id ? { ...r, ...patch } : r);
  return _lost.find(r => r.id === id) ?? null;
}

export function addLostNote(id, author, text) {
  _lost = _lost.map(r =>
    r.id === id ? { ...r, notes: [...r.notes, { author, at: '2026-06-29T12:00:00', text }] } : r
  );
}

// ── Found items ───────────────────────────────────────────
export const getAllFoundItems   = () => [..._found];
export const getUnmatchedFound = () => _found.filter(r => r.status === 'unmatched');

export function registerFoundItem(data) {
  const id = `FOUND-2026-${String(++_foundSeq).padStart(4, '0')}`;
  const rec = { ...data, id, status: 'unmatched', matchedLostId: null, photos: [], foundAt: '2026-06-29T12:00:00' };
  _found = [rec, ..._found];
  return rec;
}

export function matchFoundToLost(foundId, lostId) {
  _found = _found.map(r => r.id === foundId ? { ...r, status: 'matched', matchedLostId: lostId } : r);
  _lost  = _lost.map(r  => r.id === lostId  ? { ...r, status: 'found' }  : r);
}

// ── Damage records ────────────────────────────────────────
export const getAllDamageRecords = ()       => [..._damage];
export const getDamageForItem   = (itemId) => _damage.filter(r => r.itemId === itemId);

export function recordDamage(data) {
  const id = `DMG-2026-${String(++_dmgSeq).padStart(4, '0')}`;
  const rec = { ...data, id, photos: [], recordedAt: '2026-06-29T12:00:00', disputeId: null, resolved: false };
  _damage = [rec, ..._damage];
  return rec;
}

export function updateDamageRecord(id, patch) {
  _damage = _damage.map(r => r.id === id ? { ...r, ...patch } : r);
}

// ── Quarantine ────────────────────────────────────────────
export const getAllQuarantine     = ()       => [..._quarantine];
export const getQuarantineForItem = (itemId) => _quarantine.find(r => r.itemId === itemId) ?? null;
export const getActiveQuarantine  = ()       => _quarantine.filter(r => r.status === 'held' || r.status === 'under_review');

export function addToQuarantine(data) {
  const id = `QRT-2026-${String(++_qrtSeq).padStart(4, '0')}`;
  const rec = { ...data, id, status: 'held', heldAt: '2026-06-29T12:00:00', releasedBy: null, releasedAt: null, disposition: null };
  _quarantine = [rec, ..._quarantine];
  return rec;
}

export function updateQuarantine(id, patch) {
  _quarantine = _quarantine.map(r => r.id === id ? { ...r, ...patch } : r);
}

export function releaseFromQuarantine(id, releasedBy, disposition) {
  _quarantine = _quarantine.map(r =>
    r.id === id ? { ...r, status: 'released', releasedBy, releasedAt: '2026-06-29T12:30:00', disposition } : r
  );
}

// ── Stats ─────────────────────────────────────────────────
export function getExceptionStats() {
  return {
    openLost:         _lost.filter(r => r.status === 'reported' || r.status === 'investigating').length,
    unmatchedFound:   _found.filter(r => r.status === 'unmatched').length,
    unresolvedDamage: _damage.filter(r => !r.resolved).length,
    activeQuarantine: _quarantine.filter(r => r.status === 'held' || r.status === 'under_review').length,
  };
}
