import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle, Check, Info } from 'lucide-react';
import { getOrder, canChangeAddress, STATUS_LABELS } from '../../lib/mock/mockOrders.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { cn } from '../../utils/classNames.js';

const SAVED_ADDRESSES = [
  { id: 'addr-1', label: 'Home',          detail: '42 Liberation Road, Osu, Accra',             gps: 'GA-144-2345', deliveryFee: 15 },
  { id: 'addr-2', label: 'Office',         detail: '4 Ringway Estate Close, Cantonments, Accra', gps: 'GA-031-6789', deliveryFee: 15 },
  { id: 'addr-3', label: 'Mum\'s Place',  detail: '18 Ring Road East, Adabraka, Accra',          gps: 'GA-022-1107', deliveryFee: 20 },
  { id: 'addr-4', label: 'Friend\'s',      detail: '7 Dzorwulu Road, Dzorwulu, Accra',           gps: 'GA-053-8821', deliveryFee: 18 },
];

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

export default function ChangeAddressPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  const current = order ? SAVED_ADDRESSES.find(a => a.id === order.deliveryAddress?.id) ?? SAVED_ADDRESSES[0] : null;
  const [selectedId, setSelectedId] = useState(current?.id ?? SAVED_ADDRESSES[0].id);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  if (!order) {
    return <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
      <EmptyState title="Order not found" />
    </div>;
  }

  if (!canChangeAddress(order.status)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4" style={{ background: '#FAFAF8' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Cannot change address"
          description={`Address cannot be changed once "${STATUS_LABELS[order.status]}" — the driver has already been dispatched.`}
          action={<Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  const selectedAddr = SAVED_ADDRESSES.find(a => a.id === selectedId) ?? SAVED_ADDRESSES[0];
  const feeChanged = selectedAddr.deliveryFee !== (order.deliveryFee ?? 15);
  const feeDiff = selectedAddr.deliveryFee - (order.deliveryFee ?? 15);
  const changed = selectedId !== (current?.id ?? SAVED_ADDRESSES[0].id);

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
          <p className="text-small font-semibold text-neutral-900">Change Delivery Address</p>
          <p className="text-caption text-neutral-400 font-mono">{order.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 py-4 space-y-4">

        {/* Current */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Current address</p>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-small font-semibold text-neutral-800">{order.deliveryAddress?.label ?? 'Home'}</p>
              <p className="text-caption text-neutral-500">{order.deliveryAddress?.detail}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-info-bg border border-primary-100 p-3">
          <Info className="h-4 w-4 flex-shrink-0 text-primary-500 mt-0.5" />
          <p className="text-caption text-primary-700">
            New address must be within the outlet's service area. Delivery fee may change based on distance.
          </p>
        </div>

        {/* Address list */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Saved addresses</p>
          <div className="px-4 pb-4 space-y-2">
            {SAVED_ADDRESSES.map(addr => {
              const isSelected = selectedId === addr.id;
              const isCurrent = addr.id === (current?.id ?? SAVED_ADDRESSES[0].id);
              return (
                <button
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  className={cn(
                    'w-full text-left rounded-xl border p-3 transition-all duration-150',
                    isSelected ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-100' : 'border-neutral-200 bg-white hover:border-neutral-300',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-small font-semibold text-neutral-800">
                        {addr.label}
                        {isCurrent && <span className="ml-2 text-caption text-neutral-400">(current)</span>}
                      </p>
                      <p className="text-caption text-neutral-500 mt-0.5">{addr.detail}</p>
                      <p className="text-caption text-neutral-400">{addr.gps}</p>
                    </div>
                    <span className="text-caption text-neutral-500 flex-shrink-0 ml-2">GH₵ {addr.deliveryFee}</span>
                  </div>
                </button>
              );
            })}
            <button className="w-full text-center text-small font-medium text-accent-600 py-2 hover:text-accent-700 transition-colors">
              + Add new address
            </button>
          </div>
        </div>

        {/* Fee change notice */}
        {feeChanged && changed && (
          <div className={cn(
            'flex items-start gap-2.5 rounded-xl p-3 border animate-fade-in',
            feeDiff > 0 ? 'bg-warning-bg border-warning/20' : 'bg-success-bg border-success/20',
          )}>
            <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${feeDiff > 0 ? 'text-warning' : 'text-success'}`} />
            <p className={`text-caption ${feeDiff > 0 ? 'text-warning-text' : 'text-success-text'}`}>
              Delivery fee will {feeDiff > 0 ? `increase by GH₵ ${feeDiff}` : `decrease by GH₵ ${Math.abs(feeDiff)}`} for this address.
              {feeDiff > 0 ? ' Additional charge collected on delivery.' : ' Difference will be refunded.'}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        {saved ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Check className="h-4 w-4 text-success" />
            <p className="text-small font-semibold text-success-text">Address updated!</p>
          </div>
        ) : (
          <Button variant="accent" size="lg" className="w-full" disabled={!changed} loading={saving} onClick={handleSave}>
            Update Address{feeChanged && changed ? (feeDiff > 0 ? ` · +GH₵ ${feeDiff}` : ` · −GH₵ ${Math.abs(feeDiff)}`) : ''}
          </Button>
        )}
      </div>
    </div>
  );
}
