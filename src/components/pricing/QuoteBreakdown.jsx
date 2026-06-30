import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

export default function QuoteBreakdown({ quote, variant = 'customer', compact = false }) {
  if (!quote) return null;
  const isBusiness = variant === 'business';

  return (
    <div className={cn('space-y-1.5 text-sm', isBusiness ? 'text-neutral-700' : 'text-neutral-700')}>
      {/* Line items (skip in compact mode) */}
      {!compact && quote.lineItems?.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span className="text-neutral-500">{item.name} × {item.qty}</span>
          <span className="font-mono tabular-nums">GH₵ {item.lineTotal.toFixed(2)}</span>
        </div>
      ))}

      <div className="flex justify-between font-medium">
        <span>Subtotal</span>
        <span className="font-mono tabular-nums">GH₵ {quote.subtotal.toFixed(2)}</span>
      </div>

      {quote.surchargeAmount > 0 && (
        <div className="flex justify-between text-amber-600">
          <span>{quote.turnaroundLabel} surcharge</span>
          <span className="font-mono tabular-nums">+GH₵ {quote.surchargeAmount.toFixed(2)}</span>
        </div>
      )}

      {quote.deliveryFee > 0 && (
        <div className="flex justify-between text-neutral-500">
          <span>Delivery fee</span>
          <span className="font-mono tabular-nums">GH₵ {quote.deliveryFee.toFixed(2)}</span>
        </div>
      )}

      {quote.discountSteps?.filter(s => s.discountAmount > 0).map((step, i) => (
        <div key={i} className="flex justify-between text-green-600">
          <span>{step.label}</span>
          <span className="font-mono tabular-nums">-GH₵ {step.discountAmount.toFixed(2)}</span>
        </div>
      ))}

      {quote.discountSteps?.filter(s => s.type === 'promo_error').map((step, i) => (
        <p key={`pe-${i}`} className="text-xs text-red-500">{step.message}</p>
      ))}

      {quote.taxBreakdown?.map((t, i) => (
        <div key={i} className="flex justify-between text-neutral-400 text-xs">
          <span>{t.label}</span>
          <span className="font-mono tabular-nums">GH₵ {t.amount.toFixed(2)}</span>
        </div>
      ))}

      <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold">
        <span>Total</span>
        <span className="font-mono tabular-nums">GH₵ {quote.grandTotal.toFixed(2)}</span>
      </div>

      {quote.totalDiscount > 0 && (
        <p className="text-center text-xs text-green-600 font-medium">
          You saved GH₵ {quote.totalDiscount.toFixed(2)}
        </p>
      )}
    </div>
  );
}
