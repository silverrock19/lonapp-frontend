import { CheckCircle, Circle, Loader } from 'lucide-react';
import { TIMELINE_STAGES, getStageIndex } from '../../lib/mock/mockOrders.js';
import { cn } from '../../utils/classNames.js';

const STAGE_ICONS = ['📋', '🚗', '🏭', '✨', '📦', '🚚'];

export default function OrderTrackingTimeline({ status, className }) {
  const isComplete  = ['DELIVERED', 'COMPLETED'].includes(status);
  const isCancelled = status === 'CANCELLED';
  const activeIdx   = isComplete ? TIMELINE_STAGES.length : getStageIndex(status);

  return (
    <div className={cn('space-y-0', className)}>
      {TIMELINE_STAGES.map((stage, idx) => {
        const done    = idx < activeIdx;
        const active  = idx === activeIdx;
        const pending = idx > activeIdx;
        const isLast  = idx === TIMELINE_STAGES.length - 1;

        return (
          <div key={stage.key} className="flex gap-3">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 text-base',
                  isCancelled
                    ? 'border-neutral-200 bg-neutral-100 text-neutral-300'
                    : done
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : active
                    ? 'border-accent-500 bg-white shadow-md shadow-accent-100'
                    : 'border-neutral-200 bg-white text-neutral-300',
                )}
              >
                {done ? (
                  <CheckCircle className="h-4 w-4" />
                ) : active ? (
                  <Loader className="h-4 w-4 text-accent-500 animate-spin" />
                ) : (
                  <span className={pending ? 'opacity-30' : ''}>{STAGE_ICONS[idx]}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[28px] transition-colors duration-300',
                    done ? 'bg-accent-500' : 'bg-neutral-200',
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn('pb-7 pt-1.5 min-w-0', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-small font-semibold leading-tight',
                  done    ? 'text-accent-600'
                  : active ? 'text-neutral-900'
                  : 'text-neutral-400',
                )}
              >
                {stage.label}
              </p>
              {active && !isCancelled && (
                <p className="text-caption text-accent-500 mt-0.5 animate-fade-in">
                  In progress…
                </p>
              )}
              {done && idx === 0 && (
                <p className="text-caption text-neutral-400 mt-0.5">Confirmed</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
