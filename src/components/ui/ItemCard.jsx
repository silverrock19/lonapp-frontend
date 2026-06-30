import { Camera, Droplets, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { COLORS } from '../../lib/mock/mockIntake.js';

export default function ItemCard({ item, intakeData, compact = false, className }) {
  if (!item) return null;

  const intake    = intakeData ?? {};
  const color     = intake.attributes?.color?.primary;
  const colorDef  = COLORS.find(c => c.id === color);
  const fabric    = intake.attributes?.fabric?.type;
  const stainCnt  = intake.stains?.length ?? 0;
  const photoCnt  = intake.photos?.length ?? 0;
  const flagCount = Object.values(intake.careFlags ?? {}).filter(Boolean).length;
  const hasDefects = (intake.condition?.defects?.length ?? 0) > 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm', className)}>
        {colorDef?.hex && (
          <span
            className="h-4 w-4 flex-shrink-0 rounded-full border border-neutral-300"
            style={{ background: colorDef.hex }}
            title={colorDef.label}
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold text-neutral-700 truncate">{item.barcode}</p>
          <p className="text-caption text-neutral-500 truncate">{item.typeName} × {item.qty} · {item.customerName}</p>
        </div>
        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap', ITEM_STATUS_COLOR[item.status])}>
          {ITEM_STATUS_LABELS[item.status]}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden', className)}>
      {/* Header stripe */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          {colorDef?.hex && (
            <span
              className="h-4 w-4 flex-shrink-0 rounded-full border border-neutral-300"
              style={{ background: colorDef.hex }}
              title={colorDef.label}
            />
          )}
          <span className="font-mono text-[11px] font-semibold text-neutral-700 truncate">{item.barcode}</span>
        </div>
        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap', ITEM_STATUS_COLOR[item.status])}>
          {ITEM_STATUS_LABELS[item.status]}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {[
          ['Item',     `${item.typeName} × ${item.qty}`],
          ['Customer', item.customerName],
          ['Order',    item.orderId],
          ['Service',  item.service],
          ['Fabric',   fabric ? (fabric.charAt(0).toUpperCase() + fabric.slice(1)) : '—'],
          ['Color',    colorDef ? colorDef.label : '—'],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400">{k}</p>
            <p className="text-small font-medium text-neutral-800">{v}</p>
          </div>
        ))}
      </div>

      {/* Indicators bar */}
      {(photoCnt > 0 || stainCnt > 0 || flagCount > 0 || hasDefects) && (
        <div className="flex items-center gap-3 border-t border-neutral-100 bg-neutral-50/60 px-4 py-2">
          {photoCnt > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-neutral-500">
              <Camera className="h-3 w-3" /> {photoCnt} photo{photoCnt !== 1 ? 's' : ''}
            </span>
          )}
          {stainCnt > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600">
              <Droplets className="h-3 w-3" /> {stainCnt} stain{stainCnt !== 1 ? 's' : ''}
            </span>
          )}
          {hasDefects && (
            <span className="flex items-center gap-1 text-[10px] text-error">
              <AlertTriangle className="h-3 w-3" /> defects noted
            </span>
          )}
          {flagCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-primary-600">
              <span className="font-bold">!</span> {flagCount} care flag{flagCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
