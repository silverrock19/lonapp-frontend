import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Printer, Plus, CheckCircle2, Search, Barcode, Trash2 } from 'lucide-react';
import { getAllItems, getUntaggedItems, updateItem, addItemEvent, ITEM_STATUS_COLOR, ITEM_STATUS_LABELS } from '../../lib/mock/mockItems.js';
import { addToPrintQueue, getPrintQueue, markPrintQueueItemPrinted, removePrintQueueItem } from '../../lib/mock/mockTagging.js';
import BarcodeDisplay from '../../components/ui/BarcodeDisplay.jsx';
import TagPrintPreview from '../../components/ui/TagPrintPreview.jsx';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const DELIVERY_DATES = {
  'ORD-ACC-0629-0001': '30/06/2026',
  'ORD-ACC-0629-0002': '02/07/2026',
  'ORD-ACC-0629-0003': '02/07/2026',
};

export default function BarcodeGenerationPage() {
  const [filter, setFilter]     = useState('untagged');
  const [query, setQuery]       = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [format, setFormat]     = useState('barcode');
  const [copies, setCopies]     = useState(1);
  const [queue, setQueue]       = useState(getPrintQueue);
  const [printedIds, setPrintedIds] = useState(new Set());

  const allItems = filter === 'untagged' ? getUntaggedItems() : getAllItems();
  const items = allItems.filter(it =>
    !query ||
    it.barcode.toLowerCase().includes(query.toLowerCase()) ||
    it.customerName.toLowerCase().includes(query.toLowerCase()) ||
    it.orderId.toLowerCase().includes(query.toLowerCase())
  );

  const selected = items.find(it => it.id === selectedId) ?? getAllItems().find(it => it.id === selectedId) ?? null;
  const pending = queue.filter(e => e.status === 'pending');

  function handleAddToQueue() {
    if (!selected) return;
    addToPrintQueue({
      barcode: selected.barcode,
      itemId: selected.id,
      orderId: selected.orderId,
      customerName: selected.customerName,
      typeName: selected.typeName,
      qty: selected.qty,
      service: selected.service,
      copies,
      format,
    });
    setQueue(getPrintQueue());
  }

  function handlePrintNow() {
    if (!selected) return;
    // Mark item as TAGGED and add barcode tag record
    updateItem(selected.id, {
      status: 'TAGGED',
      tags: {
        ...selected.tags,
        barcode: { value: selected.barcode, printedAt: new Date().toISOString(), printedBy: 'Ama Otu' },
      },
    });
    addItemEvent(selected.id, 'TAGGED', 'Ama Otu', `Barcode ${selected.barcode} printed`);
    setPrintedIds(prev => new Set([...prev, selected.id]));
    setSelectedId(null);
  }

  function handleMarkPrinted(queueId) {
    markPrintQueueItemPrinted(queueId, 'Ama Otu');
    setQueue(getPrintQueue());
  }

  function handleRemoveFromQueue(queueId) {
    removePrintQueueItem(queueId);
    setQueue(getPrintQueue());
  }

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tagging" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-h2 font-bold text-neutral-900">Barcode Generation</h1>
          <p className="text-caption text-neutral-500">US-0103 · Generate barcodes and QR codes for order items</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1">
            <Printer className="h-3.5 w-3.5 text-primary-500" />
            <span className="text-caption font-semibold text-primary-700">{pending.length} in queue</span>
          </div>
        )}
      </div>

      {/* ── Main split ──────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* ── Left: Item list ─── */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Filter + search */}
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
              {[['untagged', 'Needs Tag'], ['all', 'All Items']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setFilter(val); setSelectedId(null); }}
                  className={cn(
                    'rounded px-3 py-1 text-caption font-medium transition-all',
                    filter === val ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by barcode, order ID, or customer…"
                className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Items table */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mb-2" />
                <p className="text-small font-medium text-neutral-700">All items are tagged</p>
                <p className="text-caption text-neutral-400 mt-0.5">Switch to "All Items" to view tagged items</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    {['Barcode', 'Type', 'Order / Customer', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-caption font-semibold text-neutral-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const isSelected = selectedId === item.id;
                    const wasPrinted = printedIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(isSelected ? null : item.id)}
                        className={cn(
                          'cursor-pointer border-b border-neutral-50 transition-colors',
                          isSelected ? 'bg-primary-50' : 'hover:bg-neutral-50',
                          i === items.length - 1 && 'border-b-0',
                        )}
                      >
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-[11px] text-neutral-700">{item.barcode}</span>
                        </td>
                        <td className="px-4 py-2.5 text-small text-neutral-800">{item.typeName} × {item.qty}</td>
                        <td className="px-4 py-2.5">
                          <p className="text-caption font-mono text-neutral-500">{item.orderId}</p>
                          <p className="text-small text-neutral-800 truncate max-w-[140px]">{item.customerName}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            wasPrinted ? 'bg-success/10 text-success' : ITEM_STATUS_COLOR[item.status],
                          )}>
                            {wasPrinted ? 'Printed ✓' : ITEM_STATUS_LABELS[item.status]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {isSelected && (
                            <span className="text-[10px] font-semibold text-primary-600">Selected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Right: Preview panel ─── */}
        <div className="w-72 flex-shrink-0">
          {selected ? (
            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              {/* Panel header */}
              <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                <p className="text-small font-semibold text-neutral-800">Label Preview</p>
                <p className="text-caption text-neutral-500 truncate">{selected.barcode}</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Format toggle */}
                <div className="flex gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
                  {[['barcode', 'Code128'], ['qr', 'QR Code']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFormat(val)}
                      className={cn(
                        'flex-1 rounded py-1 text-caption font-medium transition-all',
                        format === val ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tag print preview */}
                <div className="flex justify-center">
                  <TagPrintPreview
                    barcode={selected.barcode}
                    format={format}
                    customerName={selected.customerName}
                    customerId={`#${selected.customerRef}`}
                    typeName={selected.typeName}
                    qty={selected.qty}
                    service={selected.service}
                    outletName={selected.outletName}
                    deliveryDate={DELIVERY_DATES[selected.orderId]}
                    specialCare={selected.specialCare}
                    stainRemoval={selected.stainRemoval}
                  />
                </div>

                {/* Copies */}
                <div className="flex items-center justify-between">
                  <label className="text-caption font-medium text-neutral-600">Copies</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCopies(c => Math.max(1, c - 1))}
                      className="h-7 w-7 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-small font-bold"
                    >−</button>
                    <span className="w-6 text-center text-small font-semibold text-neutral-800">{copies}</span>
                    <button
                      onClick={() => setCopies(c => Math.min(10, c + 1))}
                      className="h-7 w-7 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-small font-bold"
                    >+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="primary" size="sm" className="w-full" onClick={handlePrintNow}>
                    <Printer className="h-3.5 w-3.5" /> Print Now
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleAddToQueue}>
                    <Plus className="h-3.5 w-3.5" /> Add to Queue
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-16 px-6 text-center">
              <QrCode className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-small font-medium text-neutral-500">Select an item to preview its label</p>
            </div>
          )}

          {/* Print queue */}
          {queue.length > 0 && (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2.5 flex items-center justify-between">
                <p className="text-caption font-semibold text-neutral-700">Print Queue</p>
                <span className="text-[10px] text-neutral-400">{pending.length} pending</span>
              </div>
              <div className="divide-y divide-neutral-50 max-h-48 overflow-y-auto">
                {queue.map(entry => (
                  <div key={entry.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] text-neutral-700 truncate">{entry.barcode}</p>
                      <p className="text-[10px] text-neutral-400">{entry.typeName} · {entry.copies} cop{entry.copies !== 1 ? 'ies' : 'y'}</p>
                    </div>
                    {entry.status === 'pending' ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMarkPrinted(entry.id)}
                          className="flex h-6 w-6 items-center justify-center rounded text-success hover:bg-success/10 transition-colors"
                          title="Mark printed"
                        >
                          <Printer className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromQueue(entry.id)}
                          className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
