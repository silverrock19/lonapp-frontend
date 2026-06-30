import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, Package, AlertTriangle, CheckCircle, Tag } from 'lucide-react';
import {
  getPOSSession, updatePOSSession, calcPOSPricing,
  ITEM_TYPES, genItemId, genBarcode, genReceiptId,
  addTodayOrder, getPOSOrderById,
} from '../../lib/mock/posData.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const TURNAROUND_LABELS = { standard: 'Standard · 3 days', express: 'Express · 1 day', same_day: 'Same-Day · Today' };

export default function ItemIntakePage() {
  const { id: orderId } = useParams();
  const navigate        = useNavigate();
  const session         = getPOSSession();

  // If no session or wrong order, show empty state
  const sessionValid = session.orderId === orderId && session.customer;

  const [type,         setType]        = useState(ITEM_TYPES[0].id);
  const [qty,          setQty]         = useState(1);
  const [color,        setColor]       = useState('');
  const [condition,    setCondition]   = useState('');
  const [specialCare,  setSpecialCare] = useState(false);
  const [stainRemoval, setStainRemoval]= useState(false);
  const [items,        setItems]       = useState(session.items || []);
  const [ackCount,     setAckCount]    = useState(false);
  const [ackApproval,  setAckApproval] = useState(false);
  const [finalizing,   setFinalizing]  = useState(false);
  const [done,         setDone]        = useState(false);

  const selectedType = ITEM_TYPES.find(t => t.id === type);
  const pricing = calcPOSPricing(items, session.turnaround || 'standard', session.deliveryType || 'pickup');
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  function addItem() {
    if (!selectedType || qty < 1) return;
    const itemId  = genItemId();
    const barcode = genBarcode(session.customer?.ref || '00000');
    const itemSubtotal = selectedType.price * qty + (specialCare ? 5 : 0) + (stainRemoval ? 15 : 0);
    setItems(prev => [...prev, {
      id: itemId, barcode, type, typeName: selectedType.label, qty,
      price: selectedType.price, color, condition,
      specialCare, stainRemoval,
      subtotal: itemSubtotal,
    }]);
    setQty(1); setColor(''); setCondition(''); setSpecialCare(false); setStainRemoval(false);
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function handleFinalize() {
    if (!ackCount || !ackApproval || items.length === 0) return;
    setFinalizing(true);

    const finalPricing = calcPOSPricing(items, session.turnaround || 'standard', session.deliveryType || 'pickup');
    const receiptId    = genReceiptId(orderId);

    // Persist into session
    updatePOSSession({
      items,
      ...finalPricing,
      balanceDue: finalPricing.total,
      receiptId,
      status: 'received',
    });

    // Save into today's order store
    addTodayOrder({
      id:      orderId,
      customer: session.customer,
      service:  session.service || 'Wash & Iron',
      turnaround: session.turnaround || 'standard',
      deliveryType: session.deliveryType || 'pickup',
      items,
      ...finalPricing,
      paymentMethod:  'unpaid',
      paymentStatus:  'unpaid',
      amountPaid:     0,
      balanceDue:     finalPricing.total,
      changeGiven:    0,
      specialInstructions: session.specialInstructions || '',
      status:         'RECEIVED',
      receiptId,
      createdAt:      new Date().toISOString(),
    });

    await new Promise(r => setTimeout(r, 600));
    setFinalizing(false);
    setDone(true);
  }

  if (!sessionValid) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Package className="h-12 w-12 text-neutral-300" />
        <p className="text-body font-semibold text-neutral-500">No active order for this ID</p>
        <Button variant="outline" onClick={() => navigate('/pos/order/new')}>Start a new order</Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-bg">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <div>
          <p className="text-h3 font-bold text-neutral-900">Intake Complete</p>
          <p className="text-body text-neutral-500 mt-1">{totalQty} items received · {fmtPrice(pricing.total)}</p>
          <p className="text-caption text-neutral-400 mt-1 font-mono">{orderId}</p>
        </div>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => navigate(`/pos/order/${orderId}/receipt`)}>
            Print Receipt
          </Button>
          <Button variant="primary" onClick={() => navigate(`/pos/order/${orderId}/payment`)}>
            Take Payment →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>

      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3.5 bg-white border-b border-neutral-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
          <Package className="h-4 w-4 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-body font-bold text-neutral-900">Item Intake</p>
          <p className="text-caption text-neutral-400">
            {session.customer?.name} · {orderId} · {TURNAROUND_LABELS[session.turnaround] || 'Standard'}
          </p>
        </div>
        {session.specialInstructions && (
          <div className="flex items-center gap-1.5 bg-warning-bg border border-warning/20 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-caption font-semibold text-warning-text">Special instructions</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Add item form */}
        <div className="w-80 shrink-0 bg-white border-r border-neutral-100 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Add item</p>

            {/* Item type */}
            <div>
              <label className="block text-caption font-medium text-neutral-600 mb-1.5">Item type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-body font-medium outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              >
                {ITEM_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label} — GH₵ {t.price}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-caption font-medium text-neutral-600 mb-1.5">Quantity *</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
                >
                  <Minus className="h-4 w-4 text-neutral-600" />
                </button>
                <span className="flex-1 text-center text-h3 font-bold text-neutral-900 tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(99, q + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-caption font-medium text-neutral-600 mb-1.5">Color (optional)</label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="White, Blue, Mixed…"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-small outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Special care flags */}
            <div className="space-y-2">
              <label className="block text-caption font-medium text-neutral-600">Care flags</label>
              {[
                { key: 'specialCare',  val: specialCare,  set: setSpecialCare,  label: 'Requires special care',  sub: '+GH₵ 5.00 flat' },
                { key: 'stainRemoval', val: stainRemoval, set: setStainRemoval, label: 'Stain removal needed',   sub: '+GH₵ 15.00 flat' },
              ].map(({ key, val, set, label, sub }) => (
                <button
                  key={key}
                  onClick={() => set(v => !v)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all',
                    val ? 'border-warning bg-warning-bg' : 'border-neutral-200 bg-white hover:border-neutral-300',
                  )}
                >
                  <div className={cn('h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors', val ? 'bg-warning border-warning' : 'border-neutral-300')}>
                    {val && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <p className="text-small font-medium text-neutral-800">{label}</p>
                    <p className={cn('text-caption font-semibold', val ? 'text-warning-text' : 'text-neutral-400')}>{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 p-4 border-t border-neutral-100">
            {/* Live price for this item */}
            <div className="flex justify-between text-small text-neutral-500 mb-3">
              <span>This item</span>
              <span className="font-semibold tabular-nums text-neutral-800">
                {fmtPrice(selectedType ? selectedType.price * qty + (specialCare ? 5 : 0) + (stainRemoval ? 15 : 0) : 0)}
              </span>
            </div>
            <Button variant="primary" className="w-full" onClick={addItem} disabled={qty < 1}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Item
            </Button>
          </div>
        </div>

        {/* RIGHT: Item list + finalization */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-neutral-400">
                <Tag className="h-10 w-10 opacity-30" />
                <p className="text-small">No items added yet</p>
                <p className="text-caption">Add the first item from the left panel</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3 bg-white',
                    item.specialCare || item.stainRemoval ? 'border-warning/40' : 'border-neutral-100',
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-caption font-bold text-neutral-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-semibold text-neutral-800">{item.typeName} × {item.qty}</p>
                    <p className="text-caption text-neutral-400 font-mono">{item.barcode}</p>
                    {item.color && <p className="text-caption text-neutral-400">Color: {item.color}</p>}
                    {(item.specialCare || item.stainRemoval) && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        <span className="text-caption text-warning-text font-medium">
                          {[item.specialCare && 'Special care', item.stainRemoval && 'Stain removal'].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-small font-bold text-neutral-800 tabular-nums">{fmtPrice(item.subtotal)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-neutral-300 hover:text-error transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing + finalization */}
          <div className="shrink-0 border-t border-neutral-100 bg-white p-4 space-y-3">
            {/* Pricing summary */}
            {items.length > 0 && (
              <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                <div className="flex justify-between text-small text-neutral-600">
                  <span>Subtotal ({totalQty} items)</span>
                  <span className="tabular-nums">{fmtPrice(pricing.subtotal)}</span>
                </div>
                {pricing.surcharge > 0 && (
                  <div className="flex justify-between text-small text-neutral-600">
                    <span>{session.turnaround === 'express' ? 'Express surcharge (40%)' : 'Same-Day surcharge'}</span>
                    <span className="tabular-nums">{fmtPrice(pricing.surcharge)}</span>
                  </div>
                )}
                {pricing.deliveryFee > 0 && (
                  <div className="flex justify-between text-small text-neutral-600">
                    <span>Home delivery</span>
                    <span className="tabular-nums">{fmtPrice(pricing.deliveryFee)}</span>
                  </div>
                )}
                {(pricing.taxBreakdown || []).map(line => (
                  <div key={line.label} className="flex justify-between text-small text-neutral-600">
                    <span>{line.label}</span>
                    <span className="tabular-nums">{fmtPrice(line.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-body font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="tabular-nums">{fmtPrice(pricing.total)}</span>
                </div>
              </div>
            )}

            {/* Customer approval checkboxes */}
            {items.length > 0 && (
              <div className="space-y-2">
                {[
                  { key: 'count',    val: ackCount,    set: setAckCount,    label: `Item count is correct — ${totalQty} item${totalQty !== 1 ? 's' : ''} total` },
                  { key: 'approval', val: ackApproval, set: setAckApproval, label: 'Customer has reviewed and approved the item list' },
                ].map(({ key, val, set, label }) => (
                  <button
                    key={key}
                    onClick={() => set(v => !v)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className={cn('h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors', val ? 'bg-primary-600 border-primary-600' : 'border-neutral-300 bg-white')}>
                      {val && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-small text-neutral-700">{label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={items.length === 0}
                onClick={() => navigate(`/pos/order/${orderId}/receipt`)}
              >
                Print Draft
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!ackCount || !ackApproval || items.length === 0}
                loading={finalizing}
                onClick={handleFinalize}
              >
                Finalize & Proceed to Payment →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
