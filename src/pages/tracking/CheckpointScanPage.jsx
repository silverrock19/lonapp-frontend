import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ScanBarcode, CheckCircle2, ArrowRight, MapPin, ChevronDown, AlertTriangle } from 'lucide-react';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import { getItemByBarcode, getAllItems, updateItem, addItemEvent, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import {
  STATUS_PIPELINE, nextStatus, locationForStatus, recordCheckpoint,
  getRecentCheckpoints, LOCATIONS,
} from '../../lib/mock/mockTracking.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

function StatusPipelineBar({ current }) {
  const idx = STATUS_PIPELINE.findIndex(s => s.status === current);
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {STATUS_PIPELINE.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        const future = i > idx;
        return (
          <div key={step.status} className="flex items-center flex-shrink-0">
            <div className={cn(
              'flex flex-col items-center gap-0.5',
              i === 0 ? '' : '',
            )}>
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold border-2 transition-all',
                done   ? 'border-success bg-success text-white'
                  : active ? 'border-primary-500 bg-white text-primary-600'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-300',
              )}>
                {done ? '✓' : i + 1}
              </div>
              <p className={cn(
                'text-[8px] font-medium whitespace-nowrap',
                active ? 'text-primary-600' : done ? 'text-success' : 'text-neutral-300',
              )}>
                {step.label}
              </p>
            </div>
            {i < STATUS_PIPELINE.length - 1 && (
              <div className={cn(
                'h-0.5 w-5 flex-shrink-0 mb-3 mx-0.5',
                i < idx ? 'bg-success' : 'bg-neutral-200',
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckpointHistoryRow({ chk }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
      <ScanBarcode className="h-3 w-3 text-neutral-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-semibold text-neutral-700 truncate">{chk.barcode}</p>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {chk.fromStatus && (
            <span className="text-[9px] text-neutral-500">{ITEM_STATUS_LABELS[chk.fromStatus]}</span>
          )}
          {chk.fromStatus && <ArrowRight className="h-2.5 w-2.5 text-neutral-400 flex-shrink-0" />}
          <span className={cn(
            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
            ITEM_STATUS_COLOR[chk.toStatus],
          )}>
            {ITEM_STATUS_LABELS[chk.toStatus]}
          </span>
        </div>
        <p className="text-[9px] text-neutral-400 mt-0.5">{chk.scannedBy}</p>
      </div>
    </div>
  );
}

const ALL_STATUSES = STATUS_PIPELINE.map(s => s.status);

export default function CheckpointScanPage() {
  const [item, setItem]           = useState(null);
  const [scanError, setScanError] = useState('');
  const [override, setOverride]   = useState('');
  const [showOverride, setShowOverride] = useState(false);
  const [location, setLocation]   = useState('');
  const [notes, setNotes]         = useState('');
  const [advanced, setAdvanced]   = useState(false);
  const [history, setHistory]     = useState(getRecentCheckpoints);
  const [dupWarn, setDupWarn]     = useState(null); // { item, lastScan, minsAgo, pendingAdvance }
  const [oosWarn, setOosWarn]     = useState(null); // { item, skipped, pendingStatus }

  const next = item ? (override || nextStatus(item.status)) : null;
  const nextLabel = next ? ITEM_STATUS_LABELS[next] : null;
  const autoLocation = item ? locationForStatus(next ?? item.status, item.outletId) : null;
  const effectiveLocation = location || autoLocation?.fullLabel || '';

  function handleScan(barcode) {
    const found = getItemByBarcode(barcode);
    if (!found) {
      setScanError(`No item found for barcode ${barcode}`);
      setItem(null);
      return;
    }
    setScanError('');
    setItem(found);
    setOverride('');
    setNotes('');
    setAdvanced(false);
  }

  const pipeline = ['RECEIVED','SORTING','TAGGED','WASHING','DRYING','IRONING','QC','PACKAGED','DISPATCHED'];

  function performAdvance() {
    if (!item || !next) return;
    const locLabel = effectiveLocation;

    updateItem(item.id, { status: next, location: locLabel });
    addItemEvent(item.id, next, 'Ama Otu', `Checkpoint scan → ${ITEM_STATUS_LABELS[next]}. ${notes}`.trim());
    recordCheckpoint({
      itemId: item.id,
      barcode: item.barcode,
      scannedBy: 'Ama Otu',
      fromStatus: item.status,
      toStatus: next,
      locationId: autoLocation?.id ?? 'loc-osu-intake',
      notes,
    });

    setItem(prev => ({ ...prev, status: next, location: locLabel }));
    setHistory(getRecentCheckpoints());
    setAdvanced(true);
    setNotes('');
    setOverride('');
  }

  function handleAdvance() {
    if (!item || !next) return;

    // Duplicate scan check
    const recentForItem = getRecentCheckpoints(50).filter(chk => chk.itemId === item.id);
    const lastScan = recentForItem[0];
    if (lastScan) {
      const minsAgo = Math.floor((new Date('2026-06-29T12:00:00') - new Date(lastScan.scanAt)) / 60000);
      if (minsAgo < 30) {
        setDupWarn({ item, lastScan, minsAgo, pendingAdvance: true });
        return;
      }
    }

    // Out-of-sequence check
    const currentIdx = pipeline.indexOf(item.status);
    const targetStatus = override || nextStatus(item.status);
    const targetIdx = pipeline.indexOf(targetStatus);
    const skipped = targetIdx - currentIdx - 1;
    if (skipped > 1 && !oosWarn) {
      const skippedSteps = pipeline.slice(currentIdx + 1, targetIdx).join(' → ');
      setOosWarn({ item, skipped: skippedSteps, pendingStatus: targetStatus });
      return;
    }

    performAdvance();
  }

  function handleScanAnother() {
    setItem(null);
    setAdvanced(false);
    setScanError('');
    setLocation('');
  }

  return (
    <div className="space-y-5">

      {/* Duplicate scan warning */}
      {dupWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-small font-bold text-neutral-900">Already scanned recently</p>
            </div>
            <p className="text-caption text-neutral-600">
              {dupWarn.item.barcode} was scanned <strong>{dupWarn.minsAgo} min ago</strong> by {dupWarn.lastScan.scannedBy}. Scanning again will advance its status a second time.
            </p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setDupWarn(null)} className="flex-1 rounded-lg border border-neutral-200 py-2 text-small font-semibold text-neutral-700 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={() => { setDupWarn(null); performAdvance(); }}
                className="flex-1 rounded-lg bg-amber-500 py-2 text-small font-semibold text-white hover:bg-amber-600"
              >
                Advance Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out-of-sequence warning */}
      {oosWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle className="h-5 w-5 text-error" />
              </div>
              <p className="text-small font-bold text-neutral-900">Out-of-sequence scan</p>
            </div>
            <p className="text-caption text-neutral-600">
              This skips: <strong>{oosWarn.skipped}</strong>. Add a reason note before proceeding.
            </p>
            <textarea
              id="oos-notes"
              placeholder="Reason for skipping checkpoints…"
              rows={2}
              className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
            <div className="flex gap-2 pt-1">
              <button onClick={() => setOosWarn(null)} className="flex-1 rounded-lg border border-neutral-200 py-2 text-small font-semibold text-neutral-700 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = document.getElementById('oos-notes').value;
                  setNotes(prev => (prev ? prev + ' [OOS: ' + reason + ']' : '[OOS: ' + reason + ']'));
                  setOosWarn(null);
                  performAdvance();
                }}
                className="flex-1 rounded-lg bg-error py-2 text-small font-semibold text-white hover:bg-error/90"
              >
                Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tracking" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Checkpoint Scan</h1>
          <p className="text-caption text-neutral-500">US-0109 · US-0111 · Scan items at processing checkpoints to advance status</p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left: scanner + result ─── */}
        <div className="flex-1 space-y-4">

          {/* Scanner */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-small font-semibold text-neutral-800">Scan item barcode</h2>
            <ScannerInput
              onScan={handleScan}
              label="Scanner / keyboard-wedge"
              placeholder="Scan barcode or type LA-XXXXXXXX-XXXXXX…"
              mockCameraBarcode="LA-10000003-000001"
            />
            {scanError && <p className="text-caption text-error">{scanError}</p>}
          </div>

          {/* Scan result */}
          {item && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              {/* Item summary */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] text-neutral-500">{item.barcode}</p>
                  <p className="text-small font-semibold text-neutral-900 mt-0.5">
                    {item.typeName} × {item.qty} — {item.customerName}
                  </p>
                  <p className="text-[10px] text-neutral-400">{item.orderId}</p>
                </div>
                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0', ITEM_STATUS_COLOR[item.status])}>
                  {ITEM_STATUS_LABELS[item.status]}
                </span>
              </div>

              {/* Status pipeline */}
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2">Status pipeline</p>
                <StatusPipelineBar current={item.status} />
              </div>

              {/* Success state */}
              {advanced ? (
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-small font-semibold text-success">Advanced to {ITEM_STATUS_LABELS[item.status]}</p>
                    <p className="text-[10px] text-neutral-500">{effectiveLocation}</p>
                  </div>
                  <button onClick={handleScanAnother} className="ml-auto text-caption font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">
                    Scan next
                  </button>
                </div>
              ) : (
                <>
                  {/* Auto-location */}
                  <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                    <p className="text-caption text-neutral-700 flex-1">{effectiveLocation || '—'}</p>
                    <button
                      onClick={() => setLocation('')}
                      className="text-[10px] text-neutral-400 hover:text-neutral-600"
                    >
                      Auto
                    </button>
                  </div>

                  {/* Notes */}
                  <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Notes (optional)…"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
                  />

                  {/* Override status */}
                  <div>
                    <button
                      onClick={() => setShowOverride(v => !v)}
                      className="flex items-center gap-1 text-caption text-neutral-500 hover:text-neutral-700"
                    >
                      <ChevronDown className={cn('h-3 w-3 transition-transform', showOverride && 'rotate-180')} />
                      Override target status
                    </button>
                    {showOverride && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {ALL_STATUSES.filter(s => s !== item.status).map(s => (
                          <button
                            key={s}
                            onClick={() => setOverride(s === override ? '' : s)}
                            className={cn(
                              'rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all',
                              override === s
                                ? 'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-100'
                                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
                            )}
                          >
                            {ITEM_STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advance button */}
                  {next ? (
                    <Button variant="accent" size="default" className="w-full" onClick={handleAdvance}>
                      <ArrowRight className="h-4 w-4" />
                      Advance to {override ? ITEM_STATUS_LABELS[override] : nextLabel}
                    </Button>
                  ) : (
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-center text-caption text-neutral-500">
                      Item is at final status — no further advancement
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Right: recent scans ─── */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <p className="text-caption font-semibold uppercase tracking-wider text-neutral-400">Recent Scans</p>
          {history.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-10 flex flex-col items-center text-center">
              <ScanBarcode className="h-6 w-6 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">No scans yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(chk => <CheckpointHistoryRow key={chk.id} chk={chk} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
