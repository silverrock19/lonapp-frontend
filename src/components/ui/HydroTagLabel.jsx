import { cn } from '../../utils/classNames.js';

// Format: {CustomerName}-{OutletAbbrev}({Qty})-{DD/MM/YYYY}
function buildTagText(customerName, outletAbbrev, qty, deliveryDate) {
  const lastName = customerName?.split(' ').pop() ?? customerName ?? '—';
  const abbrev   = (outletAbbrev ?? 'OSU').toUpperCase();
  const dateStr  = deliveryDate ?? '—';
  return `${lastName}-${abbrev}(${qty ?? '?'})-${dateStr}`;
}

const MATERIAL_STYLES = {
  standard: 'bg-white border-neutral-300',
  coated:   'bg-stone-50 border-stone-300',
  tyvek:    'bg-cyan-50 border-cyan-300',
  vinyl:    'bg-amber-50 border-amber-300',
};

const MATERIAL_LABELS = {
  standard: 'Standard Paper',
  coated:   'Coated',
  tyvek:    'Tyvek · Waterproof',
  vinyl:    'Vinyl Adhesive',
};

// Bilingual service name (EN / Twi phonetic)
const SERVICE_TWI = {
  'Wash & Iron':     'Ho ne Tra',
  'Wash Only':       'Ho Nkoaa',
  'Iron Only':       'Tra Nkoaa',
  'Dry Cleaning':    'Dray Klinig',
  'Specialist Care': 'Sikwan Ho',
};

export default function HydroTagLabel({
  customerName,
  outletAbbrev,
  qty,
  deliveryDate,
  typeName,
  service,
  material = 'standard',
  size = 'full',
  className,
}) {
  const tagText = buildTagText(customerName, outletAbbrev, qty, deliveryDate);
  const twi     = SERVICE_TWI[service] ?? service;
  const isSmall = size === 'preview';

  return (
    <div
      className={cn(
        'inline-flex flex-col border-2 rounded-lg overflow-hidden font-mono select-all print:shadow-none',
        MATERIAL_STYLES[material] ?? MATERIAL_STYLES.standard,
        isSmall ? 'w-48 text-[9px]' : 'w-64 text-[11px]',
        'shadow-md',
        className,
      )}
    >
      {/* Header bar */}
      <div className={cn(
        'flex items-center justify-between px-2 py-1',
        'bg-neutral-800 text-white',
        isSmall ? 'gap-1' : 'gap-2',
      )}>
        <span className="font-bold tracking-wider uppercase text-[9px]">LonApp</span>
        <span className={cn(
          'rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase',
          material === 'tyvek' || material === 'vinyl'
            ? 'bg-cyan-500 text-white'
            : 'bg-neutral-600 text-neutral-300',
        )}>
          {MATERIAL_LABELS[material] ?? material}
        </span>
      </div>

      {/* Main tag text */}
      <div className={cn(
        'px-2 py-1.5 flex flex-col gap-0.5 flex-1',
        isSmall ? 'gap-0.5' : 'gap-1',
      )}>
        <div className="font-bold tracking-wide text-neutral-900 leading-tight break-all">
          {tagText}
        </div>

        {typeName && (
          <div className="text-neutral-500 text-[9px] uppercase tracking-wider leading-tight">
            {typeName}
          </div>
        )}
      </div>

      {/* Bilingual service footer */}
      {service && (
        <div className="border-t border-neutral-200 px-2 py-1 flex items-center justify-between">
          <span className="text-neutral-700 font-medium">{service}</span>
          <span className="text-neutral-400 italic">{twi}</span>
        </div>
      )}
    </div>
  );
}
