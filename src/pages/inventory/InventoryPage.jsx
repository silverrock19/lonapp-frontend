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

function DetailPanel({ item, onClose }) {
  const [rQty, setRQty] = useState('');
  const [rLoc, setRLoc] = useState('');
  const [rNote, setRNote] = useState('');
  const [aQty, setAQty] = useState('');
  const [aReason, setAReason] = useState('');

  const status = getStockStatus(item);

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

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-96 bg-white border-l border-neutral-200 shadow-xl flex flex-col overflow-y-auto">
      <div className="flex items-start justify-between p-5 border-b border-neutral-100">
        <div>
          <h3 className="font-bold text-neutral-900 leading-snug">{item.name}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">{INVENTORY_CATEGORIES[item.category]} · {item.supplier}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{item.supplierContact}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 ml-2 flex-shrink-0"><X size={16} /></button>
      </div>

      <div className="p-5 border-b border-neutral-100 space-y-3">
        <div className="flex items-center justify-between">
          <p className={LABEL}>Stock Overview</p>
          <StatusBadge status={status} />
        </div>
        {LOCATIONS.map(loc => (
          <div key={loc}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-neutral-600">{loc}</span>
              <span className="text-xs font-mono font-semibold tabular-nums">{item.locationStock[loc]} / {item.maxStock}</span>
            </div>
            <StockBar current={item.locationStock[loc]} max={item.maxStock} />
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="text-center">
            <p className={LABEL}>Total</p>
            <p className="font-bold text-lg">{item.currentStock}</p>
          </div>
          <div className="text-center">
            <p className={LABEL}>Reorder At</p>
            <p className="font-bold text-lg">{item.reorderLevel}</p>
          </div>
          <div className="text-center">
            <p className={LABEL}>Unit Cost</p>
            <p className="font-bold text-sm font-mono tabular-nums">{formatGHS(item.unitCost)}</p>
          </div>
        </div>
        {item.notes && (
          <p className="text-xs bg-warning-bg text-warning-text rounded-lg px-3 py-2">{item.notes}</p>
        )}
      </div>

      {item.movements.length > 0 && (
        <div className="p-5 border-b border-neutral-100">
          <p className={cn(LABEL, 'mb-3')}>Movement History</p>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Type', 'Qty', 'Date', 'By', 'Note'].map(h => (
                  <th key={h} className="text-left py-1.5 pr-2 text-neutral-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.movements.map((m, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td className="py-1.5 pr-2">
                    <span className={cn('font-bold', m.type === 'IN' ? 'text-success' : 'text-error')}>
                      {m.type === 'IN' ? <ArrowDown size={12} className="inline mr-0.5" /> : <ArrowUp size={12} className="inline mr-0.5" />}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-1.5 pr-2 font-mono tabular-nums font-semibold">{m.qty}</td>
                  <td className="py-1.5 pr-2 text-neutral-500">{m.date}</td>
                  <td className="py-1.5 pr-2 text-neutral-500">{m.by}</td>
                  <td className="py-1.5 text-neutral-400 truncate max-w-[80px]">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-5 border-b border-neutral-100">
        <p className={cn(LABEL, 'mb-3')}>Receive Stock</p>
        <form onSubmit={handleReceive} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input required type="number" min="1" value={rQty} onChange={e => setRQty(e.target.value)}
              placeholder="Quantity"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm w-full" />
            <select required value={rLoc} onChange={e => setRLoc(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm w-full">
              <option value="">Location…</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <input type="text" value={rNote} onChange={e => setRNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <button type="submit"
            className="w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
            Confirm Receipt
          </button>
        </form>
      </div>

      <div className="p-5">
        <p className={cn(LABEL, 'mb-3')}>Adjust Stock</p>
        <form onSubmit={handleAdjust} className="space-y-2">
          <input required type="number" value={aQty} onChange={e => setAQty(e.target.value)}
            placeholder="Adjustment (e.g. -2 or +5)"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <input required type="text" value={aReason} onChange={e => setAReason(e.target.value)}
            placeholder="Reason for adjustment"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <button type="submit"
            className="w-full py-2 rounded-lg border border-neutral-200 text-sm font-semibold hover:bg-neutral-50">
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
