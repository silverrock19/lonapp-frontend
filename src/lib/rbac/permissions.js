/**
 * RBAC permission map derived from LonApp_Personas_and_RBAC_Matrix_V2.xlsx
 *
 * Access levels:
 *   F = Full (create, read, edit, delete, approve)
 *   E = Edit (read + edit, no delete)
 *   R = Read-only
 *   C = Create only
 *   A = Approve (specialist approval action)
 *   T = Team data (scoped to own team/location)
 *   O = Own data only
 *   M = Multi-account (commercial, cross-location)
 *   N = No access (hidden from UI)
 */

export const ACCESS = {
  FULL: 'F',
  EDIT: 'E',
  READ: 'R',
  CREATE: 'C',
  APPROVE: 'A',
  TEAM: 'T',
  OWN: 'O',
  MULTI: 'M',
  NONE: 'N',
};

/**
 * Feature slugs correspond to nav items and route groups.
 * Each role maps to a set of feature levels.
 */
const N = 'N';
const F = 'F';
const E = 'E';
const R = 'R';
const T = 'T';
const A = 'A';
const O = 'O';
const M = 'M';

export const PERMISSIONS = {
  // ── Super Admin tier ──────────────────────────────────────────────
  owner: {
    orders: F, outlets: F, item_tracking: F, delivery: F,
    customers: F, staff: F, pricing: F, payments: F,
    reports: F, support: F, settings: F, business_profile: F,
    crm: F, inventory: F, platform_admin: N,
  },

  // ── Admin tier ────────────────────────────────────────────────────
  admin: {
    orders: F, outlets: F, item_tracking: F, delivery: F,
    customers: F, staff: F, pricing: F, payments: F,
    reports: F, support: F, settings: F, business_profile: F,
    crm: F, inventory: F, platform_admin: N,
  },

  // ── Manager tier ──────────────────────────────────────────────────
  ops_manager: {
    orders: F, outlets: E, item_tracking: F, delivery: F,
    customers: E, staff: R, pricing: R, payments: R,
    reports: R, support: E, settings: R, business_profile: R,
    crm: R, inventory: R, platform_admin: N,
  },

  finance_manager: {
    // Pricing: A on base price config, F on everything else
    orders: R, outlets: R, item_tracking: R, delivery: R,
    customers: R, staff: R, pricing: F, payments: F,
    reports: F, support: R, settings: R, business_profile: R,
    crm: R, inventory: R, platform_admin: N,
  },

  fleet_manager: {
    orders: N, outlets: N, item_tracking: N, delivery: F,
    customers: N, staff: N, pricing: N, payments: N,
    reports: F, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  price_manager: {
    orders: N, outlets: N, item_tracking: N, delivery: N,
    customers: N, staff: N, pricing: F, payments: N,
    reports: R, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  // ── Staff tier ────────────────────────────────────────────────────
  intake_staff: {
    // T = scoped to own team's items/orders at the outlet
    orders: T, outlets: N, item_tracking: T, delivery: N,
    customers: T, staff: N, pricing: N, payments: T,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  processing_staff: {
    orders: N, outlets: N, item_tracking: T, delivery: N,
    customers: N, staff: N, pricing: N, payments: N,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  driver: {
    orders: T, outlets: N, item_tracking: N, delivery: F,
    customers: N, staff: N, pricing: N, payments: T,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  dispatcher: {
    orders: N, outlets: N, item_tracking: N, delivery: F,
    customers: N, staff: N, pricing: N, payments: N,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  front_desk: {
    orders: T, outlets: N, item_tracking: N, delivery: N,
    customers: E, staff: N, pricing: N, payments: T,
    reports: N, support: R, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  customer_support: {
    orders: E, outlets: N, item_tracking: N, delivery: N,
    customers: E, staff: N, pricing: N, payments: N,
    reports: E, support: F, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  // ── Customer tier ─────────────────────────────────────────────────
  retail_customer: {
    orders: O, outlets: N, item_tracking: O, delivery: N,
    customers: F, staff: N, pricing: R, payments: F,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  commercial_customer: {
    orders: M, outlets: N, item_tracking: M, delivery: N,
    customers: F, staff: N, pricing: R, payments: F,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: N,
  },

  // ── Platform Admin tier ───────────────────────────────────────────
  platform_admin: {
    orders: N, outlets: N, item_tracking: N, delivery: N,
    customers: N, staff: N, pricing: N, payments: N,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: F,
  },

  super_admin: {
    orders: N, outlets: N, item_tracking: N, delivery: N,
    customers: N, staff: N, pricing: N, payments: N,
    reports: N, support: N, settings: N, business_profile: N,
    crm: N, inventory: N, platform_admin: F,
  },
};

/** Returns the access level for a role+feature. Defaults to 'N'. */
export function getAccessLevel(role, feature) {
  return PERMISSIONS[role]?.[feature] ?? N;
}

/** True if the access level grants any view/read capability. */
export function canView(level) {
  return level !== N;
}

/** True if the access level grants write/edit capability. */
export function canEdit(level) {
  return level === F || level === E;
}

/** True if the access level grants full (create/delete) capability. */
export function canCreate(level) {
  return level === F || level === T || level === M || level === O;
}

/** True if the access level grants approval capability. */
export function canApprove(level) {
  return level === F || level === A;
}

/**
 * Home route for each role — where the user lands after login / persona switch.
 * Routes that don't exist yet (e.g. /reports) fall back to '/'.
 */
export const ROLE_HOME = {
  owner:               '/',
  admin:               '/',
  ops_manager:         '/',
  intake_staff:        '/intake',
  processing_staff:    '/tracking',
  finance_manager:     '/',
  fleet_manager:       '/delivery',
  driver:              '/delivery',
  dispatcher:          '/delivery',
  front_desk:          '/pos',
  price_manager:       '/services',
  customer_support:    '/customers',
  retail_customer:     '/app',
  commercial_customer: '/app',
  platform_admin:      '/admin/businesses',
  super_admin:         '/admin/businesses',
};

/**
 * Human-readable role labels for display.
 */
export const ROLE_LABELS = {
  owner:               'Business Owner',
  admin:               'Admin',
  ops_manager:         'Operations Manager',
  intake_staff:        'Intake Staff',
  processing_staff:    'Processing Staff',
  finance_manager:     'Finance Manager',
  fleet_manager:       'Fleet Manager',
  driver:              'Driver',
  dispatcher:          'Dispatcher',
  front_desk:          'Front Desk Staff',
  price_manager:       'Pricing Manager',
  customer_support:    'Customer Support',
  retail_customer:     'Retail Customer',
  commercial_customer: 'Commercial Customer',
  platform_admin:      'Platform Admin',
  super_admin:         'System Admin',
};

/**
 * Persona definitions for the dev switcher, grouped by tier.
 */
export const PERSONA_TIERS = [
  {
    tier: 'Super Admin',
    personas: [
      { role: 'owner', name: 'Ama Kufuor', email: 'ama@cleanpro.com', org: 'CleanPro Ltd', initials: 'AK', accentColor: '#0C5FC5', bgColor: '#EBF2FD' },
    ],
  },
  {
    tier: 'Admin',
    personas: [
      { role: 'admin', name: 'Emmanuel Boateng', email: 'e.boateng@cleanpro.com', org: 'CleanPro Ltd', initials: 'EB', accentColor: '#0C5FC5', bgColor: '#EBF2FD' },
    ],
  },
  {
    tier: 'Manager',
    personas: [
      { role: 'ops_manager',     name: 'Abena Ofori',    email: 'a.ofori@cleanpro.com',   org: 'CleanPro Ltd', initials: 'AO', accentColor: '#7C3AED', bgColor: '#F3F0FF' },
      { role: 'finance_manager', name: 'Kwame Asante',   email: 'k.asante@cleanpro.com',  org: 'CleanPro Ltd', initials: 'KA', accentColor: '#059669', bgColor: '#ECFDF5' },
      { role: 'fleet_manager',   name: 'Joseph Darko',   email: 'j.darko@cleanpro.com',   org: 'CleanPro Ltd', initials: 'JD', accentColor: '#D97706', bgColor: '#FFFBEB' },
      { role: 'price_manager',   name: 'Efua Mensah',    email: 'e.mensah@cleanpro.com',  org: 'CleanPro Ltd', initials: 'EM', accentColor: '#DC2626', bgColor: '#FEF2F2' },
    ],
  },
  {
    tier: 'Staff',
    personas: [
      { role: 'intake_staff',     name: 'Yaw Owusu',     email: 'y.owusu@cleanpro.com',   org: 'CleanPro — Osu', initials: 'YO', accentColor: '#0E9AA7', bgColor: '#E8F9FA' },
      { role: 'processing_staff', name: 'Akua Bonsu',    email: 'a.bonsu@cleanpro.com',   org: 'CleanPro — Osu', initials: 'AB', accentColor: '#0E9AA7', bgColor: '#E8F9FA' },
      { role: 'driver',           name: 'Kofi Amoah',    email: 'k.amoah@cleanpro.com',   org: 'CleanPro Fleet', initials: 'KO', accentColor: '#D97706', bgColor: '#FFFBEB' },
      { role: 'dispatcher',       name: 'Nana Sarpong',  email: 'n.sarpong@cleanpro.com', org: 'CleanPro Fleet', initials: 'NS', accentColor: '#D97706', bgColor: '#FFFBEB' },
      { role: 'front_desk',       name: 'Adjoa Mensah',  email: 'adj.mensah@cleanpro.com',org: 'CleanPro — Spintex', initials: 'AM', accentColor: '#0C5FC5', bgColor: '#EBF2FD' },
      { role: 'customer_support', name: 'Esi Tetteh',    email: 'e.tetteh@cleanpro.com',  org: 'CleanPro Ltd', initials: 'ET', accentColor: '#7C3AED', bgColor: '#F3F0FF' },
    ],
  },
  {
    tier: 'Retail Customer',
    personas: [
      { role: 'retail_customer', name: 'Adwoa Frimpong', email: 'adwoa.f@gmail.com', org: 'Personal', initials: 'AF', accentColor: '#0E9AA7', bgColor: '#E8F9FA' },
    ],
  },
  {
    tier: 'Commercial Customer',
    personas: [
      { role: 'commercial_customer', name: 'GoldCoast Hotels', email: 'laundry@gchotels.com', org: 'GoldCoast Hotels Ltd', initials: 'GC', accentColor: '#059669', bgColor: '#ECFDF5' },
    ],
  },
  {
    tier: 'Platform Admin',
    personas: [
      { role: 'platform_admin', name: 'LonApp Admin', email: 'admin@lonapp.com', org: 'LonApp HQ', initials: 'LA', accentColor: '#374151', bgColor: '#F3F4F6' },
    ],
  },
];
