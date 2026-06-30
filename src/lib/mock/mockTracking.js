// EP-04: Tracking & Status — US-0109/0110/0111/0112/0124

// ── Physical locations ────────────────────────────────────
export const LOCATIONS = [
  { id: 'loc-osu-intake',   outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'intake',   label: 'Intake Counter',  fullLabel: 'Intake Counter — CleanPro Osu'      },
  { id: 'loc-osu-sorting',  outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'sorting',  label: 'Sorting Bay',     fullLabel: 'Sorting Bay — CleanPro Osu'         },
  { id: 'loc-osu-washing',  outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'washing',  label: 'Washing Area',    fullLabel: 'Washing Area — CleanPro Osu'        },
  { id: 'loc-osu-drying',   outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'drying',   label: 'Drying Area',     fullLabel: 'Drying Area — CleanPro Osu'         },
  { id: 'loc-osu-ironing',  outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'ironing',  label: 'Ironing Station', fullLabel: 'Ironing Station — CleanPro Osu'     },
  { id: 'loc-osu-qc',       outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'qc',       label: 'QC Bay',          fullLabel: 'QC Bay — CleanPro Osu'              },
  { id: 'loc-osu-dispatch', outletId: 'outlet-001', outletName: 'CleanPro Osu',           outletAbbrev: 'OSU', zone: 'dispatch', label: 'Dispatch Counter',fullLabel: 'Dispatch Counter — CleanPro Osu'    },
  { id: 'loc-fpc-intake',   outletId: 'outlet-002', outletName: 'FreshPress Cantonments', outletAbbrev: 'FPC', zone: 'intake',   label: 'Intake Counter',  fullLabel: 'Intake Counter — FreshPress'        },
  { id: 'loc-fpc-washing',  outletId: 'outlet-002', outletName: 'FreshPress Cantonments', outletAbbrev: 'FPC', zone: 'washing',  label: 'Washing Area',    fullLabel: 'Washing Area — FreshPress'          },
  { id: 'loc-fpc-dispatch', outletId: 'outlet-002', outletName: 'FreshPress Cantonments', outletAbbrev: 'FPC', zone: 'dispatch', label: 'Dispatch Counter',fullLabel: 'Dispatch Counter — FreshPress'      },
  { id: 'loc-transit',      outletId: null,          outletName: null,                    outletAbbrev: null,  zone: 'transit',  label: 'In Transit',      fullLabel: 'In Transit'                         },
  { id: 'FPC',         outletId: 'FPC',  zone: 'processing', label: 'Factory Processing Centre',     shortLabel: 'FPC Main'        },
  { id: 'FPC_WASH',    outletId: 'FPC',  zone: 'washing',    label: 'FPC — Washing Hall',            shortLabel: 'FPC Wash'        },
  { id: 'FPC_DRY',     outletId: 'FPC',  zone: 'drying',     label: 'FPC — Drying Room',             shortLabel: 'FPC Dry'         },
  { id: 'FPC_IRON',    outletId: 'FPC',  zone: 'ironing',    label: 'FPC — Ironing Bay',             shortLabel: 'FPC Iron'        },
  { id: 'FPC_QC',      outletId: 'FPC',  zone: 'qc',         label: 'FPC — Quality Control',         shortLabel: 'FPC QC'          },
  { id: 'FPC_PACK',    outletId: 'FPC',  zone: 'dispatch',   label: 'FPC — Packing & Dispatch',      shortLabel: 'FPC Pack'        },
];

export const ZONE_LABELS = {
  intake:   'Intake',
  sorting:  'Sorting',
  washing:  'Washing',
  drying:   'Drying',
  ironing:  'Ironing',
  qc:       'QC',
  dispatch: 'Dispatch',
  transit:  'In Transit',
};

export const ZONE_COLORS = {
  intake:   'bg-neutral-100 text-neutral-700',
  sorting:  'bg-blue-50 text-blue-700',
  washing:  'bg-cyan-50 text-cyan-700',
  drying:   'bg-orange-50 text-orange-700',
  ironing:  'bg-amber-50 text-amber-700',
  qc:       'bg-purple-50 text-purple-700',
  dispatch: 'bg-success/10 text-success',
  transit:  'bg-primary-50 text-primary-700',
};

