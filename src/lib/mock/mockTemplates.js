// Mock order templates for US-0089 Create Order Templates
import { calcTax } from '../pricing/tax.js';

const OUTLET = { id: 'outlet-001', name: 'CleanPro Osu', address: '42 Oxford Street, Osu, Accra' };
const ADDR_HOME   = { id: 'addr-1', label: 'Home',   detail: '42 Liberation Road, Osu, Accra',             gps: 'GA-144-2345' };
const ADDR_OFFICE = { id: 'addr-2', label: 'Office', detail: '4 Ringway Estate Close, Cantonments, Accra', gps: 'GA-031-6789' };

function calcEstimate(items, turnaround) {
  const sub      = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const surcharge = turnaround === 'express' ? sub * 0.4 : 0;
  const { totalTax: vat } = calcTax(sub + surcharge);
  return sub + surcharge + 30 + vat; // +30 for pickup+delivery
}

export const MOCK_TEMPLATES = [
  {
    id: 'tmpl-001',
    name: 'Weekly Shirts & Trousers',
    color: '#0E9AA7',
    outlet: OUTLET,
    turnaround: 'standard',
    items: [
      { id: 'ti1', name: 'Shirt / Blouse',  qty: 5, unitPrice: 8,  category: 'washing' },
      { id: 'ti2', name: 'Trouser / Pants', qty: 3, unitPrice: 10, category: 'washing' },
    ],
    deliveryAddress: ADDR_HOME,
    notes: 'Handle with care.',
    usageCount: 12,
    lastUsedAt: '2026-06-15',
    createdAt: '2026-01-10',
  },
  {
    id: 'tmpl-002',
    name: 'Monthly Dry Cleaning',
    color: '#7C3AED',
    outlet: OUTLET,
    turnaround: 'express',
    items: [
      { id: 'ti3', name: 'Suit (2-piece)',  qty: 1, unitPrice: 35, category: 'dry-cleaning' },
      { id: 'ti4', name: 'Dress Shirt',     qty: 3, unitPrice: 10, category: 'dry-cleaning' },
    ],
    deliveryAddress: ADDR_OFFICE,
    notes: '',
    usageCount: 5,
    lastUsedAt: '2026-05-28',
    createdAt: '2026-02-20',
  },
  {
    id: 'tmpl-003',
    name: 'Bedding Set',
    color: '#B45309',
    outlet: OUTLET,
    turnaround: 'standard',
    items: [
      { id: 'ti5', name: 'Duvet / Comforter', qty: 1, unitPrice: 40, category: 'heavy' },
      { id: 'ti6', name: 'Pillow Case',        qty: 4, unitPrice: 5,  category: 'washing' },
      { id: 'ti7', name: 'Bed Sheet',          qty: 2, unitPrice: 15, category: 'washing' },
    ],
    deliveryAddress: ADDR_HOME,
    notes: 'Hypoallergenic wash.',
    usageCount: 3,
    lastUsedAt: '2026-04-10',
    createdAt: '2026-03-01',
  },
].map(t => ({ ...t, estimatedTotal: calcEstimate(t.items, t.turnaround) }));

const MAP = Object.fromEntries(MOCK_TEMPLATES.map(t => [t.id, t]));

export const getTemplate  = id => MAP[id] ?? null;
export const getAllTemplates = () => [...MOCK_TEMPLATES];
