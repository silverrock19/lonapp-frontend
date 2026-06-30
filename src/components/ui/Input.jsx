import { forwardRef } from 'react';
import { cn } from '../../utils/classNames.js';

const inputBase = [
  'w-full border rounded-lg px-3.5 py-2.5 text-body text-neutral-800',
  'placeholder:text-neutral-400',
  'outline-none transition-all duration-150',
  'border-neutral-200 bg-white',
  'hover:border-neutral-300',
  'focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100 focus:ring-offset-0',
].join(' ');

const Input = forwardRef(({ label, required, helper, error, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-small font-semibold text-neutral-700">
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        className={cn(
          inputBase,
          error && 'border-error bg-error-bg focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
      {error  && <p id={`${inputId}-error`}  role="alert" className="text-caption text-error">{error}</p>}
      {!error && helper && <p id={`${inputId}-helper`} className="text-caption text-neutral-500">{helper}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
