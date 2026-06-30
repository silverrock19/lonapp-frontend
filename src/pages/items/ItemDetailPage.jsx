import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ArrowRight, ScanBarcode, Layers, AlertTriangle, Camera } from 'lucide-react';
import { getItemById, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { getIntakeData } from '../../lib/mock/mockIntake.js';
import { getCheckpointsForItem, getBatchesForItem, ZONE_LABELS } from '../../lib/mock/mockTracking.js';
import { getLostForItem, getDamageForItem, getQuarantineForItem, DAMAGE_SEVERITY, QUARANTINE_STATUSES } from '../../lib/mock/mockExceptions.js';
import { cn } from '../../utils/classNames.js';

const PHOTO_GRADIENTS = [
  'from-slate-400 to-slate-600', 'from-teal-400 to-teal-600',
  'from-blue-400 to-blue-600',   'from-indigo-400 to-indigo-600',
];

const PHOTO_LABELS = { front: 'Front', back: 'Back', closeup: 'Close-up', damage: 'Damage' };

const TABS = ['Overview', 'History', 'Exceptions'];

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3">
      <p className="w-28 flex-shrink-0 text-caption text-neutral-400">{label}</p>
      <p className="text-caption text-neutral-700 font-medium">{value || '—'}</p>
    </div>
  );
}

