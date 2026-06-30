import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/slices/authSlice.js';
import {
  BarChart3, TrendingUp, TrendingDown, Users, ShoppingBag,
  Package, Banknote, Download, Calendar, ChevronDown, ChevronRight, AlertCircle,
} from 'lucide-react';
import { getAllTransactions, PAYMENT_METHODS } from '../../lib/mock/mockPayments.js';
import { getAllInvoices } from '../../lib/mock/mockInvoices.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const SECTION_ROLES = {
  revenue:    ['owner', 'admin', 'finance_manager', 'ops_manager'],
  orders:     ['owner', 'admin', 'ops_manager', 'finance_manager', 'customer_support'],
  production: ['owner', 'admin', 'ops_manager'],
  customers:  ['owner', 'admin', 'ops_manager', 'customer_support'],
  staff:      ['owner', 'admin', 'ops_manager'],
};

const ALL_TABS = [
  { key: 'revenue',    label: 'Revenue' },
  { key: 'orders',     label: 'Orders' },
  { key: 'production', label: 'Production' },
  { key: 'customers',  label: 'Customers' },
  { key: 'staff',      label: 'Staff' },
];

const MOCK_ORDER_STATS = {
  total: 127, completed: 89, inProgress: 28, cancelled: 10,
  avgTurnaround: 2.3, expressShare: 24,
  byStatus: [
    { label: 'Completed', count: 89, color: 'bg-success' },
    { label: 'In Progress', count: 28, color: 'bg-primary-500' },
    { label: 'Cancelled', count: 10, color: 'bg-error' },
  ],
  weeklyVolume: [12, 18, 15, 22, 19, 24, 17],
};

const MOCK_CUSTOMER_STATS = {
  total: 284, newThisPeriod: 32, returning: 252, retentionRate: 88.7,
  topCustomers: [
    { name: 'GoldCoast Hotels', orders: 18, revenue: 4280 },
    { name: 'Adwoa Frimpong', orders: 7, revenue: 620 },
    { name: 'Kweku Mensah', orders: 5, revenue: 390 },
    { name: 'Faustina Osei', orders: 4, revenue: 310 },
  ],
};

const MOCK_STAFF_STATS = {
  activeStaff: 12, avgProcessingTime: 4.2,
  topPerformers: [
    { name: 'Yaw Owusu', role: 'Intake Staff', itemsProcessed: 142 },
    { name: 'Akua Bonsu', role: 'Processing Staff', itemsProcessed: 128 },
    { name: 'Kofi Amoah', role: 'Driver', deliveries: 34 },
  ],
  workloadByStation: [
    { station: 'Intake', utilization: 78 },
    { station: 'Washing', utilization: 92 },
    { station: 'Drying', utilization: 65 },
    { station: 'Ironing', utilization: 84 },
    { station: 'Packaging', utilization: 71 },
  ],
};

const DATE_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Month', 'Last Month'];

const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';
const SMALL_LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';

function KpiCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className={CARD}>
      <p className={SMALL_LABEL}>{label}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">{value}</span>
        {Icon && <Icon className={cn('w-5 h-5', iconClass)} />}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    paid:    'bg-success-bg text-success-text',
    overdue: 'bg-error-bg text-error',
    pending: 'bg-warning-bg text-warning-text',
  };
  return (
    <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', map[status] ?? 'bg-neutral-100 text-neutral-500')}>
      {status}
    </span>
  );
}

