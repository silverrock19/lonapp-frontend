import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Table2 } from 'lucide-react';
import { getAllOrders, STATUS_LABELS, turnaroundLabel } from '../../lib/mock/mockOrders.js';

const DATE_PRESETS = [
  { id: 'all',    label: 'All time',      days: null },
  { id: 'last7',  label: 'Last 7 days',   days: 7 },
  { id: 'last30', label: 'Last 30 days',  days: 30 },
  { id: 'last3m', label: 'Last 3 months', days: 90 },
  { id: 'thisyr', label: 'This year',     days: null, thisYear: true },
];

const STATUS_FILTER_GROUPS = [
  { label: 'Active',    statuses: ['PLACED', 'PICKUP_SCHEDULED', 'DRIVER_EN_ROUTE_PICKUP', 'ITEMS_PICKED_UP', 'RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE', 'AWAITING_PAYMENT', 'IN_PROCESSING', 'QUALITY_CHECK', 'READY_FOR_DELIVERY', 'DRIVER_EN_ROUTE_DELIVERY'] },
  { label: 'Delivered', statuses: ['DELIVERED', 'COMPLETED'] },
  { label: 'Cancelled', statuses: ['CANCELLED'] },
];

function getDateRange(preset) {
  const now = new Date();
  if (!preset || preset.id === 'all') return { dateFrom: null, dateTo: null };
  if (preset.thisYear) return { dateFrom: new Date(now.getFullYear(), 0, 1).toISOString(), dateTo: null };
  if (preset.days) {
    const from = new Date(now);
    from.setDate(from.getDate() - preset.days);
    return { dateFrom: from.toISOString(), dateTo: null };
  }
  return { dateFrom: null, dateTo: null };
}

function buildCSV(orders) {
  const headers = [
    'Order Number', 'Order Date', 'Status', 'Outlet', 'Items Count',
    'Turnaround', 'Delivery Address', 'Subtotal (GH₵)', 'Surcharge (GH₵)',
    'Pickup Fee (GH₵)', 'Delivery Fee (GH₵)', 'VAT (GH₵)', 'Total (GH₵)',
    'Payment Method', 'Pickup Date', 'Delivery Date', 'Paid At',
  ];

  const rows = orders.map(o => {
    const totalItems = o.items.reduce((s, i) => s + i.qty, 0);
    const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    return [
      escape(o.id),
      escape(o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-GH') : ''),
      escape(STATUS_LABELS[o.status] ?? o.status),
      escape(o.outlet.name),
      totalItems,
      escape(turnaroundLabel(o.turnaround)),
      escape(o.deliveryAddress?.detail ?? ''),
      o.subtotal.toFixed(2),
      o.surcharge.toFixed(2),
      o.pickupFee.toFixed(2),
      o.deliveryFee.toFixed(2),
      o.vat.toFixed(2),
      o.total.toFixed(2),
      escape(o.paymentMethod?.label ?? ''),
      escape(o.pickupDate ?? ''),
      escape(o.deliveryDate ?? ''),
      escape(o.paidAt ? new Date(o.paidAt).toLocaleDateString('en-GH') : ''),
    ].join(',');
  });

  return [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
}

export default function ExportOrdersPage() {
  const navigate       = useNavigate();
  const allOrders      = getAllOrders();
  const [preset,     setPreset]     = useState('all');
  const [statusGrp,  setStatusGrp] = useState(null); // null = all
  const [format,     setFormat]     = useState('csv');
  const [exporting,  setExporting]  = useState(false);
  const [done,       setDone]       = useState(false);

  const presetObj    = DATE_PRESETS.find(p => p.id === preset);
  const { dateFrom } = getDateRange(presetObj);
  const groupStatuses = statusGrp ? STATUS_FILTER_GROUPS.find(g => g.label === statusGrp)?.statuses ?? [] : [];

  const filtered = allOrders.filter(o => {
    if (groupStatuses.length && !groupStatuses.includes(o.status)) return false;
    if (dateFrom && new Date(o.placedAt) < new Date(dateFrom)) return false;
    return true;
  });

  async function handleExport() {
    if (filtered.length === 0) return;
    setExporting(true);
    await new Promise(r => setTimeout(r, 800));
    const csv  = buildCSV(filtered);
    const blob = new Blob([csv], { type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `orders_export_${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-bold text-neutral-900">Export Orders</p>
          <p className="text-caption text-neutral-400">Download your order data as CSV or Excel</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Date range */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Date Range</p>
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`px-3 py-1.5 rounded-full text-small font-semibold border transition-all ${
                  preset === p.id
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Order Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusGrp(null)}
              className={`px-3 py-1.5 rounded-full text-small font-semibold border transition-all ${
                statusGrp === null
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              All statuses
            </button>
            {STATUS_FILTER_GROUPS.map(g => (
              <button
                key={g.label}
                onClick={() => setStatusGrp(g.label)}
                className={`px-3 py-1.5 rounded-full text-small font-semibold border transition-all ${
                  statusGrp === g.label
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">File Format</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'csv',   label: 'CSV',   desc: 'Works with any app', icon: FileText },
              { id: 'excel', label: 'Excel', desc: 'Opens in Excel / Sheets', icon: Table2 },
            ].map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFormat(id)}
                className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all text-left ${
                  format === id ? 'border-accent-500 bg-accent-50' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${format === id ? 'text-accent-600' : 'text-neutral-400'}`} />
                <p className={`text-small font-bold ${format === id ? 'text-accent-700' : 'text-neutral-700'}`}>{label}</p>
                <p className="text-caption text-neutral-400">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Export Preview</p>
          {filtered.length === 0 ? (
            <p className="text-small text-neutral-400 italic">No orders match the selected filters.</p>
          ) : (
            <div className="space-y-1">
              <p className="text-body font-bold text-neutral-900">{filtered.length} order{filtered.length !== 1 ? 's' : ''} will be exported</p>
              <p className="text-caption text-neutral-400">
                {filtered.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status)).length} delivered ·{' '}
                {filtered.filter(o => !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(o.status)).length} active ·{' '}
                {filtered.filter(o => o.status === 'CANCELLED').length} cancelled
              </p>
              <p className="text-caption text-neutral-400">
                Total value: GH₵ {filtered.reduce((s, o) => s + o.total, 0).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        {done ? (
          <div className="w-full rounded-2xl bg-success-bg text-success-text font-semibold text-small text-center py-4">
            ✓ Export downloaded successfully
          </div>
        ) : (
          <button
            onClick={handleExport}
            disabled={filtered.length === 0 || exporting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-semibold text-body py-4 disabled:opacity-50 transition-opacity hover:bg-accent-600 active:opacity-70"
          >
            {exporting ? (
              <span className="animate-pulse">Preparing export…</span>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Export {filtered.length > 0 ? `${filtered.length} Orders` : 'Orders'} · {format.toUpperCase()}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
