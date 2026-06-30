// EP-04: Intake & Condition data — US-0106/0107/0108/0119/0120/0121/0122/0123

export const FABRIC_TYPES = [
  { id: 'cotton',    label: 'Cotton'     },
  { id: 'polyester', label: 'Polyester'  },
  { id: 'linen',     label: 'Linen'      },
  { id: 'silk',      label: 'Silk'       },
  { id: 'wool',      label: 'Wool'       },
  { id: 'denim',     label: 'Denim'      },
  { id: 'leather',   label: 'Leather'    },
  { id: 'synthetic', label: 'Synthetic'  },
  { id: 'blend',     label: 'Blend'      },
  { id: 'unknown',   label: 'Unknown'    },
];

export const COLORS = [
  { id: 'black',  label: 'Black',      hex: '#1F2937' },
  { id: 'white',  label: 'White',      hex: '#F9FAFB', border: true },
  { id: 'grey',   label: 'Grey',       hex: '#9CA3AF' },
  { id: 'navy',   label: 'Navy',       hex: '#1E3A5F' },
  { id: 'blue',   label: 'Blue',       hex: '#3B82F6' },
  { id: 'red',    label: 'Red',        hex: '#EF4444' },
  { id: 'green',  label: 'Green',      hex: '#22C55E' },
  { id: 'yellow', label: 'Yellow',     hex: '#EAB308' },
  { id: 'pink',   label: 'Pink',       hex: '#EC4899' },
  { id: 'brown',  label: 'Brown',      hex: '#92400E' },
  { id: 'beige',  label: 'Beige',      hex: '#D2B48C' },
  { id: 'purple', label: 'Purple',     hex: '#A855F7' },
  { id: 'orange', label: 'Orange',     hex: '#F97316' },
  { id: 'multi',  label: 'Multicolor', hex: null },
];

export const PATTERNS = [
  { id: 'solid',   label: 'Solid'       },
  { id: 'striped', label: 'Striped'     },
  { id: 'checked', label: 'Checked'     },
  { id: 'floral',  label: 'Floral'      },
  { id: 'printed', label: 'Printed'     },
  { id: 'denim',   label: 'Denim wash'  },
];

export const DEFECT_TYPES = [
  { id: 'hole',          label: 'Hole'                },
  { id: 'tear',          label: 'Tear / Rip'          },
  { id: 'stain_pre',     label: 'Stain (pre-existing)'},
  { id: 'fade',          label: 'Fading / Discoloration'},
  { id: 'pilling',       label: 'Pilling'             },
  { id: 'button_miss',   label: 'Missing button'      },
  { id: 'zipper',        label: 'Zipper issue'        },
  { id: 'snag',          label: 'Snag'                },
  { id: 'hem_loose',     label: 'Loose hem'           },
  { id: 'seam_open',     label: 'Open seam'           },
];

export const STAIN_TYPES = [
  { id: 'food',    label: 'Food',    abbr: 'FD', fill: '#FEF3C7', stroke: '#D97706', text: '#78350F' },
  { id: 'oil',     label: 'Oil',     abbr: 'OL', fill: '#FDE68A', stroke: '#B45309', text: '#78350F' },
  { id: 'ink',     label: 'Ink',     abbr: 'IN', fill: '#DBEAFE', stroke: '#2563EB', text: '#1E3A8A' },
  { id: 'blood',   label: 'Blood',   abbr: 'BL', fill: '#FEE2E2', stroke: '#DC2626', text: '#7F1D1D' },
  { id: 'mud',     label: 'Mud',     abbr: 'MD', fill: '#D6D3D1', stroke: '#78716C', text: '#292524' },
  { id: 'sweat',   label: 'Sweat',   abbr: 'SW', fill: '#CFFAFE', stroke: '#0891B2', text: '#164E63' },
  { id: 'grease',  label: 'Grease',  abbr: 'GR', fill: '#F3F4F6', stroke: '#4B5563', text: '#111827' },
  { id: 'unknown', label: 'Unknown', abbr: '?',  fill: '#F3F4F6', stroke: '#9CA3AF', text: '#6B7280' },
];

