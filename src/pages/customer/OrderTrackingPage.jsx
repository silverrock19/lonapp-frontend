import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, ChevronRight, Package, Edit3, RotateCcw, Truck, X, Receipt, FileText, RefreshCw, AlertTriangle, Camera, History } from 'lucide-react';
import {
  getOrder, STATUS_LABELS,
  canEditItems, canReschedulePickup, canRescheduleDelivery,
  canChangeAddress, canCancelPrePickup, canCancelPostPickup,
} from '../../lib/mock/mockOrders.js';
import { getAllItems, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { getCheckpointsForItem } from '../../lib/mock/mockTracking.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS, getTaxLabel } from '../../utils/formatCurrency.js';
import OrderTrackingTimeline from '../../components/ui/OrderTrackingTimeline.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const fmtDate = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GH', { weekday: 'short', month: 'short', day: 'numeric' });
};

const STATUS_BADGE = {
  PLACED:                   { bg: 'bg-accent-50',  text: 'text-accent-700' },
  PICKUP_SCHEDULED:         { bg: 'bg-accent-50',  text: 'text-accent-700' },
  DRIVER_EN_ROUTE_PICKUP:   { bg: 'bg-warning-bg', text: 'text-warning-text' },
  ITEMS_PICKED_UP:          { bg: 'bg-accent-50',  text: 'text-accent-600' },
  RECEIVED_AT_OUTLET:       { bg: 'bg-accent-50',  text: 'text-accent-600' },
  INSPECTION_COMPLETE:      { bg: 'bg-accent-50',  text: 'text-accent-600' },
  AWAITING_PAYMENT:         { bg: 'bg-warning-bg', text: 'text-warning-text' },
  IN_PROCESSING:            { bg: 'bg-purple-50',  text: 'text-purple-600' },
  QUALITY_CHECK:            { bg: 'bg-purple-50',  text: 'text-purple-600' },
  READY_FOR_DELIVERY:       { bg: 'bg-success-bg', text: 'text-success-text' },
  DRIVER_EN_ROUTE_DELIVERY: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  DELIVERED:                { bg: 'bg-success-bg', text: 'text-success-text' },
  COMPLETED:                { bg: 'bg-success-bg', text: 'text-success-text' },
  CANCELLED:                { bg: 'bg-neutral-100', text: 'text-neutral-500' },
};

