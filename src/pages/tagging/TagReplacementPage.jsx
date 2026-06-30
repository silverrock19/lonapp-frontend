import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import BarcodeDisplay from '../../components/ui/BarcodeDisplay.jsx';
import { getItemByBarcode, getAllItems, updateItem, addItemEvent } from '../../lib/mock/mockItems.js';
import { REPLACEMENT_REASONS, addReplacement, getReplacements } from '../../lib/mock/mockTagging.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const STEPS = ['Find Item', 'Select Reason', 'Confirm & Print', 'Done'];

function StepDot({ n, current, label }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold border-2 transition-all',
        done   ? 'bg-success border-success text-white'
          : active ? 'border-primary-500 bg-white text-primary-600'
          : 'border-neutral-200 bg-neutral-50 text-neutral-400',
      )}>
        {done ? '✓' : n}
      </div>
      <span className={cn('text-[10px] font-medium', active ? 'text-primary-600' : done ? 'text-success' : 'text-neutral-400')}>
        {label}
      </span>
    </div>
  );
}

function Connector({ done }) {
  return (
    <div className={cn('h-0.5 flex-1 mb-4 transition-colors', done ? 'bg-success' : 'bg-neutral-200')} />
  );
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function TagReplacementPage() {
  const [step, setStep]         = useState(1);
  const [item, setItem]         = useState(null);
  const [scanError, setScanError] = useState('');
  const [manualQuery, setManualQuery] = useState('');
  const [reason, setReason]     = useState('');
  const [notes, setNotes]       = useState('');
  const [confirmScan, setConfirmScan] = useState(false);
  const [history, setHistory]   = useState(getReplacements);
  const [latestId, setLatestId] = useState(null);

  function handleScan(barcode) {
    const found = getItemByBarcode(barcode);
    if (!found) {
      setScanError(`No item found for barcode ${barcode}`);
      return;
    }
    setScanError('');
    setItem(found);
    setStep(2);
  }

  function handleManualSearch() {
    if (!manualQuery.trim()) return;
    const q = manualQuery.trim().toUpperCase();
    const found = getAllItems().find(it =>
      it.barcode.toUpperCase() === q ||
      it.orderId.toUpperCase() === q
    );
    if (!found) {
      setScanError(`No item found matching "${manualQuery}"`);
      return;
    }
    setScanError('');
    setItem(found);
    setStep(2);
  }

  function handleConfirmScan(barcode) {
    // Confirm scan: the new barcode must match the item's barcode (preserved)
    if (barcode === item.barcode) {
      setConfirmScan(true);
    } else {
      setScanError(`Scanned barcode ${barcode} does not match ${item.barcode}`);
    }
  }

  function handleComplete() {
    if (!confirmScan) return;
    const entry = {
      originalBarcode: item.barcode,
      newBarcode: item.barcode, // barcode value preserved per US-0127
      itemId: item.id,
      orderId: item.orderId,
      customerName: item.customerName,
      typeName: item.typeName,
      reason,
      reasonLabel: REPLACEMENT_REASONS.find(r => r.id === reason)?.label ?? reason,
      replacedBy: 'Ama Otu',
      confirmScanned: true,
      notes,
    };
    const newRecord = addReplacement(entry);
    updateItem(item.id, {
      tags: {
        ...item.tags,
        barcode: { value: item.barcode, printedAt: new Date().toISOString(), printedBy: 'Ama Otu', replaced: true },
      },
    });
    addItemEvent(item.id, 'TAG_REPLACED', 'Ama Otu', `Replacement: ${entry.reasonLabel}. ${notes}`);
    setHistory(getReplacements());
    setLatestId(newRecord.id);
    setStep(4);
  }

  function handleReset() {
    setStep(1);
    setItem(null);
    setScanError('');
    setReason('');
    setNotes('');
    setConfirmScan(false);
    setManualQuery('');
  }

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tagging" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Tag Replacement &amp; Re-tagging</h1>
          <p className="text-caption text-neutral-500">US-0127 · Replace damaged or lost tags. Barcode value is preserved; history retained.</p>
        </div>
      </div>

      {/* ── Step indicator ──────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <StepDot n={i + 1} current={step} label={label} />
            {i < STEPS.length - 1 && <Connector done={step > i + 1} />}
          </div>
        ))}
      </div>

      {/* ── Step content ────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        <div className="flex-1 space-y-4">

          {/* Step 1: Find item */}
          {step === 1 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-small font-semibold text-neutral-800">Find the item with the damaged tag</h2>
              <ScannerInput
                onScan={handleScan}
                label="Scan damaged barcode"
                placeholder="Scan old/damaged barcode or enter manually…"
                mockCameraBarcode="LA-10000003-000001"
              />
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-caption text-neutral-400">or search by order ID</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <div className="flex gap-2">
                <input
                  value={manualQuery}
                  onChange={e => setManualQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                  placeholder="Order ID or barcode…"
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
                />
                <Button variant="outline" size="sm" onClick={handleManualSearch}>
                  <Search className="h-3.5 w-3.5" /> Search
                </Button>
              </div>
              {scanError && (
                <p className="text-caption text-error">{scanError}</p>
              )}
            </div>
          )}

          {/* Step 2: Reason + current tag info */}
          {step === 2 && item && (
            <div className="space-y-4">
              {/* Current tag card */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-small font-semibold text-neutral-800">Current tag information</h2>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Barcode', item.barcode],
                      ['Customer', item.customerName],
                      ['Item type', `${item.typeName} × ${item.qty}`],
                      ['Order', item.orderId],
                      ['Current status', item.status],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">{k}</p>
                        <p className={cn('text-small font-medium text-neutral-800', k === 'Barcode' && 'font-mono text-[12px]')}>{v}</p>
                      </div>
                    ))}
                  </div>
                  {item.tags.barcode ? (
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Tagged by</p>
                      <p className="text-caption text-neutral-700">
                        {item.tags.barcode.printedBy} · {fmtDateTime(item.tags.barcode.printedAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                        <AlertTriangle className="h-3 w-3" /> No barcode tag on record — item may be untagged
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-small font-semibold text-neutral-800">Reason for replacement</h2>
                <div className="grid grid-cols-2 gap-2">
                  {REPLACEMENT_REASONS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-left text-caption transition-all',
                        reason === r.id
                          ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300',
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-caption font-medium text-neutral-600">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Additional details about the tag damage or loss…"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400 resize-none"
                  />
                </div>
                <Button
                  variant="primary"
                  size="default"
                  disabled={!reason}
                  onClick={() => setStep(3)}
                  className="w-full"
                >
                  Continue to Print &amp; Confirm
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Print new tag + confirm scan */}
          {step === 3 && item && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-small font-semibold text-neutral-800">Print new tag</h2>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 flex flex-col items-center gap-2">
                  <BarcodeDisplay value={item.barcode} width={280} height={72} showLabel />
                  <p className="text-[10px] text-neutral-500">Barcode value preserved · New label will be printed</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-caption text-amber-800">
                  <strong>Important:</strong> The barcode value <strong>{item.barcode}</strong> is preserved exactly as before.
                  Only the physical label is replaced. All processing history is retained.
                </div>
                <Button variant="primary" size="default" className="w-full">
                  <RotateCcw className="h-4 w-4" /> Print Replacement Label
                </Button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-small font-semibold text-neutral-800">
                  Confirm: scan the new label to verify
                </h2>
                {confirmScan ? (
                  <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <p className="text-small font-semibold text-success">New label confirmed</p>
                  </div>
                ) : (
                  <ScannerInput
                    onScan={handleConfirmScan}
                    label="Scan the newly printed label"
                    placeholder="Scan new barcode to confirm…"
                    mockCameraBarcode={item.barcode}
                  />
                )}
                {scanError && <p className="text-caption text-error">{scanError}</p>}
                <Button
                  variant="accent"
                  size="default"
                  className="w-full"
                  disabled={!confirmScan}
                  onClick={handleComplete}
                >
                  <CheckCircle2 className="h-4 w-4" /> Complete Replacement
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && latestId && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-6 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <div>
                <p className="text-h3 font-bold text-neutral-900">Replacement complete</p>
                <p className="text-small text-neutral-600 mt-1">
                  Reference: <span className="font-mono font-semibold">{latestId}</span>
                </p>
                <p className="text-caption text-neutral-500 mt-1">
                  The original barcode value has been preserved. Full replacement history is logged below.
                </p>
              </div>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" /> Replace Another Tag
              </Button>
            </div>
          )}
        </div>

        {/* ── Right: history ─── */}
        <div className="w-72 flex-shrink-0">
          <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-400">
            Replacement History
          </p>
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-8 flex flex-col items-center text-center px-4">
                <RotateCcw className="h-6 w-6 text-neutral-300 mb-2" />
                <p className="text-caption text-neutral-400">No replacements yet</p>
              </div>
            ) : (
              history.map(record => (
                <div
                  key={record.id}
                  className={cn(
                    'rounded-lg border bg-white p-3 shadow-sm',
                    record.id === latestId ? 'border-success/40 bg-success/5' : 'border-neutral-200',
                  )}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-mono text-[9px] text-neutral-500 leading-snug">{record.id}</span>
                    {record.id === latestId && (
                      <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success whitespace-nowrap">New</span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-neutral-800 font-semibold">{record.originalBarcode}</p>
                  <p className="text-[10px] text-neutral-600 mt-0.5">{record.customerName} · {record.typeName}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {record.reasonLabel}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1">{fmtDateTime(record.replacedAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
