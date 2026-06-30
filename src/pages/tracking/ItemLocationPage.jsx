import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { getAllItems, updateItem, addItemEvent, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import {
  STATUS_PIPELINE, nextStatus, locationForStatus, recordCheckpoint,
  getCheckpointsForItem, ZONE_LABELS, ZONE_COLORS,
} from '../../lib/mock/mockTracking.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const STATUS_ZONE_MAP = {
  RECEIVED: 'intake', SORTING: 'sorting', TAGGED: 'sorting',
  WASHING: 'washing', DRYING: 'drying', IRONING: 'ironing',
  QC: 'qc', PACKAGED: 'dispatch', DISPATCHED: 'dispatch',
};
const ZONE_ORDER = ['intake', 'sorting', 'washing', 'drying', 'ironing', 'qc', 'dispatch'];

function ZonePill({ zone, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium transition-all',
        active ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
      )}
    >
      <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold', ZONE_COLORS[zone])}>
        {count}
      </span>
      {ZONE_LABELS[zone]}
    </button>
  );
}

function ItemRow({ item, onAdvance }) {
  const [expanded, setExpanded] = useState(false);
  const zone = STATUS_ZONE_MAP[item.status];
  const next = nextStatus(item.status);
  const [localStatus, setLocalStatus] = useState(item.status);
  const [localLoc,    setLocalLoc   ] = useState(item.location);

  function handleAdvance() {
    if (!next) return;
    const loc = locationForStatus(next, item.outletId);
    updateItem(item.id, { status: next, location: loc.fullLabel });
    addItemEvent(item.id, next, 'Ama Otu', `Status updated via item location view`);
    recordCheckpoint({ itemId: item.id, barcode: item.barcode, scannedBy: 'Ama Otu', fromStatus: localStatus, toStatus: next, locationId: loc.id, notes: '' });
    setLocalStatus(next);
    setLocalLoc(loc.fullLabel);
    onAdvance?.();
  }

  const history = expanded ? getCheckpointsForItem(item.id) : [];

  return (
    <>
      <tr className={cn('border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors', expanded && 'bg-primary-50/30')}>
        <td className="px-4 py-2.5">
          <span className="font-mono text-[11px] text-neutral-700">{item.barcode}</span>
        </td>
        <td className="px-4 py-2.5">
          <p className="text-small text-neutral-800">{item.typeName} × {item.qty}</p>
          <p className="text-[10px] text-neutral-500">{item.customerName}</p>
        </td>
        <td className="px-4 py-2.5">
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[localStatus])}>
            {ITEM_STATUS_LABELS[localStatus]}
          </span>
        </td>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-neutral-300 flex-shrink-0" />
            <span className="text-caption text-neutral-600 truncate max-w-[160px]">{localLoc || '—'}</span>
          </div>
          {zone && (
            <span className={cn('inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold mt-0.5', ZONE_COLORS[zone])}>
              {ZONE_LABELS[zone]}
            </span>
          )}
        </td>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            {next && (
              <button
                onClick={handleAdvance}
                className="flex items-center gap-1 rounded-md border border-accent-300 bg-accent-50 px-2 py-1 text-[10px] font-semibold text-accent-700 hover:bg-accent-100 transition-colors"
              >
                → {ITEM_STATUS_LABELS[next]}
              </button>
            )}
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-neutral-100 bg-primary-50/20">
          <td colSpan={5} className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Checkpoint history</p>
            {history.length === 0 ? (
              <p className="text-caption text-neutral-400">No checkpoint scans recorded</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {history.map((chk, i) => (
                  <div key={chk.id} className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1">
                    {i > 0 && <ArrowRight className="h-2.5 w-2.5 text-neutral-300" />}
                    <span className={cn('inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold', ITEM_STATUS_COLOR[chk.toStatus])}>
                      {ITEM_STATUS_LABELS[chk.toStatus]}
                    </span>
                    <span className="text-[9px] text-neutral-400">{chk.scannedBy}</span>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function ItemLocationPage() {
  const [items, setItems]       = useState(getAllItems);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [query, setQuery]       = useState('');

  function refresh() { setItems(getAllItems()); }

  // Count per zone
  const zoneCounts = { all: items.length };
  items.forEach(item => {
    const zone = STATUS_ZONE_MAP[item.status];
    if (zone) zoneCounts[zone] = (zoneCounts[zone] ?? 0) + 1;
  });

  const filtered = items.filter(item => {
    const zone = STATUS_ZONE_MAP[item.status];
    if (zoneFilter !== 'all' && zone !== zoneFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return item.barcode.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.orderId.toLowerCase().includes(q) ||
        item.typeName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tracking" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Item Locations</h1>
          <p className="text-caption text-neutral-500">US-0110 · US-0111 · Live status and location of every item in the system</p>
        </div>
      </div>

      {/* ── Zone filter pills ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setZoneFilter('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium transition-all',
            zoneFilter === 'all' ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
          )}
        >
          All <span className="font-bold">{items.length}</span>
        </button>
        {ZONE_ORDER.map(zone => (
          zoneCounts[zone] !== undefined && (
            <ZonePill
              key={zone}
              zone={zone}
              count={zoneCounts[zone] ?? 0}
              active={zoneFilter === zone}
              onClick={() => setZoneFilter(zone === zoneFilter ? 'all' : zone)}
            />
          )
        ))}
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by barcode, customer, order, or item type…"
          className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
        />
      </div>

      {/* ── Items table ──────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <MapPin className="h-7 w-7 text-neutral-300 mb-2" />
            <p className="text-small font-medium text-neutral-600">No items match this filter</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {['Barcode', 'Item', 'Status', 'Location / Zone', 'Action'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-caption font-semibold text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <ItemRow key={item.id} item={item} onAdvance={refresh} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
