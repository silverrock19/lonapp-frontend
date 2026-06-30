import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Zap, Clock, Info } from 'lucide-react';
import {
  selectDraft, selectDraftItems,
  setTurnaround, setPickup, setDelivery, setNotes,
} from '../../store/slices/orderSlice.js';
import ServiceItemPicker from '../../components/forms/ServiceItemPicker.jsx';
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';
import SlotCalendarPicker from '../../components/ui/SlotCalendarPicker.jsx';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const SAVED_ADDRESSES = [
  { id: 'addr-1', label: 'Home',   detail: '42 Liberation Road, Osu, Accra',          gps: 'GA-144-2345' },
  { id: 'addr-2', label: 'Office', detail: '4 Ringway Estate Close, Cantonments, Accra', gps: 'GA-031-6789' },
];

const STEPS = ['Items', 'Pickup', 'Delivery'];

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const draft    = useSelector(selectDraft);
  const items    = useSelector(selectDraftItems);
  const [step, setStep] = useState(1);

  // Step 2 state
  const [pickupAddrId, setPickupAddrId] = useState(SAVED_ADDRESSES[0].id);
  const [pickupDate,   setPickupDate]   = useState(null);
  const [pickupSlot,   setPickupSlot]   = useState(null);

  // Step 3 state
  const [deliveryAddrId, setDeliveryAddrId] = useState(SAVED_ADDRESSES[0].id);
  const [deliveryDate,   setDeliveryDate]   = useState(null);
  const [deliverySlot,   setDeliverySlot]   = useState(null);

  const totalItems   = items.reduce((s, i) => s + i.qty, 0);
  const turnaroundDays = (draft.turnaround === 'express' || draft.turnaround === 'same-day')
    ? (draft.outlet?.turnaround?.express ?? 1)
    : (draft.outlet?.turnaround?.standard ?? 3);

  function getMinDeliveryDate() {
    if (!pickupDate) return null;
    const d = new Date(pickupDate);
    d.setDate(d.getDate() + turnaroundDays);
    return d.toISOString().split('T')[0];
  }

  function goNext() {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const addr = SAVED_ADDRESSES.find(a => a.id === pickupAddrId);
      dispatch(setPickup({ address: addr, date: pickupDate, slot: pickupSlot }));
      setStep(3);
    } else {
      const addr = SAVED_ADDRESSES.find(a => a.id === deliveryAddrId);
      dispatch(setDelivery({ address: addr, date: deliveryDate, slot: deliverySlot }));
      navigate('/app/order/review');
    }
  }

  function goBack() {
    if (step === 1) navigate(-1);
    else setStep(step - 1);
  }

  const canProceed =
    step === 1 ? totalItems > 0 :
    step === 2 ? (pickupDate && pickupSlot) :
    (deliveryDate && deliverySlot);


  const TURNAROUND_OPTIONS = [
    {
      id:   'standard',
      label: 'Standard',
      sub:   `${draft.outlet?.turnaround?.standard ?? 3} days · Base price`,
      icon:  Clock,
    },
    {
      id:   'express',
      label: 'Express',
      sub:   `${draft.outlet?.turnaround?.express ?? 1} day · +${Math.round((draft.outlet?.expressSurcharge ?? 0.4) * 100)}%`,
      icon:  Zap,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-small font-semibold text-neutral-900 truncate">
              {draft.outlet?.name ?? 'New Order'}
            </p>
            <p className="text-caption text-neutral-400">Step {step} of 3 — {STEPS[step - 1]}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-accent-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">

        {/* ── Step 1: Items & service speed ── */}
        {step === 1 && (
          <div className="px-4 py-5 space-y-4">

            {/* Turnaround selector */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-3">Service speed</p>
              <div className="grid grid-cols-2 gap-2">
                {TURNAROUND_OPTIONS.map(({ id, label, sub, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => dispatch(setTurnaround(id))}
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all duration-150',
                      draft.turnaround === id
                        ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-100'
                        : 'border-neutral-200 bg-white hover:border-neutral-300',
                    )}
                  >
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${draft.turnaround === id ? 'text-accent-500' : 'text-neutral-400'}`} />
                    <div>
                      <p className={`text-small font-semibold ${draft.turnaround === id ? 'text-accent-600' : 'text-neutral-700'}`}>
                        {label}
                      </p>
                      <p className="text-caption text-neutral-400 mt-0.5">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {draft.outlet?.sameDayAvailable && (
                <button
                  onClick={() => dispatch(setTurnaround('same-day'))}
                  className={cn(
                    'mt-2 w-full flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all duration-150',
                    draft.turnaround === 'same-day'
                      ? 'border-warning bg-warning-bg ring-2 ring-warning/20'
                      : 'border-neutral-200 bg-white hover:border-neutral-300',
                  )}
                >
                  <Zap className={`h-4 w-4 flex-shrink-0 ${draft.turnaround === 'same-day' ? 'text-warning' : 'text-neutral-400'}`} />
                  <div className="flex-1">
                    <p className={`text-small font-semibold ${draft.turnaround === 'same-day' ? 'text-warning-text' : 'text-neutral-700'}`}>
                      Same-Day
                    </p>
                    <p className="text-caption text-neutral-400 mt-0.5">
                      Back by {draft.outlet.sameDayGuaranteedDelivery} · +{Math.round((draft.outlet?.sameDaySurcharge ?? 1.75) * 100)}%
                    </p>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold text-white">
                    RUSH
                  </span>
                </button>
              )}
            </div>

            {/* Item picker */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-3">Select items</p>
              <ServiceItemPicker availableServices={draft.outlet?.services} />
            </div>

            {/* Special instructions */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-2">Special instructions</p>
              <textarea
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all resize-none"
                rows={3}
                placeholder="e.g. Handle silk shirts with care, separate whites…"
                value={draft.notes}
                onChange={e => dispatch(setNotes(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Pickup ── */}
        {step === 2 && (
          <div className="px-4 py-5 space-y-4">
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-3">Pickup address</p>
              <div className="space-y-2">
                {SAVED_ADDRESSES.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => setPickupAddrId(addr.id)}
                    className={cn(
                      'w-full text-left rounded-xl border p-3 transition-all duration-150',
                      pickupAddrId === addr.id
                        ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-100'
                        : 'border-neutral-200 bg-white hover:border-neutral-300',
                    )}
                  >
                    <p className="text-small font-semibold text-neutral-800">{addr.label}</p>
                    <p className="text-caption text-neutral-500 mt-0.5">{addr.detail}</p>
                    <p className="text-caption text-neutral-400">{addr.gps}</p>
                  </button>
                ))}
                <button className="w-full text-center text-small font-medium text-accent-600 py-2 hover:text-accent-700 transition-colors">
                  + Add new address
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <SlotCalendarPicker
                label="Pickup date & time"
                selectedDate={pickupDate}
                selectedSlot={pickupSlot}
                onDateChange={setPickupDate}
                onSlotChange={setPickupSlot}
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Delivery ── */}
        {step === 3 && (
          <div className="px-4 py-5 space-y-4">
            <div className="flex items-start gap-2.5 rounded-xl bg-info-bg border border-primary-100 p-3">
              <Info className="h-4 w-4 flex-shrink-0 text-primary-500 mt-0.5" />
              <p className="text-caption text-primary-700">
                Earliest delivery: pickup date + <strong>{turnaroundDays} day{turnaroundDays !== 1 ? 's' : ''}</strong>
                {' '}({draft.turnaround} turnaround). Select any available date from then.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-small font-bold text-neutral-700 mb-3">Delivery address</p>
              <div className="space-y-2">
                {SAVED_ADDRESSES.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => setDeliveryAddrId(addr.id)}
                    className={cn(
                      'w-full text-left rounded-xl border p-3 transition-all duration-150',
                      deliveryAddrId === addr.id
                        ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-100'
                        : 'border-neutral-200 bg-white hover:border-neutral-300',
                    )}
                  >
                    <p className="text-small font-semibold text-neutral-800">{addr.label}</p>
                    <p className="text-caption text-neutral-500 mt-0.5">{addr.detail}</p>
                  </button>
                ))}
                <button className="w-full text-center text-small font-medium text-accent-600 py-2 hover:text-accent-700 transition-colors">
                  + Add new address
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <SlotCalendarPicker
                label="Delivery date & time"
                minDate={getMinDeliveryDate()}
                selectedDate={deliveryDate}
                selectedSlot={deliverySlot}
                onDateChange={setDeliveryDate}
                onSlotChange={setDeliverySlot}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        {step === 1 && draft.total > 0 && (
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-caption text-neutral-400">
                {totalItems} item{totalItems !== 1 ? 's' : ''} · {draft.turnaround}
              </p>
              <p className="text-body font-bold text-neutral-900 tabular-nums">{fmtPrice(draft.total)}</p>
            </div>
            <p className="text-caption text-neutral-400">incl. VAT + fees</p>
          </div>
        )}
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          disabled={!canProceed}
          onClick={goNext}
        >
          {step < 3 ? 'Continue' : 'Review Order'}
        </Button>
      </div>
    </div>
  );
}
