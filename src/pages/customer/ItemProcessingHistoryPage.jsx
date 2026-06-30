import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ScanBarcode, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { getAllItems, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { getCheckpointsForItem, ZONE_LABELS } from '../../lib/mock/mockTracking.js';
import { cn } from '../../utils/classNames.js';

const STATUS_TIMELINE_ICONS = {
  RECEIVED:   '📥',
  SORTING:    '🗂️',
  TAGGED:     '🏷️',
  WASHING:    '🫧',
  DRYING:     '💨',
  IRONING:    '👔',
  QC:         '✅',
  PACKAGED:   '📦',
  DISPATCHED: '🚚',
};

export default function ItemProcessingHistoryPage() {
  const { id: orderId } = useParams();

  const allItems    = getAllItems();
  const orderItems  = allItems.filter(item => item.orderId === orderId || !orderId);

  return (
    <div data-theme="customer" className="min-h-screen bg-neutral-50">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-4 py-3 flex items-center gap-3">
        <Link to={`/app/orders/${orderId}`} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-small font-bold text-neutral-900">Processing History</h1>
          <p className="text-[10px] text-neutral-500">{orderId}</p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">

        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ScanBarcode className="h-8 w-8 text-neutral-300 mb-3" />
            <p className="text-small text-neutral-500">No items found for this order</p>
          </div>
        ) : (
          orderItems.map(item => {
            const checkpoints = getCheckpointsForItem(item.id);

            return (
              <div key={item.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                {/* Item header */}
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <p className="text-small font-semibold text-neutral-800">{item.typeName} × {item.qty}</p>
                    <p className="font-mono text-[10px] text-neutral-400">{item.barcode}</p>
                  </div>
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                    {ITEM_STATUS_LABELS[item.status]}
                  </span>
                </div>

                {/* Timeline */}
                <div className="px-4 py-3 space-y-0">
                  {checkpoints.length === 0 ? (
                    <p className="text-caption text-neutral-400 py-2">No processing scans yet</p>
                  ) : (
                    checkpoints.map((chk, i) => (
                      <div key={chk.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-50 text-[10px]">
                            {STATUS_TIMELINE_ICONS[chk.toStatus] ?? '•'}
                          </div>
                          {i < checkpoints.length - 1 && (
                            <div className="mt-1 w-0.5 flex-1 bg-neutral-100 min-h-[16px]" />
                          )}
                        </div>
                        <div className="pb-3 min-w-0 flex-1">
                          <p className="text-small font-semibold text-neutral-800">
                            {ITEM_STATUS_LABELS[chk.toStatus]}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 text-neutral-400 flex-shrink-0" />
                            <p className="text-[10px] text-neutral-500 truncate">
                              {chk.scanAt?.slice(11, 16)} · {chk.scannedBy}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Current status */}
                  <div className="flex gap-3 pt-1">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                    </div>
                    <div className="pb-2">
                      <p className="text-small font-semibold text-primary-700">
                        {ITEM_STATUS_LABELS[item.status]} — Now
                      </p>
                      {item.location && (
                        <p className="text-[10px] text-neutral-500">{item.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Footer note */}
        <p className="text-center text-[10px] text-neutral-400 pb-4">
          Processing times are estimates. Your items are handled with care at every step.
        </p>
      </div>
    </div>
  );
}
