import { forwardRef } from 'react';
import { cn } from '../../utils/classNames.js';

export const Input = forwardRef(function Input(
  { label, required, helper, error, className, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-small font-medium text-neutral-700">
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        className={cn(
          'h-10 w-full rounded-md border px-3 text-body text-neutral-800 placeholder:text-neutral-400 outline-none transition-shadow',
          'border-neutral-300 bg-white focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
          error && 'border-error bg-error-bg focus:border-error focus:ring-error-bg',
          className
        )}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="text-caption text-error-text">{error}</p>}
      {!error && helper && <p id={`${inputId}-helper`} className="text-caption text-neutral-500">{helper}</p>}
    </div>
  );
});
