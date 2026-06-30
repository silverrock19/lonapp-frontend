import BarcodeDisplay from './BarcodeDisplay.jsx';
import { cn } from '../../utils/classNames.js';

// Bilingual EN/Twi service labels
const SERVICE_LABELS = {
  'Wash & Iron':     { en: 'Wash & Iron',     tw: 'Ho ne Tra'   },
  'Wash Only':       { en: 'Wash Only',        tw: 'Ho Nkoaa'    },
  'Iron Only':       { en: 'Iron Only',        tw: 'Tra Nkoaa'   },
  'Dry Cleaning':    { en: 'Dry Cleaning',     tw: 'Dray Klinig' },
  'Specialist Care': { en: 'Specialist Care',  tw: 'Sikwan Ho'   },
};

// 58 mm thermal label proportions ~ 220px × 120px
export default function TagPrintPreview({
  barcode,
  format = 'barcode',
  customerName,
  customerId,
  typeName,
  qty,
  service,
  outletName,
  deliveryDate,
  specialCare,
  stainRemoval,
  className,
}) {
  const svcLabel = SERVICE_LABELS[service] ?? { en: service ?? '—', tw: '' };

  return (
    <div
      className={cn(
        'w-[220px] rounded-lg border border-neutral-300 bg-white shadow-md overflow-hidden',
        'print:shadow-none print:border-black',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-900 px-2.5 py-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white">LonApp</span>
        <span className="text-[9px] text-neutral-400 font-mono">{customerId ?? ''}</span>
      </div>

      {/* Customer + item info */}
      <div className="px-2.5 pt-1.5 pb-1 space-y-0.5">
        <p className="text-[11px] font-bold text-neutral-900 leading-tight truncate">{customerName ?? '—'}</p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-neutral-600">{typeName ?? '—'} × {qty ?? '?'}</p>
          {deliveryDate && (
            <p className="text-[9px] text-neutral-400 font-mono">{deliveryDate}</p>
          )}
        </div>
      </div>

      {/* Service — bilingual */}
      <div className="mx-2.5 flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 mb-1">
        <span className="text-[10px] font-semibold text-neutral-800">{svcLabel.en}</span>
        {svcLabel.tw && (
          <span className="text-[9px] italic text-neutral-400">{svcLabel.tw}</span>
        )}
      </div>

      {/* Flag pills */}
      {(specialCare || stainRemoval) && (
        <div className="mx-2.5 mb-1 flex gap-1">
          {specialCare  && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-amber-700">Special Care</span>}
          {stainRemoval && <span className="rounded-full bg-error/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-error">Stain Removal</span>}
        </div>
      )}

      {/* Barcode / QR */}
      <div className="flex justify-center px-2 pb-2">
        <BarcodeDisplay
          value={barcode}
          format={format}
          width={196}
          height={format === 'qr' ? 80 : 52}
          showLabel
        />
      </div>

      {/* Outlet footer */}
      {outletName && (
        <div className="border-t border-neutral-200 px-2.5 py-0.5">
          <p className="text-[9px] text-neutral-400 text-center truncate">{outletName}</p>
        </div>
      )}
    </div>
  );
}
