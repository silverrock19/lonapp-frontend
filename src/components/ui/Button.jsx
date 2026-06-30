import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const base = [
  'inline-flex items-center justify-center gap-2 font-sans font-semibold',
  'transition-all duration-150 ease-out',
  'active:scale-[0.97]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  'disabled:pointer-events-none disabled:opacity-50',
  'select-none',
].join(' ');

const variants = {
  primary:   'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md focus-visible:ring-primary-300',
  accent:    'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md focus-visible:ring-accent-300',
  neutral:   'bg-neutral-600 text-white shadow-sm hover:bg-neutral-700 hover:shadow-md focus-visible:ring-neutral-300',
  secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-200',
  outline:   'border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 focus-visible:ring-neutral-200',
  ghost:     'bg-transparent text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-200',
  danger:    'bg-error text-white shadow-sm hover:bg-error-text hover:shadow-md focus-visible:ring-error',
  warning:   'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-200',
};

const sizes = {
  sm:      'h-9 px-3.5 text-small rounded-md',
  default: 'h-11 px-5 text-body rounded-lg',
  lg:      'h-12 px-6 text-body-lg rounded-lg',
};

const Button = ({ variant = 'primary', size = 'default', loading = false, pill = false, children, className, ...props }) => {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], pill && '!rounded-full', className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
