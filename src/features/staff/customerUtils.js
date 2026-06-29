export const TIER_CONFIG = {
  Bronze: { bg: '#FFF4E0', color: '#945800' },
  Silver: { bg: '#F3F4F6', color: '#4B5563' },
  Gold:   { bg: '#FFFBEB', color: '#92400E' },
  VIP:    { bg: '#F3F0FF', color: '#7C3AED' },
};

export const STATUS_CONFIG = {
  Active:    { bg: '#DCFCE7', color: '#14532D', label: 'Active'    },
  Inactive:  { bg: '#F3F4F6', color: '#6B7280', label: 'Inactive'  },
  Suspended: { bg: '#FEE2E2', color: '#991B1B', label: 'Suspended' },
};

export const ORDER_STATUS = {
  Completed:    { bg: '#DCFCE7', color: '#14532D' },
  Processing:   { bg: '#EBF2FD', color: '#1E40AF' },
  'In Transit': { bg: '#FFF4E0', color: '#945800' },
  Cancelled:    { bg: '#FEE2E2', color: '#991B1B' },
};

const AVATAR_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];

export const avatarColor = name =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

export const initials = name => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

export const detectSearchType = query => {
  const q = query.trim();
  if (!q) return null;
  if (q.startsWith('0') || q.startsWith('+233')) return 'phone';
  if (q.includes('@')) return 'email';
  if (q.toUpperCase().startsWith('CUST-')) return 'id';
  return 'name';
};

export const searchTypeLabel = type => ({
  phone: 'Searching by phone',
  email: 'Searching by email',
  id:    'Searching by customer ID',
  name:  'Searching by name',
}[type]);

export const filterCustomers = (customers, query, filters) => {
  let results = [...customers];
  if (query.trim()) {
    const q    = query.trim().toLowerCase();
    const type = detectSearchType(query);
    results = results.filter(c => {
      if (type === 'phone') return c.phone.replace(/[\s+]/g, '').includes(q.replace(/[\s+]/g, ''));
      if (type === 'email') return c.email.toLowerCase().includes(q);
      if (type === 'id')    return c.id.toLowerCase().includes(q);
      return c.name.toLowerCase().includes(q);
    });
  }
  if (filters.tier !== 'All')   results = results.filter(c => c.tier === filters.tier);
  if (filters.status !== 'All') results = results.filter(c => c.status === filters.status);
  if (filters.hasPendingOrders) results = results.filter(c => c.hasPendingOrders);
  if (filters.dateFrom) results = results.filter(c => c.registeredDate >= filters.dateFrom);
  if (filters.dateTo)   results = results.filter(c => c.registeredDate <= filters.dateTo);
  return results;
};
