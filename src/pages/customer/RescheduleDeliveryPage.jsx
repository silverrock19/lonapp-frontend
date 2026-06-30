import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle, Check } from 'lucide-react';
import { getOrder, canRescheduleDelivery, STATUS_LABELS } from '../../lib/mock/mockOrders.js';
import SlotCalendarPicker from '../../components/ui/SlotCalendarPicker.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const MAX_RESCHEDULES = 3;

const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { weekday: 'short', month: 'short', day: 'numeric' });

function getDeliveryFee(deliveryDateStr) {
  if (!deliveryDateStr) return 0;
  const delivMs = new Date(deliveryDateStr).getTime();
  const nowMs = Date.now();
  const hoursUntil = (delivMs - nowMs) / 3_600_000;
  if (hoursUntil > 12) return 0;
  if (hoursUntil > 2)  return 8;
  return 6;
}

export default function RescheduleDeliveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  const [newDate, setNewDate] = useState(null);
  const [newSlot, setNewSlot] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  if (!order) {
    return <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
      <EmptyState title="Order not found" />
    </div>;
  }

  if (!canRescheduleDelivery(order.status)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Cannot reschedule delivery"
          description={`Delivery rescheduling is only available when your order is processing or ready. Current status: "${STATUS_LABELS[order.status]}".`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  const fee = getDeliveryFee(order.deliveryDate);
  const canSave = newDate && newSlot;
  const reschedulesLeft = MAX_RESCHEDULES - (order.rescheduleCount ?? 0);

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate(-1), 1200);
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FAFAF8' }}>

      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-semibold text-neutral-900">Reschedule Delivery</p>
          <p className="text-caption text-neutral-400 font-mono">{order.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 py-4 space-y-4">

        {/* Current delivery */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Current delivery</p>
          <p className="text-small font-semibold text-neutral-800">{fmtDate(order.deliveryDate)}</p>
          <p className="text-caption text-neutral-500">{order.deliverySlot?.label}</p>
          <p className="text-caption text-neutral-400 mt-1">{order.deliveryAddress?.detail}</p>
        </div>

        {/* Note: delivery must be after items ready */}
        <div className="flex items-start gap-2.5 rounded-xl bg-info-bg border border-primary-100 p-3">
          <Info className="h-4 w-4 flex-shrink-0 text-primary-500 mt-0.5" />
          <p className="text-caption text-primary-700">
            New delivery date must be on or after your items are ready. Earliest available dates are shown.
          </p>
        </div>

        {/* Fee info */}
        {fee > 0 && (
          <div className="flex items-start gap-2.5 rounded-xl bg-warning-bg border border-warning/20 p-3">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning mt-0.5" />
            <div>
              <p className="text-caption font-semibold text-warning-text">Late reschedule fee: GH₵ {fee}</p>
              <p className="text-caption text-warning-text/80 mt-0.5">Rescheduling within 12 hours of delivery time incurs a fee.</p>
            </div>
          </div>
        )}

        <p className="text-caption text-neutral-400 text-center">
          {reschedulesLeft} reschedule{reschedulesLeft !== 1 ? 's' : ''} remaining
        </p>

        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <SlotCalendarPicker
            label="New delivery date & time"
            minDate={order.deliveryDate}
            selectedDate={newDate}
            selectedSlot={newSlot}
            onDateChange={setNewDate}
            onSlotChange={setNewSlot}
          />
        </div>
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        {saved ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Check className="h-4 w-4 text-success" />
            <p className="text-small font-semibold text-success-text">Delivery rescheduled!</p>
          </div>
        ) : (
          <>
            {fee > 0 && canSave && (
              <p className="text-caption text-warning-text text-center mb-2">Reschedule fee of GH₵ {fee} applies.</p>
            )}
            <Button variant="accent" size="lg" className="w-full" disabled={!canSave} loading={saving} onClick={handleSave}>
              Confirm Reschedule{fee > 0 ? ` · +GH₵ ${fee}` : ''}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
