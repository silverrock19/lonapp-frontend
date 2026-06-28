import { useRef, useState } from 'react';
import { cn } from '../../utils/classNames.js';

const OtpInput = ({ length = 6, value = '', onChange, error }) => {
  const inputs = useRef([]);
  const cells = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (e, i) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = cells.map((c, idx) => (idx === i ? char : c)).join('');
    onChange(next);
    if (char && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !cells[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-2" onPaste={handlePaste}>
        {cells.map((char, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              'h-12 w-12 rounded-md border text-center text-h4 font-semibold text-neutral-800 outline-none transition-shadow',
              'border-neutral-300 focus:border-primary-500 focus:ring-[3px] focus:ring-primary-100',
              error && 'border-error focus:border-error focus:ring-error-bg'
            )}
          />
        ))}
      </div>
      {error && <p className="mt-1.5 text-caption text-error-text">{error}</p>}
    </div>
  );
};

export default OtpInput;
