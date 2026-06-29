import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const base = 'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-100',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-accent-100',
  neutral:   'bg-[#6B7280] text-white hover:bg-[#4B5563] focus-visible:ring-2 focus-visible:ring-neutral-200',
  secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  outline:   'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
  ghost:     'bg-transparent text-neutral-600 hover:bg-neutral-100',
  danger:    'bg-error text-white hover:bg-error-text',
  warning:   'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-100',
};

const sizes = {
  sm:      'h-10 px-3 text-small',
  default: 'h-12 px-4 text-body',
  lg:      'h-11 px-6 text-body-lg',
};

const Button = ({ variant = 'primary', size = 'default', loading = false, pill = false, children, className, ...props }) => {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      style={{ borderRadius: pill ? 9999 : 8, ...props.style }}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