export const getLocation = (id) => LOCATIONS.find(l => l.id === id) ?? null;
export const getLocationsByOutlet = (outletId) => LOCATIONS.filter(l => l.outletId === outletId);

// ── Status pipeline ───────────────────────────────────────
export const STATUS_PIPELINE = [
  { status: 'RECEIVED',   label: 'Received',   zone: 'intake'   },
  { status: 'SORTING',    label: 'Sorting',    zone: 'sorting'  },
  { status: 'TAGGED',     label: 'Tagged',     zone: 'sorting'  },
  { status: 'WASHING',    label: 'Washing',    zone: 'washing'  },
  { status: 'DRYING',     label: 'Drying',     zone: 'drying'   },
  { status: 'IRONING',    label: 'Ironing',    zone: 'ironing'  },
  { status: 'QC',         label: 'QC Check',   zone: 'qc'       },
  { status: 'PACKAGED',   label: 'Packaged',   zone: 'dispatch' },
  { status: 'DISPATCHED', label: 'Dispatched', zone: 'dispatch' },
];

const PIPELINE_STATUSES = STATUS_PIPELINE.map(s => s.status);

export function nextStatus(current) {
  const idx = PIPELINE_STATUSES.indexOf(current);
  return idx >= 0 && idx < PIPELINE_STATUSES.length - 1 ? PIPELINE_STATUSES[idx + 1] : null;
}

export function statusZone(status) {
  return STATUS_PIPELINE.find(s => s.status === status)?.zone ?? 'intake';
}

export function locationForStatus(status, outletId = 'outlet-001') {
  const zone = statusZone(status);
  return LOCATIONS.find(l => l.outletId === outletId && l.zone === zone)
      ?? LOCATIONS.find(l => l.zone === zone)
      ?? LOCATIONS[0];
}

// ── Batch types ───────────────────────────────────────────
export const BATCH_TYPES = [
  { id: 'wash',     label: 'Wash Load',    statusIn: 'WASHING',  statusOut: 'DRYING',  zone: 'washing' },
  { id: 'dry',      label: 'Dry Run',      statusIn: 'DRYING',   statusOut: 'IRONING', zone: 'drying'  },
  { id: 'dryclean', label: 'Dry Cleaning', statusIn: 'WASHING',  statusOut: 'IRONING', zone: 'washing' },
  { id: 'iron',     label: 'Iron Run',     statusIn: 'IRONING',  statusOut: 'QC',      zone: 'ironing' },
  { id: 'qc',       label: 'QC Batch',     statusIn: 'QC',       statusOut: 'PACKAGED',zone: 'qc'      },
];

export const MACHINES = [
  { id: 'washer-1', label: 'Washer 1',    type: 'wash',     locationId: 'loc-osu-washing'  },
  { id: 'washer-2', label: 'Washer 2',    type: 'wash',     locationId: 'loc-osu-washing'  },
  { id: 'dc-1',     label: 'DC Unit 1',   type: 'dryclean', locationId: 'loc-osu-washing'  },
  { id: 'dryer-1',  label: 'Dryer 1',     type: 'dry',      locationId: 'loc-osu-drying'   },
  { id: 'dryer-2',  label: 'Dryer 2',     type: 'dry',      locationId: 'loc-osu-drying'   },
  { id: 'iron-1',   label: 'Station 1',   type: 'iron',     locationId: 'loc-osu-ironing'  },
  { id: 'iron-2',   label: 'Station 2',   type: 'iron',     locationId: 'loc-osu-ironing'  },
  { id: 'iron-3',   label: 'Station 3',   type: 'iron',     locationId: 'loc-osu-ironing'  },
  { id: 'qc-bay',   label: 'QC Bay',      type: 'qc',       locationId: 'loc-osu-qc'       },
];

export const getMachinesForType = (type) => MACHINES.filter(m => m.type === type);

