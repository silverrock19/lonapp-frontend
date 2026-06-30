import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle, Check } from 'lucide-react';
import { getOrder, canReschedulePickup, STATUS_LABELS } from '../../lib/mock/mockOrders.js';
import SlotCalendarPicker from '../../components/ui/SlotCalendarPicker.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

// Reschedule fee logic (US-0067)
// >24h before pickup → GH₵ 0
// <24h before pickup → GH₵ 10
// Same-day (<2h) → GH₵ 5 (lower flat fee, not applicable here — just show GH₵ 10 for <24h)
const MAX_RESCHEDULES = 3;

const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { weekday: 'short', month: 'short', day: 'numeric' });

function getRescheduleFee(pickupDateStr) {
  if (!pickupDateStr) return 0;
  const pickupMs = new Date(pickupDateStr).getTime();
  const nowMs = Date.now();
  const hoursUntil = (pickupMs - nowMs) / 3_600_000;
  if (hoursUntil > 24) return 0;
  if (hoursUntil > 2)  return 10;
  return 5;
}

export default function ReschedulePickupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  const [newDate, setNewDate]   = useState(null);
  const [newSlot, setNewSlot]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  if (!order) {
    return <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
      <EmptyState title="Order not found" />
    </div>;
  }

  if (!canReschedulePickup(order.status)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Cannot reschedule"
          description={`Pickup cannot be rescheduled once status is "${STATUS_LABELS[order.status]}".`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  if (order.rescheduleCount >= MAX_RESCHEDULES) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Reschedule limit reached"
          description={`You've already rescheduled this order ${MAX_RESCHEDULES} times. Please contact support to reschedule further.`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  const fee = getRescheduleFee(order.pickupDate);
  const canSave = newDate && newSlot;
  const reschedulesLeft = MAX_RESCHEDULES - order.rescheduleCount;

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
          <p className="text-small font-semibold text-neutral-900">Reschedule Pickup</p>
          <p className="text-caption text-neutral-400 font-mono">{order.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 py-4 space-y-4">

        {/* Current pickup */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Current pickup</p>
          <p className="text-small font-semibold text-neutral-800">{fmtDate(order.pickupDate)}</p>
          <p className="text-caption text-neutral-500">{order.pickupSlot?.label}</p>
        </div>

        {/* Fee info */}
        <div className={`flex items-start gap-2.5 rounded-xl p-3 border ${fee > 0 ? 'bg-warning-bg border-warning/20' : 'bg-info-bg border-primary-100'}`}>
          {fee > 0
            ? <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning mt-0.5" />
            : <Info className="h-4 w-4 flex-shrink-0 text-primary-500 mt-0.5" />
          }
          <div>
            <p className={`text-caption font-semibold ${fee > 0 ? 'text-warning-text' : 'text-primary-700'}`}>
              {fee > 0 ? `Late reschedule fee: GH₵ ${fee}` : 'Free reschedule'}
            </p>
            <p className={`text-caption mt-0.5 ${fee > 0 ? 'text-warning-text/80' : 'text-primary-600'}`}>
              {fee > 0
                ? 'Rescheduling within 24 hours of pickup incurs a fee.'
                : 'No charge — rescheduling more than 24 hours before pickup is free.'}
            </p>
          </div>
        </div>

        <p className="text-caption text-neutral-400 text-center">
          {reschedulesLeft} reschedule{reschedulesLeft !== 1 ? 's' : ''} remaining (max {MAX_RESCHEDULES})
        </p>

        {/* New slot picker */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <SlotCalendarPicker
            label="New pickup date & time"
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
            <p className="text-small font-semibold text-success-text">Pickup rescheduled!</p>
          </div>
        ) : (
          <>
            {fee > 0 && canSave && (
              <p className="text-caption text-warning-text text-center mb-2">Reschedule fee of GH₵ {fee} will be added to your order.</p>
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
