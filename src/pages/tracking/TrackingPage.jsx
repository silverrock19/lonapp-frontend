import { Link } from 'react-router-dom';
import { ScanBarcode, MapPin, Layers, ArrowRightLeft, Activity, ArrowRight, CheckCircle2, Clock, Truck } from 'lucide-react';
import { getAllItems, ITEM_STATUS_COLOR, ITEM_STATUS_LABELS } from '../../lib/mock/mockItems.js';
import { getTrackingStats, getAllBatches, getInTransit, ZONE_LABELS, ZONE_COLORS, STATUS_PIPELINE } from '../../lib/mock/mockTracking.js';
import { cn } from '../../utils/classNames.js';

const ZONE_ORDER = ['intake', 'sorting', 'washing', 'drying', 'ironing', 'qc', 'dispatch'];

const STATUS_ZONE_MAP = {
  RECEIVED:   'intake',
  SORTING:    'sorting',
  TAGGED:     'sorting',
  WASHING:    'washing',
  DRYING:     'drying',
  IRONING:    'ironing',
  QC:         'qc',
  PACKAGED:   'dispatch',
  DISPATCHED: 'dispatch',
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-h3 font-bold text-neutral-900">{value}</p>
      <p className="text-caption text-neutral-500">{label}</p>
      {sub && <p className="text-[10px] text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function TrackingPage() {
  const items = getAllItems();
  const batches = getAllBatches();
  const inTransit = getInTransit();
  const stats = getTrackingStats(items);

  // Count items per zone from live status
  const zoneCounts = ZONE_ORDER.reduce((acc, z) => ({ ...acc, [z]: 0 }), {});
  items.forEach(item => {
    const zone = STATUS_ZONE_MAP[item.status];
    if (zone) zoneCounts[zone] = (zoneCounts[zone] ?? 0) + 1;
  });

  const activeBatches = batches.filter(b => b.status === 'active');

  const STAT_CARDS = [
    { icon: Activity,      label: 'Active batches',      value: stats.activeBatches,     color: 'bg-primary-50 text-primary-600',  sub: 'currently processing' },
    { icon: ScanBarcode,   label: 'Scans today',          value: stats.scannedToday,      color: 'bg-accent-50 text-accent-600',    sub: 'checkpoint advances'  },
    { icon: Truck,         label: 'In transit',           value: stats.inTransit,         color: 'bg-amber-50 text-amber-600',      sub: 'inter-outlet transfers'},
    { icon: CheckCircle2,  label: 'Batches done today',   value: stats.completedBatches,  color: 'bg-success/10 text-success',      sub: 'completed loads'      },
  ];

  const QUICK_ACTIONS = [
    { icon: ScanBarcode,    label: 'Checkpoint Scan',      desc: 'Scan to advance item status', to: '/tracking/scan',     color: 'border-accent-200 bg-accent-50 text-accent-700'   },
    { icon: MapPin,         label: 'Item Locations',       desc: 'Live status & location map',  to: '/tracking/items',    color: 'border-blue-200 bg-blue-50 text-blue-700'         },
    { icon: Layers,         label: 'Batch Board',          desc: 'Manage processing loads',     to: '/tracking/batches',  color: 'border-primary-200 bg-primary-50 text-primary-700'},
    { icon: ArrowRightLeft, label: 'Transfers',            desc: 'Move items between locations',to: '/tracking/transfer', color: 'border-amber-200 bg-amber-50 text-amber-700'      },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Tracking &amp; Status</h1>
        <p className="text-caption text-neutral-500">
          US-0109–0112 · 0124 · Real-time item tracking, checkpoint scanning, batch management and inter-outlet transfers
        </p>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Factory floor overview ───────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
          <p className="text-small font-semibold text-neutral-800">Factory Floor — Live Overview</p>
          <Link to="/tracking/items" className="flex items-center gap-1 text-caption text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-7 divide-x divide-neutral-100">
          {ZONE_ORDER.map((zone, i) => {
            const count = zoneCounts[zone] ?? 0;
            return (
              <div key={zone} className="flex flex-col items-center gap-1 py-4 px-2 text-center">
                <span className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-full text-small font-bold',
                  count > 0 ? ZONE_COLORS[zone] : 'bg-neutral-50 text-neutral-300',
                )}>
                  {count}
                </span>
                <p className="text-[10px] font-medium text-neutral-500">{ZONE_LABELS[zone]}</p>
                {i < ZONE_ORDER.length - 1 && (
                  <ArrowRight className="h-2.5 w-2.5 text-neutral-200 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick actions ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.to} to={a.to} className={cn('rounded-xl border p-4 flex items-start gap-3 hover:shadow-md transition-shadow', a.color)}>
            <a.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-semibold">{a.label}</p>
              <p className="text-[10px] mt-0.5 opacity-70">{a.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto flex-shrink-0 self-center opacity-50" />
          </Link>
        ))}
      </div>

      {/* ── Active batches + In-transit ──────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active batches */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <p className="text-small font-semibold text-neutral-800">Active Batches ({activeBatches.length})</p>
            <Link to="/tracking/batches" className="text-caption text-primary-600 hover:text-primary-700">
              View board
            </Link>
          </div>
          {activeBatches.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Layers className="h-6 w-6 text-neutral-300 mb-1" />
              <p className="text-caption text-neutral-400">No active batches</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {activeBatches.map(b => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold text-neutral-800">{b.name}</p>
                    <p className="text-[10px] text-neutral-500">{b.itemIds.length} items · {b.machineId ?? '—'}</p>
                  </div>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In transit */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <p className="text-small font-semibold text-neutral-800">In Transit ({inTransit.length})</p>
            <Link to="/tracking/transfer" className="text-caption text-primary-600 hover:text-primary-700">
              View transfers
            </Link>
          </div>
          {inTransit.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Truck className="h-6 w-6 text-neutral-300 mb-1" />
              <p className="text-caption text-neutral-400">No active transfers</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {inTransit.map(t => {
                const from = t.fromLocationId?.replace('loc-', '').replace('-', ' ');
                const to   = t.toLocationId?.replace('loc-', '').replace('-', ' ');
                return (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <Truck className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] text-neutral-700">{t.id}</p>
                      <p className="text-[10px] text-neutral-500">{t.itemIds.length} item{t.itemIds.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">In Transit</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
