import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MOCK_DUPLICATE } from '../../data/mockStaff.js';

const isValidGhanaPhone = val => /^0\d{9}$/.test(val.replace(/\s/g, ''));

const DuplicateCheckBanner = ({ phone }) => {
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isValidGhanaPhone(phone)) { setStatus('idle'); return; }
    setStatus('checking');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus(phone.replace(/\s/g, '') === MOCK_DUPLICATE.phone ? 'match' : 'clear');
    }, 1200);
    return () => clearTimeout(timerRef.current);
  }, [phone]);

  if (status === 'idle') return null;

  if (status === 'checking') return (
    <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      <p className="text-small text-neutral-500">Checking for existing account…</p>
    </div>
  );

  if (status === 'clear') return (
    <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
      <p className="text-small font-medium text-green-700">No existing account found. Proceed to register.</p>
    </div>
  );

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="text-small font-semibold text-amber-800">
            Customer with this phone may already exist: {MOCK_DUPLICATE.name}
          </p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-caption font-semibold text-amber-700 transition-colors hover:bg-amber-50">
              View profile
            </button>
            <button type="button" className="rounded-md border border-transparent px-3 py-1.5 text-caption font-semibold text-amber-600 transition-colors hover:bg-amber-100">
              Continue anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateCheckBanner;
