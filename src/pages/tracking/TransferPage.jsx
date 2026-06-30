import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, CheckCircle2, ScanBarcode, MapPin, ArrowRight, X, Truck } from 'lucide-react';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import { getItemByBarcode, getAllItems, updateItem, addItemEvent, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { LOCATIONS, getAllTransfers, createTransfer, receiveTransfer, getLocation } from '../../lib/mock/mockTracking.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const STEPS = ['Select Items', 'Choose Destination', 'Confirm'];

function StepDot({ n, current, label }) {
  const done   = n < current;
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
      <span className={cn('text-[10px] font-medium whitespace-nowrap', active ? 'text-primary-600' : done ? 'text-success' : 'text-neutral-400')}>
        {label}
      </span>
    </div>
  );
}

function Connector({ done }) {
  return <div className={cn('h-0.5 flex-1 mb-4 transition-colors', done ? 'bg-success' : 'bg-neutral-200')} />;
}

function TransferHistoryRow({ txf }) {
  const fromLoc = getLocation(txf.fromLocationId);
  const toLoc   = getLocation(txf.toLocationId);
  const statusColors = {
    in_transit: 'bg-amber-50 text-amber-700',
    received:   'bg-success/10 text-success',
  };
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <span className="font-mono text-[9px] text-neutral-500">{txf.id}</span>
        <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-semibold', statusColors[txf.status] ?? 'bg-neutral-100 text-neutral-600')}>
          {txf.status === 'in_transit' ? 'In Transit' : 'Received'}
        </span>
      </div>
      <p className="text-[11px] font-semibold text-neutral-800">
        {txf.itemIds.length} item{txf.itemIds.length !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500 flex-wrap">
        <span>{fromLoc?.label ?? txf.fromLocationId}</span>
        <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
        <span>{toLoc?.label ?? txf.toLocationId}</span>
      </div>
      <p className="text-[10px] text-neutral-400 mt-1">{txf.transferredBy} · {txf.transferredAt?.slice(11, 16)}</p>
    </div>
  );
}

// Group locations by outlet for the destination picker
function groupLocations() {
  const groups = {};
  LOCATIONS.forEach(loc => {
    const key = loc.outletId ?? '__transit__';
    const label = loc.outletName ?? 'Other';
    if (!groups[key]) groups[key] = { label, locations: [] };
    groups[key].locations.push(loc);
  });
  return Object.values(groups);
}

const LOCATION_GROUPS = groupLocations();