// ── Seed data ─────────────────────────────────────────────
const SEED_BATCHES = [
  {
    id: 'BATCH-2026-0001',
    name: 'Wash Load A',
    type: 'wash',
    machineId: 'washer-2',
    status: 'active',
    outletId: 'outlet-001',
    locationId: 'loc-osu-washing',
    itemIds: ['ITM-0004', 'ITM-0005'],
    startedAt: '2026-06-29T10:30:00',
    completedAt: null,
    createdBy: 'Kojo Mensah',
    notes: 'Cotton cycle 40°C',
  },
  {
    id: 'BATCH-2026-0002',
    name: 'Iron Run A',
    type: 'iron',
    machineId: 'iron-1',
    status: 'pending',
    outletId: 'outlet-001',
    locationId: 'loc-osu-ironing',
    itemIds: ['ITM-0001', 'ITM-0002'],
    startedAt: null,
    completedAt: null,
    createdBy: 'Ama Otu',
    notes: '',
  },
  {
    id: 'BATCH-2026-0003',
    name: 'Dry Clean C',
    type: 'dryclean',
    machineId: 'dc-1',
    status: 'pending',
    outletId: 'outlet-001',
    locationId: 'loc-osu-washing',
    itemIds: ['ITM-0003'],
    startedAt: null,
    completedAt: null,
    createdBy: 'Kojo Mensah',
    notes: 'Silk suit — gentle cycle only',
  },
  {
    id: 'BATCH-2026-0004',
    name: 'Wash Load X',
    type: 'wash',
    machineId: 'washer-1',
    status: 'completed',
    outletId: 'outlet-001',
    locationId: 'loc-osu-washing',
    itemIds: [],
    startedAt: '2026-06-29T07:00:00',
    completedAt: '2026-06-29T08:45:00',
    createdBy: 'Ama Otu',
    notes: 'Morning first load',
  },
];

const SEED_CHECKPOINTS = [
  { id: 'CHK-0001', itemId: 'ITM-0001', barcode: 'LA-10000003-000001', scannedBy: 'Ama Otu', scanAt: '2026-06-29T08:15:00', fromStatus: null,       toStatus: 'RECEIVED', locationId: 'loc-osu-intake',  notes: '' },
  { id: 'CHK-0002', itemId: 'ITM-0001', barcode: 'LA-10000003-000001', scannedBy: 'Ama Otu', scanAt: '2026-06-29T08:30:00', fromStatus: 'RECEIVED', toStatus: 'TAGGED',   locationId: 'loc-osu-sorting', notes: '' },
  { id: 'CHK-0003', itemId: 'ITM-0002', barcode: 'LA-10000003-000002', scannedBy: 'Ama Otu', scanAt: '2026-06-29T08:31:00', fromStatus: 'RECEIVED', toStatus: 'TAGGED',   locationId: 'loc-osu-sorting', notes: '' },
  { id: 'CHK-0004', itemId: 'ITM-0004', barcode: 'LA-10000005-000001', scannedBy: 'Kojo Mensah', scanAt: '2026-06-29T10:00:00', fromStatus: null,    toStatus: 'RECEIVED', locationId: 'loc-osu-intake',  notes: '' },
  { id: 'CHK-0005', itemId: 'ITM-0005', barcode: 'LA-10000005-000002', scannedBy: 'Kojo Mensah', scanAt: '2026-06-29T10:01:00', fromStatus: null,    toStatus: 'RECEIVED', locationId: 'loc-osu-intake',  notes: '' },
];

const SEED_TRANSFERS = [
  {
    id: 'TXF-2026-0001',
    type: 'item',
    itemIds: ['ITM-0006'],
    batchId: null,
    fromLocationId: 'loc-osu-sorting',
    toLocationId: 'loc-fpc-intake',
    transferredBy: 'Kojo Mensah',
    transferredAt: '2026-06-29T09:45:00',
    receivedBy: null,
    receivedAt: null,
    status: 'in_transit',
    notes: 'Customer requested FreshPress for specialist care',
  },
];

