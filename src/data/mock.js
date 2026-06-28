// ─── Dashboard ─────────────────────────────────────────────────────────────

export const kpiData = [
  { label: 'Orders today',   value: '48',    trend: '+12% vs yesterday', up: true  },
  { label: 'Revenue (GHS)',  value: '3,240', trend: '+8% vs yesterday',  up: true  },
  { label: 'Active staff',   value: '11',    trend: '2 outlets'                     },
  { label: 'Pending pickups',value: '7',     trend: '▼ 3 from yesterday', down: true},
];

export const recentOrders = [
  { id: '#LA-2048', customer: 'Nana A.',   service: 'Wash + Iron',  amount: 'GHS 75.00',  status: 'Processing' },
  { id: '#LA-2047', customer: 'Kojo B.',   service: 'Dry Clean',    amount: 'GHS 90.00',  status: 'Pickup'     },
  { id: '#LA-2046', customer: 'Adwoa M.',  service: 'Express Wash', amount: 'GHS 112.50', status: 'Delivered'  },
  { id: '#LA-2045', customer: 'Kwame D.',  service: 'Ironing',      amount: 'GHS 40.00',  status: 'Pending'    },
  { id: '#LA-2044', customer: 'Abena S.',  service: 'Wash + Iron',  amount: 'GHS 75.00',  status: 'Delivered'  },
];

export const setupChecklist = [
  { label: 'Company verified',      done: true,  href: '/business'  },
  { label: 'Outlet added',          done: true,  href: '/business?tab=Outlets'  },
  { label: 'Services configured',   done: true,  href: '/business?tab=Services' },
  { label: 'Add payment method',    done: false, href: '/business?tab=Payments' },
  { label: 'Invite staff',          done: false, href: '/staff'     },
];

// ─── Business Profile (US-0010) ────────────────────────────────────────────