export default function TransferPage() {
  const [step, setStep]             = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [scanError, setScanError]   = useState('');
  const [destId, setDestId]         = useState('');
  const [fromLocId, setFromLocId]   = useState('loc-osu-sorting');
  const [notes, setNotes]           = useState('');
  const [txfId, setTxfId]           = useState(null);
  const [history, setHistory]       = useState(getAllTransfers);

  const allItems = getAllItems();
  const destLoc  = getLocation(destId);
  const fromLoc  = getLocation(fromLocId);

  function handleScan(barcode) {
    const found = getItemByBarcode(barcode);
    if (!found) {
      setScanError(`No item found for ${barcode}`);
      return;
    }
    if (selectedItems.find(i => i.id === found.id)) {
      setScanError('Item already added');
      return;
    }
    setScanError('');
    setSelectedItems(prev => [...prev, found]);
  }

  function removeItem(id) {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  }

  function toggleItem(item) {
    setSelectedItems(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  }

  function handleConfirm() {
    if (!destId || selectedItems.length === 0) return;
    const txf = createTransfer({
      type: 'item',
      itemIds: selectedItems.map(i => i.id),
      batchId: null,
      fromLocationId: fromLocId,
      toLocationId: destId,
      transferredBy: 'Kojo Mensah',
      receivedBy: null,
      receivedAt: null,
      notes,
    });
    // Update item locations
    selectedItems.forEach(item => {
      updateItem(item.id, { location: `In Transit → ${destLoc?.fullLabel ?? destId}` });
      addItemEvent(item.id, 'TRANSFER', 'Kojo Mensah', `Transfer ${txf.id}: to ${destLoc?.fullLabel ?? destId}`);
    });
    setTxfId(txf.id);
    setHistory(getAllTransfers());
    setStep(4);
  }

  function handleReset() {
    setStep(1);
    setSelectedItems([]);
    setScanError('');
    setDestId('');
    setNotes('');
    setTxfId(null);
  }

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tracking" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Item Transfer</h1>
          <p className="text-caption text-neutral-500">US-0124 · Transfer items or batches between outlets and factory zones</p>
        </div>
      </div>

      {/* ── Step indicator ───────────────────────────────────── */}
      {step < 4 && (
        <div className="flex items-center gap-1">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <StepDot n={i + 1} current={step} label={label} />
              {i < STEPS.length - 1 && <Connector done={step > i + 1} />}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-5 items-start">
        <div className="flex-1 space-y-4">

          {/* Step 1: Select items */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Scan */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-small font-semibold text-neutral-800">Scan items to transfer</h2>
                <ScannerInput
                  onScan={handleScan}
                  label="Scanner / keyboard-wedge"
                  placeholder="Scan barcode to add item…"
                  mockCameraBarcode="LA-10000005-000003"
                />
                {scanError && <p className="text-caption text-error">{scanError}</p>}
              </div>

              {/* Or pick from list */}
              <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                  <p className="text-small font-semibold text-neutral-800">Or select from list</p>
                </div>
                <div className="divide-y divide-neutral-50 max-h-48 overflow-y-auto">
                  {allItems.map(item => {
                    const sel = selectedItems.find(i => i.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          sel ? 'bg-primary-50' : 'hover:bg-neutral-50',
                        )}
                      >
                        <div className={cn(
                          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors',
                          sel ? 'border-primary-500 bg-primary-500' : 'border-neutral-300',
                        )}>
                          {sel && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] text-neutral-600">{item.barcode}</p>
                          <p className="text-caption text-neutral-800">{item.typeName} × {item.qty} — {item.customerName}</p>
                        </div>
                        <span className={cn('flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                          {ITEM_STATUS_LABELS[item.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected items */}
              {selectedItems.length > 0 && (
                <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-4 space-y-2">
                  <p className="text-caption font-semibold text-primary-700">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</p>
                  <div className="space-y-1">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center gap-2 rounded-md border border-primary-200 bg-white px-2.5 py-1.5">
                        <span className="font-mono text-[10px] text-neutral-600 flex-1 truncate">{item.barcode}</span>
                        <span className="text-caption text-neutral-700 truncate">{item.typeName}</span>
                        <button onClick={() => removeItem(item.id)} className="flex-shrink-0 text-neutral-400 hover:text-error">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="primary" size="sm" className="w-full" onClick={() => setStep(2)}>
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose destination */}
          {step === 2 && (
            <div className="space-y-4">
              {/* From */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-small font-semibold text-neutral-800">Current location (from)</h2>
                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.filter(l => l.zone !== 'transit').slice(0, 8).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => setFromLocId(loc.id)}
                      className={cn(
                        'flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-caption transition-all',
                        fromLocId === loc.id
                          ? 'border-neutral-400 bg-neutral-100 ring-2 ring-neutral-200'
                          : 'border-neutral-200 hover:border-neutral-300',
                      )}
                    >
                      <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-neutral-400" />
                      <div>
                        <p className="text-[11px] font-semibold text-neutral-800">{loc.label}</p>
                        <p className="text-[9px] text-neutral-500">{loc.outletName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* To */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-small font-semibold text-neutral-800">Transfer destination (to)</h2>
                <div className="space-y-4">
                  {LOCATION_GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">{group.label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {group.locations.map(loc => (
                          <button
                            key={loc.id}
                            onClick={() => setDestId(loc.id)}
                            className={cn(
                              'flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-caption transition-all',
                              destId === loc.id
                                ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100'
                                : 'border-neutral-200 hover:border-neutral-300',
                            )}
                          >
                            <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-neutral-400" />
                            <div>
                              <p className="text-[11px] font-semibold text-neutral-800">{loc.label}</p>
                              {loc.outletName && <p className="text-[9px] text-neutral-500">{loc.outletName}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" size="sm" className="flex-1" disabled={!destId} onClick={() => setStep(3)}>
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-small font-semibold text-neutral-800">Confirm transfer</h2>

              {/* Transfer summary */}
              <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider">From</p>
                    <p className="text-small font-semibold text-neutral-800">{fromLoc?.label ?? '—'}</p>
                    <p className="text-[10px] text-neutral-500">{fromLoc?.outletName ?? ''}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider">To</p>
                    <p className="text-small font-semibold text-primary-700">{destLoc?.label ?? '—'}</p>
                    <p className="text-[10px] text-neutral-500">{destLoc?.outletName ?? 'Other'}</p>
                  </div>
                </div>
                <div className="border-t border-neutral-200 pt-2">
                  <p className="text-caption font-semibold text-neutral-700">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}</p>
                  <div className="mt-1 space-y-0.5">
                    {selectedItems.map(item => (
                      <p key={item.id} className="text-[10px] text-neutral-500">
                        <span className="font-mono">{item.barcode}</span> · {item.typeName} — {item.customerName}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-caption font-semibold text-neutral-700">Transfer notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any special instructions for the receiving location…"
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>Back</Button>
                <Button variant="accent" size="sm" className="flex-1" onClick={handleConfirm}>
                  <Truck className="h-4 w-4" /> Dispatch Transfer
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && txfId && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-6 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <div>
                <p className="text-h3 font-bold text-neutral-900">Transfer dispatched</p>
                <p className="text-small text-neutral-600 mt-1">
                  Reference: <span className="font-mono font-semibold">{txfId}</span>
                </p>
                <p className="text-caption text-neutral-500 mt-1">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} in transit to{' '}
                  {destLoc?.fullLabel ?? destId}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <ArrowRightLeft className="h-4 w-4" /> New Transfer
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: transfer history ─── */}
        <div className="w-64 flex-shrink-0">
          <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-400">
            Transfer History ({history.length})
          </p>
          {history.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-10 flex flex-col items-center text-center">
              <Truck className="h-6 w-6 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">No transfers yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(txf => <TransferHistoryRow key={txf.id} txf={txf} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
