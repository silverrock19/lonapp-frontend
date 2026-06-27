import { Outlet, NavLink } from 'react-router-dom';
import { Home, ClipboardList, Store, Users, Wallet, Building2, Settings, Bell } from 'lucide-react';
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

export default function AppShell() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col bg-neutral-900 text-neutral-400">
        <div className="flex h-14 items-center px-4 border-b border-neutral-800">
          <span className="text-h4 font-bold text-white tracking-tight">LonApp</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main navigation">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn('flex items-center gap-3 rounded-md px-3 py-2 text-small font-medium transition-colors',
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-neutral-800 hover:text-neutral-200'
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <div />
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-small font-medium text-neutral-700">{user?.name ?? 'User'}</span>
            </div>
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