export const SEVERITY_COLORS = {
  light:  { bg: '#FEF9C3', border: '#CA8A04', label: '#92400E' },
  medium: { bg: '#FED7AA', border: '#EA580C', label: '#7C2D12' },
  heavy:  { bg: '#FECACA', border: '#DC2626', label: '#991B1B' },
};

export const CARE_FLAGS = [
  { id: 'delicate',       label: 'Delicate',         desc: 'Handle with extra care'      },
  { id: 'dry_clean_only', label: 'Dry-clean only',   desc: 'Do not wet-wash'             },
  { id: 'hand_wash_only', label: 'Hand-wash only',   desc: 'No machine washing'          },
  { id: 'no_bleach',      label: 'No bleach',        desc: 'No bleaching agents'         },
  { id: 'no_tumble_dry',  label: 'No tumble dry',    desc: 'Air dry only'                },
  { id: 'no_iron',        label: 'Do not iron',      desc: 'No ironing'                  },
  { id: 'separate_wash',  label: 'Separate wash',    desc: 'May bleed — wash separately' },
  { id: 'low_heat',       label: 'Low heat',         desc: 'Maximum 30°C'                },
];

export const PHOTO_TYPES = [
  { id: 'intake_front',  label: 'Front View'    },
  { id: 'intake_back',   label: 'Back View'     },
  { id: 'intake_detail', label: 'Close-up'      },
  { id: 'intake_damage', label: 'Damage / Defect'},
];

function emptyFlags() {
  return Object.fromEntries(CARE_FLAGS.map(f => [f.id, false]));
}

function emptyAttributes() {
  return {
    color:   { primary: null, secondary: null, pattern: null },
    fabric:  { type: null, blend: null },
    weight:  { value: null, unit: 'kg' },
    brand:   '',
    size:    '',
    notes:   '',
  };
}

function emptyCondition() {
  return { rating: null, notes: '', defects: [] };
}

// Seed: 2 items completed, 4 pending
const SEED_INTAKE = {
  'ITM-0001': {
    itemId: 'ITM-0001',
    status: 'completed',
    attributes: {
      color:  { primary: 'black', secondary: null, pattern: 'solid' },
      fabric: { type: 'cotton', blend: null },
      weight: { value: 0.4, unit: 'kg' },
      brand: '',
      size: 'L',
      notes: '',
    },
    condition: {
      rating: 'fair',
      notes: 'Minor wear on collar area. One button slightly loose.',
      defects: [
        { id: 'def-001', type: 'pilling',     location: 'Collar',        severity: 'minor', notes: '' },
        { id: 'def-002', type: 'button_miss', location: 'Left cuff',     severity: 'minor', notes: 'Button still attached but thread fraying' },
      ],
    },
    stains: [
      { id: 'stain-001', x: 0.47, y: 0.44, side: 'front', type: 'food',  severity: 'medium', notes: 'Possible tomato sauce' },
      { id: 'stain-002', x: 0.60, y: 0.72, side: 'back',  type: 'sweat', severity: 'light',  notes: '' },
    ],
    careFlags: { ...emptyFlags(), delicate: false, no_bleach: true },
    photos: [
      { id: 'photo-001', type: 'intake_front', caption: '',  takenAt: '2026-06-29T08:20:00', takenBy: 'Ama Otu', mockIndex: 0 },
      { id: 'photo-002', type: 'intake_back',  caption: '',  takenAt: '2026-06-29T08:21:00', takenBy: 'Ama Otu', mockIndex: 1 },
    ],
    completedAt: '2026-06-29T08:35:00',
    completedBy: 'Ama Otu',
  },
  'ITM-0002': {
    itemId: 'ITM-0002',
    status: 'completed',
    attributes: {
      color:  { primary: 'navy', secondary: null, pattern: 'solid' },
      fabric: { type: 'cotton', blend: null },
      weight: { value: 0.5, unit: 'kg' },
      brand: '',
      size: 'M',
      notes: '',
    },
    condition: { rating: 'good', notes: '', defects: [] },
    stains: [],
    careFlags: emptyFlags(),
    photos: [
      { id: 'photo-003', type: 'intake_front', caption: '', takenAt: '2026-06-29T08:38:00', takenBy: 'Ama Otu', mockIndex: 2 },
    ],
    completedAt: '2026-06-29T08:40:00',
    completedBy: 'Ama Otu',
  },
  'ITM-0003': {
    itemId: 'ITM-0003',
    status: 'pending',
    attributes: emptyAttributes(),
    condition: emptyCondition(),
    stains: [],
    careFlags: { ...emptyFlags(), delicate: true, dry_clean_only: true, no_tumble_dry: true },
    photos: [],
    completedAt: null,
    completedBy: null,
  },
  'ITM-0004': {
    itemId: 'ITM-0004',
    status: 'pending',
    attributes: emptyAttributes(),
    condition: emptyCondition(),
    stains: [],
    careFlags: emptyFlags(),
    photos: [],
    completedAt: null,
    completedBy: null,
  },
  'ITM-0005': {
    itemId: 'ITM-0005',
    status: 'pending',
    attributes: emptyAttributes(),
    condition: emptyCondition(),
    stains: [],
    careFlags: emptyFlags(),
    photos: [],
    completedAt: null,
    completedBy: null,
  },
  'ITM-0006': {
    itemId: 'ITM-0006',
    status: 'pending',
    attributes: emptyAttributes(),
    condition: emptyCondition(),
    stains: [],
    careFlags: emptyFlags(),
    photos: [],
    completedAt: null,
    completedBy: null,
  },
};