function TimelineEvent({ icon: Icon, color, title, sub, note, batchId, machineId, location, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full', color)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!isLast && <div className="mt-1 flex-1 w-0.5 bg-neutral-100 min-h-[20px]" />}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-small font-semibold text-neutral-800">{title}</p>
        <p className="text-[10px] text-neutral-500">{sub}</p>
        {note && <p className="text-[10px] text-neutral-400 mt-0.5 italic">{note}</p>}
        {(batchId || machineId || location) && (
          <div className="mt-1 flex flex-wrap gap-2">
            {location && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] text-neutral-500">{location}</span>
            )}
            {batchId && (
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[9px] text-primary-600">{batchId}</span>
            )}
            {machineId && (
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[9px] text-accent-600">{machineId}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const [tab, setTab] = useState('Overview');

  const item = getItemById(itemId);
  if (!item) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-small font-semibold text-neutral-600">Item not found: {itemId}</p>
        <Link to="/items" className="mt-3 text-caption text-primary-600">← Back to search</Link>
      </div>
    );
  }

  const intake     = getIntakeData(itemId);
  const checkpoints = getCheckpointsForItem(itemId);
  const batches    = getBatchesForItem(itemId);
  const lostRec    = getLostForItem(itemId);
  const damageRecs = getDamageForItem(itemId);
  const qrtRec     = getQuarantineForItem(itemId);

  // Build unified history timeline
  const events = [];
  // Item history events from mockItems
  (item.history ?? []).forEach(h => {
    events.push({ at: h.at, type: 'status', title: `Status → ${ITEM_STATUS_LABELS[h.status] ?? h.status}`, sub: `${h.by ?? 'System'} · ${h.at?.slice(11, 16)}`, note: h.note });
  });
  // Checkpoint scans
  checkpoints.forEach(chk => {
    events.push({
      at: chk.scanAt,
      type: 'scan',
      title: `Checkpoint scan → ${ITEM_STATUS_LABELS[chk.toStatus]}`,
      sub: `${chk.scannedBy} · ${chk.scanAt?.slice(11, 16)}`,
      note: chk.notes || null,
      batchId: chk.batchId ?? null,
      machineId: chk.machineId ?? null,
      location: chk.location ?? null,
    });
  });
  // Sort by time desc
  events.sort((a, b) => (b.at ?? '').localeCompare(a.at ?? ''));

  const hasExceptions = lostRec || damageRecs.length > 0 || qrtRec;
  const exceptionCount = (lostRec ? 1 : 0) + damageRecs.length + (qrtRec ? 1 : 0);

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <Link to="/items" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors mt-0.5">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-[11px] text-neutral-500">{item.barcode}</span>
            <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
              {ITEM_STATUS_LABELS[item.status]}
            </span>
            {hasExceptions && (
              <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-semibold text-error">
                <AlertTriangle className="h-2.5 w-2.5" /> {exceptionCount} exception{exceptionCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h1 className="text-h2 font-bold text-neutral-900">{item.typeName} × {item.qty}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-caption text-neutral-600">{item.customerName}</p>
            <p className="text-caption text-neutral-400">{item.orderId}</p>
            {item.location && (
              <div className="flex items-center gap-1 text-caption text-neutral-500">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[160px]">{item.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-neutral-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-small font-medium border-b-2 transition-colors',
              tab === t
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-700',
            )}
          >
            {t}
            {t === 'Exceptions' && exceptionCount > 0 && (
              <span className="ml-1.5 rounded-full bg-error/10 px-1.5 py-0.5 text-[9px] font-bold text-error">{exceptionCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview tab ─────────────────────────────────────── */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Item details */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-2">
            <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-3">Item Details</p>
            <InfoRow label="Item type"   value={item.typeName} />
            <InfoRow label="Quantity"    value={`${item.qty}`} />
            <InfoRow label="Service"     value={item.service} />
            <InfoRow label="Outlet"      value={item.outletName} />
            <InfoRow label="Status"      value={ITEM_STATUS_LABELS[item.status]} />
            <InfoRow label="Location"    value={item.location} />
          </div>

          {/* Intake attributes */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-2">
            <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-3">Intake Attributes</p>
            {intake ? (
              <>
                <InfoRow label="Fabric"      value={intake.fabric} />
                <InfoRow label="Color"       value={intake.color} />
                <InfoRow label="Pattern"     value={intake.pattern} />
                <InfoRow label="Weight"      value={intake.weight ? `${intake.weight} kg` : null} />
                <InfoRow label="Brand"       value={intake.brand} />
                <InfoRow label="Condition"   value={intake.condition} />
                <InfoRow label="Stains"      value={`${intake.stains?.length ?? 0} mapped`} />
                <InfoRow label="Defects"     value={`${intake.defects?.length ?? 0} recorded`} />
              </>
            ) : (
              <p className="text-caption text-neutral-400">No intake data recorded yet</p>
            )}
          </div>

          {/* Photos */}
          {intake?.photos?.length > 0 && (
            <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-3">Photos ({intake.photos.length})</p>
              <div className="flex gap-2 flex-wrap">
                {intake.photos.map((ph, i) => (
                  <div key={i} className={`h-16 w-16 rounded-lg bg-gradient-to-br ${PHOTO_GRADIENTS[i % PHOTO_GRADIENTS.length]} flex flex-col items-center justify-center`}>
                    <Camera className="h-4 w-4 text-white/70" />
                    <p className="text-[8px] text-white/70 mt-0.5">{PHOTO_LABELS[ph.type] ?? ph.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batches */}
          {batches.length > 0 && (
            <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-3">Batch Membership</p>
              <div className="space-y-1.5">
                {batches.map(b => (
                  <div key={b.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <Layers className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                    <p className="text-small font-medium text-neutral-700 flex-1">{b.name}</p>
                    <span className="font-mono text-[10px] text-neutral-400">{b.id}</span>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      b.status === 'active' ? 'bg-primary-50 text-primary-700'
                        : b.status === 'completed' ? 'bg-success/10 text-success'
                        : 'bg-neutral-100 text-neutral-500',
                    )}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── History tab (US-0118) ─────────────────────────────── */}
      {tab === 'History' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider mb-4">Processing History — Audit Trail</p>
          {events.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <ScanBarcode className="h-6 w-6 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">No history events recorded</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((ev, i) => (
                <TimelineEvent
                  key={i}
                  icon={ev.type === 'scan' ? ScanBarcode : ArrowRight}
                  color={ev.type === 'scan' ? 'bg-accent-50 text-accent-600' : 'bg-primary-50 text-primary-600'}
                  title={ev.title}
                  sub={ev.sub}
                  note={ev.note}
                  batchId={ev.batchId}
                  machineId={ev.machineId}
                  location={ev.location}
                  isLast={i === events.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Exceptions tab ───────────────────────────────────── */}
      {tab === 'Exceptions' && (
        <div className="space-y-3">
          {!hasExceptions && (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
              <AlertTriangle className="h-6 w-6 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">No exceptions recorded for this item</p>
            </div>
          )}

          {lostRec && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-small font-semibold text-amber-900">Lost Item Report</p>
                <span className="ml-auto font-mono text-[10px] text-amber-600">{lostRec.id}</span>
              </div>
              <p className="text-caption text-amber-800">Status: {lostRec.status} · Last seen: {lostRec.lastSeen}</p>
              <p className="text-[10px] text-amber-600 mt-1">Reported by {lostRec.reportedBy} · {lostRec.reportedAt.slice(0,10)}</p>
            </div>
          )}

          {damageRecs.map(r => {
            const sev = DAMAGE_SEVERITY.find(s => s.id === r.severity);
            return (
              <div key={r.id} className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <p className="text-small font-semibold text-orange-900">Damage Record</p>
                  <span className={cn('ml-auto rounded-full border px-2 py-0.5 text-[10px] font-semibold', sev?.color)}>{sev?.label}</span>
                </div>
                <p className="text-caption text-orange-800">{r.damageType} · {r.stage}</p>
                <p className="text-caption text-orange-700 mt-1">{r.description}</p>
                <p className="text-[10px] text-orange-600 mt-1">{r.recordedBy} · {r.recordedAt.slice(0,10)}</p>
              </div>
            );
          })}

          {qrtRec && (
            <div className="rounded-xl border border-error/30 bg-error/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-error" />
                <p className="text-small font-semibold text-error">Quarantine Hold</p>
                <span className="ml-auto font-mono text-[10px] text-error">{qrtRec.id}</span>
              </div>
              <p className="text-caption text-error">{QUARANTINE_STATUSES[qrtRec.status]?.label}</p>
              <p className="text-caption text-neutral-700 mt-1">{qrtRec.notes}</p>
              <p className="text-[10px] text-neutral-500 mt-1">Held by {qrtRec.heldBy} · {qrtRec.heldAt.slice(0,10)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