export const businessProfile = {
  // View-only metadata
  meta: {
    businessId:       'LB-GH-000001',
    registrationDate: '12 Jan 2026',
    approvalDate:     '15 Jan 2026',
    status:           'Active',
  },

  // Company information
  company: {
    name:               'Sparkle Laundry Ltd',
    email:              'owner@sparkle.com',
    phone:              '+233 24 123 4567',
    whatsapp:           '+233 24 123 4567',
    website:            'sparklelaundry.com',
    address:            '42 Liberation Road, Osu, Accra',
    gps:                'GA-123-4567',
    businessType:       'Retail + Commercial',
    registrationNumber: 'GH-BUS-20241045',
    currency:           'GHS — Ghanaian Cedi',
    description:        'Premier laundry and dry-cleaning service in Accra. Same-day express available.',
    logo:               null,
  },

  // Outlets (US-0010)
  outlets: [
    {
      id: 1, name: 'HQ — Osu', abbrev: 'OSU',
      address: '42 Liberation Road, Osu', phone: '+233 24 123 4567',
      type: 'Drop-off + Factory', enabled: true,
      hours: {
        Mon: { open: '08:00', close: '18:00', enabled: true  },
        Tue: { open: '08:00', close: '18:00', enabled: true  },
        Wed: { open: '08:00', close: '18:00', enabled: true  },
        Thu: { open: '08:00', close: '18:00', enabled: true  },
        Fri: { open: '08:00', close: '17:00', enabled: true  },
        Sat: { open: '09:00', close: '14:00', enabled: true  },
        Sun: { open: null,    close: null,    enabled: false },
      },
    },
    {
      id: 2, name: 'Spintex Outlet', abbrev: 'SPX',
      address: '8 Spintex Road, Spintex', phone: '+233 24 987 6543',
      type: 'Drop-off only', enabled: true,
      hours: {
        Mon: { open: '09:00', close: '18:00', enabled: true  },
        Tue: { open: '09:00', close: '18:00', enabled: true  },
        Wed: { open: '09:00', close: '18:00', enabled: true  },
        Thu: { open: '09:00', close: '18:00', enabled: true  },
        Fri: { open: '09:00', close: '18:00', enabled: true  },
        Sat: { open: '10:00', close: '15:00', enabled: true  },
        Sun: { open: null,    close: null,    enabled: false },
      },
    },
    {
      id: 3, name: 'Tema Factory', abbrev: 'TMA',
      address: 'Industrial Area, Tema', phone: '+233 24 555 1234',
      type: 'Factory only', enabled: false,
      hours: {
        Mon: { open: '07:00', close: '19:00', enabled: true },
        Tue: { open: '07:00', close: '19:00', enabled: true },
        Wed: { open: '07:00', close: '19:00', enabled: true },
        Thu: { open: '07:00', close: '19:00', enabled: true },
        Fri: { open: '07:00', close: '19:00', enabled: true },
        Sat: { open: '08:00', close: '14:00', enabled: true },
        Sun: { open: null,    close: null,    enabled: false},
      },
    },
  ],

  // Services (US-0010)
  services: {
    retail: [
      { id: 'r1', name: 'Washing',       active: true,  price: 'GHS 15/kg'   },
      { id: 'r2', name: 'Ironing',       active: true,  price: 'GHS 8/item'  },
      { id: 'r3', name: 'Dry Cleaning',  active: true,  price: 'GHS 30/item' },
      { id: 'r4', name: 'Folding',       active: false, price: 'GHS 5/kg'    },
      { id: 'r5', name: 'Stain Removal', active: false, price: 'GHS 20/item' },
      { id: 'r6', name: 'Shoe Cleaning', active: false, price: 'GHS 25/pair' },
    ],
    commercial: [
      { id: 'c1', name: 'Bulk Washing',    active: true,  price: 'GHS 12/kg'   },
      { id: 'c2', name: 'Linen Service',   active: true,  price: 'GHS 18/item' },
      { id: 'c3', name: 'Uniform Laundry', active: false, price: 'GHS 10/item' },
    ],
    turnaround: { standard: '3 days', express: '1 day', expressSurcharge: 50, expressEnabled: true },
  },

  // Payments (US-0010)
  payments: {
    methods: [
      { id: 1, type: 'Mobile Money',  provider: 'MTN MoMo', number: '+233 24 123 4567', primary: true  },
      { id: 2, type: 'Bank Transfer', provider: 'GCB Bank', number: 'Acc: 1234567890',  primary: false },
    ],
  },
};

// ─── Admin personal profile (US-0018) ──────────────────────────────────────

export const adminProfile = {
  fullName:    'Ama Kufuor',
  displayName: 'Ama K.',
  email:       'owner@sparkle.com',
  phone:       '+233 24 123 4567',
  jobTitle:    'General Manager',
  photo:       null,

  // Business info fields from US-0018
  business: {
    description: 'Premier laundry and dry-cleaning service in Accra. Same-day express available.',
    website:     'sparklelaundry.com',
    socialLinks: {
      facebook:  'facebook.com/sparklelaundry',
      instagram: 'instagram.com/sparklegh',
      twitter:   '',
    },
    hours: {
      Mon: { open: '08:00', close: '18:00', enabled: true  },
      Tue: { open: '08:00', close: '18:00', enabled: true  },
      Wed: { open: '08:00', close: '18:00', enabled: true  },
      Thu: { open: '08:00', close: '18:00', enabled: true  },
      Fri: { open: '08:00', close: '17:00', enabled: true  },
      Sat: { open: '09:00', close: '14:00', enabled: true  },
      Sun: { open: null,    close: null,    enabled: false },
    },
  },

  // Notification preferences
  notifications: {
    newOrders:    { email: true,  sms: true,  whatsapp: false },
    orderUpdates: { email: true,  sms: true,  whatsapp: false },
    payments:     { email: true,  sms: false, whatsapp: false },
    marketing:    true,
    weeklyReport: true,
  },
};
