// ─── Roles (from LonApp_Personas_and_RBAC_Matrix_V2.xlsx) ───────────────────

export const ROLES = [
  { code: 'super_admin',       name: 'Super Admin',          level: 'Super Admin', color: '#7C3AED', bg: '#F3F0FF' },
  { code: 'admin',             name: 'Admin',                level: 'Admin',       color: '#0C5FC5', bg: '#EAF2FC' },
  { code: 'ops_manager',       name: 'Operations Manager',   level: 'Manager',     color: '#0E9AA7', bg: '#E6FAFB' },
  { code: 'customer_service',  name: 'Customer Service',     level: 'Staff',       color: '#C77700', bg: '#FFF4E0' },
  { code: 'factory_processor', name: 'Factory Processor',    level: 'Staff',       color: '#6B7280', bg: '#F3F4F6' },
  { code: 'quality_checker',   name: 'Quality Checker',      level: 'Staff',       color: '#1F9D57', bg: '#E6F6EE' },
  { code: 'driver',            name: 'Driver',               level: 'Staff',       color: '#374151', bg: '#E5E7EB' },
  { code: 'accountant',        name: 'Accountant',           level: 'Staff',       color: '#A16207', bg: '#FEF9C3' },
];

// ─── Permission code definitions ──────────────────────────────────────────────

export const PERMISSION_CODES = {
  F:  { label: 'Full',              short: 'F',  color: '#1F9D57', bg: '#E6F6EE', desc: 'Complete access — view, create, edit, delete, approve'  },
  'F*': { label: 'Conditional Full', short: 'F*', color: '#0E9AA7', bg: '#E6FAFB', desc: 'Full access subject to business rules or approval step'   },
  E:  { label: 'Edit',              short: 'E',  color: '#0C5FC5', bg: '#EAF2FC', desc: 'Can view and modify; cannot create or delete'             },
  R:  { label: 'Read Only',         short: 'R',  color: '#C77700', bg: '#FFF4E0', desc: 'View-only; no modifications allowed'                      },
  C:  { label: 'Create Only',       short: 'C',  color: '#7C3AED', bg: '#F3F0FF', desc: 'Can create new records but cannot edit existing ones'     },
  A:  { label: 'Approve',           short: 'A',  color: '#0C5FC5', bg: '#EAF2FC', desc: 'Can review and approve/reject but not modify content'     },
  O:  { label: 'Own Data Only',     short: 'O',  color: '#6B7280', bg: '#F3F4F6', desc: 'Access limited to records they personally created'        },
  T:  { label: "Team Data",         short: "T",  color: "#6B7280", bg: "#F3F4F6", desc: "Access to their team or outlet's data only"        },
  M:  { label: 'Multi-Account',     short: 'M',  color: '#6B7280', bg: '#F3F4F6', desc: 'Access across multiple business accounts'                 },
  N:  { label: 'No Access',         short: 'N',  color: '#9CA3AF', bg: '#F9FAFB', desc: 'No access — action is hidden or disabled for this role'   },
};

// ─── RBAC Matrix — EP-01 features only ───────────────────────────────────────
// Columns map to ROLES.code in order

