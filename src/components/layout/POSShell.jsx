import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ShoppingCart, Package, CreditCard, Printer, ClipboardList,
  LogOut, MonitorCheck, Lock,
} from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { selectUser } from '../../store/slices/authSlice.js';
import { logout } from '../../store/actions/auth.js';
import { getPOSSession } from '../../lib/mock/posData.js';

const NAV_ITEMS = [
  { to: '/pos/order/new', icon: ShoppingCart,  label: 'New Order',       shortcut: 'N' },
  { to: '/pos/intake',    icon: Package,        label: 'Item Intake',     shortcut: 'I' },
  { to: '/pos/payment',   icon: CreditCard,     label: 'Take Payment',    shortcut: 'P' },
  { to: '/pos/orders',    icon: ClipboardList,  label: "Today's Orders",  shortcut: 'T' },
  { to: '/pos/receipt',   icon: Printer,        label: 'Reprint',         shortcut: 'R' },
];

function useLiveClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' }));
    }, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function initials(name) {
  if (!name) return 'FD';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function POSShell() {
  const user     = useSelector(selectUser);
  const navigate = useNavigate();
  const clock    = useLiveClock();

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const session = getPOSSession();
      const orderId = session.orderId;
      switch (e.key.toUpperCase()) {
        case 'N': navigate('/pos/order/new'); break;
        case 'T': navigate('/pos/orders');    break;
        case 'R': navigate('/pos/receipt');   break;
        case 'L': navigate('/pos/lock');      break;
        case 'I': if (orderId) navigate(`/pos/order/${orderId}/intake`); break;
        case 'P': if (orderId) navigate(`/pos/order/${orderId}/payment`); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-50 overflow-hidden">

      {/* ── Top bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5 shadow-md z-20">
        {/* Left: logo + outlet */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <MonitorCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-small font-bold text-neutral-900 leading-tight">POS Counter</p>
            <p className="text-caption text-neutral-400 leading-tight">CleanPro Osu</p>
          </div>
        </div>

        {/* Right: clock + staff + exit */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-body font-mono font-semibold text-neutral-600 tabular-nums">{clock}</span>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700">
              {initials(user?.name)}
            </div>
            <div className="hidden md:block">
              <p className="text-small font-medium text-neutral-800 leading-tight">{user?.name ?? 'Front Desk'}</p>
              <p className="text-caption text-neutral-400 leading-tight">Front Desk Staff</p>
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-200" />

          <button
            onClick={() => navigate('/pos/lock')}
            className="flex items-center gap-1.5 text-caption font-medium text-neutral-500 hover:text-warning-text transition-colors"
            title="Lock terminal between customers (L)"
          >
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <div className="h-5 w-px bg-neutral-200" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-caption font-medium text-neutral-500 hover:text-error transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* ── Nav tabs ── */}
      <nav className="flex shrink-0 border-b border-neutral-200 bg-white z-10">
        {NAV_ITEMS.map(({ to, icon: Icon, label, shortcut }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 border-b-2 transition-all duration-150 text-center min-h-[52px]',
                isActive
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50',
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={cn('h-4 w-4', isActive ? 'text-primary-500' : 'text-neutral-400')} />
                  <span className={cn(
                    'absolute -top-1.5 -right-2.5 text-[9px] font-bold leading-none px-0.5 rounded',
                    isActive ? 'text-primary-500' : 'text-neutral-400',
                  )}>
                    {shortcut}
                  </span>
                </div>
                <span className={cn('text-[11px] font-medium leading-tight', isActive ? 'text-primary-600' : 'text-neutral-500')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
