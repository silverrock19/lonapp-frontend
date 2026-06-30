import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight, Search, SlidersHorizontal, X,
  Download, FileDown, CheckSquare, Square,
} from 'lucide-react';
import {
  getAllOrders, searchOrders, STATUS_LABELS, TIMELINE_STAGES, getStageIndex,
} from '../../lib/mock/mockOrders.js';
import EmptyState from '../../components/ui/EmptyState.jsx';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const STATUS_BADGE = {
  PLACED:                   { bg: 'bg-blue-50',    text: 'text-blue-600'  },
  PICKUP_SCHEDULED:         { bg: 'bg-blue-50',    text: 'text-blue-600'  },
  DRIVER_EN_ROUTE_PICKUP:   { bg: 'bg-warning-bg', text: 'text-warning-text' },
  ITEMS_PICKED_UP:          { bg: 'bg-accent-50',  text: 'text-accent-600' },
  RECEIVED_AT_OUTLET:       { bg: 'bg-accent-50',  text: 'text-accent-600' },
  INSPECTION_COMPLETE:      { bg: 'bg-accent-50',  text: 'text-accent-600' },
  AWAITING_PAYMENT:         { bg: 'bg-warning-bg', text: 'text-warning-text' },
  IN_PROCESSING:            { bg: 'bg-purple-50',  text: 'text-purple-600' },
  QUALITY_CHECK:            { bg: 'bg-purple-50',  text: 'text-purple-600' },
  READY_FOR_DELIVERY:       { bg: 'bg-success-bg', text: 'text-success-text' },
  DRIVER_EN_ROUTE_DELIVERY: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  DELIVERED:                { bg: 'bg-success-bg', text: 'text-success-text' },
  COMPLETED:                { bg: 'bg-success-bg', text: 'text-success-text' },
  CANCELLED:                { bg: 'bg-neutral-100', text: 'text-neutral-500' },
};

// Status groups for filter chips
const STATUS_GROUPS = [
  { label: 'Scheduled',  statuses: ['PLACED', 'PICKUP_SCHEDULED'] },
  { label: 'Picked Up',  statuses: ['DRIVER_EN_ROUTE_PICKUP', 'ITEMS_PICKED_UP'] },
  { label: 'At Outlet',  statuses: ['RECEIVED_AT_OUTLET', 'INSPECTION_COMPLETE', 'AWAITING_PAYMENT'] },
  { label: 'Processing', statuses: ['IN_PROCESSING', 'QUALITY_CHECK'] },
  { label: 'Ready',      statuses: ['READY_FOR_DELIVERY', 'DRIVER_EN_ROUTE_DELIVERY'] },
  { label: 'Delivered',  statuses: ['DELIVERED', 'COMPLETED'] },
  { label: 'Cancelled',  statuses: ['CANCELLED'] },
];

const DATE_PRESETS = [
  { id: 'all',    label: 'All time',      getFrom: () => null },
  { id: 'last7',  label: 'Last 7 days',   getFrom: () => { const d = new Date(); d.setDate(d.getDate()-7); return d.toISOString(); } },
  { id: 'last30', label: 'Last 30 days',  getFrom: () => { const d = new Date(); d.setDate(d.getDate()-30); return d.toISOString(); } },
  { id: 'last3m', label: 'Last 3 months', getFrom: () => { const d = new Date(); d.setMonth(d.getMonth()-3); return d.toISOString(); } },
  { id: 'thisyr', label: 'This year',     getFrom: () => new Date(new Date().getFullYear(), 0, 1).toISOString() },
];

const TERMINAL = new Set(['DELIVERED', 'COMPLETED', 'CANCELLED']);
const DOWNLOADABLE = new Set(['DELIVERED', 'COMPLETED']);

