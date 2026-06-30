import { useState, useRef, useEffect, useCallback } from 'react';
import { Scan, Camera, Keyboard, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const BARCODE_RE = /^LA-\d{8}-\d{6}$/;
const WEDGE_TIMEOUT_MS = 80; // chars typed faster than this = scanner wedge

// ── Mode: keyboard-wedge ─────────────────────────────────────────────────────

function WedgeMode({ onScan, placeholder }) {
  const [value, setValue] = useState('');
  const [state, setState] = useState('idle'); // idle | success | error
  const [errMsg, setErrMsg] = useState('');
  const lastCharTime = useRef(0);
  const wedgeBuffer = useRef('');
  const wedgeTimer = useRef(null);

  function commitScan(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!BARCODE_RE.test(trimmed)) {
      setState('error');
      setErrMsg(`Invalid format. Expected LA-XXXXXXXX-XXXXXX`);
      setTimeout(() => setState('idle'), 2500);
      return;
    }
    setState('success');
    onScan?.(trimmed);
    setValue('');
    setTimeout(() => setState('idle'), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitScan(value);
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
    setState('idle');
  }

  return (
    <div className="space-y-2">
      <div className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all',
        state === 'success' ? 'border-success bg-success/5 ring-2 ring-success/20'
          : state === 'error'   ? 'border-error bg-error/5 ring-2 ring-error/20'
          : 'border-neutral-200 bg-white focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100',
      )}>
        <Scan className={cn('h-4 w-4 flex-shrink-0',
          state === 'success' ? 'text-success' : state === 'error' ? 'text-error' : 'text-neutral-400'
        )} />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Scan barcode or type and press Enter…'}
          className="flex-1 bg-transparent text-small text-neutral-800 outline-none placeholder:text-neutral-400 font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        {state === 'success' && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" />}
        {state === 'error'   && <XCircle      className="h-4 w-4 flex-shrink-0 text-error" />}
      </div>
      {state === 'error' && (
        <p className="text-caption text-error">{errMsg}</p>
      )}
      {state === 'success' && (
        <p className="text-caption text-success font-medium">Barcode scanned successfully</p>
      )}
    </div>
  );
}

// ── Mode: camera mock ────────────────────────────────────────────────────────

function CameraMode({ onScan, mockBarcode }) {
  const [phase, setPhase] = useState('scanning'); // scanning | found | done
  const [foundCode, setFoundCode] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      const code = mockBarcode ?? 'LA-10000002-000001';
      setFoundCode(code);
      setPhase('found');
      const t2 = setTimeout(() => {
        setPhase('done');
        onScan?.(code);
      }, 900);
      return () => clearTimeout(t2);
    }, 2200);
    return () => clearTimeout(t1);
  }, [onScan, mockBarcode]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-48 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-neutral-900">
        {/* Corner brackets */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div
            key={i}
            className={cn('absolute h-6 w-6 border-2 border-white/70', pos,
              i === 0 ? 'border-r-0 border-b-0 rounded-tl' :
              i === 1 ? 'border-l-0 border-b-0 rounded-tr' :
              i === 2 ? 'border-r-0 border-t-0 rounded-bl' :
                        'border-l-0 border-t-0 rounded-br'
            )}
          />
        ))}
        {phase === 'scanning' && (
          <>
            {/* Scan line */}
            <div className="absolute left-4 right-4 h-0.5 bg-accent-400/80 shadow-[0_0_8px_2px_rgba(14,154,167,0.6)] animate-[scanline_1.5s_ease-in-out_infinite]" />
            <p className="text-caption text-white/60">Scanning…</p>
          </>
        )}
        {phase === 'found' && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-10 w-10 text-success animate-[bounce_0.4s_ease-out]" />
            <p className="font-mono text-[11px] text-white/90">{foundCode}</p>
          </div>
        )}
        {phase === 'done' && (
          <p className="text-caption text-success font-medium">Captured</p>
        )}
      </div>
      <p className="text-caption text-neutral-500">Point camera at barcode</p>
    </div>
  );
}

// ── Public component ─────────────────────────────────────────────────────────

export default function ScannerInput({
  onScan,
  placeholder,
  label,
  defaultMode = 'wedge',
  mockCameraBarcode,
  className,
}) {
  const [mode, setMode] = useState(defaultMode);

  const modes = [
    { id: 'wedge',  icon: Keyboard, label: 'Manual / Wedge' },
    { id: 'camera', icon: Camera,   label: 'Camera'         },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-small font-medium text-neutral-700">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5 w-fit">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-caption font-medium transition-all',
              mode === m.id
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'wedge'  && <WedgeMode  onScan={onScan} placeholder={placeholder} />}
      {mode === 'camera' && <CameraMode onScan={onScan} mockBarcode={mockCameraBarcode} />}
    </div>
  );
}
