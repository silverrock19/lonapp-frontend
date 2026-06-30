import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, MapPin, Star, Clock, Zap, CreditCard, Check } from 'lucide-react';
import OUTLETS from '../../lib/mock/outlets.js';
import { SERVICE_CATEGORIES } from '../../lib/mock/orderServices.js';
import { startDraft } from '../../store/slices/orderSlice.js';
import Button from '../../components/ui/Button.jsx';

const SERVICE_LABELS = {
  washing: 'Washing', ironing: 'Ironing',
  'dry-cleaning': 'Dry Cleaning', specialist: 'Specialist', bedding: 'Bedding',
};
const PAYMENT_LABELS = { cash: 'Cash', momo: 'Mobile Money', card: 'Card' };

export default function OutletDetailPage() {
  const { id }  = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const outlet   = OUTLETS.find(o => o.id === id);

  if (!outlet) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center" style={{ background: '#FAFAF8' }}>
        <p className="text-body text-neutral-500">Outlet not found.</p>
        <button onClick={() => navigate('/app/discover')} className="mt-4 text-accent-600 text-small font-medium">
          Back to search
        </button>
      </div>
    );
  }

  function handleStartOrder() {
    dispatch(startDraft(outlet));
    navigate('/app/order/new');
  }

  const catalogForOutlet = SERVICE_CATEGORIES.filter(c => outlet.services.includes(c.id));

  return (
    <div className="min-h-screen pb-36" style={{ background: '#FAFAF8' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <h1 className="text-body font-semibold text-neutral-900 truncate">{outlet.name}</h1>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-neutral-100 p-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-h3 font-bold text-white"
            style={{ backgroundColor: outlet.color }}
          >
            {outlet.avatar}
          </div>
          <div className="min-w-0">
            <h2 className="text-h4 font-bold text-neutral-900">{outlet.name}</h2>
            <p className="text-caption text-neutral-500 mt-0.5">{outlet.tagline}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-0.5 text-small font-bold text-warning">
                <Star className="h-3.5 w-3.5 fill-current" /> {outlet.rating}
              </span>
              <span className="text-caption text-neutral-400">({outlet.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-small text-neutral-700">{outlet.address}</p>
              <p className="text-caption text-neutral-400">{outlet.gps}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-neutral-400" />
            <p className="text-small text-neutral-700 flex-1">{outlet.hours}</p>
            <span className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${
              outlet.openNow ? 'bg-success-bg text-success-text' : 'bg-neutral-100 text-neutral-500'
            }`}>
              {outlet.openNow ? 'Open now' : 'Closed'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 flex-shrink-0 text-neutral-400" />
            <p className="text-small text-neutral-600">
              {outlet.paymentMethods.map(p => PAYMENT_LABELS[p] || p).join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Turnaround options */}
      <div className="mx-4 mt-3 rounded-2xl bg-white shadow-sm border border-neutral-100 p-4">
        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Turnaround</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3 text-center">
            <p className="text-caption text-neutral-500">Standard</p>
            <p className="text-h4 font-bold text-neutral-900 mt-0.5">{outlet.turnaround.standard} days</p>
            <p className="text-caption text-neutral-400 mt-0.5">Base price</p>
          </div>
          <div className="rounded-xl bg-accent-50 border border-accent-100 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Zap className="h-3.5 w-3.5 text-accent-500" />
              <p className="text-caption font-semibold text-accent-600">Express</p>
            </div>
            <p className="text-h4 font-bold text-accent-700 mt-0.5">{outlet.turnaround.express} day</p>
            <p className="text-caption text-accent-500 mt-0.5">+{Math.round(outlet.expressSurcharge * 100)}% surcharge</p>
          </div>
        </div>

        {outlet.sameDayAvailable && (
          <div className="mt-3 rounded-xl bg-warning-bg border border-warning/20 p-3 flex items-start gap-3">
            <Zap className="h-5 w-5 flex-shrink-0 text-warning mt-0.5" />
            <div>
              <p className="text-small font-semibold text-warning-text">Same-Day Available</p>
              <p className="text-caption text-warning-text/80 mt-0.5">
                Order by {outlet.sameDayCutoff} · Ready by {outlet.sameDayGuaranteedDelivery}
                {' '}· +{Math.round(outlet.sameDaySurcharge * 100)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Services & pricing */}
      <div className="mx-4 mt-3 rounded-2xl bg-white shadow-sm border border-neutral-100 p-4">
        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Services & Sample Pricing</h3>
        {catalogForOutlet.map(cat => (
          <div key={cat.id} className="mb-4 last:mb-0">
            <p className="text-caption font-semibold text-neutral-500 mb-2">{cat.icon} {cat.label}</p>
            <div className="space-y-1.5">
              {cat.items.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-small text-neutral-700">{item.name}</span>
                  <span className="text-small font-semibold text-neutral-800 tabular-nums">GH₵ {item.unitPrice}</span>
                </div>
              ))}
              {cat.items.length > 4 && (
                <p className="text-caption text-neutral-400">+{cat.items.length - 4} more</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mx-4 mt-3 rounded-2xl bg-white shadow-sm border border-neutral-100 p-4">
        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Features</h3>
        <div className="grid grid-cols-2 gap-2">
          {outlet.features.map(f => (
            <div key={f} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 flex-shrink-0 text-success" />
              <span className="text-small text-neutral-600">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 py-3 bg-white border-t border-neutral-100 shadow-[0_-2px_12px_rgba(15,20,27,.06)]">
        <p className="text-caption text-neutral-400 mb-2.5 text-center">
          GH₵ {outlet.pickupFee} pickup · GH₵ {outlet.deliveryFee} delivery · {outlet.turnaround.standard}-day standard
        </p>
        <Button variant="accent" size="lg" className="w-full" onClick={handleStartOrder}>
          Start Order
        </Button>
      </div>
    </div>
  );
}
