import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const base = 'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-100',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-accent-100',
  secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  outline:   'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
  ghost:     'bg-transparent text-neutral-600 hover:bg-neutral-100',
  danger:    'bg-error text-white hover:bg-error-text',
};

const sizes = {
  sm:      'h-8 px-3 text-small',
  default: 'h-10 px-4 text-body',
  lg:      'h-12 px-6 text-body-lg',
};

export function Button({ variant = 'primary', size = 'default', loading = false, pill = false, children, className, ...props }) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], pill ? 'rounded-full' : 'rounded-md', className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
