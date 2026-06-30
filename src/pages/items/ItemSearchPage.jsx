import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ScanBarcode, Filter, X, ChevronRight, MapPin } from 'lucide-react';
import { getAllItems, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import ItemCard from '../../components/ui/ItemCard.jsx';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import { cn } from '../../utils/classNames.js';

const STATUS_OPTIONS = ['RECEIVED','SORTING','TAGGED','WASHING','DRYING','IRONING','QC','PACKAGED','DISPATCHED'];
const TYPE_OPTIONS   = ['shirt', 'suit', 'trouser', 'dress', 'jacket', 'bedsheet', 'duvet', 'curtain', 'towel'];

export default function ItemSearchPage() {
  const allItems = getAllItems();

  const [query,     setQuery]     = useState('');
  const [statusF,   setStatusF]   = useState('');
  const [typeF,     setTypeF]     = useState('');
  const [showScan,  setShowScan]  = useState(false);
  const [highlight, setHighlight] = useState(null);

  function handleScan(barcode) {
    setQuery(barcode);
    setShowScan(false);
    const found = allItems.find(i => i.barcode === barcode);
    setHighlight(found?.id ?? null);
  }

  const filtered = allItems.filter(item => {
    if (statusF && item.status !== statusF) return false;
    if (typeF   && item.type !== typeF)     return false;
    if (query) {
      const q = query.toLowerCase();
      return item.barcode.toLowerCase().includes(q)
        || item.orderId.toLowerCase().includes(q)
        || item.customerName.toLowerCase().includes(q)
        || item.typeName.toLowerCase().includes(q)
        || item.id.toLowerCase().includes(q);
    }
    return true;
  });

  const hasFilters = query || statusF || typeF;

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Item Search</h1>
        <p className="text-caption text-neutral-500">US-0117 · Search items by barcode, order, customer, or status</p>
      </div>

      {/* ── Search bar ──────────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setHighlight(null); }}
            placeholder="Search by barcode, order, customer, item type…"
            className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button onClick={() => { setQuery(''); setHighlight(null); }} className="text-neutral-400 hover:text-neutral-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowScan(v => !v)}
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-colors',
            showScan ? 'border-accent-400 bg-accent-50 text-accent-700' : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50',
          )}
        >
          <ScanBarcode className="h-4 w-4" />
        </button>
      </div>

      {/* ── Scanner ─────────────────────────────────────────── */}
      {showScan && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <ScannerInput
            onScan={handleScan}
            label="Scanner / keyboard-wedge"
            placeholder="Scan barcode to find item…"
            mockCameraBarcode="LA-10000003-000001"
          />
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />

        <select
          value={statusF}
          onChange={e => setStatusF(e.target.value)}
          className={cn(
            'rounded-full border px-3 py-1 text-caption font-medium outline-none transition-all',
            statusF ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600',
          )}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{ITEM_STATUS_LABELS[s]}</option>)}
        </select>

        <select
          value={typeF}
          onChange={e => setTypeF(e.target.value)}
          className={cn(
            'rounded-full border px-3 py-1 text-caption font-medium outline-none transition-all',
            typeF ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600',
          )}
        >
          <option value="">All types</option>
          {TYPE_OPTIONS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setQuery(''); setStatusF(''); setTypeF(''); setHighlight(null); }}
            className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}

        <span className="ml-auto text-caption text-neutral-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Results ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-16 text-center">
          <Search className="mb-2 h-8 w-8 text-neutral-300" />
          <p className="text-small font-medium text-neutral-600">No items found</p>
          <p className="text-caption text-neutral-400 mt-1">Try a different search term or clear filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={cn(
                'flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group',
                highlight === item.id ? 'border-accent-400 ring-2 ring-accent-100 shadow-md' : 'border-neutral-200',
              )}
            >
              {/* Barcode + type */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[11px] font-semibold text-neutral-600">{item.barcode}</span>
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                    {ITEM_STATUS_LABELS[item.status]}
                  </span>
                </div>
                <p className="text-small font-semibold text-neutral-800">{item.typeName} × {item.qty}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-caption text-neutral-500">{item.customerName}</p>
                  <p className="text-caption text-neutral-400">{item.orderId}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex-shrink-0 text-right">
                {item.location && (
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                    <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                    <span className="max-w-[120px] truncate">{item.location}</span>
                  </div>
                )}
                <p className="text-[9px] text-neutral-400 mt-0.5">{item.outletAbbrev}</p>
              </div>

              <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-300 group-hover:text-primary-400 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