function ActionRow({ icon: Icon, label, sub, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-neutral-50 transition-colors active:opacity-70 ${danger ? 'text-error' : ''}`}
    >
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${danger ? 'bg-error/10' : 'bg-neutral-100'}`}>
        <Icon className={`h-4 w-4 ${danger ? 'text-error' : 'text-neutral-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-small font-semibold ${danger ? 'text-error' : 'text-neutral-800'}`}>{label}</p>
        {sub && <p className="text-caption text-neutral-400 mt-0.5">{sub}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-neutral-300 flex-shrink-0" />
    </button>
  );
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="Order not found" description="This order doesn't exist or has been removed." action={
          <button onClick={() => navigate('/app')} className="text-accent-600 text-small font-medium">Back to Home</button>
        } />
      </div>
    );
  }

  const { status } = order;
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.PLACED;
  const isTerminal = ['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(status);
  const showModify = !isTerminal;

  const go = path => navigate(`/app/orders/${id}/${path}`);

  const ep04Items = getAllItems().filter(i => i.orderId === id);
  const hasEp04Items = ep04Items.length > 0;

  return (
    <div className="flex flex-col min-h-screen pb-8" style={{ background: '#FAFAF8' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-small font-semibold text-neutral-900 truncate font-mono">{order.id}</p>
          <p className="text-caption text-neutral-400">{order.outlet.name}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${badge.bg} ${badge.text}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* Timeline */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Order Status</p>
          <OrderTrackingTimeline status={status} />
        </div>

        {/* Item Processing — EP-04 live status */}
        {hasEp04Items && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-2">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Item Processing</p>
            {ep04Items.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-small font-medium text-neutral-800 truncate">{item.typeName} × {item.qty}</p>
                  <p className="font-mono text-[10px] text-neutral-400">{item.barcode}</p>
                </div>
                <span className={cn('flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                  {ITEM_STATUS_LABELS[item.status]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Summary card */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Order Summary</p>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-small">
                <span className="text-neutral-700">{item.name} × {item.qty}</span>
                <span className="font-semibold text-neutral-800 tabular-nums">{formatGHS(item.unitPrice * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-100 space-y-1">
            {order.surcharge > 0 && (
              <div className="flex justify-between text-caption text-neutral-500">
                <span>{order.turnaround === 'express' ? 'Express' : 'Same-day'} surcharge</span>
                <span className="tabular-nums">+{formatGHS(order.surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-caption text-neutral-500">
              <span>Pickup + Delivery</span>
              <span className="tabular-nums">{formatGHS(order.pickupFee + order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-caption text-neutral-500">
              <span>{getTaxLabel()}</span>
              <span className="tabular-nums">{formatGHS(order.vat)}</span>
            </div>
            <div className="flex justify-between text-body font-bold pt-1 border-t border-neutral-100">
              <span className="text-neutral-900">Total</span>
              <span className="text-accent-600 tabular-nums">{formatGHS(order.total)}</span>
            </div>
          </div>
          {order.notes ? (
            <p className="text-caption text-neutral-400 italic border-t border-neutral-100 pt-2">"{order.notes}"</p>
          ) : null}
        </div>

        {/* Schedule card */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Schedule</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-caption text-neutral-400 mb-1">Pickup</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <p className="text-small font-semibold text-neutral-800">{fmtDate(order.pickupDate)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <p className="text-caption text-neutral-500">{order.pickupSlot?.label ?? '—'}</p>
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-caption text-neutral-400 mb-1">Delivery</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <p className="text-small font-semibold text-neutral-800">{fmtDate(order.deliveryDate)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <p className="text-caption text-neutral-500">{order.deliverySlot?.label ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-small font-medium text-neutral-700">{order.deliveryAddress?.label}</p>
              <p className="text-caption text-neutral-400">{order.deliveryAddress?.detail}</p>
            </div>
          </div>
        </div>

        {/* Modify actions */}
        {showModify && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Modify Order</p>
            <div className="divide-y divide-neutral-100">
              {canEditItems(status) && (
                <ActionRow icon={Edit3} label="Edit items" sub="Add, remove or change quantities" onClick={() => go('edit')} />
              )}
              {canReschedulePickup(status) && (
                <ActionRow icon={RotateCcw} label="Reschedule pickup" sub={order.rescheduleCount >= 3 ? 'Max reschedules reached' : 'Change date or time window'} onClick={() => order.rescheduleCount < 3 && go('reschedule-pickup')} />
              )}
              {canRescheduleDelivery(status) && (
                <ActionRow icon={Truck} label="Reschedule delivery" sub="Change delivery date or time" onClick={() => go('reschedule-delivery')} />
              )}
              {canChangeAddress(status) && (
                <ActionRow icon={MapPin} label="Change delivery address" sub="Update where items are delivered" onClick={() => go('change-address')} />
              )}
              {(canCancelPrePickup(status) || canCancelPostPickup(status)) && (
                <ActionRow
                  icon={X}
                  label={canCancelPostPickup(status) ? 'Request cancellation' : 'Cancel order'}
                  sub={canCancelPostPickup(status) ? 'Partial refund — CS review required' : '100% refund before pickup'}
                  onClick={() => go('cancel')}
                  danger
                />
              )}
            </div>
          </div>
        )}

        {/* Documents — only for terminal orders */}
        {isTerminal && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Documents</p>
            <div className="divide-y divide-neutral-100">
              {status !== 'CANCELLED' && (
                <>
                  <ActionRow
                    icon={Receipt}
                    label="Download Receipt"
                    sub="Proof of payment · printable PDF"
                    onClick={() => navigate(`/app/orders/${id}/receipt`)}
                  />
                  <ActionRow
                    icon={FileText}
                    label="Download Invoice"
                    sub="Tax invoice · Ghana TIN compliant"
                    onClick={() => navigate(`/app/orders/${id}/invoice`)}
                  />
                </>
              )}
              <ActionRow
                icon={RefreshCw}
                label="Reorder"
                sub="Place the same items again"
                onClick={() => navigate('/app/discover')}
              />
              {status !== 'CANCELLED' && (
                <ActionRow
                  icon={AlertTriangle}
                  label="Report an Issue"
                  sub="Missing items, quality problem, or damage"
                  onClick={() => navigate(`/app/orders/${id}/report`)}
                />
              )}
            </div>
          </div>
        )}

        {/* Your Items — EP-04 entry points */}
        {hasEp04Items && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Your Items</p>
            <div className="divide-y divide-neutral-100">
              <ActionRow
                icon={History}
                label="Processing History"
                sub="See every checkpoint scan for your items"
                onClick={() => navigate(`/app/orders/${id}/item-history`)}
              />
              <ActionRow
                icon={Camera}
                label="Item Photos"
                sub="View intake and condition photos"
                onClick={() => navigate(`/app/orders/${id}/photos`)}
              />
            </div>
          </div>
        )}

        {/* Outlet info */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Laundry</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-small font-bold text-white" style={{ backgroundColor: order.outlet.color }}>
              {order.outlet.avatar}
            </div>
            <div>
              <p className="text-small font-semibold text-neutral-800">{order.outlet.name}</p>
              <p className="text-caption text-neutral-400">{order.outlet.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