export const RBAC_FEATURES = [
  {
    category: 'Account & Registration',
    features: [
      {
        story: 'US-0001', name: 'Business Registration — Company Info',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
      {
        story: 'US-0002', name: 'Business Registration — Outlets & Factories',
        permissions: { super_admin: 'F*', admin: 'F*', ops_manager: 'E', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
      {
        story: 'US-0005', name: 'Admin Account Setup',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
      {
        story: 'US-0006', name: 'Business Approval Workflow',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
    ],
  },
  {
    category: 'Authentication',
    features: [
      {
        story: 'US-0008', name: 'Login & Authentication',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'F', customer_service: 'F', factory_processor: 'F', quality_checker: 'F', driver: 'F', accountant: 'F' },
      },
      {
        story: 'US-0009', name: 'Forgot Password / Recovery',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'F', customer_service: 'F', factory_processor: 'F', quality_checker: 'F', driver: 'F', accountant: 'F' },
      },
    ],
  },
  {
    category: 'Security & Sessions',
    features: [
      {
        story: 'US-0012', name: 'Password Change',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'F', customer_service: 'F', factory_processor: 'F', quality_checker: 'F', driver: 'F', accountant: 'F' },
      },
      {
        story: 'US-0016', name: 'Secure Logout',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'F', customer_service: 'F', factory_processor: 'F', quality_checker: 'F', driver: 'F', accountant: 'F' },
      },
      {
        story: 'US-0017', name: 'Session Management',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
    ],
  },
  {
    category: 'Staff & Access Control',
    features: [
      {
        story: 'US-0023', name: 'Staff Account Creation',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'N', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
      {
        story: 'US-0024', name: 'RBAC Management',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'N', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
      {
        story: 'US-0025', name: 'Staff Profile & Employment Status',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'E', customer_service: 'N', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'N' },
      },
    ],
  },
  {
    category: 'Audit & Notifications',
    features: [
      {
        story: 'US-0026', name: 'Activity Audit Trail',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'R', customer_service: 'R', factory_processor: 'N', quality_checker: 'N', driver: 'N', accountant: 'R' },
      },
      {
        story: 'US-0027', name: 'Notification Preferences',
        permissions: { super_admin: 'F', admin: 'F', ops_manager: 'F', customer_service: 'F', factory_processor: 'F', quality_checker: 'F', driver: 'F', accountant: 'F' },
      },
    ],
  },
];

// ─── Staff status meta ────────────────────────────────────────────────────────

export const STAFF_STATUS = {
  active:     { label: 'Active',     dot: '#1F9D57', bg: '#E6F6EE', text: '#13753F' },
  on_leave:   { label: 'On Leave',   dot: '#C77700', bg: '#FFF4E0', text: '#945800' },
  suspended:  { label: 'Suspended',  dot: '#D92D20', bg: '#FDECEA', text: '#A31C12' },
  inactive:   { label: 'Inactive',   dot: '#6B7280', bg: '#F3F4F6', text: '#374151' },
  terminated: { label: 'Terminated', dot: '#374151', bg: '#E5E7EB', text: '#1F2937' },
};

// ─── Mock staff members ───────────────────────────────────────────────────────

export const mockStaff = [
  {
    id: 'ST-001', employeeId: 'EMP-0001',
    name: 'Ama Kufuor', email: 'owner@sparkle.com', phone: '+233 24 123 4567',
    role: 'super_admin', department: 'Management', outlet: 'HQ — Osu',
    employmentType: 'Full-time', startDate: '12 Jan 2026',
    status: 'active', lastActive: '2 min ago',
    photo: null,
  },
  {
    id: 'ST-002', employeeId: 'EMP-0002',
    name: 'Kofi Mensah', email: 'kofi.m@sparkle.com', phone: '+233 24 456 7890',
    role: 'admin', department: 'Management', outlet: 'HQ — Osu',
    employmentType: 'Full-time', startDate: '15 Jan 2026',
    status: 'active', lastActive: '1 hour ago',
    photo: null,
  },
  {
    id: 'ST-003', employeeId: 'EMP-0003',
    name: 'Akua Darko', email: 'akua.d@sparkle.com', phone: '+233 24 789 0123',
    role: 'ops_manager', department: 'Operations', outlet: 'Spintex Outlet',
    employmentType: 'Full-time', startDate: '20 Jan 2026',
    status: 'active', lastActive: '3 hours ago',
    photo: null,
  },
  {
    id: 'ST-004', employeeId: 'EMP-0004',
    name: 'Kweku Asante', email: 'kweku.a@sparkle.com', phone: '+233 24 234 5678',
    role: 'customer_service', department: 'Customer Success', outlet: 'HQ — Osu',
    employmentType: 'Part-time', startDate: '25 Jan 2026',
    status: 'active', lastActive: '5 min ago',
    photo: null,
  },
  {
    id: 'ST-005', employeeId: 'EMP-0005',
    name: 'Abena Boateng', email: 'abena.b@sparkle.com', phone: '+233 24 345 6789',
    role: 'factory_processor', department: 'Operations', outlet: 'Tema Factory',
    employmentType: 'Full-time', startDate: '28 Jan 2026',
    status: 'on_leave', lastActive: '3 days ago',
    photo: null,
  },
  {
    id: 'ST-006', employeeId: 'EMP-0006',
    name: 'Yaw Appiah', email: 'yaw.a@sparkle.com', phone: '+233 24 456 7891',
    role: 'quality_checker', department: 'Quality Assurance', outlet: 'Tema Factory',
    employmentType: 'Full-time', startDate: '1 Feb 2026',
    status: 'active', lastActive: 'Yesterday',
    photo: null,
  },
  {
    id: 'ST-007', employeeId: 'EMP-0007',
    name: 'Kojo Antwi', email: 'kojo.a@sparkle.com', phone: '+233 24 567 8902',
    role: 'driver', department: 'Logistics', outlet: 'HQ — Osu',
    employmentType: 'Contract', startDate: '5 Feb 2026',
    status: 'suspended', lastActive: '2 weeks ago',
    photo: null,
  },
  {
    id: 'ST-008', employeeId: 'EMP-0008',
    name: 'Serwa Boafo', email: 'serwa.b@sparkle.com', phone: '+233 24 678 9013',
    role: 'accountant', department: 'Finance', outlet: 'HQ — Osu',
    employmentType: 'Full-time', startDate: '10 Feb 2026',
    status: 'active', lastActive: '45 min ago',
    photo: null,
  },
];

// ─── Mock active sessions (for Settings > Sessions) ──────────────────────────

export const mockSessions = [
  {
    id: 'sess-001', device: 'Chrome on macOS',
    location: 'Accra, Ghana', ip: '197.255.1.xxx',
    loginTime: 'Jun 28, 2026 · 09:12 AM', lastActive: '2 min ago',
    current: true,
  },
  {
    id: 'sess-002', device: 'Safari on iPhone 15',
    location: 'Accra, Ghana', ip: '197.255.1.xxx',
    loginTime: 'Jun 27, 2026 · 06:45 PM', lastActive: '1 day ago',
    current: false,
  },
  {
    id: 'sess-003', device: 'Chrome on Windows 11',
    location: 'Kumasi, Ghana', ip: '154.161.2.xxx',
    loginTime: 'Jun 26, 2026 · 02:30 PM', lastActive: '2 days ago',
    current: false, unusualLocation: true,
  },
  {
    id: 'sess-004', device: 'Firefox on Ubuntu',
    location: 'Accra, Ghana', ip: '197.255.3.xxx',
    loginTime: 'Jun 24, 2026 · 10:00 AM', lastActive: '4 days ago',
    current: false,
  },
];

// ─── Mock audit log entries (for Settings > Audit Log) ───────────────────────

export const mockAuditLogs = [
  { id: 'AL-001', timestamp: 'Jun 28, 2026 · 09:14 AM', event: 'Login', category: 'auth',    actor: 'Ama Kufuor',   entity: 'Account',      detail: 'Signed in from Chrome on macOS', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-002', timestamp: 'Jun 28, 2026 · 09:18 AM', event: 'Profile Updated', category: 'profile', actor: 'Ama Kufuor', entity: 'Profile',       detail: 'Changed display name from "Ama" to "Ama K."', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-003', timestamp: 'Jun 27, 2026 · 03:22 PM', event: 'Staff Invited',   category: 'staff',   actor: 'Ama Kufuor',   entity: 'Serwa Boafo',  detail: 'Sent invitation to serwa.b@sparkle.com with role Accountant', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-004', timestamp: 'Jun 27, 2026 · 02:45 PM', event: 'Status Changed',  category: 'staff',   actor: 'Ama Kufuor',   entity: 'Kojo Antwi',   detail: 'Employment status changed from Active → Suspended. Reason: Policy violation', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-005', timestamp: 'Jun 27, 2026 · 01:10 PM', event: 'Role Assigned',   category: 'rbac',    actor: 'Kofi Mensah',  entity: 'Akua Darko',   detail: 'Role changed from Customer Service → Operations Manager', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-006', timestamp: 'Jun 26, 2026 · 11:30 AM', event: 'Password Changed',category: 'security',actor: 'Akua Darko',   entity: 'Account',      detail: 'Password updated via Settings > Security', ip: '154.161.2.xxx', result: 'success' },
  { id: 'AL-007', timestamp: 'Jun 26, 2026 · 10:05 AM', event: 'Session Revoked', category: 'security',actor: 'Kofi Mensah',  entity: 'Session',      detail: 'Revoked session on Firefox from Takoradi, Ghana', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-008', timestamp: 'Jun 25, 2026 · 08:55 PM', event: 'Login Failed',    category: 'auth',    actor: 'unknown',      entity: 'Account',      detail: 'Failed login attempt for owner@sparkle.com — incorrect password', ip: '102.89.45.xxx', result: 'failed' },
  { id: 'AL-009', timestamp: 'Jun 25, 2026 · 04:00 PM', event: 'Outlet Disabled', category: 'business',actor: 'Ama Kufuor',   entity: 'Tema Factory', detail: 'Outlet temporarily disabled pending renovation', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-010', timestamp: 'Jun 24, 2026 · 09:30 AM', event: 'Login', category: 'auth',    actor: 'Serwa Boafo',  entity: 'Account',      detail: 'First-time login after invitation accepted', ip: '197.255.3.xxx', result: 'success' },
  { id: 'AL-011', timestamp: 'Jun 23, 2026 · 02:15 PM', event: 'Payment Method Added', category: 'business', actor: 'Ama Kufuor', entity: 'Payments', detail: 'Added GCB Bank bank transfer payment method', ip: '197.255.1.xxx', result: 'success' },
  { id: 'AL-012', timestamp: 'Jun 22, 2026 · 11:00 AM', event: 'Business Info Updated', category: 'business', actor: 'Kofi Mensah', entity: 'Business Profile', detail: 'Updated business description and website URL', ip: '197.255.1.xxx', result: 'success' },
];

export const AUDIT_CATEGORIES = [
  { value: '',         label: 'All categories'  },
  { value: 'auth',     label: 'Authentication'  },
  { value: 'profile',  label: 'Profile'         },
  { value: 'staff',    label: 'Staff'           },
  { value: 'rbac',     label: 'Access Control'  },
  { value: 'security', label: 'Security'        },
  { value: 'business', label: 'Business'        },
];

export const AUDIT_CATEGORY_META = {
  auth:     { bg: '#EAF2FC', text: '#0C5FC5' },
  profile:  { bg: '#F3F0FF', text: '#7C3AED' },
  staff:    { bg: '#FFF4E0', text: '#945800' },
  rbac:     { bg: '#E6FAFB', text: '#0B7C87' },
  security: { bg: '#FDECEA', text: '#A31C12' },
  business: { bg: '#E6F6EE', text: '#13753F' },
};

export const MOCK_ME = {
  fullName:    'Akua Darko',
  displayName: 'Akua D.',
  email:       'akua.darko@sparkle.com',
  phone:       '+233 24 456 7890',
  whatsapp:    '+233 24 456 7890',
  emergencyName:         'Kofi Darko',
  emergencyPhone:        '+233 24 999 8888',
  emergencyRelationship: 'Spouse',
  roleCode:       'ops_manager',
  status:         'active',
  employeeId:     'EMP-003',
  outlet:         'HQ — Osu',
  startDate:      '3 Feb 2025',
  department:     'Operations',
  employmentType: 'Full-time',
};

export const MOCK_OUTLETS = [
  { id: 'osu',     label: 'HQ — Osu' },
  { id: 'spintex', label: 'Spintex Outlet' },
  { id: 'tema',    label: 'Tema Factory' },
];

export const MOCK_DUPLICATE = { phone: '0200000000', name: 'Adwoa M.' };

export const MOCK_CUSTOMERS = [
  {
    id: 'CUST-00421',
    name: 'Abena Mensah',
    phone: '+233 24 487 6543',
    email: 'abena.mensah@email.com',
    status: 'Active',
    tier: 'Gold',
    registeredDate: '2023-03-12',
    hasPendingOrders: true,
    totalOrders: 38,
    totalSpend: 'GH₵ 4,820',
    preferredOutlet: 'Osu HQ',
    addresses: [
      { label: 'Home', line1: '14 Cantonments Road', area: 'Cantonments', city: 'Accra', gps: 'GA-042-5621', primary: true },
      { label: 'Office', line1: '1 Independence Ave', area: 'Ridge', city: 'Accra', gps: 'GA-018-7890', primary: false },
    ],
    recentOrders: [
      { id: 'ORD-2024-1847', date: 'Dec 15, 2024', items: '8 items', amount: 'GH₵ 285.00', status: 'Completed' },
      { id: 'ORD-2024-1701', date: 'Nov 28, 2024', items: '3 items', amount: 'GH₵ 95.00',  status: 'Completed' },
      { id: 'ORD-2025-0041', date: 'Jan 8, 2025',  items: '12 items', amount: 'GH₵ 420.00', status: 'Processing' },
    ],
    lastOrder: { date: 'Jan 8, 2025', amount: 'GH₵ 420.00' },
  },
  {
    id: 'CUST-00189',
    name: 'Kwame Osei',
    phone: '+233 20 012 3456',
    email: 'kwame.osei@gmail.com',
    status: 'Active',
    tier: 'Silver',
    registeredDate: '2022-11-05',
    hasPendingOrders: false,
    totalOrders: 14,
    totalSpend: 'GH₵ 970',
    preferredOutlet: 'Spintex',
    addresses: [
      { label: 'Home', line1: '22 Spintex Road', area: 'Spintex', city: 'Accra', gps: 'GA-154-3301', primary: true },
    ],
    recentOrders: [
      { id: 'ORD-2025-0011', date: 'Jan 3, 2025',  items: '2 items', amount: 'GH₵ 85.00',  status: 'Completed' },
      { id: 'ORD-2024-1604', date: 'Nov 14, 2024', items: '5 items', amount: 'GH₵ 150.00', status: 'Completed' },
    ],
    lastOrder: { date: 'Jan 3, 2025', amount: 'GH₵ 85.00' },
  },
  {
    id: 'CUST-00734',
    name: 'Ama Boateng',
    phone: '+233 27 765 4321',
    email: 'ama.b@outlook.com',
    status: 'Suspended',
    tier: 'Bronze',
    registeredDate: '2023-08-19',
    hasPendingOrders: false,
    totalOrders: 4,
    totalSpend: 'GH₵ 142',
    preferredOutlet: 'Osu HQ',
    addresses: [
      { label: 'Home', line1: '7 Osu Badu Street', area: 'Osu', city: 'Accra', gps: 'GA-033-1190', primary: true },
    ],
    recentOrders: [
      { id: 'ORD-2024-1209', date: 'Oct 28, 2024', items: '1 item', amount: 'GH₵ 42.50', status: 'Completed' },
    ],
    lastOrder: { date: 'Oct 28, 2024', amount: 'GH₵ 42.50' },
  },
  {
    id: 'CUST-00056',
    name: 'Yaw Darko',
    phone: '+233 50 198 7654',
    email: 'yaw.darko@business.gh',
    status: 'Active',
    tier: 'VIP',
    registeredDate: '2021-06-30',
    hasPendingOrders: true,
    totalOrders: 112,
    totalSpend: 'GH₵ 28,450',
    preferredOutlet: 'Osu HQ',
    addresses: [
      { label: 'Office', line1: 'Plot 12, Airport City', area: 'Airport City', city: 'Accra', gps: 'GA-011-0044', primary: true },
      { label: 'Home', line1: '4 Labone Close', area: 'Labone', city: 'Accra', gps: 'GA-028-9912', primary: false },
    ],
    recentOrders: [
      { id: 'ORD-2025-0039', date: 'Jan 9, 2025',  items: '24 items', amount: 'GH₵ 1,240.00', status: 'In Transit' },
      { id: 'ORD-2024-1890', date: 'Dec 22, 2024', items: '18 items', amount: 'GH₵ 890.00',   status: 'Completed' },
      { id: 'ORD-2024-1756', date: 'Dec 1, 2024',  items: '9 items',  amount: 'GH₵ 410.00',   status: 'Completed' },
    ],
    lastOrder: { date: 'Jan 9, 2025', amount: 'GH₵ 1,240.00' },
  },
  {
    id: 'CUST-01102',
    name: 'Efua Asante',
    phone: '+233 24 400 1122',
    email: 'efua.asante@yahoo.com',
    status: 'Inactive',
    tier: 'Bronze',
    registeredDate: '2024-01-08',
    hasPendingOrders: false,
    totalOrders: 2,
    totalSpend: 'GH₵ 44',
    preferredOutlet: 'Tema',
    addresses: [
      { label: 'Home', line1: '5B Community 11', area: 'Tema', city: 'Tema', gps: 'TM-002-5501', primary: true },
    ],
    recentOrders: [
      { id: 'ORD-2024-0831', date: 'Jul 14, 2024', items: '1 item', amount: 'GH₵ 22.00', status: 'Completed' },
    ],
    lastOrder: { date: 'Jul 14, 2024', amount: 'GH₵ 22.00' },
  },
];
