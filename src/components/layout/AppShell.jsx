import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, ClipboardList, Store, Users, Wallet, Building2,
  Settings, Bell, Search, LogOut, User,
} from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/',         icon: Home,          label: 'Dashboard' },
  { to: '/orders',   icon: ClipboardList, label: 'Orders' },
  { to: '/outlets',  icon: Store,         label: 'Outlets' },
  { to: '/staff',    icon: Users,         label: 'Staff' },
  { to: '/payments', icon: Wallet,        label: 'Payments' },
  { to: '/business', icon: Building2,     label: 'Business' },
  { to: '/settings', icon: Settings,      label: 'Settings' },
];

function initials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* ── Light Sidebar ─────────────────────────────────── */}
      <aside className="flex w-56 flex-col border-r border-neutral-100 bg-white">

        {/* Logo */}
        <div className="flex h-14 items-center gap-2 px-4 border-b border-neutral-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-500">
            <span className="text-caption font-bold text-white">L</span>
          </div>
          <span className="text-h4 font-bold tracking-tight text-primary-600">LonApp</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main navigation">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[44px] items-center gap-3 rounded-md px-3 text-small font-medium transition-colors',
                  isActive
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary-500' : 'text-neutral-400')}
                    aria-hidden="true"
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-100 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-medium text-neutral-800">{user?.name ?? 'User'}</p>
              <p className="truncate text-caption text-neutral-400">{user?.role ?? 'Staff'}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-small text-neutral-400 w-64 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search…"
              className="flex-1 bg-transparent outline-none text-neutral-700 placeholder:text-neutral-400"
              aria-label="Search"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Bell with error dot */}
            <button
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" aria-hidden="true" />
            </button>

            {/* Avatar */}
            <button
              aria-label="Account"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 hover:ring-2 hover:ring-primary-200 transition-all"
            >
              {initials(user?.name)}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
