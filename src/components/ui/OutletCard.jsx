import { MapPin, Star, Clock, Zap, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const SERVICE_LABELS = {
  washing:       'Washing',
  ironing:       'Ironing',
  'dry-cleaning':'Dry Cleaning',
  specialist:    'Specialist',
  bedding:       'Bedding',
};

const OutletCard = ({ outlet, onSelect, selected = false, variant = 'default' }) => (
  <button
    onClick={() => onSelect?.(outlet)}
    className={cn(
      'w-full text-left rounded-2xl border bg-white transition-all duration-150 active:scale-[0.98]',
      selected
        ? 'border-accent-500 ring-2 ring-accent-100 shadow-md'
        : 'border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-200',
      variant === 'compact' ? 'p-3' : 'p-4',
    )}
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-small font-bold text-white"
          style={{ backgroundColor: outlet.color || '#0E9AA7' }}
        >
          {outlet.avatar}
        </div>
        <div>
          <p className="text-body font-semibold text-neutral-900">{outlet.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-caption text-warning font-semibold">
              <Star className="h-3 w-3 fill-current" />
              {outlet.rating}
            </span>
            <span className="text-caption text-neutral-300">·</span>
            <span className="text-caption text-neutral-400">{outlet.reviewCount} reviews</span>
          </div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-300 mt-1" />
    </div>

    {/* Address & distance */}
    <div className="flex items-center gap-1.5 mt-3">
      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
      <span className="text-caption text-neutral-500 truncate flex-1">{outlet.address}</span>
      <span className="flex-shrink-0 text-caption font-semibold text-accent-600 ml-1">
        {outlet.distance} km
      </span>
    </div>

    {/* Hours + status */}
    <div className="flex items-center gap-1.5 mt-1.5">
      <Clock className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
      <span className="text-caption text-neutral-500 flex-1">{outlet.hours}</span>
      <span className={cn(
        'flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        outlet.openNow ? 'bg-success-bg text-success-text' : 'bg-neutral-100 text-neutral-500',
      )}>
        {outlet.openNow ? 'Open' : 'Closed'}
      </span>
    </div>

    {/* Service chips */}
    <div className="flex flex-wrap gap-1.5 mt-3">
      {outlet.services.map(s => (
        <span key={s} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-caption text-neutral-600">
          {SERVICE_LABELS[s] || s}
        </span>
      ))}
      {outlet.sameDayAvailable && (
        <span className="flex items-center gap-0.5 rounded-full bg-accent-50 px-2.5 py-0.5 text-caption font-semibold text-accent-600">
          <Zap className="h-3 w-3" />
          Same-Day
        </span>
      )}
    </div>

    {/* Turnaround footer */}
    {variant !== 'compact' && (
      <div className="flex gap-3 mt-3 pt-3 border-t border-neutral-100">
        <div className="text-center flex-1">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Standard</p>
          <p className="text-small font-semibold text-neutral-700 mt-0.5">{outlet.turnaround.standard} days</p>
        </div>
        <div className="w-px bg-neutral-100" />
        <div className="text-center flex-1">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Express</p>
          <p className="text-small font-semibold text-accent-600 mt-0.5">
            {outlet.turnaround.express} day +{Math.round(outlet.expressSurcharge * 100)}%
          </p>
        </div>
        <div className="w-px bg-neutral-100" />
        <div className="text-center flex-1">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pickup</p>
          <p className="text-small font-semibold text-neutral-700 mt-0.5">GH₵ {outlet.pickupFee}</p>
        </div>
      </div>
    )}
  </button>
);

export default OutletCard;
