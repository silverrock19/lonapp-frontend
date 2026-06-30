import { Wifi, Lock } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

// Post-MVP: RFID tag badge — shows EPC code, status, wash count
// Full implementation deferred to premium tier rollout

export default function RFIDTagBadge({ epc, washCount = 0, status = 'assigned', className }) {
  const isAssigned = status === 'assigned' && !!epc;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-lg border px-3 py-2',
      isAssigned
        ? 'border-purple-200 bg-purple-50'
        : 'border-neutral-200 bg-neutral-50',
      className,
    )}>
      <Wifi className={cn('h-4 w-4 flex-shrink-0', isAssigned ? 'text-purple-500' : 'text-neutral-300')} />
      <div className="min-w-0">
        {isAssigned ? (
          <>
            <p className="font-mono text-[11px] font-semibold text-purple-900 truncate">{epc}</p>
            <p className="text-[10px] text-purple-500">RFID · {washCount} wash cycle{washCount !== 1 ? 's' : ''}</p>
          </>
        ) : (
          <>
            <p className="text-caption text-neutral-500 font-medium">No RFID tag assigned</p>
            <p className="text-[10px] text-neutral-400">Post-MVP · Premium tier</p>
          </>
        )}
      </div>
      <span className="ml-auto flex-shrink-0 rounded-full bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
        Premium
      </span>
    </div>
  );
}
