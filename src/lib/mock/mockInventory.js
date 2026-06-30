// Categories
export const INVENTORY_CATEGORIES = {
  DETERGENT: 'Detergents & Chemicals',
  PACKAGING: 'Packaging & Bags',
  EQUIPMENT: 'Equipment & Consumables',
  SUPPLIES: 'General Supplies',
};

export const STOCK_STATUSES = {
  OK:   { label: 'In Stock',     color: 'text-success-text', bg: 'bg-success-bg',  dot: 'bg-success' },
  LOW:  { label: 'Low Stock',    color: 'text-warning-text', bg: 'bg-warning-bg',  dot: 'bg-warning' },
  OUT:  { label: 'Out of Stock', color: 'text-error',        bg: 'bg-error-bg',    dot: 'bg-error'   },
};

export const LOCATIONS = ['Osu Branch', 'Spintex Branch', 'Central Warehouse'];

export const MOCK_INVENTORY_ITEMS = [
  {
    id: 'INV-001', name: 'Persil Powder Detergent (5kg)', category: 'DETERGENT',
    unit: 'Bag', unitCost: 85.00, currentStock: 23, reorderLevel: 10, maxStock: 50,
    supplier: 'ChemDistrib Ghana', supplierContact: '+233 24 111 2222',
    locationStock: { 'Osu Branch': 12, 'Spintex Branch': 8, 'Central Warehouse': 3 },
    usagePerDay: 2.1, lastRestocked: '2026-06-20', notes: '',
    movements: [
      { type: 'IN', qty: 20, date: '2026-06-20', by: 'Yaw Owusu', note: 'Monthly restock' },
      { type: 'OUT', qty: 4, date: '2026-06-21', by: 'System', note: 'Daily usage Osu' },
      { type: 'OUT', qty: 3, date: '2026-06-22', by: 'System', note: 'Daily usage Spintex' },
    ],
  },
  {
    id: 'INV-002', name: 'Fabric Softener — Comfort (5L)', category: 'DETERGENT',
    unit: 'Bottle', unitCost: 45.00, currentStock: 6, reorderLevel: 8, maxStock: 30,
    supplier: 'ChemDistrib Ghana', supplierContact: '+233 24 111 2222',
    locationStock: { 'Osu Branch': 4, 'Spintex Branch': 2, 'Central Warehouse': 0 },
    usagePerDay: 0.8, lastRestocked: '2026-06-10', notes: 'Order urgently',
    movements: [
      { type: 'IN', qty: 15, date: '2026-06-10', by: 'Yaw Owusu', note: 'Restock' },
      { type: 'OUT', qty: 9, date: '2026-06-11', by: 'System', note: 'Weekly usage' },
    ],
  },
  {
    id: 'INV-003', name: 'Dry Cleaning Solvent (20L)', category: 'DETERGENT',
    unit: 'Drum', unitCost: 420.00, currentStock: 0, reorderLevel: 2, maxStock: 10,
    supplier: 'Accra Chemical Co.', supplierContact: '+233 30 444 5555',
    locationStock: { 'Osu Branch': 0, 'Spintex Branch': 0, 'Central Warehouse': 0 },
    usagePerDay: 0.3, lastRestocked: '2026-05-30', notes: 'URGENT — out of stock',
    movements: [
      { type: 'IN', qty: 5, date: '2026-05-30', by: 'Abena Ofori', note: 'Quarterly order' },
      { type: 'OUT', qty: 5, date: '2026-06-15', by: 'System', note: 'Usage depleted' },
    ],
  },
  {
    id: 'INV-004', name: 'Wire Hangers (box of 100)', category: 'PACKAGING',
    unit: 'Box', unitCost: 28.00, currentStock: 14, reorderLevel: 5, maxStock: 40,
    supplier: 'Tema Packaging Ltd', supplierContact: '+233 22 333 4444',
    locationStock: { 'Osu Branch': 8, 'Spintex Branch': 6, 'Central Warehouse': 0 },
    usagePerDay: 0.5, lastRestocked: '2026-06-15', notes: '',
    movements: [
      { type: 'IN', qty: 20, date: '2026-06-15', by: 'Yaw Owusu', note: 'Restock' },
    ],
  },
  {
    id: 'INV-005', name: 'Laundry Bags — Large (pack of 50)', category: 'PACKAGING',
    unit: 'Pack', unitCost: 35.00, currentStock: 4, reorderLevel: 6, maxStock: 20,
    supplier: 'Tema Packaging Ltd', supplierContact: '+233 22 333 4444',
    locationStock: { 'Osu Branch': 3, 'Spintex Branch': 1, 'Central Warehouse': 0 },
    usagePerDay: 0.6, lastRestocked: '2026-06-05', notes: '',
    movements: [],
  },
  {
    id: 'INV-006', name: 'Stain Remover Spray (500ml)', category: 'DETERGENT',
    unit: 'Bottle', unitCost: 22.00, currentStock: 18, reorderLevel: 10, maxStock: 40,
    supplier: 'ChemDistrib Ghana', supplierContact: '+233 24 111 2222',
    locationStock: { 'Osu Branch': 10, 'Spintex Branch': 8, 'Central Warehouse': 0 },
    usagePerDay: 0.4, lastRestocked: '2026-06-18', notes: '',
    movements: [
      { type: 'IN', qty: 20, date: '2026-06-18', by: 'Abena Ofori', note: 'Restock' },
    ],
  },
  {
    id: 'INV-007', name: 'Garment Covers / Poly Bags (roll of 200)', category: 'PACKAGING',
    unit: 'Roll', unitCost: 65.00, currentStock: 8, reorderLevel: 4, maxStock: 20,
    supplier: 'Tema Packaging Ltd', supplierContact: '+233 22 333 4444',
    locationStock: { 'Osu Branch': 5, 'Spintex Branch': 3, 'Central Warehouse': 0 },
    usagePerDay: 0.7, lastRestocked: '2026-06-12', notes: '',
    movements: [],
  },
  {
    id: 'INV-008', name: 'Bleach — Jik (4L)', category: 'DETERGENT',
    unit: 'Bottle', unitCost: 18.00, currentStock: 3, reorderLevel: 5, maxStock: 20,
    supplier: 'ChemDistrib Ghana', supplierContact: '+233 24 111 2222',
    locationStock: { 'Osu Branch': 2, 'Spintex Branch': 1, 'Central Warehouse': 0 },
    usagePerDay: 0.3, lastRestocked: '2026-06-01', notes: '',
    movements: [],
  },
];

export function getStockStatus(item) {
  if (item.currentStock === 0) return 'OUT';
  if (item.currentStock <= item.reorderLevel) return 'LOW';
  return 'OK';
}

export function getLowStockItems() {
  return MOCK_INVENTORY_ITEMS.filter(i => getStockStatus(i) !== 'OK');
}

export const getInventoryItem = id => MOCK_INVENTORY_ITEMS.find(i => i.id === id) ?? null;
export const getAllInventoryItems = () => [...MOCK_INVENTORY_ITEMS];
