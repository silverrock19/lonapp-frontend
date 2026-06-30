import { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, ArrowDown, ArrowUp, RefreshCw, ChevronRight, X, CheckCircle } from 'lucide-react';
import { getAllInventoryItems, getLowStockItems, getStockStatus, STOCK_STATUSES, INVENTORY_CATEGORIES, LOCATIONS } from '../../lib/mock/mockInventory.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

function StatusBadge({ status }) {
  const s = STOCK_STATUSES[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold', s.bg, s.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}

function StockBar({ current, max }) {
  const pct = Math.min(100, max > 0 ? Math.round((current / max) * 100) : 0);
  const color = pct === 0 ? 'bg-error' : pct <= 25 ? 'bg-warning' : 'bg-success';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-neutral-500 tabular-nums w-8 text-right">{pct}%</span>
    </div>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <div className={CARD}>
      <p className={LABEL}>{label}</p>
      <p className={cn('text-2xl font-bold mt-1', color ?? 'text-neutral-900')}>{value}</p>
    </div>
  );
}

function ReceiveModal({ onClose }) {
  const items = getAllInventoryItems();
  const [itemId, setItemId] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState('');
  const [ref, setRef] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const item = items.find(i => i.id === itemId);
    window.alert(`Stock received: ${qty} × ${item?.name ?? itemId}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Receive Stock</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={LABEL}>Item</label>
            <select required value={itemId} onChange={e => setItemId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="">Select item…</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Location</label>
            <select required value={location} onChange={e => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="">Select location…</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Quantity</label>
              <input required type="number" min="1" value={qty} onChange={e => setQty(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className={LABEL}>Supplier Ref</label>
              <input type="text" value={ref} onChange={e => setRef(e.target.value)}
                placeholder="PO-123"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Notes</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-50">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Confirm Receipt</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_PANEL = {
  OK:  { headerBg: 'bg-success/8',  border: 'border-success/20',  icon: 'text-success'  },
  LOW: { headerBg: 'bg-warning/8',  border: 'border-warning/20',  icon: 'text-warning'  },
  OUT: { headerBg: 'bg-error/8',    border: 'border-error/20',    icon: 'text-error'    },
};

function DetailPanel({ item, onClose }) {
  const [rQty, setRQty] = useState('');
  const [rLoc, setRLoc] = useState('');
  const [rNote, setRNote] = useState('');
  const [aQty, setAQty] = useState('');
  const [aReason, setAReason] = useState('');

  const status = getStockStatus(item);
  const theme = STATUS_PANEL[status] ?? STATUS_PANEL.OK;

  function handleReceive(e) {
    e.preventDefault();
    window.alert(`Stock received: ${rQty} × ${item.name} → ${rLoc}`);
    setRQty(''); setRLoc(''); setRNote('');
  }
  function handleAdjust(e) {
    e.preventDefault();
    window.alert(`Stock adjusted: ${aQty > 0 ? '+' : ''}${aQty} ${item.name}. Reason: ${aReason}`);
    setAQty(''); setAReason('');
  }

  const inputCls = 'w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all';

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-[400px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col overflow-y-auto">

      {/* ── Header ── */}
      <div className={cn('p-5 border-b', theme.headerBg, theme.border)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Package size={15} className={theme.icon} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {INVENTORY_CATEGORIES[item.category]}
              </span>
            </div>
            <h3 className="text-[17px] font-bold text-neutral-900 leading-snug">{item.name}</h3>
            <p className="text-[13px] text-neutral-500 mt-1">per {item.unit}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-[12px] text-neutral-400">{item.supplier}</p>
            <p className="text-[12px] font-mono text-neutral-500 mt-0.5">{item.supplierContact}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* ── Stock overview ── */}
      <div className="p-5 border-b border-neutral-100 space-y-4">
        {/* Big numbers */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: item.currentStock, mono: false, bold: true },
            { label: 'Reorder At', value: item.reorderLevel, mono: false, bold: false },
            { label: 'Unit Cost', value: formatGHS(item.unitCost), mono: true, bold: false },
          ].map(({ label, value, mono, bold }) => (
            <div key={label} className="rounded-xl bg-neutral-50 border border-neutral-100 px-3 py-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{label}</p>
              <p className={cn('text-[15px]', mono ? 'font-mono tabular-nums' : '', bold ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-700')}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Per-location bars */}
        <div className="space-y-2.5">
          <p className={LABEL}>Stock by location</p>
          {LOCATIONS.map(loc => {
            const qty = item.locationStock[loc] ?? 0;
            const pct = Math.min(100, item.maxStock > 0 ? Math.round((qty / item.maxStock) * 100) : 0);
            const barColor = pct === 0 ? 'bg-error' : pct <= 25 ? 'bg-warning' : 'bg-success';
            return (
              <div key={loc}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-neutral-700 font-medium">{loc}</span>
                  <span className="text-[12px] font-mono font-semibold tabular-nums text-neutral-500">
                    {qty} <span className="text-neutral-300">/</span> {item.maxStock}
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all duration-300', barColor)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Urgent note */}
        {item.notes && (
          <div className="flex items-start gap-2.5 rounded-xl bg-warning-bg border border-warning/30 px-3.5 py-3">
            <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-warning-text font-medium">{item.notes}</p>
          </div>
        )}
      </div>

      {/* ── Movement history ── */}
      {item.movements.length > 0 && (
        <div className="p-5 border-b border-neutral-100">
          <p className={cn(LABEL, 'mb-3')}>Movement History</p>
          <div className="space-y-2">
            {item.movements.map((m, i) => {
              const isIn = m.type === 'IN';
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-neutral-50 border border-neutral-100 px-3.5 py-3">
                  <span className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold flex-shrink-0 mt-0.5',
                    isIn ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  )}>
                    {isIn ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                    {m.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-bold text-neutral-900 font-mono tabular-nums">
                        {isIn ? '+' : '−'}{m.qty}
                      </span>
                      <span className="text-[12px] text-neutral-400 flex-shrink-0">{m.date}</span>
                    </div>
                    <p className="text-[12px] text-neutral-500 mt-0.5 truncate">
                      {m.by}{m.note ? <> · <span className="text-neutral-400">{m.note}</span></> : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Receive stock ── */}
      <div className="p-5 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
            <ArrowDown size={13} className="text-primary-600" />
          </div>
          <p className={LABEL}>Receive Stock</p>
        </div>
        <form onSubmit={handleReceive} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Quantity</label>
              <input required type="number" min="1" value={rQty} onChange={e => setRQty(e.target.value)}
                placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Location</label>
              <select required value={rLoc} onChange={e => setRLoc(e.target.value)} className={inputCls}>
                <option value="">Select…</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Note (optional)</label>
            <input type="text" value={rNote} onChange={e => setRNote(e.target.value)}
              placeholder="e.g. Quarterly order" className={inputCls} />
          </div>
          <button type="submit"
            className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-[14px] font-semibold hover:bg-primary-700 transition-colors shadow-sm">
            Confirm Receipt
          </button>
        </form>
      </div>

      {/* ── Adjust stock ── */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100">
            <RefreshCw size={13} className="text-neutral-500" />
          </div>
          <p className={LABEL}>Adjust Stock</p>
        </div>
        <form onSubmit={handleAdjust} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Adjustment</label>
            <input required type="number" value={aQty} onChange={e => setAQty(e.target.value)}
              placeholder="e.g. -2 or +5" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5">Reason</label>
            <input required type="text" value={aReason} onChange={e => setAReason(e.target.value)}
              placeholder="Damaged, usage depletion…" className={inputCls} />
          </div>
          <button type="submit"
            className="w-full py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 text-[14px] font-semibold hover:bg-neutral-50 transition-colors">
            Apply Adjustment
          </button>
        </form>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const allItems = getAllInventoryItems();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showReorderList, setShowReorderList] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const needAttention = getLowStockItems();
  const outCount = needAttention.filter(i => getStockStatus(i) === 'OUT').length;
  const lowCount = needAttention.filter(i => getStockStatus(i) === 'LOW').length;

  const okCount = allItems.filter(i => getStockStatus(i) === 'OK').length;

  const filtered = allItems.filter(item => {
    const status = getStockStatus(item);
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (statusFilter && status !== statusFilter) return false;
    if (locationFilter && (item.locationStock[locationFilter] ?? 0) === 0 && status !== 'OUT') return false;
    return true;
  });

  const rowBg = (item) => {
    const s = getStockStatus(item);
    if (s === 'OUT') return 'bg-error-bg/30';
    if (s === 'LOW') return 'bg-warning-bg/20';
    return '';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Inventory Management</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Track supplies and consumables across all branches</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowReorderList(v => !v); setSelectedItem(null); }}
            className={cn(
              'relative inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors',
              showReorderList ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
            )}
          >
            <RefreshCw size={15} />
            Reorder List
            {needAttention.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {needAttention.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setShowReceiveModal(true); setSelectedItem(null); setShowReorderList(false); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
          >
            <Plus size={15} />
            Receive Stock
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {needAttention.length > 0 && !showReorderList && (
        <div className="flex items-center gap-3 bg-warning-bg border border-warning/30 rounded-lg px-4 py-3">
          <AlertTriangle size={16} className="text-warning flex-shrink-0" />
          <p className="text-sm text-warning-text font-medium">
            <span className="font-bold">{needAttention.length} items need attention</span>
            {' '}— {outCount} out of stock, {lowCount} low stock.
          </p>
          <button onClick={() => setShowReorderList(true)} className="ml-auto text-xs font-bold text-warning-text underline">
            View Reorder List
          </button>
        </div>
      )}

      {/* Reorder list panel */}
      {showReorderList && (
        <div className={CARD}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-neutral-900">Reorder List</h2>
            <button onClick={() => setShowReorderList(false)} className="p-1 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Item', 'Current Stock', 'Reorder Level', 'Supplier', ''].map(h => (
                  <th key={h} className={cn(LABEL, 'text-left py-2 pr-4 font-semibold')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {needAttention.map(item => (
                <tr key={item.id} className="border-b border-neutral-50">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-neutral-900">{item.name}</p>
                    <StatusBadge status={getStockStatus(item)} />
                  </td>
                  <td className="py-3 pr-4 font-mono tabular-nums font-bold">{item.currentStock} {item.unit}s</td>
                  <td className="py-3 pr-4 text-neutral-500">{item.reorderLevel} {item.unit}s</td>
                  <td className="py-3 pr-4 text-neutral-500 text-xs">{item.supplier}</td>
                  <td className="py-3">
                    <button
                      onClick={() => window.alert('Purchase order created for: ' + item.name)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                    >
                      Create PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KPI row */}
      {!showReorderList && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <KpiCard label="Total Items" value={allItems.length} />
            <KpiCard label="In Stock" value={okCount} color="text-success" />
            <KpiCard label="Low Stock" value={lowCount} color="text-warning-text" />
            <KpiCard label="Out of Stock" value={outCount} color="text-error" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search items…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="">All Categories</option>
              {Object.entries(INVENTORY_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="">All Statuses</option>
              <option value="OK">In Stock</option>
              <option value="LOW">Low Stock</option>
              <option value="OUT">Out of Stock</option>
            </select>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className={cn(CARD, 'p-0 overflow-hidden')}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  {['Item Name', 'Category', 'Stock', 'Location Stock', 'Reorder Lvl', 'Unit Cost', 'Status', ''].map(h => (
                    <th key={h} className={cn(LABEL, 'text-left px-4 py-3')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-neutral-400 text-sm">No items match your filters.</td>
                  </tr>
                )}
                {filtered.map(item => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className={cn('border-b border-neutral-100 hover:bg-neutral-50/60 transition-colors', rowBg(item))}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">per {item.unit}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-600">
                          {INVENTORY_CATEGORIES[item.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono tabular-nums text-neutral-900">{item.currentStock}</td>
                      <td className="px-4 py-3 text-[11px] text-neutral-500 leading-5">
                        Osu: {item.locationStock['Osu Branch']}<br />
                        Spintex: {item.locationStock['Spintex Branch']}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{item.reorderLevel}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">{formatGHS(item.unitCost)}</td>
                      <td className="px-4 py-3"><StatusBadge status={status} /></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Details <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-400">
              {filtered.length} of {allItems.length} items
            </div>
          </div>
        </>
      )}

      {/* Detail panel */}
      {selectedItem && <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* Receive modal */}
      {showReceiveModal && <ReceiveModal onClose={() => setShowReceiveModal(false)} />}
    </div>
  );
}
