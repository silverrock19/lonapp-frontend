import { useRef } from 'react';
import { cn } from '../../utils/classNames.js';

export function OtpInput({ length = 6, value = '', onChange, error, disabled }) {
  const refs = useRef([]);

  function handleChange(i, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(length, '').split('');
    arr[i] = char;
    const next = arr.join('').slice(0, length);
    onChange(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const arr = value.padEnd(length, '').split('');
        arr[i] = '';
        onChange(arr.join(''));
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
    e.preventDefault();
  }

  return (
    <div>
      <div className="flex justify-center gap-2" role="group" aria-label="One-time password">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            className={cn(
              'h-12 w-11 rounded-md border text-center text-h4 font-semibold text-neutral-900 outline-none transition-all',
              'border-neutral-300 bg-white focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
              value[i] && !error && 'border-primary-400 bg-primary-50',
              error && 'border-error bg-error-bg focus:ring-error-bg',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-center text-caption text-error-text">{error}</p>}
    </div>
  );
}
