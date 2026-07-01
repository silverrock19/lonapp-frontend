import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Store, Users, Tag, Wallet,
  Building2, Settings, Bell, Search, LogOut, UserCircle2, BookUser, MonitorCheck, ExternalLink, QrCode, PackageSearch, Activity, ShieldAlert, PackageCheck, Headphones, BarChart3, Package,
  FlaskConical, Zap, Shield, BookOpen,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { cn } from '../../utils/classNames.js';
import { useLogo } from '../../context/LogoContext.jsx';
import { selectUser } from '../../store/slices/authSlice.js';
import { logout } from '../../store/actions/auth.js';
import { getAccessLevel, canView, ROLE_LABELS } from '../../lib/rbac/permissions.js';

// Nav item shape: { to, icon, label, feature, end? }
// `feature` is checked against the active role's permission map.
// Items with feature='*' are always shown (dashboard, profile, etc.)
const ALL_NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { to: '/',        icon: LayoutDashboard, label: 'Dashboard',          feature: '*',          end: true },
      { to: '/orders',  icon: ClipboardList,   label: 'Orders',             feature: 'orders'                },
      { to: '/outlets', icon: Store,           label: 'Outlets & Factories', feature: 'outlets'              },
    ],
  },
  {
    label: 'Factory',
    items: [
      { to: '/tagging',    icon: QrCode,        label: 'Tagging & ID',  feature: 'item_tracking' },
      { to: '/intake',     icon: PackageSearch, label: 'Item Intake',   feature: 'item_tracking' },
      { to: '/tracking',   icon: Activity,      label: 'Tracking',      feature: 'item_tracking' },
      { to: '/exceptions', icon: ShieldAlert,   label: 'Exceptions',    feature: 'item_tracking' },
      { to: '/items',      icon: Search,        label: 'Item Search',   feature: 'item_tracking' },
      { to: '/delivery',   icon: PackageCheck,  label: 'Delivery',      feature: 'delivery'      },
    ],
  },
  {
    label: 'Production',
    items: [
      { to: '/production',             icon: Activity,      label: 'Production',  feature: 'item_tracking' },
      { to: '/production/machines',    icon: Settings,      label: 'Machines',    feature: 'item_tracking' },
      { to: '/production/chemicals',   icon: FlaskConical,  label: 'Chemicals',   feature: 'item_tracking' },
      { to: '/production/energy',      icon: Zap,           label: 'Energy',      feature: 'item_tracking' },
      { to: '/production/environment', icon: Shield,        label: 'Compliance',  feature: 'item_tracking' },
      { to: '/production/sops',        icon: BookOpen,      label: 'SOPs',        feature: 'item_tracking' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/customers', icon: BookUser,    label: 'Customers',           feature: 'customers' },
      { to: '/staff',     icon: Users,       label: 'Staff & Roles',       feature: 'staff'     },
      { to: '/services',  icon: Tag,         label: 'Services & Pricing',  feature: 'pricing'   },
      { to: '/payments',  icon: Wallet,      label: 'Payments',            feature: 'payments'  },
      { to: '/reports',   icon: BarChart3,   label: 'Reports',             feature: 'reports'   },
      { to: '/support',   icon: Headphones,  label: 'Support',             feature: 'support'   },
      { to: '/inventory', icon: Package,     label: 'Inventory',           feature: 'inventory' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/business', icon: Building2,   label: 'Business Profile', feature: 'business_profile' },
      { to: '/settings', icon: Settings,    label: 'Settings',         feature: 'settings'         },
      { to: '/profile',  icon: UserCircle2, label: 'My Profile',       feature: '*'                },
    ],
  },
];

const getNavGroups = (role) => {
  return ALL_NAV_GROUPS
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (item.feature === '*') return true;
        return canView(getAccessLevel(role, item.feature));
      }),
    }))
    .filter(group => group.items.length > 0);
}

const initials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AppShell = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { logoUrl } = useLogo();
  const navGroups = getNavGroups(user?.role);
  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? 'Staff';

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="flex w-56 flex-col border-r border-neutral-100 bg-white shadow-md z-10">

        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center border-b border-neutral-100 px-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Business logo" className="h-8 w-auto max-w-[120px] object-contain" />
          ) : (
            <img src="/logo.png" alt="LonApp" className="h-8 w-auto object-contain" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-2 pb-2 pt-3" aria-label="Main navigation">
          {navGroups.map(group => (
            <div key={group.label} className="mb-1">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[40px] items-center gap-2.5 rounded-lg px-3 text-small font-medium transition-all duration-150',
                        isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn('h-4 w-4 flex-shrink-0 transition-colors duration-150', isActive ? 'text-primary-500' : 'text-neutral-400 group-hover:text-neutral-600')}
                          aria-hidden="true"
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Switch to POS — only shown for roles that use the POS */}
        {canView(getAccessLevel(user?.role, 'orders')) && (
          <div className="shrink-0 px-2 pb-2">
            <button
              onClick={() => navigate('/pos')}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 transition-colors group"
            >
              <MonitorCheck className="h-4 w-4 flex-shrink-0 text-primary-500" />
              <span className="flex-1 text-left text-small font-semibold">Switch to POS</span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 border-t border-neutral-100 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-medium text-neutral-800">{user?.name ?? 'User'}</p>
              <p className="truncate text-caption text-neutral-400">{roleLabel}</p>
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

      {/* ── Main area ────────────────────────────────────── */}
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
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-all duration-150"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" aria-hidden="true" />
            </button>
            <button
              aria-label="My profile"
              onClick={() => navigate('/profile')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 hover:ring-2 hover:ring-primary-200 transition-all duration-150"
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

export default AppShell;
