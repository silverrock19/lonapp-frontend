import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, BarChart2, ShieldCheck,
  Settings, Bell, Search, LogOut, Clock,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { cn } from '../../utils/classNames.js';
import { selectUser } from '../../store/slices/authSlice.js';
import { logout } from '../../store/actions/auth.js';
import { mockBusinesses } from '../../data/mockAdminData.js';

const pendingCount = mockBusinesses.filter(b => b.status === 'pending' || b.status === 'resubmission').length;
const clarifyCount = mockBusinesses.filter(b => b.status === 'awaiting_clarification').length;

const navGroups = [
  {
    label: 'Review',
    items: [
      { to: '/admin/businesses',    icon: Building2,      label: 'Business Approvals', badge: pendingCount },
      { to: '/admin/clarifications',icon: Clock,          label: 'Clarifications',     badge: clarifyCount },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin',               icon: LayoutDashboard,label: 'Overview',           end: true },
      { to: '/admin/users',         icon: Users,          label: 'Users & Accounts'              },
      { to: '/admin/analytics',     icon: BarChart2,      label: 'Analytics'                     },
      { to: '/admin/audit',         icon: ShieldCheck,    label: 'Audit Log'                     },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

function initials(name) {
  if (!name) return 'A';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AdminShell = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">

      {/* ── Sidebar ─ identical light style to AppShell ───── */}
      <aside className="flex w-56 flex-col border-r border-neutral-100 bg-white">

        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center border-b border-neutral-100 px-4">
          <img src="/logo.png" alt="LonApp" className="h-8 w-auto object-contain" />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-2 pb-2 pt-3" aria-label="Admin navigation">
          {navGroups.map(group => (
            <div key={group.label} className="mb-1">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ to, icon: Icon, label, end, badge }) => (
                  <NavLink
                    key={to} to={to} end={end}
                    className={({ isActive }) => cn(
                      'flex min-h-[40px] items-center gap-2.5 rounded-md px-3 text-small font-medium transition-colors',
                      isActive
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary-500' : 'text-neutral-400')}
                          aria-hidden="true"
                        />
                        <span className="flex-1">{label}</span>
                        {badge > 0 && (
                          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — same as AppShell */}
        <div className="shrink-0 border-t border-neutral-100 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-medium text-neutral-800">{user?.name ?? 'Admin'}</p>
              <p className="truncate text-caption text-neutral-400">Platform Admin</p>
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

      {/* ── Main area — same as AppShell ─────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <div className="flex w-64 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search…"
              className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
              aria-label="Search"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" aria-hidden="true" />
            </button>
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
};

export default AdminShell;
