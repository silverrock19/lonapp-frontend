export const SERVICE_CATEGORIES = [
  {
    id: 'washing',
    label: 'Washing',
    icon: '🫧',
    items: [
      { id: 'shirt',       name: 'Shirt / Blouse',    unitPrice: 8,  unit: 'per item' },
      { id: 't-shirt',     name: 'T-Shirt',           unitPrice: 6,  unit: 'per item' },
      { id: 'trouser',     name: 'Trouser / Pants',   unitPrice: 10, unit: 'per item' },
      { id: 'jeans',       name: 'Jeans',             unitPrice: 12, unit: 'per item' },
      { id: 'dress',       name: 'Dress',             unitPrice: 18, unit: 'per item' },
      { id: 'suit-jacket', name: 'Suit Jacket',       unitPrice: 25, unit: 'per item' },
      { id: 'shorts',      name: 'Shorts',            unitPrice: 6,  unit: 'per item' },
      { id: 'underwear',   name: 'Underwear / Socks', unitPrice: 3,  unit: 'per item' },
    ],
  },
  {
    id: 'bedding',
    label: 'Bedding',
    icon: '🛏️',
    items: [
      { id: 'bedsheet-single', name: 'Bed Sheet (Single)',   unitPrice: 18, unit: 'per item' },
      { id: 'bedsheet-double', name: 'Bed Sheet (Double)',   unitPrice: 25, unit: 'per item' },
      { id: 'pillowcase',      name: 'Pillowcase',           unitPrice: 5,  unit: 'per item' },
      { id: 'duvet-single',    name: 'Duvet Cover (Single)', unitPrice: 30, unit: 'per item' },
      { id: 'duvet-double',    name: 'Duvet Cover (Double)', unitPrice: 40, unit: 'per item' },
      { id: 'towel',           name: 'Towel',                unitPrice: 8,  unit: 'per item' },
    ],
  },
  {
    id: 'ironing',
    label: 'Ironing Only',
    icon: '👔',
    items: [
      { id: 'iron-shirt',   name: 'Iron Shirt / Blouse', unitPrice: 4,  unit: 'per item' },
      { id: 'iron-trouser', name: 'Iron Trouser',        unitPrice: 5,  unit: 'per item' },
      { id: 'iron-dress',   name: 'Iron Dress',          unitPrice: 8,  unit: 'per item' },
      { id: 'iron-suit',    name: 'Iron Suit (2-piece)', unitPrice: 15, unit: 'per set'  },
    ],
  },
  {
    id: 'dry-cleaning',
    label: 'Dry Cleaning',
    icon: '✨',
    items: [
      { id: 'dry-shirt',  name: 'Dry Clean Shirt',          unitPrice: 20, unit: 'per item' },
      { id: 'dry-suit',   name: 'Dry Clean Suit',           unitPrice: 60, unit: 'per set'  },
      { id: 'dry-dress',  name: 'Dry Clean Dress',          unitPrice: 35, unit: 'per item' },
      { id: 'dry-coat',   name: 'Dry Clean Coat / Jacket',  unitPrice: 45, unit: 'per item' },
      { id: 'dry-tie',    name: 'Dry Clean Tie',            unitPrice: 12, unit: 'per item' },
    ],
  },
  {
    id: 'specialist',
    label: 'Specialist',
    icon: '⭐',
    items: [
      { id: 'wedding-dress', name: 'Wedding Dress',       unitPrice: 120, unit: 'per item' },
      { id: 'leather',       name: 'Leather Jacket',      unitPrice: 80,  unit: 'per item' },
      { id: 'curtain',       name: 'Curtains (per panel)',unitPrice: 25,  unit: 'per item' },
      { id: 'carpet-sm',     name: 'Carpet (small)',      unitPrice: 50,  unit: 'per item' },
    ],
  },
];

export const ALL_ITEMS = SERVICE_CATEGORIES.flatMap(c =>
  c.items.map(i => ({ ...i, category: c.id }))
);

import { calcTax } from '../pricing/tax.js';

export function calcPricing(items, turnaround, outlet) {
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * (it.qty || 0), 0);
  let surcharge = 0;
  if (turnaround === 'express')  surcharge = subtotal * (outlet?.expressSurcharge ?? 0.40);
  if (turnaround === 'same-day') surcharge = subtotal * (outlet?.sameDaySurcharge ?? 1.75);
  const pickupFee   = outlet?.pickupFee   ?? 15;
  const deliveryFee = outlet?.deliveryFee ?? 15;
  const servicesTotal = subtotal + surcharge;
  const { totalTax: vat } = calcTax(servicesTotal);
  const total = servicesTotal + pickupFee + deliveryFee + vat;
  return { subtotal, surcharge, pickupFee, deliveryFee, vat, total };
}
