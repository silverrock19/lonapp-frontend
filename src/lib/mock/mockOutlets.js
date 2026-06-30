const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function defaultHours() {
  return DAYS.reduce((acc, d) => ({
    ...acc,
    [d]: { open: d !== 'Sun', from: '08:00', to: '18:00' },
  }), {});
}

const SEED_LOCATIONS = [
  {
    id: 'LOC-001',
    locationType: 'dual',        // This is the main factory that also takes drop-offs
    name: 'CleanPro HQ — Osu',
    abbrev: 'OSU',
    address: '42 Oxford Street, Osu, Accra',
    gps: 'GA-144-2345',
    phone: '+233 24 123 4567',
    email: 'osu@cleanpro.gh',
    capacity: 500,               // kg/day processing capacity
    equipment: ['Washer x8', 'Dryer x8', 'Industrial Presser x4'],
    linkedFactoryId: null,       // null = this IS the factory
    doublesAsOutlet: true,
    enabled: true,
    hours: defaultHours(),
    expressSurcharge: 0.40,
    sameDaySurcharge: 1.75,
    pickupFee: 15,
    deliveryFee: 15,
    sameDayAvailable: true,
    sameDayCutoff: '10:00',
    createdAt: '2024-01-15',
  },
  {
    id: 'LOC-002',
    locationType: 'outlet-only',
    name: 'Spintex Outlet',
    abbrev: 'SPX',
    address: '8 Spintex Road, Spintex, Accra',
    gps: 'GA-031-6789',
    phone: '+233 24 987 6543',
    email: 'spintex@cleanpro.gh',
    capacity: null,
    equipment: [],
    linkedFactoryId: 'LOC-001',  // linked to HQ factory
    doublesAsOutlet: false,
    enabled: true,
    hours: { ...defaultHours(), Sun: { open: false, from: null, to: null } },
    expressSurcharge: 0.40,
    sameDaySurcharge: 1.75,
    pickupFee: 20,
    deliveryFee: 20,
    sameDayAvailable: false,
    sameDayCutoff: null,
    createdAt: '2024-03-01',
  },
  {
    id: 'LOC-003',
    locationType: 'factory-only',
    name: 'Tema Processing Factory',
    abbrev: 'TMA',
    address: 'Industrial Area, Tema, Greater Accra',
    gps: 'GA-229-4521',
    phone: '+233 24 555 1234',
    email: 'tema@cleanpro.gh',
    capacity: 1200,
    equipment: ['Washer x16', 'Dryer x12', 'Industrial Press x8', 'Dry-Clean Unit x2'],
    linkedFactoryId: null,
    doublesAsOutlet: false,
    enabled: false,            // under construction
    hours: { ...defaultHours(), Sun: { open: false, from: null, to: null } },
    expressSurcharge: null,
    sameDaySurcharge: null,
    pickupFee: null,
    deliveryFee: null,
    sameDayAvailable: false,
    sameDayCutoff: null,
    createdAt: '2025-06-01',
  },
];

let _locations = SEED_LOCATIONS.map(l => ({ ...l }));

export const getLocations    = ()       => [..._locations];
export const getFactories    = ()       => _locations.filter(l => l.locationType !== 'outlet-only');
export const getOutlets      = ()       => _locations.filter(l => l.locationType !== 'factory-only');
export const getLocationById = (id)     => _locations.find(l => l.id === id) ?? null;
export const updateLocation  = (id, p)  => { _locations = _locations.map(l => l.id === id ? { ...l, ...p } : l); };
export const addLocation     = (loc)    => {
  const id = `LOC-${String(Date.now()).slice(-5)}`;
  _locations = [..._locations, { id, createdAt: new Date().toISOString().slice(0, 10), ...loc }];
  return id;
};
export const removeLocation  = (id)     => {
  // BR-003: cannot remove last location
  if (_locations.length <= 1) throw new Error('Cannot remove the last location (BR-003)');
  _locations = _locations.filter(l => l.id !== id);
};

export function validateLocations(locs) {
  const errors = [];
  if (locs.length === 0) errors.push('At least one outlet or factory is required (BR-003)');
  const factories = locs.filter(l => l.locationType !== 'outlet-only');
  const outlets   = locs.filter(l => l.locationType !== 'factory-only');
  if (factories.length > 1) {
    // BR-001: all outlets must be linked to a factory
    const unlinked = outlets.filter(l => l.locationType === 'outlet-only' && !l.linkedFactoryId);
    if (unlinked.length > 0) errors.push(`BR-001: ${unlinked.length} outlet(s) must be linked to a factory when multiple factories exist`);
  }
  return errors;
}

export { defaultHours };