export default function OrdersListPage() {
  const navigate = useNavigate();

  const [query,          setQuery]          = useState('');
  const [activeGroups,   setActiveGroups]   = useState(new Set());
  const [datePreset,     setDatePreset]     = useState('all');
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [selectMode,     setSelectMode]     = useState(false);
  const [selected,       setSelected]       = useState(new Set());

  // Compute filtered orders
  const displayOrders = useMemo(() => {
    let orders = query.trim() ? searchOrders(query) : getAllOrders();

    // Status filter
    if (activeGroups.size > 0) {
      const allowedStatuses = new Set(
        [...activeGroups].flatMap(g => STATUS_GROUPS.find(sg => sg.label === g)?.statuses ?? [])
      );
      orders = orders.filter(o => allowedStatuses.has(o.status));
    }

    // Date filter
    const preset = DATE_PRESETS.find(p => p.id === datePreset);
    const dateFrom = preset?.getFrom();
    if (dateFrom) orders = orders.filter(o => new Date(o.placedAt) >= new Date(dateFrom));

    return orders;
  }, [query, activeGroups, datePreset]);

  const activeFilterCount = activeGroups.size + (datePreset !== 'all' ? 1 : 0);

  function toggleGroup(label) {
    setActiveGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function clearFilters() {
    setActiveGroups(new Set());
    setDatePreset('all');
    setQuery('');
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function handleBulkDownload() {
    if (selected.size === 0) return;
    navigate(`/app/orders/bulk-receipt?ids=${[...selected].join(',')}`);
  }

  const active = displayOrders.filter(o => !TERMINAL.has(o.status));
  const past   = displayOrders.filter(o =>  TERMINAL.has(o.status));

  function MiniProgress({ status }) {
    const activeIdx = getStageIndex(status);
    return (
      <div className="flex items-center gap-1 mt-2">
        {TIMELINE_STAGES.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < activeIdx ? 'bg-accent-500' : i === activeIdx ? 'bg-accent-300' : 'bg-neutral-200'
          }`} />
        ))}
      </div>
    );
  }

  const OrderCard = useCallback(({ order }) => {
    const badge      = STATUS_BADGE[order.status] ?? STATUS_BADGE.PLACED;
    const totalQty   = order.items.reduce((s, i) => s + i.qty, 0);
    const canSelect  = DOWNLOADABLE.has(order.status);
    const isSelected = selected.has(order.id);

    return (
      <div className="relative">
        {/* Checkbox overlay in select mode */}
        {selectMode && canSelect && (
          <button
            onClick={() => toggleSelect(order.id)}
            className="absolute top-3 left-3 z-10"
            aria-label={isSelected ? 'Deselect' : 'Select'}
          >
            {isSelected
              ? <CheckSquare className="h-5 w-5 text-accent-600" />
              : <Square className="h-5 w-5 text-neutral-300" />
            }
          </button>
        )}
        <button
          onClick={() => selectMode && canSelect ? toggleSelect(order.id) : navigate(`/app/orders/${order.id}`)}
          className={`w-full text-left rounded-2xl bg-white border shadow-sm p-4 hover:shadow-md transition-all active:opacity-70 ${
            isSelected ? 'border-accent-400 ring-2 ring-accent-100' : 'border-neutral-100'
          } ${selectMode && canSelect ? 'pl-12' : ''}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-small font-bold text-neutral-900 font-mono truncate">{order.id}</p>
              <p className="text-caption text-neutral-400">{order.outlet.name} · {totalQty} item{totalQty !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`rounded-full px-2 py-0.5 text-caption font-semibold ${badge.bg} ${badge.text}`}>
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
              {!selectMode && <ChevronRight className="h-4 w-4 text-neutral-300" />}
            </div>
          </div>

          {!TERMINAL.has(order.status) && <MiniProgress status={order.status} />}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <p className="text-caption text-neutral-400">
              {TERMINAL.has(order.status) && order.status !== 'CANCELLED'
                ? `${order.status === 'DELIVERED' ? 'Delivered' : 'Completed'} ${fmtDate(order.completedAt || order.deliveryDate)}`
                : order.status === 'CANCELLED'
                ? `Cancelled · Placed ${fmtDate(order.placedAt)}`
                : `Pickup ${fmtDate(order.pickupDate)} · Delivery ${fmtDate(order.deliveryDate)}`
              }
            </p>
            <p className="text-small font-bold text-neutral-800 tabular-nums">{fmtPrice(order.total)}</p>
          </div>
        </button>
      </div>
    );
  }, [navigate, selectMode, selected]);

  if (getAllOrders().length === 0) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="No orders yet" description="Your placed orders will appear here." action={
          <button onClick={() => navigate('/app/discover')} className="text-accent-600 text-small font-semibold">Start your first order →</button>
        } />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-100 shadow-sm">

        {/* Title row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <h1 className="text-h3 font-bold text-neutral-900">My Orders</h1>
            <p className="text-caption text-neutral-400">{displayOrders.length} of {getAllOrders().length} shown</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/orders/export')}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Export orders"
            >
              <FileDown className="h-5 w-5 text-neutral-500" />
            </button>
            <button
              onClick={() => { setFilterOpen(o => !o); setSelectMode(false); }}
              className={`flex h-9 items-center gap-1.5 px-3 rounded-full transition-colors text-small font-semibold ${
                filterOpen || activeFilterCount > 0
                  ? 'bg-accent-50 text-accent-700'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setSelectMode(o => !o); setSelected(new Set()); }}
              className={`flex h-9 items-center gap-1.5 px-3 rounded-full transition-colors text-small font-semibold ${
                selectMode ? 'bg-accent-500 text-white' : 'hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              <Download className="h-4 w-4" />
              Select
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5 focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-100 transition-all">
            <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by ID, item, outlet…"
              className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="border-t border-neutral-100 px-4 pt-3 pb-3 space-y-3 bg-white">
            {/* Status chips */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_GROUPS.map(g => {
                  const on = activeGroups.has(g.label);
                  return (
                    <button
                      key={g.label}
                      onClick={() => toggleGroup(g.label)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        on ? 'bg-accent-500 text-white border-accent-500' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Date chips */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Date Range</p>
              <div className="flex flex-wrap gap-1.5">
                {DATE_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setDatePreset(p.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                      datePreset === p.id ? 'bg-accent-500 text-white border-accent-500' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-[11px] font-semibold text-error flex items-center gap-1">
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Select mode banner */}
        {selectMode && (
          <div className="border-t border-accent-100 bg-accent-50 px-4 py-2 flex items-center justify-between">
            <p className="text-caption text-accent-700 font-medium">
              {selected.size === 0 ? 'Tap a delivered order to select' : `${selected.size} selected`}
            </p>
            <button onClick={exitSelectMode} className="text-caption text-accent-600 font-semibold">Cancel</button>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="px-4 pt-4 space-y-4">
        {displayOrders.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <Search className="h-10 w-10 mx-auto mb-3 text-neutral-200" />
            <p className="text-small font-semibold">No orders match your search</p>
            <button onClick={clearFilters} className="text-caption text-accent-600 font-semibold mt-2">Clear filters</button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active ({active.length})</p>
                {active.map(o => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
            {past.length > 0 && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Past Orders ({past.length})</p>
                {past.map(o => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bulk download bar */}
      {selectMode && selected.size > 0 && (
        <div className="fixed bottom-20 inset-x-0 px-4 z-30">
          <button
            onClick={handleBulkDownload}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 shadow-xl hover:bg-accent-600 active:opacity-80 transition-all"
          >
            <Download className="h-5 w-5" />
            Download {selected.size} Receipt{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
