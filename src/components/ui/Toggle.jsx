import { Lock } from 'lucide-react';

const SIZES = {
  sm: { track: 'h-5 w-9',   thumb: 'h-4 w-4', on: 'translate-x-4' },
  md: { track: 'h-6 w-11',  thumb: 'h-5 w-5', on: 'translate-x-5' },
  lg: { track: 'h-7 w-12',  thumb: 'h-6 w-6', on: 'translate-x-5' },
};

const Toggle = ({ checked, onChange, label, size = 'sm', locked = false }) => {
  const s = SIZES[size];
  if (locked) {
    return (
      <div
        title="Required — cannot be disabled"
        className={`relative inline-flex flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-neutral-200 ${s.track}`}
      >
        <span className={`inline-block rounded-full bg-neutral-400 shadow ${s.thumb} ${s.on}`} />
        <Lock className="absolute right-0.5 top-0.5 h-3 w-3 text-neutral-500" />
      </div>
    );
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${s.track} ${checked ? 'bg-primary-500' : 'bg-neutral-200'}`}
    >
      <span className={`pointer-events-none inline-block rounded-full bg-white shadow transition-transform ${s.thumb} ${checked ? s.on : 'translate-x-0'}`} />
    </button>
  );
};

export default Toggle;
