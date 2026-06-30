import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Plus, X, CheckCircle2, Clock, ScanBarcode } from 'lucide-react';
import {
  getAllBatches, createBatch, startBatch, completeBatch, addItemToBatch, removeItemFromBatch,
  BATCH_TYPES, MACHINES, getMachinesForType,
} from '../../lib/mock/mockTracking.js';
import { getAllItems, updateItem, addItemEvent, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const STATUS_COLUMNS = [
  { id: 'pending',   label: 'Pending',     color: 'border-neutral-200 bg-neutral-50',       dot: 'bg-neutral-400' },
  { id: 'active',    label: 'In Progress', color: 'border-primary-200 bg-primary-50/30',    dot: 'bg-primary-500 animate-pulse' },
  { id: 'completed', label: 'Completed',   color: 'border-success/30 bg-success/5',         dot: 'bg-success' },
];

const TYPE_COLORS = {
  wash:     'bg-cyan-50 border-cyan-200 text-cyan-800',
  dry:      'bg-orange-50 border-orange-200 text-orange-800',
  dryclean: 'bg-purple-50 border-purple-200 text-purple-800',
  iron:     'bg-amber-50 border-amber-200 text-amber-800',
  qc:       'bg-success/10 border-success/30 text-success',
};

function BatchCard({ batch, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const items = getAllItems().filter(i => batch.itemIds.includes(i.id));
  const batchType = BATCH_TYPES.find(t => t.id === batch.type);
  const machine = MACHINES.find(m => m.id === batch.machineId);

  return (
    <div className={cn(
      'rounded-xl border bg-white shadow-sm overflow-hidden',
      batch.status === 'active'    ? 'border-primary-300 shadow-primary-100/50 shadow-md'
        : batch.status === 'completed' ? 'border-success/30 opacity-80'
        : 'border-neutral-200',
    )}>
      {/* Card header */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className={cn(
              'h-1.5 w-1.5 rounded-full flex-shrink-0',
              batch.status === 'active' ? 'bg-primary-500 animate-pulse'
                : batch.status === 'completed' ? 'bg-success'
                : 'bg-neutral-400',
            )} />
            <span className="font-mono text-[9px] text-neutral-400">{batch.id}</span>
          </div>
          <p className="text-small font-semibold text-neutral-900">{batch.name}</p>
        </div>
        <span className={cn('flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', TYPE_COLORS[batch.type] ?? TYPE_COLORS.wash)}>
          {batchType?.label ?? batch.type}
        </span>
      </div>

      {/* Card meta */}
      <div className="px-3 pb-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {[
          ['Machine', machine?.label ?? batch.machineId ?? '—'],
          ['Items', `${batch.itemIds.length}`],
          ...(batch.startedAt ? [['Started', batch.startedAt.slice(11, 16)]] : []),
          ...(batch.completedAt ? [['Done', batch.completedAt.slice(11, 16)]] : []),
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">{k}</p>
            <p className="text-[11px] font-semibold text-neutral-700">{v}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      {batch.notes && (
        <div className="mx-3 mb-2 rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1">
          <p className="text-[10px] text-neutral-500 italic">{batch.notes}</p>
        </div>
      )}

      {/* Items list (expandable) */}
      {batch.itemIds.length > 0 && (
        <div className="border-t border-neutral-100 px-3 py-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-[10px] text-neutral-500 hover:text-neutral-700 font-medium"
          >
            {expanded ? '▲ Hide' : '▼ Show'} items ({batch.itemIds.length})
          </button>
          {expanded && (
            <div className="mt-1.5 space-y-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-[10px]">
                  <span className="font-mono text-neutral-600 flex-1 truncate">{item.barcode}</span>
                  <span className="text-neutral-500 truncate">{item.typeName}</span>
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                    {ITEM_STATUS_LABELS[item.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-neutral-100 px-3 py-2">
        {batch.status === 'pending' && (
          <Button variant="primary" size="sm" className="w-full" onClick={() => onAction('start', batch.id)}>
            Start Batch
          </Button>
        )}
        {batch.status === 'active' && (
          <Button variant="accent" size="sm" className="w-full" onClick={() => onAction('complete', batch.id)}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Complete Batch
          </Button>
        )}
        {batch.status === 'completed' && (
          <p className="text-center text-[10px] text-success font-semibold">Completed {batch.completedAt?.slice(11, 16)}</p>
        )}
      </div>
    </div>
  );
}

function NewBatchPanel({ onClose, onCreated }) {
  const [name, setName]         = useState('');
  const [type, setType]         = useState('wash');
  const [machineId, setMachineId] = useState('');
  const [notes, setNotes]       = useState('');
  const machines = getMachinesForType(type);

  function handleCreate() {
    if (!name.trim()) return;
    createBatch({ name, type, machineId: machineId || machines[0]?.id, notes, outletId: 'outlet-001', locationId: 'loc-osu-washing', itemIds: [], createdBy: 'Ama Otu' });
    onCreated?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <p className="text-small font-semibold text-neutral-900">New batch</p>
          <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <label className="text-caption font-semibold text-neutral-700">Batch name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Wash Load B, Iron Run C…"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-caption font-semibold text-neutral-700">Batch type</label>
            <div className="flex flex-wrap gap-1.5">
              {BATCH_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setType(t.id); setMachineId(''); }}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all',
                    type === t.id
                      ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-caption font-semibold text-neutral-700">Machine / station</label>
            <select
              value={machineId}
              onChange={e => setMachineId(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-small outline-none focus:border-primary-300"
            >
              {machines.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-caption font-semibold text-neutral-700">Notes</label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Cycle, temperature, instructions…"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" className="flex-1" disabled={!name.trim()} onClick={handleCreate}>
              Create Batch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BatchBoardPage() {
  const [batches, setBatches]     = useState(getAllBatches);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNew, setShowNew]     = useState(false);

  function refresh() { setBatches(getAllBatches()); }

  function handleAction(action, batchId) {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;
    const batchType = BATCH_TYPES.find(t => t.id === batch.type);

    if (action === 'start') {
      startBatch(batchId);
      // Advance items to statusIn
      if (batchType) {
        batch.itemIds.forEach(itemId => {
          updateItem(itemId, { status: batchType.statusIn });
          addItemEvent(itemId, batchType.statusIn, 'Ama Otu', `Batch ${batchId} started`);
        });
      }
    } else if (action === 'complete') {
      completeBatch(batchId);
      // Advance items to statusOut
      if (batchType) {
        batch.itemIds.forEach(itemId => {
          updateItem(itemId, { status: batchType.statusOut });
          addItemEvent(itemId, batchType.statusOut, 'Ama Otu', `Batch ${batchId} completed`);
        });
      }
    }
    refresh();
  }

  const filtered = batches.filter(b => typeFilter === 'all' || b.type === typeFilter);

  const byStatus = {
    pending:   filtered.filter(b => b.status === 'pending'),
    active:    filtered.filter(b => b.status === 'active'),
    completed: filtered.filter(b => b.status === 'completed'),
  };

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tracking" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-h2 font-bold text-neutral-900">Batch Board</h1>
          <p className="text-caption text-neutral-500">US-0112 · Group items into processing loads and track each batch through the factory</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="h-3.5 w-3.5" /> New Batch
        </Button>
      </div>

      {/* ── Type filter ───────────────────────────────────────── */}
      <div className="flex gap-1.5 flex-wrap">
        {[{ id: 'all', label: 'All types' }, ...BATCH_TYPES].map(t => (
          <button
            key={t.id}
            onClick={() => setTypeFilter(t.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-caption font-medium transition-all',
              typeFilter === t.id
                ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Board columns ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {STATUS_COLUMNS.map(col => (
          <div key={col.id}>
            <div className={cn('rounded-t-xl border border-b-0 px-3 py-2.5 flex items-center gap-2', col.color)}>
              <span className={cn('h-2 w-2 rounded-full flex-shrink-0', col.dot)} />
              <p className="text-small font-semibold text-neutral-800">{col.label}</p>
              <span className="ml-auto rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                {byStatus[col.id].length}
              </span>
            </div>
            <div className={cn('rounded-b-xl border border-t-0 p-2 space-y-2 min-h-40', col.color)}>
              {byStatus[col.id].length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Layers className="h-5 w-5 text-neutral-300 mb-1" />
                  <p className="text-[10px] text-neutral-400">No {col.label.toLowerCase()} batches</p>
                </div>
              ) : (
                byStatus[col.id].map(batch => (
                  <BatchCard key={batch.id} batch={batch} onAction={handleAction} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showNew && (
        <NewBatchPanel
          onClose={() => setShowNew(false)}
          onCreated={refresh}
        />
      )}
    </div>
  );
}