let _batches     = SEED_BATCHES.map(b => ({ ...b, itemIds: [...b.itemIds] }));
let _checkpoints = [...SEED_CHECKPOINTS];
let _transfers   = [...SEED_TRANSFERS];
let _batchSeq    = 4;
let _chkSeq      = 5;
let _txfSeq      = 1;

// ── Batches ───────────────────────────────────────────────
export const getAllBatches        = ()     => [..._batches];
export const getBatchById         = (id)   => _batches.find(b => b.id === id) ?? null;
export const getBatchesForItem    = (id)   => _batches.filter(b => b.itemIds.includes(id));
export const getActiveBatches     = ()     => _batches.filter(b => b.status === 'active');
export const getPendingBatches    = ()     => _batches.filter(b => b.status === 'pending');

export function createBatch(data) {
  const id = `BATCH-2026-${String(++_batchSeq).padStart(4, '0')}`;
  const batch = { ...data, id, status: 'pending', startedAt: null, completedAt: null };
  _batches = [..._batches, batch];
  return batch;
}

export function startBatch(id) {
  _batches = _batches.map(b =>
    b.id === id ? { ...b, status: 'active', startedAt: '2026-06-29T10:45:00' } : b
  );
  return _batches.find(b => b.id === id) ?? null;
}

export function completeBatch(id) {
  _batches = _batches.map(b =>
    b.id === id ? { ...b, status: 'completed', completedAt: '2026-06-29T12:00:00' } : b
  );
  return _batches.find(b => b.id === id) ?? null;
}

export function addItemToBatch(batchId, itemId) {
  _batches = _batches.map(b =>
    b.id === batchId && !b.itemIds.includes(itemId)
      ? { ...b, itemIds: [...b.itemIds, itemId] }
      : b
  );
}

export function removeItemFromBatch(batchId, itemId) {
  _batches = _batches.map(b =>
    b.id === batchId ? { ...b, itemIds: b.itemIds.filter(i => i !== itemId) } : b
  );
}

// ── Checkpoints ───────────────────────────────────────────
export const getAllCheckpoints      = ()       => [..._checkpoints].reverse();
export const getCheckpointsForItem  = (itemId) => _checkpoints.filter(c => c.itemId === itemId).reverse();
export const getRecentCheckpoints   = (n = 20) => [..._checkpoints].reverse().slice(0, n);

export function recordCheckpoint(data) {
  const id = `CHK-${String(++_chkSeq).padStart(4, '0')}`;
  const chk = { ...data, id, scanAt: '2026-06-29T10:45:00' };
  _checkpoints = [..._checkpoints, chk];
  return chk;
}

// ── Transfers ─────────────────────────────────────────────
export const getAllTransfers     = ()     => [..._transfers].reverse();
export const getTransferById    = (id)   => _transfers.find(t => t.id === id) ?? null;
export const getInTransit       = ()     => _transfers.filter(t => t.status === 'in_transit');

export function createTransfer(data) {
  const id = `TXF-2026-${String(++_txfSeq).padStart(4, '0')}`;
  const txf = { ...data, id, status: 'in_transit', transferredAt: '2026-06-29T10:50:00' };
  _transfers = [txf, ..._transfers];
  return txf;
}

export function receiveTransfer(id, receivedBy) {
  _transfers = _transfers.map(t =>
    t.id === id ? { ...t, status: 'received', receivedBy, receivedAt: '2026-06-29T11:30:00' } : t
  );
  return _transfers.find(t => t.id === id) ?? null;
}

// ── Stats ─────────────────────────────────────────────────
export function getTrackingStats(items) {
  return {
    activeBatches:  _batches.filter(b => b.status === 'active').length,
    inTransit:      _transfers.filter(t => t.status === 'in_transit').length,
    scannedToday:   _checkpoints.filter(c => c.scanAt?.startsWith('2026-06-29')).length,
    completedBatches: _batches.filter(b => b.status === 'completed' && b.completedAt?.startsWith('2026-06-29')).length,
  };
}
