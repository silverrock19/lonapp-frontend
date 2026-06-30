import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Layers } from 'lucide-react';

// Mock staff credentials for demo
const MOCK_STAFF = [
  { id: 'staff-001', email: 'frontdesk@mojolfe.com', phone: '0244000001', password: 'desk1234', name: 'Abena Owusu',  role: 'front_desk' },
  { id: 'staff-002', email: 'manager@mojolfe.com',   phone: '0244000002', password: 'mgr1234',  name: 'Kwame Asante', role: 'manager'    },
  { id: 'staff-003', email: 'owner@mojolfe.com',     phone: '0244000003', password: 'own1234',  name: 'Mojo Owner',   role: 'owner'      },
];

export default function POSLoginPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const staff = MOCK_STAFF.find(
      s => (s.email === identifier.toLowerCase() || s.phone === identifier) && s.password === password
    );

    if (!staff) {
      setError('Invalid email/phone or password.');
      setLoading(false);
      return;
    }

    // Dispatch login action (reuse existing authSlice pattern)
    dispatch({
      type: 'auth/setUser',
      payload: {
        id:    staff.id,
        name:  staff.name,
        role:  staff.role,
        email: staff.email,
      },
    });

    setLoading(false);

    // Role-based routing: front_desk → /pos, manager/owner → /pos (POS entry)
    if (staff.role === 'front_desk' || staff.role === 'manager' || staff.role === 'owner') {
      navigate('/pos', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6">
      {/* Logo area */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500">
          <Layers className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <p className="text-h4 font-bold text-white">Mojo POS</p>
          <p className="text-caption text-neutral-400">Staff sign-in</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-caption text-neutral-400 mb-1.5">Email or phone number</label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="staff@mojolfe.com"
            autoFocus
            required
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-small text-white placeholder:text-neutral-500 outline-none focus:border-accent-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-caption text-neutral-400 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 pr-11 text-small text-white placeholder:text-neutral-500 outline-none focus:border-accent-400 transition-colors"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-900/40 border border-red-700/40 px-4 py-2.5 text-caption text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !identifier || !password}
          className="w-full rounded-xl bg-accent-500 py-3.5 text-small font-bold text-white disabled:opacity-40 hover:bg-accent-600 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in to POS'}
        </button>

        <p className="text-center text-caption text-neutral-500">
          No social login · Staff accounts only
        </p>
      </form>

      {/* Demo hint */}
      <div className="mt-8 w-full max-w-sm rounded-xl bg-neutral-800/50 border border-neutral-700/50 px-4 py-3 text-caption text-neutral-400">
        <p className="font-semibold text-neutral-300 mb-1">Demo accounts</p>
        <p>Front desk: frontdesk@mojolfe.com · desk1234</p>
        <p>Manager: manager@mojolfe.com · mgr1234</p>
      </div>
    </div>
  );
}
