import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import {
  Search, X, ChevronDown, ChevronUp, Phone, Mail,
  ShoppingBag, Eye, MapPin, Calendar, Clock, Plus,
  ChevronRight, AlertCircle, ExternalLink, UserPlus,
  LayoutGrid, List,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  Bronze: { bg: '#FFF4E0', color: '#945800' },
  Silver: { bg: '#F3F4F6', color: '#4B5563' },
  Gold:   { bg: '#FFFBEB', color: '#92400E' },
  VIP:    { bg: '#F3F0FF', color: '#7C3AED' },
};

const STATUS_CONFIG = {
  Active:    { bg: '#DCFCE7', color: '#14532D', label: 'Active' },
  Inactive:  { bg: '#F3F4F6', color: '#6B7280', label: 'Inactive' },
  Suspended: { bg: '#FEE2E2', color: '#991B1B', label: 'Suspended' },
};

const ORDER_STATUS = {
  Completed:   { bg: '#DCFCE7', color: '#14532D' },
  Processing:  { bg: '#EBF2FD', color: '#1E40AF' },
  'In Transit':{ bg: '#FFF4E0', color: '#945800' },
  Cancelled:   { bg: '#FEE2E2', color: '#991B1B' },
};

const MOCK_CUSTOMERS = [
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];

const avatarColor = (name) =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

const initials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
};

const detectSearchType = (query) => {
  const q = query.trim();
  if (!q) return null;
  if (q.startsWith('0') || q.startsWith('+233')) return 'phone';
  if (q.includes('@')) return 'email';
  if (q.toUpperCase().startsWith('CUST-')) return 'id';
  return 'name';
};

const searchTypeLabel = (type) =>
  ({ phone: 'Searching by phone', email: 'Searching by email', id: 'Searching by customer ID', name: 'Searching by name' }[type]);

function filterCustomers(customers, query, filters) {
  let results = [...customers];
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    const type = detectSearchType(query);
    results = results.filter((c) => {
      if (type === 'phone') return c.phone.replace(/[\s+]/g, '').includes(q.replace(/[\s+]/g, ''));
      if (type === 'email') return c.email.toLowerCase().includes(q);
      if (type === 'id')    return c.id.toLowerCase().includes(q);
      return c.name.toLowerCase().includes(q);
    });
  }
  if (filters.tier !== 'All')   results = results.filter((c) => c.tier === filters.tier);
  if (filters.status !== 'All') results = results.filter((c) => c.status === filters.status);
  if (filters.hasPendingOrders) results = results.filter((c) => c.hasPendingOrders);
  if (filters.dateFrom) results = results.filter((c) => c.registeredDate >= filters.dateFrom);
  if (filters.dateTo)   results = results.filter((c) => c.registeredDate <= filters.dateTo);
  return results;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ children, bg, color }) => (
  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
    {children}
  </span>
);

// ─── Pill select ──────────────────────────────────────────────────────────────

const PillSelect = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
          value === opt
            ? 'bg-[#0C5FC5] text-white border-[#0C5FC5]'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#0C5FC5] hover:text-[#0C5FC5]'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="rounded-lg border border-neutral-200 bg-white p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-neutral-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 rounded w-1/3" />
        <div className="h-3 bg-neutral-200 rounded w-2/3" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-7 bg-neutral-200 rounded w-24" />
      <div className="h-7 bg-neutral-200 rounded w-24" />
    </div>
  </div>
);

// ─── Customer card ────────────────────────────────────────────────────────────

