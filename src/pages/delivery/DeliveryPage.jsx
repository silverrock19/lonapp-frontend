import { useState } from 'react';
import { PackageCheck, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import {
  getAllBundles, toggleItemVerified, verifyBundle, dispatchBundle, getDeliveryStats, BUNDLE_STATUSES,
} from '../../lib/mock/mockDelivery.js';
import { getItemById, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center gap-3">
      <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-h3 font-bold text-neutral-900">{value}</p>
        <p className="text-[10px] text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

function BundleCard({ bundle, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [localBundle, setLocalBundle] = useState(bundle);

  const items = localBundle.itemIds.map(id => getItemById(id)).filter(Boolean);
  const verifiedCount = localBundle.verifiedItemIds.length;
  const totalCount    = localBundle.itemIds.length;
  const allVerified   = verifiedCount === totalCount;

  const statusDef = BUNDLE_STATUSES[localBundle.status];

  function handleToggle(itemId) {
    toggleItemVerified(localBundle.id, itemId);
    setLocalBundle(prev => {
      const has = prev.verifiedItemIds.includes(itemId);
      const verifiedItemIds = has
        ? prev.verifiedItemIds.filter(i => i !== itemId)
        : [...prev.verifiedItemIds, itemId];
      return { ...prev, verifiedItemIds };
    });
  }

  function handleVerify() {
    verifyBundle(localBundle.id, 'Kojo Mensah');
    setLocalBundle(prev => ({ ...prev, status: 'verified', verifiedItemIds: [...prev.itemIds], verifiedAt: '2026-06-29T12:00:00', verifiedBy: 'Kojo Mensah' }));
    onRefresh();
  }

  function handleDispatch() {
    dispatchBundle(localBundle.id, 'Kojo Mensah');
    setLocalBundle(prev => ({ ...prev, status: 'dispatched', dispatchedAt: '2026-06-29T12:30:00', dispatchedBy: 'Kojo Mensah' }));
    onRefresh();
  }

  return (
    <div className={cn(
      'rounded-xl border bg-white shadow-sm overflow-hidden',
      localBundle.status === 'dispatched' ? 'border-neutral-200 opacity-70'
        : localBundle.status === 'verified' ? 'border-success/30'
        : 'border-neutral-200',
    )}>
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-semibold text-neutral-600">{localBundle.id}</span>
              <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border', statusDef?.color)}>
                {statusDef?.label}
              </span>
            </div>
            <p className="text-small font-bold text-neutral-900">{localBundle.customerName}</p>
            <p className="text-caption text-neutral-500">{localBundle.orderId}</p>
          </div>

          {/* Verification progress */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <div className="relative h-1.5 w-20 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', allVerified ? 'bg-success' : 'bg-primary-400')}
                  style={{ width: `${totalCount ? (verifiedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-neutral-600">{verifiedCount}/{totalCount}</span>
            </div>
            <p className="text-[9px] text-neutral-400">items verified</p>
          </div>
        </div>

        {/* Delivery info */}
        <div className="mt-2 flex flex-wrap gap-3">
          {localBundle.deliveryAddress && (
            <div className="flex items-center gap-1 text-[10px] text-neutral-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{localBundle.deliveryAddress}</span>
            </div>
          )}
          {localBundle.customerPhone && (
            <div className="flex items-center gap-1 text-[10px] text-neutral-500">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{localBundle.customerPhone}</span>
            </div>
          )}
          <span className="text-[10px] text-neutral-500 capitalize">{localBundle.deliveryMethod === 'pickup' ? '🏪 Customer pickup' : '🚚 Home delivery'}</span>
        </div>

        {/* GPS + Packaging + COD */}
        <div className="mt-1.5 flex flex-wrap gap-2">
          {localBundle.gpsCode && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
              📍 {localBundle.gpsCode}
            </span>
          )}
          {localBundle.packagingMethod && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
              📦 {localBundle.packagingMethod.charAt(0).toUpperCase() + localBundle.packagingMethod.slice(1)}
            </span>
          )}
          {localBundle.isCOD && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              💵 COD: GH₵ {(localBundle.codAmount || 0).toFixed(2)}
            </span>
          )}
        </div>

        {localBundle.notes && (
          <div className="mt-2 rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5">
            <p className="text-[10px] text-amber-800">{localBundle.notes}</p>
          </div>
        )}
      </div>

      {/* Items verification checklist */}
      <div className="border-t border-neutral-100">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-caption font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />}
          {expanded ? 'Hide' : 'Show'} items
        </button>

        {expanded && (
          <div className="border-t border-neutral-100 divide-y divide-neutral-50">
            {items.map(item => {
              const isVerified = localBundle.verifiedItemIds.includes(item.id);
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                  <button
                    onClick={() => localBundle.status === 'pending' && handleToggle(item.id)}
                    className={cn(
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors',
                      isVerified
                        ? 'border-success bg-success text-white'
                        : localBundle.status === 'pending'
                          ? 'border-neutral-300 hover:border-success'
                          : 'border-neutral-200 bg-neutral-50',
                    )}
                  >
                    {isVerified && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-small text-neutral-800">{item.typeName} × {item.qty}</p>
                    <p className="font-mono text-[10px] text-neutral-500">{item.barcode}</p>
                  </div>
                  <span className={cn('flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                    {ITEM_STATUS_LABELS[item.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-neutral-100 px-4 py-3 flex items-center gap-2">
        {localBundle.status === 'pending' && (
          <>
            {!allVerified && (
              <button
                onClick={() => {
                  localBundle.itemIds.forEach(id => {
                    if (!localBundle.verifiedItemIds.includes(id)) handleToggle(id);
                  });
                }}
                className="text-caption text-primary-600 hover:text-primary-700 font-medium"
              >
                Check all
              </button>
            )}
            <Button
              variant="primary"
              size="sm"
              className="ml-auto"
              disabled={!allVerified}
              onClick={handleVerify}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verify Bundle
            </Button>
          </>
        )}
        {localBundle.status === 'verified' && (
          <Button variant="accent" size="sm" className="ml-auto w-full" onClick={handleDispatch}>
            <Truck className="h-3.5 w-3.5" />
            Dispatch to Customer
          </Button>
        )}
        {localBundle.status === 'dispatched' && (
          <div className="flex w-full items-center justify-center gap-2 text-caption text-success font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Dispatched {localBundle.dispatchedAt?.slice(11, 16)}
          </div>
        )}
      </div>
    </div>
  );
}

const FILTER_OPTIONS = ['all', 'pending', 'verified', 'dispatched'];
const FILTER_LABELS  = { all: 'All', pending: 'Pending', verified: 'Verified', dispatched: 'Dispatched' };

export default function DeliveryPage() {
  const [bundles, setBundles] = useState(getAllBundles);
  const [filter, setFilter]   = useState('all');
  const [showManifest, setShowManifest] = useState(false);
  const stats = getDeliveryStats();

  function refresh() { setBundles(getAllBundles()); }

  const filtered = bundles.filter(b => filter === 'all' || b.status === filter);

  const STAT_CARDS = [
    { icon: Clock,         label: 'Pending verification', value: stats.pendingVerification,  color: 'bg-amber-50 text-amber-600'  },
    { icon: PackageCheck,  label: 'Verified — ready',     value: stats.verifiedReady,         color: 'bg-blue-50 text-blue-600'    },
    { icon: Truck,         label: 'Dispatched today',     value: stats.dispatchedToday,       color: 'bg-success/10 text-success'  },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Delivery Bundles</h1>
          <p className="text-caption text-neutral-500">US-0116 · Group finished items into delivery bundles, verify all present, and dispatch to customers</p>
        </div>
        <button
          onClick={() => setShowManifest(true)}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-small font-semibold text-neutral-700 shadow-sm hover:border-neutral-300"
        >
          <Truck className="h-3.5 w-3.5" /> Driver Manifest
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Filter tabs ──────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-neutral-200">
        {FILTER_OPTIONS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2.5 text-small font-medium border-b-2 transition-colors capitalize',
              filter === f ? 'border-primary-500 text-primary-700' : 'border-transparent text-neutral-500 hover:text-neutral-700',
            )}
          >
            {FILTER_LABELS[f]}
            <span className={cn('ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold', filter === f ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500')}>
              {f === 'all' ? bundles.length : bundles.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Bundle list ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-16 text-center">
          <PackageCheck className="mb-2 h-8 w-8 text-neutral-300" />
          <p className="text-small font-medium text-neutral-600">No bundles in this view</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} onRefresh={refresh} />
          ))}
        </div>
      )}

      {showManifest && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <p className="text-small font-bold text-neutral-900">Driver Delivery Manifest</p>
                <p className="text-[10px] text-neutral-500">Verified &amp; dispatched bundles for today</p>
              </div>
              <button onClick={() => setShowManifest(false)} className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
                ✕
              </button>
            </div>
            <div className="divide-y divide-neutral-100">
              {bundles.filter(b => b.status === 'verified' || b.status === 'dispatched').length === 0 ? (
                <p className="py-8 text-center text-caption text-neutral-400">No verified or dispatched bundles yet</p>
              ) : (
                bundles.filter(b => b.status === 'verified' || b.status === 'dispatched').map((b, i) => (
                  <div key={b.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-neutral-500">{b.id}</span>
                        {b.isCOD && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">COD GH₵{(b.codAmount||0).toFixed(2)}</span>}
                        <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-semibold', b.status === 'dispatched' ? 'bg-success/10 text-success' : 'bg-blue-50 text-blue-700')}>{b.status}</span>
                      </div>
                      <p className="text-small font-semibold text-neutral-900 mt-0.5">{b.customerName}</p>
                      {b.deliveryAddress && <p className="text-[10px] text-neutral-500">{b.deliveryAddress}</p>}
                      <div className="flex gap-3 mt-0.5">
                        {b.gpsCode && <p className="text-[10px] text-neutral-400">GPS: {b.gpsCode}</p>}
                        {b.customerPhone && <p className="text-[10px] text-neutral-400">{b.customerPhone}</p>}
                      </div>
                      <p className="text-[10px] text-neutral-400">{b.itemIds.length} item{b.itemIds.length !== 1 ? 's' : ''} · {b.packagingMethod ?? 'folded'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-neutral-100 px-5 py-3">
              <button onClick={() => window.print()} className="text-caption text-primary-600 font-medium hover:text-primary-700">🖨 Print Manifest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
