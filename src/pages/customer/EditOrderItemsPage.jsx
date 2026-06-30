import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, AlertCircle, Check } from 'lucide-react';
import { getOrder, canEditItems, STATUS_LABELS, REMOVAL_REASONS } from '../../lib/mock/mockOrders.js';
import { SERVICE_CATEGORIES } from '../../lib/mock/orderServices.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { cn } from '../../utils/classNames.js';
import { generateQuote } from '../../lib/pricing/engine.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

// Flat list of all service items for quick lookup
const ALL_SERVICE_ITEMS = SERVICE_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, categoryId: c.id, categoryLabel: c.label })));

export default function EditOrderItemsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  const [items, setItems] = useState(order ? [...order.items] : []);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'add'
  const [activeCat, setActiveCat] = useState(SERVICE_CATEGORIES[0]?.id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removalReasonMap, setRemovalReasonMap] = useState({});
  const [showReasonFor, setShowReasonFor] = useState(null);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={AlertCircle} title="Order not found" />
      </div>
    );
  }

  if (!canEditItems(order.status)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertCircle}
          title="Editing not available"
          description={`Orders with status "${STATUS_LABELS[order.status]}" cannot be edited. Items can only be changed before the driver is en route.`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  let derivedQuote = null;
  try {
    derivedQuote = generateQuote({
      cartItems: items.map(i => ({
        serviceId: i.id ?? i.serviceId ?? i.name?.toLowerCase().replace(/\s/g, '-'),
        name: i.name,
        qty: i.qty,
        unitPrice: i.unitPrice,
        category: i.category ?? 'washing',
      })),
      turnaroundId: order?.turnaround ?? 'standard',
      deliveryMethod: order?.deliveryMethod ?? 'pickup',
      customerTier: 'retail',
    });
  } catch {
    derivedQuote = null;
  }

  const subtotal = derivedQuote?.subtotal ?? 0;
  const surcharge = derivedQuote?.surchargeAmount ?? 0;
  const vat = derivedQuote?.totalTax ?? 0;
  const total = derivedQuote?.grandTotal ?? 0;
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const changed = JSON.stringify(items) !== JSON.stringify(order.items);

  const setQty = (itemId, delta) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      const newQty = (existing?.qty ?? 0) + delta;
      if (newQty <= 0) {
        // Ask for removal reason if removing completely
        if (existing && existing.qty === 1) {
          setShowReasonFor(itemId);
          return prev;
        }
        return prev.filter(i => i.id !== itemId);
      }
      if (existing) return prev.map(i => i.id === itemId ? { ...i, qty: newQty } : i);
      const svcItem = ALL_SERVICE_ITEMS.find(s => s.id === itemId);
      if (!svcItem) return prev;
      return [...prev, { id: itemId, name: svcItem.name, qty: 1, unitPrice: svcItem.unitPrice, category: svcItem.categoryId }];
    });
  };

  const confirmRemoval = (itemId, reason) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    setRemovalReasonMap(m => ({ ...m, [itemId]: reason }));
    setShowReasonFor(null);
  };

  const getQty = itemId => items.find(i => i.id === itemId)?.qty ?? 0;

  async function handleSave() {
    if (items.length === 0) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate(-1), 1200);
  }

  const availCats = SERVICE_CATEGORIES.filter(c => order.outlet?.services ? order.outlet.services.includes(c.id) : true);
  const selectedCat = availCats.find(c => c.id === activeCat) ?? availCats[0];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-small font-semibold text-neutral-900">Edit Items</p>
            <p className="text-caption text-neutral-400 font-mono">{order.id}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-neutral-100">
          {[{ id: 'items', label: 'Current items' }, { id: 'add', label: 'Add more' }].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex-1 py-2.5 text-small font-semibold transition-colors',
                activeTab === t.id
                  ? 'text-accent-600 border-b-2 border-accent-500'
                  : 'text-neutral-400 hover:text-neutral-600',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 py-4 space-y-3">

        {activeTab === 'items' && (
          <>
            {items.length === 0 ? (
              <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-6 text-center">
                <AlertCircle className="h-8 w-8 text-error mx-auto mb-2" />
                <p className="text-small font-semibold text-error">All items removed</p>
                <p className="text-caption text-neutral-500 mt-1">At least 1 item must remain. To cancel the order entirely, use the Cancel option.</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-small font-medium text-neutral-800">{item.name}</p>
                        <p className="text-caption text-neutral-400">GH₵ {item.unitPrice} each · {fmtPrice(item.unitPrice * item.qty)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setQty(item.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 active:scale-90 transition-transform"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-small font-bold text-neutral-900 tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white active:scale-90 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            {changed && (
              <div className="rounded-2xl bg-white border border-accent-200 shadow-sm p-4 animate-fade-in">
                <p className="text-caption font-semibold text-accent-600 mb-2">Updated pricing</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-small">
                    <span className="text-neutral-500">Subtotal ({totalItems} items)</span>
                    <span className="tabular-nums">{fmtPrice(subtotal)}</span>
                  </div>
                  {surcharge > 0 && (
                    <div className="flex justify-between text-small">
                      <span className="text-neutral-500">Surcharge</span>
                      <span className="tabular-nums">+{fmtPrice(surcharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-small">
                    <span className="text-neutral-500">Fees + VAT</span>
                    <span className="tabular-nums">{fmtPrice(order.pickupFee + order.deliveryFee + vat)}</span>
                  </div>
                  <div className="flex justify-between text-body font-bold border-t border-neutral-100 pt-1 mt-1">
                    <span className="text-neutral-900">New total</span>
                    <span className="text-accent-600 tabular-nums">{fmtPrice(total)}</span>
                  </div>
                  <p className="text-caption text-neutral-400 pt-1">
                    Was {fmtPrice(order.total)} · difference: <span className={total > order.total ? 'text-warning-text' : 'text-success-text'}>
                      {total > order.total ? '+' : ''}{fmtPrice(total - order.total)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'add' && (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {availCats.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={cn(
                    'flex-shrink-0 rounded-full px-3.5 py-1.5 text-small font-medium transition-all duration-150',
                    activeCat === c.id ? 'bg-accent-500 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                  )}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {selectedCat && (
              <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {selectedCat.items.map(svcItem => {
                    const qty = getQty(svcItem.id);
                    return (
                      <div key={svcItem.id} className={cn('flex items-center gap-3 px-4 py-3', qty > 0 && 'bg-accent-50/50')}>
                        <div className="flex-1 min-w-0">
                          <p className="text-small font-medium text-neutral-800">{svcItem.name}</p>
                          <p className="text-caption text-neutral-400">GH₵ {svcItem.unitPrice} {svcItem.unit}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {qty > 0 && (
                            <>
                              <button onClick={() => setQty(svcItem.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 active:scale-90 transition-transform">
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-small font-bold text-accent-600 tabular-nums">{qty}</span>
                            </>
                          )}
                          <button
                            onClick={() => setQty(svcItem.id, 1)}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90',
                              qty > 0 ? 'bg-accent-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                            )}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Removal reason modal */}
      {showReasonFor && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-2xl p-4 pb-8 animate-slide-up">
            <p className="text-body font-bold text-neutral-900 mb-1">Remove item?</p>
            <p className="text-small text-neutral-500 mb-3">Please select a reason for removing this item.</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {REMOVAL_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => confirmRemoval(showReasonFor, r)}
                  className="w-full text-left text-small text-neutral-700 px-3 py-2.5 rounded-xl border border-neutral-200 hover:border-accent-300 hover:bg-accent-50 transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3" onClick={() => setShowReasonFor(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Fixed bottom bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        {saved ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Check className="h-4 w-4 text-success" />
            <p className="text-small font-semibold text-success-text">Changes saved!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-small text-neutral-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              <p className="text-body font-bold text-accent-600 tabular-nums">{fmtPrice(total)}</p>
            </div>
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              disabled={!changed || items.length === 0}
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