const CustomerCard = ({ customer, onViewProfile }) => {
  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;

  return (
    <div
      className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-[#0C5FC5]/40 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onViewProfile(customer)}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold"
          style={{ background: tierCfg.bg, color: tierCfg.color }}
        >
          {initials(customer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-neutral-900 text-sm">{customer.name}</span>
            <Badge bg={statusCfg.bg} color={statusCfg.color}>{statusCfg.label}</Badge>
            <Badge bg={tierCfg.bg} color={tierCfg.color}>{customer.tier}</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{customer.id}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Phone className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Mail className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
          <span className="truncate">{customer.email}</span>
        </div>
        {customer.lastOrder && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ShoppingBag className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
            <span>Last order: {customer.lastOrder.date} · <span className="font-medium text-neutral-700">{customer.lastOrder.amount}</span></span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onViewProfile(customer)}
          className="flex items-center gap-1.5 rounded-md bg-[#0C5FC5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0A4EA0] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Profile
        </button>
        <button className="flex items-center gap-1.5 rounded-md border border-[#0C5FC5] px-3 py-1.5 text-xs font-medium text-[#0C5FC5] hover:bg-[#0C5FC5]/5 transition-colors">
          <ShoppingBag className="h-3.5 w-3.5" />
          Create Order
        </button>
        <a
          href={`tel:${customer.phone}`}
          className="flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-500 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors"
          title={`Call ${customer.phone}`}
        >
          <Phone className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

// ─── Skeleton row (list mode) ─────────────────────────────────────────────────

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-neutral-100 last:border-0">
    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-neutral-200 flex-shrink-0" /><div className="space-y-1.5"><div className="h-3 bg-neutral-200 rounded w-28" /><div className="h-2.5 bg-neutral-200 rounded w-20" /></div></div></td>
    <td className="px-5 py-3.5"><div className="h-3 bg-neutral-200 rounded w-32" /></td>
    <td className="px-5 py-3.5"><div className="h-3 bg-neutral-200 rounded w-36" /></td>
    <td className="px-5 py-3.5"><div className="h-6 bg-neutral-200 rounded-full w-16" /></td>
    <td className="px-5 py-3.5"><div className="h-6 bg-neutral-200 rounded-full w-14" /></td>
    <td className="px-5 py-3.5"><div className="h-3 bg-neutral-200 rounded w-28" /></td>
    <td className="px-5 py-3.5"><div className="flex gap-2"><div className="h-8 bg-neutral-200 rounded-md w-20" /><div className="h-8 bg-neutral-200 rounded-md w-24" /></div></td>
  </tr>
);

// ─── Customer row (list mode) ─────────────────────────────────────────────────

const CustomerRow = ({ customer, onViewProfile }) => {
  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;

  return (
    <tr
      className="border-b border-neutral-100 last:border-0 hover:bg-[#F5F8FF] cursor-pointer transition-colors group"
      onClick={() => onViewProfile(customer)}
    >
      {/* Name + ID */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold"
            style={{ background: tierCfg.bg, color: tierCfg.color }}
          >
            {initials(customer.name)}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-neutral-900 leading-tight group-hover:text-[#0C5FC5] transition-colors">{customer.name}</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">{customer.id}</p>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-5 py-3.5 text-[13px] text-neutral-600 whitespace-nowrap">{customer.phone}</td>

      {/* Email */}
      <td className="px-5 py-3.5 text-[13px] text-neutral-500 max-w-[200px]">
        <span className="truncate block">{customer.email}</span>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          {statusCfg.label}
        </span>
      </td>

      {/* Tier */}
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap"
          style={{ background: tierCfg.bg, color: tierCfg.color }}
        >
          {customer.tier}
        </span>
      </td>

      {/* Last order */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        {customer.lastOrder ? (
          <div>
            <p className="text-[13px] font-semibold text-neutral-800">{customer.lastOrder.amount}</p>
            <p className="text-[12px] text-neutral-400">{customer.lastOrder.date}</p>
          </div>
        ) : (
          <span className="text-neutral-300 text-[13px]">No orders</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(customer)}
            className="flex items-center gap-1.5 rounded-lg bg-[#0C5FC5] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0A4EA0] transition-colors whitespace-nowrap shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            Profile
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-semibold text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors whitespace-nowrap">
            <ShoppingBag className="h-3.5 w-3.5" />
            New Order
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Customer Detail Panel ────────────────────────────────────────────────────

const CustomerDetailPanel = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!customer) return null;

  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;
  const avatar    = avatarColor(customer.name);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-neutral-100 px-6 py-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className="h-14 w-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold"
              style={{ background: avatar.background, color: avatar.color }}
            >
              {initials(customer.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-[17px] font-bold text-neutral-900 leading-tight">{customer.name}</h2>
                  <p className="text-[13px] text-neutral-400 mt-0.5 font-mono">{customer.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-600" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge bg={statusCfg.bg} color={statusCfg.color}>{statusCfg.label}</Badge>
                <Badge bg={tierCfg.bg} color={tierCfg.color}>{customer.tier} tier</Badge>
                {customer.hasPendingOrders && (
                  <Badge bg="#FFF4E0" color="#945800">Pending order</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Total orders', value: customer.totalOrders },
              { label: 'Total spend',  value: customer.totalSpend },
              { label: 'Outlet',       value: customer.preferredOutlet },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2.5 text-center">
                <p className="text-[13px] font-bold text-neutral-900">{value}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#0C5FC5] text-white text-[13px] font-semibold hover:bg-[#0A4EA0] transition-colors">
              <Plus className="h-4 w-4" />
              Create Order
            </button>
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg border border-neutral-200 text-neutral-700 text-[13px] font-medium hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg border border-neutral-200 text-neutral-700 text-[13px] font-medium hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-5 border-b border-neutral-200">
            {['overview', 'orders', 'addresses'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[13px] font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[#0C5FC5] text-[#0C5FC5]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Overview tab ──────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Suspended warning */}
              {customer.status === 'Suspended' && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-red-800">Account suspended</p>
                    <p className="text-[12px] text-red-600 mt-0.5">This customer cannot place new orders until the suspension is lifted.</p>
                  </div>
                </div>
              )}

              {/* Contact info */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">Contact</p>
                <div className="rounded-lg border border-neutral-100 bg-white overflow-hidden divide-y divide-neutral-100">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Phone className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-500">Phone</p>
                      <p className="text-[14px] font-medium text-neutral-900">{customer.phone}</p>
                    </div>
                    <a href={`tel:${customer.phone}`} className="text-[#0C5FC5] hover:underline text-[12px] font-medium">Call</a>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Mail className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-500">Email</p>
                      <p className="text-[14px] font-medium text-neutral-900 truncate">{customer.email}</p>
                    </div>
                    <a href={`mailto:${customer.email}`} className="text-[#0C5FC5] hover:underline text-[12px] font-medium flex-shrink-0">Email</a>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    <div>
                      <p className="text-[13px] text-neutral-500">Registered</p>
                      <p className="text-[14px] font-medium text-neutral-900">{customer.registeredDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent orders preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Recent Orders</p>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[12px] text-[#0C5FC5] font-medium hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {customer.recentOrders.slice(0, 2).map((order) => {
                    const s = ORDER_STATUS[order.status] || ORDER_STATUS.Completed;
                    return (
                      <div key={order.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-neutral-900 font-mono">{order.id}</span>
                            <Badge bg={s.bg} color={s.color}>{order.status}</Badge>
                          </div>
                          <p className="text-[12px] text-neutral-400 mt-0.5">{order.date} · {order.items}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-neutral-800 flex-shrink-0">{order.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary address */}
              {customer.addresses.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">Primary Address</p>
                  {customer.addresses.filter(a => a.primary).map(addr => (
                    <div key={addr.label} className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3">
                      <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-neutral-900">{addr.line1}</p>
                        <p className="text-[12px] text-neutral-400">{addr.area}, {addr.city}</p>
                        {addr.gps && <p className="text-[12px] text-neutral-400 font-mono mt-0.5">{addr.gps}</p>}
                      </div>
                      <span className="text-[11px] bg-[#EBF2FD] text-[#0C5FC5] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">{addr.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Orders tab ────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] text-neutral-500">{customer.recentOrders.length} recent orders</p>
                <button className="flex items-center gap-1 text-[12px] text-[#0C5FC5] font-medium hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  Full history
                </button>
              </div>
              {customer.recentOrders.map((order) => {
                const s = ORDER_STATUS[order.status] || ORDER_STATUS.Completed;
                return (
                  <div key={order.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-neutral-900 font-mono">{order.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge bg={s.bg} color={s.color}>{order.status}</Badge>
                          <span className="text-[12px] text-neutral-400">{order.items}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[14px] font-bold text-neutral-900">{order.amount}</p>
                        <p className="text-[12px] text-neutral-400 mt-0.5">{order.date}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors">
                        <Eye className="h-3 w-3" />
                        View order
                      </button>
                      {order.status === 'Completed' && (
                        <button className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors">
                          <ShoppingBag className="h-3 w-3" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Addresses tab ─────────────────────────────────────────────── */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {customer.addresses.map((addr) => (
                <div key={addr.label} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      <span className="text-[14px] font-semibold text-neutral-900">{addr.label}</span>
                      {addr.primary && (
                        <span className="text-[11px] bg-[#EBF2FD] text-[#0C5FC5] font-semibold px-2 py-0.5 rounded-full">Primary</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[14px] text-neutral-800 pl-6">{addr.line1}</p>
                  <p className="text-[13px] text-neutral-500 pl-6 mt-0.5">{addr.area}, {addr.city}</p>
                  {addr.gps && (
                    <p className="text-[12px] text-neutral-400 font-mono pl-6 mt-0.5">{addr.gps}</p>
                  )}
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MapPin className="h-8 w-8 text-neutral-300 mb-3" />
                  <p className="text-[14px] text-neutral-500">No addresses on file</p>
                  <p className="text-[12px] text-neutral-400 mt-1">Customer can add addresses in the app</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const CustomerSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(MOCK_CUSTOMERS);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

  const [filters, setFilters] = useState({
    tier: 'All', status: 'All', hasPendingOrders: false, dateFrom: '', dateTo: '',
  });

  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setResults(filterCustomers(MOCK_CUSTOMERS, debouncedQuery, filters));
      setIsLoading(false);
      if (debouncedQuery.trim() || Object.values(filters).some((v) => v && v !== 'All')) {
        setHasSearched(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [debouncedQuery, filters]);

  const clearSearch = () => { setQuery(''); setDebouncedQuery(''); setHasSearched(false); inputRef.current?.focus(); };
  const resetFilters = () => setFilters({ tier: 'All', status: 'All', hasPendingOrders: false, dateFrom: '', dateTo: '' });

  const searchType = detectSearchType(query);
  const hasActiveFilters =
    filters.tier !== 'All' || filters.status !== 'All' ||
    filters.hasPendingOrders || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Management', to: '/' }, { label: 'Customers' }]} />
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Customers</h1>
          <p className="mt-0.5 text-sm text-neutral-400">Search and manage your customer accounts</p>
        </div>
        <button
          onClick={() => navigate('/customers/walkin')}
          className="flex items-center gap-2 rounded-lg bg-[#0C5FC5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0A4EA0] transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Register walk-in
        </button>
      </div>

      {/* Search bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, email, or CUST-XXXXX…"
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20 transition-all"
            style={{ borderRadius: 8 }}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {searchType && (
          <p className="text-xs text-[#0C5FC5] font-medium pl-1">{searchTypeLabel(searchType)}</p>
        )}

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-[#0C5FC5] transition-colors"
        >
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Advanced filters
          {hasActiveFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0C5FC5] text-[10px] font-bold text-white">!</span>
          )}
        </button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Customer Tier</p>
            <PillSelect options={['All', 'Bronze', 'Silver', 'Gold', 'VIP']} value={filters.tier} onChange={(v) => setFilters((f) => ({ ...f, tier: v }))} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Status</p>
            <PillSelect options={['All', 'Active', 'Inactive', 'Suspended']} value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-700 font-medium">Has pending orders</p>
            <button
              onClick={() => setFilters((f) => ({ ...f, hasPendingOrders: !f.hasPendingOrders }))}
              className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${filters.hasPendingOrders ? 'bg-[#0C5FC5]' : 'bg-neutral-300'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${filters.hasPendingOrders ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Registration Date</p>
            <div className="flex items-center gap-3">
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20 transition-all"
                style={{ borderRadius: 8 }} />
              <span className="text-neutral-400 text-sm flex-shrink-0">to</span>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20 transition-all"
                style={{ borderRadius: 8 }} />
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">Clear all filters</button>
          )}
        </div>
      )}

      {/* Results toolbar */}
      <div className="flex items-center justify-between">
        {!isLoading ? (
          <p className="text-sm text-neutral-500">
            {hasSearched
              ? <>Showing <span className="font-semibold text-neutral-800">{results.length}</span> of <span className="font-semibold text-neutral-800">{MOCK_CUSTOMERS.length}</span> customers</>
              : <>Showing all <span className="font-semibold text-neutral-800">{results.length}</span> customers</>
            }
          </p>
        ) : <span />}

        {/* Grid / List toggle */}
        <div className="flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            className={`flex items-center justify-center h-7 w-7 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#0C5FC5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-700'}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List view"
            className={`flex items-center justify-center h-7 w-7 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#0C5FC5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-700'}`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {/* ── Grid view ── */}
        {viewMode === 'grid' && (
          <>
            {isLoading && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            )}
            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} onViewProfile={setSelectedCustomer} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── List / table view ── */}
        {viewMode === 'list' && (
          <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-100 bg-neutral-50/80">
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Customer</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Phone</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Tier</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Last Order</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}
                  {!isLoading && results.map((customer) => (
                    <CustomerRow key={customer.id} customer={customer} onViewProfile={setSelectedCustomer} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mb-4">
              <Search className="h-7 w-7 text-neutral-400" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800 mb-1">No customers found</h3>
            <p className="text-sm text-neutral-400 max-w-xs">Try a different search term or clear filters</p>
            <div className="flex items-center gap-2 mt-4">
              {query && (
                <button onClick={clearSearch} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors">Clear search</button>
              )}
              {hasActiveFilters && (
                <button onClick={resetFilters} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5] transition-colors">Clear filters</button>
              )}
              <button
                onClick={() => navigate('/customers/walkin')}
                className="rounded-md bg-[#0C5FC5] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0A4EA0] transition-colors"
              >
                Register new customer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer detail panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerSearchPage;