// ─── Section: Revenue ───────────────────────────────────────────────
function RevenueSection() {
  const txns = getAllTransactions?.() ?? [];
  const invoices = getAllInvoices?.() ?? [];

  const success = txns.filter(t => t.status === 'SUCCESS');
  const totalRevenue = success.reduce((s, t) => s + (t.amount ?? 0), 0);
  const momoRevenue  = success.filter(t => t.method === 'momo').reduce((s, t) => s + (t.amount ?? 0), 0);
  const paidCount    = invoices.filter(i => i.status === 'paid').length;
  const collRate     = invoices.length ? ((paidCount / invoices.length) * 100).toFixed(1) : '0.0';
  const outstanding  = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.balanceDue ?? 0), 0);

  const methodColors = { momo: 'bg-accent-500', card: 'bg-primary-500', cash: 'bg-success', wallet: 'bg-neutral-400', bank_transfer: 'bg-neutral-400' };
  const methodCounts = {};
  success.forEach(t => { methodCounts[t.method] = (methodCounts[t.method] ?? 0) + 1; });
  const totalCount = Object.values(methodCounts).reduce((s, c) => s + c, 1);

  const topInvoices = [...invoices].sort((a, b) => (b.totalAmount ?? 0) - (a.totalAmount ?? 0)).slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue"    value={formatGHS(totalRevenue)} icon={Banknote}    iconClass="text-primary-600" />
        <KpiCard label="MoMo Revenue"     value={formatGHS(momoRevenue)}  icon={TrendingUp}  iconClass="text-accent-600" />
        <KpiCard label="Collection Rate"  value={`${collRate}%`}                    icon={BarChart3}   iconClass="text-success" />
        <KpiCard label="Outstanding"      value={formatGHS(outstanding)}  icon={TrendingDown} iconClass="text-error" />
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-3'}>Revenue by Payment Method</p>
        <div className="space-y-2">
          {Object.entries(methodCounts).map(([method, count]) => (
            <div key={method} className="flex items-center gap-3">
              <span className="w-24 text-xs text-neutral-600 capitalize">{method.replace('_', ' ')}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full', methodColors[method] ?? 'bg-neutral-400')}
                  style={{ width: `${(count / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-3'}>Top Invoices</p>
        <div className="space-y-2">
          {topInvoices.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-neutral-800">{inv.id}</p>
                <p className="text-xs text-neutral-500">{inv.customerName ?? inv.customer}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-sm font-semibold text-neutral-900">{formatGHS(inv.totalAmount ?? 0)}</span>
                <StatusBadge status={inv.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Orders ────────────────────────────────────────────────
function OrdersSection() {
  const o = MOCK_ORDER_STATS;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxVol = Math.max(...o.weeklyVolume);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Orders"  value={o.total}       icon={ShoppingBag} iconClass="text-primary-600" />
        <KpiCard label="Completed"     value={o.completed}   icon={TrendingUp}  iconClass="text-success" />
        <KpiCard label="In Progress"   value={o.inProgress}  icon={BarChart3}   iconClass="text-accent-600" />
        <KpiCard label="Cancelled"     value={o.cancelled}   icon={TrendingDown} iconClass="text-error" />
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-4'}>Weekly Volume</p>
        <div className="flex items-end gap-2 h-24">
          {o.weeklyVolume.map((vol, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary-500 rounded-t" style={{ height: `${(vol / maxVol) * 80}px` }} />
              <span className="text-[10px] text-neutral-400">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={CARD}>
          <p className={SMALL_LABEL}>Avg Turnaround</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">{o.avgTurnaround} <span className="text-base font-normal text-neutral-400">days</span></p>
        </div>
        <div className={CARD}>
          <p className={SMALL_LABEL}>Express Share</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">{o.expressShare}<span className="text-base font-normal text-neutral-400">%</span></p>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Production ────────────────────────────────────────────
function ProductionSection() {
  const placeholders = ['Items Processed', 'Batches Today', 'Avg Cycle Time', 'QC Pass Rate'];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {placeholders.map(label => (
          <div key={label} className={cn(CARD, 'opacity-40')}>
            <p className={SMALL_LABEL}>{label}</p>
            <p className="text-2xl font-bold text-neutral-300 mt-2">–</p>
          </div>
        ))}
      </div>

      <div className={cn(CARD, 'border-dashed border-neutral-200 bg-neutral-50 text-center py-10')}>
        <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
        <p className="text-h3 font-bold text-neutral-900 mb-1">Production Analytics Coming Soon</p>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mb-4">
          Production analytics (EP-07 Production Dashboard — US-0192) will appear here. Meanwhile, see live data on the Tracking board.
        </p>
        <a href="/tracking" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 border border-primary-500 bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors">
          Go to Tracking Board <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// ─── Section: Customers ─────────────────────────────────────────────
function CustomersSection() {
  const c = MOCK_CUSTOMER_STATS;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Customers"  value={c.total}                      icon={Users}       iconClass="text-primary-600" />
        <KpiCard label="New This Period"  value={c.newThisPeriod}              icon={TrendingUp}  iconClass="text-success" />
        <KpiCard label="Returning"        value={c.returning}                  icon={BarChart3}   iconClass="text-accent-600" />
        <KpiCard label="Retention Rate"   value={`${c.retentionRate}%`}        icon={TrendingUp}  iconClass="text-success" />
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-3'}>Top Customers</p>
        <div className="space-y-1">
          {c.topCustomers.map((cust, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
              <p className="text-sm font-medium text-neutral-800">{cust.name}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-500">{cust.orders} orders</span>
                <span className="font-mono tabular-nums text-sm font-semibold text-neutral-900">{formatGHS(cust.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Staff ─────────────────────────────────────────────────
function StaffSection() {
  const s = MOCK_STAFF_STATS;
  const totalItems = s.topPerformers.reduce((sum, p) => sum + (p.itemsProcessed ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Staff"         value={s.activeStaff}                   icon={Users}    iconClass="text-primary-600" />
        <KpiCard label="Avg Processing Time"  value={`${s.avgProcessingTime} hrs`}    icon={Calendar} iconClass="text-accent-600" />
        <KpiCard label="Items Processed"      value={totalItems}                       icon={Package}  iconClass="text-success" />
        <KpiCard label="Delivery Rate"        value="94%"                              icon={TrendingUp} iconClass="text-success" />
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-4'}>Station Workload</p>
        <div className="space-y-3">
          {s.workloadByStation.map(ws => (
            <div key={ws.station} className="flex items-center gap-3">
              <span className="w-20 text-xs text-neutral-600">{ws.station}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-primary-500 transition-all"
                  style={{ width: `${ws.utilization}%` }}
                />
              </div>
              <span className="text-xs font-mono text-neutral-500 w-8 text-right">{ws.utilization}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <p className={SMALL_LABEL + ' mb-3'}>Top Performers</p>
        <div className="space-y-1">
          {s.topPerformers.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                <p className="text-xs text-neutral-400">{p.role}</p>
              </div>
              <span className="text-sm font-mono font-semibold text-neutral-900">
                {p.itemsProcessed != null ? `${p.itemsProcessed} items` : `${p.deliveries} deliveries`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function ReportsHubPage() {
  const role = useSelector(selectUserRole);
  const allowedTabs = ALL_TABS.filter(t => SECTION_ROLES[t.key]?.includes(role));

  const [activeTab, setActiveTab]   = useState(allowedTabs[0]?.key ?? null);
  const [dateRange, setDateRange]   = useState('Last 30 Days');
  const [showDR, setShowDR]         = useState(false);

  if (!allowedTabs.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500 text-base">You don't have access to reports.</p>
      </div>
    );
  }

  const sectionMap = {
    revenue:    <RevenueSection />,
    orders:     <OrdersSection />,
    production: <ProductionSection />,
    customers:  <CustomersSection />,
    staff:      <StaffSection />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h2 font-bold text-neutral-900">Reports & Analytics</h1>

        <div className="flex items-center gap-2">
          {/* Date range dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDR(p => !p)}
              className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
            >
              <Calendar className="w-4 h-4 text-neutral-400" />
              {dateRange}
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            {showDR && (
              <div className="absolute right-0 mt-1 z-20 bg-white border border-neutral-100 shadow-md rounded-lg py-1 min-w-[160px]">
                {DATE_RANGES.map(dr => (
                  <button
                    key={dr}
                    onClick={() => { setDateRange(dr); setShowDR(false); }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm hover:bg-neutral-50',
                      dr === dateRange ? 'text-primary-700 font-semibold' : 'text-neutral-700',
                    )}
                  >
                    {dr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={() => window.alert('Exporting report for: ' + dateRange)}
            className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-100">
        {allowedTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-sm transition-colors -mb-px',
              activeTab === tab.key
                ? 'border-b-2 border-primary-500 text-primary-700 font-semibold'
                : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div>{sectionMap[activeTab]}</div>
    </div>
  );
}