let _intake = Object.fromEntries(
  Object.entries(SEED_INTAKE).map(([k, v]) => [k, JSON.parse(JSON.stringify(v))])
);

export const getIntakeData   = (itemId) => _intake[itemId] ?? null;
export const getAllIntakeData = ()       => Object.values(_intake);

export function updateIntakeData(itemId, patch) {
  _intake[itemId] = { ...(_intake[itemId] ?? { itemId }), ...patch };
  return _intake[itemId];
}

export function getIntakeStats() {
  const all = Object.values(_intake);
  return {
    pending:        all.filter(d => d.status === 'pending').length,
    inProgress:     all.filter(d => d.status === 'in_progress').length,
    completedToday: all.filter(d => d.completedAt?.startsWith('2026-06-29')).length,
    totalStains:    all.reduce((n, d) => n + (d.stains?.length ?? 0), 0),
    careFlags:      all.filter(d => Object.values(d.careFlags ?? {}).some(Boolean)).length,
  };
}

let _seq = { stain: 10, defect: 10, photo: 10 };

export function addStain(itemId, stain) {
  const intake = _intake[itemId];
  if (!intake) return null;
  const newStain = { ...stain, id: `stain-${String(++_seq.stain).padStart(3, '0')}` };
  intake.stains = [...(intake.stains ?? []), newStain];
  return newStain;
}

export function updateStain(itemId, stainId, patch) {
  const intake = _intake[itemId];
  if (!intake) return;
  intake.stains = (intake.stains ?? []).map(s => s.id === stainId ? { ...s, ...patch } : s);
}

export function removeStain(itemId, stainId) {
  const intake = _intake[itemId];
  if (!intake) return;
  intake.stains = (intake.stains ?? []).filter(s => s.id !== stainId);
}

export function addDefect(itemId, defect) {
  const intake = _intake[itemId];
  if (!intake) return null;
  const newDefect = { ...defect, id: `def-${String(++_seq.defect).padStart(3, '0')}` };
  intake.condition.defects = [...(intake.condition.defects ?? []), newDefect];
  return newDefect;
}

export function removeDefect(itemId, defectId) {
  const intake = _intake[itemId];
  if (!intake) return;
  intake.condition.defects = (intake.condition.defects ?? []).filter(d => d.id !== defectId);
}

export function addPhoto(itemId, photo) {
  const intake = _intake[itemId];
  if (!intake) return null;
  const idx = (intake.photos?.length ?? 0) % 6;
  const newPhoto = { ...photo, id: `photo-${String(++_seq.photo).padStart(3, '0')}`, takenAt: '2026-06-29T10:00:00', mockIndex: idx };
  intake.photos = [...(intake.photos ?? []), newPhoto];
  return newPhoto;
}

export function removePhoto(itemId, photoId) {
  const intake = _intake[itemId];
  if (!intake) return;
  intake.photos = (intake.photos ?? []).filter(p => p.id !== photoId);
}
