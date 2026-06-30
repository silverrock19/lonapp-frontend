import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { checkQuoteExpiry } from '../../lib/pricing/engine.js';

export default function QuoteExpiryBadge({ validUntil, onReQuote, className }) {
  const status = checkQuoteExpiry({ validUntil });

  if (!status.valid) {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700', className)}>
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">This quote has expired.</span>
        {onReQuote && (
          <button onClick={onReQuote} className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700">
            <RefreshCw className="h-3 w-3" /> Re-quote
          </button>
        )}
      </div>
    );
  }

  if (status.expiringSoon) {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-700', className)}>
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span>Quote expires in {status.hoursRemaining < 1 ? 'less than 1 hour' : `${status.hoursRemaining.toFixed(0)} hours`}. Accept soon.</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-neutral-400', className)}>
      <Clock className="h-3 w-3" />
      Valid for {status.hoursRemaining.toFixed(0)} more hours
    </div>
  );
}
