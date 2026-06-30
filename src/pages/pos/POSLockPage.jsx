import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice.js';
import { Lock, Delete } from 'lucide-react';

// Mock PIN lookup (real app would have per-staff PINs)
const STAFF_PINS = {
  'staff-001': '1234',
  'staff-002': '5678',
  'staff-003': '9999',
};

// Quick-switch staff list (shared terminal)
const QUICK_SWITCH_STAFF = [
  { id: 'staff-001', name: 'Abena Owusu',  initials: 'AO', pin: '1234', role: 'front_desk' },
  { id: 'staff-002', name: 'Kwame Asante', initials: 'KA', pin: '5678', role: 'manager'    },
  { id: 'staff-003', name: 'Mojo Owner',   initials: 'MO', pin: '9999', role: 'owner'      },
];

export default function POSLockPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector(selectUser);

  const [mode,       setMode]       = useState('locked'); // 'locked' | 'switch'
  const [activeStaff, setActiveStaff] = useState(null);
  const [pin,        setPin]        = useState('');
  const [error,      setError]      = useState('');
  const [shake,      setShake]      = useState(false);

  const MAX_PIN = 4;
  const target  = activeStaff ?? (user ? QUICK_SWITCH_STAFF.find(s => s.id === user.id) : null);

  function appendDigit(d) {
    if (pin.length >= MAX_PIN) return;
    const next = pin + d;
    setPin(next);
    setError('');

    if (next.length === MAX_PIN) {
      setTimeout(() => verifyPin(next), 80);
    }
  }

  function verifyPin(entered) {
    if (!target) return;
    if (entered === target.pin) {
      dispatch({ type: 'auth/setUser', payload: { id: target.id, name: target.name, role: target.role } });
      navigate('/pos', { replace: true });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin('');
      setError('Incorrect PIN. Try again.');
    }
  }

  function selectStaff(staff) {
    setActiveStaff(staff);
    setPin('');
    setError('');
    setMode('locked');
  }

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6 select-none">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 mx-auto mb-4">
          <Lock className="h-6 w-6 text-neutral-400" />
        </div>
        {mode === 'locked' && target ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-white font-bold text-body mx-auto mb-2">
              {target.name.split(' ').map(w => w[0]).join('')}
            </div>
            <p className="text-h4 font-bold text-white">{target.name}</p>
            <p className="text-caption text-neutral-400 mt-0.5">Enter your 4-digit PIN</p>
          </>
        ) : (
          <>
            <p className="text-h4 font-bold text-white">Terminal Locked</p>
            <p className="text-caption text-neutral-400 mt-0.5">Select your account to continue</p>
          </>
        )}
      </div>

      {/* Quick-switch picker */}
      {mode === 'switch' && (
        <div className="w-full max-w-xs mb-6 space-y-2">
          {QUICK_SWITCH_STAFF.map(staff => (
            <button key={staff.id} onClick={() => selectStaff(staff)} className="w-full flex items-center gap-3 rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-3 text-left hover:bg-neutral-700 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white text-small font-bold">
                {staff.initials}
              </div>
              <div>
                <p className="text-small font-semibold text-white">{staff.name}</p>
                <p className="text-caption text-neutral-400 capitalize">{staff.role.replace('_', ' ')}</p>
              </div>
            </button>
          ))}
          <button onClick={() => { setMode('locked'); setActiveStaff(null); }} className="w-full text-caption text-neutral-500 py-2">Cancel</button>
        </div>
      )}

      {/* PIN dots */}
      {mode === 'locked' && target && (
        <>
          <div className={`flex gap-3 mb-6 transition-transform ${shake ? 'translate-x-2 duration-75' : ''}`}>
            {Array.from({ length: MAX_PIN }).map((_, i) => (
              <div key={i} className={`h-3.5 w-3.5 rounded-full transition-all ${i < pin.length ? 'bg-accent-500 scale-110' : 'bg-neutral-600'}`} />
            ))}
          </div>

          {error && <p className="text-caption text-red-400 mb-4">{error}</p>}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6">
            {DIGITS.map((d, i) => {
              if (d === null) return <div key={i} />;
              return (
                <button
                  key={i}
                  onClick={() => d === 'del' ? setPin(p => p.slice(0, -1)) : appendDigit(String(d))}
                  className={`flex h-16 items-center justify-center rounded-xl text-body font-bold transition-all active:scale-95 ${d === 'del' ? 'bg-neutral-700 text-neutral-400' : 'bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700'}`}
                >
                  {d === 'del' ? <Delete className="h-5 w-5" /> : d}
                </button>
              );
            })}
          </div>

          {/* Switch user */}
          <button onClick={() => { setMode('switch'); setPin(''); }} className="text-caption text-accent-400 font-semibold hover:text-accent-300 mb-3">
            Switch staff account
          </button>
        </>
      )}

      <button onClick={() => navigate('/pos/login')} className="text-caption text-neutral-600 hover:text-neutral-500">
        Sign in with password
      </button>
    </div>
  );
}
