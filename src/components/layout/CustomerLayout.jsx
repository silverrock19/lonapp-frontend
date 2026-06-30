import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { House, ClipboardList, Heart, User } from 'lucide-react';
import InstallBanner from '../customer/InstallBanner.jsx';

const TABS = [
  { label: 'Home',    icon: House,          path: '/app'           },
  { label: 'Orders',  icon: ClipboardList,  path: '/app/orders'    },
  { label: 'Saved',   icon: Heart,          path: '/app/favorites' },
  { label: 'Profile', icon: User,           path: '/app/profile'   },
];

const CustomerLayout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path) =>
    path === '/app' ? location.pathname === '/app' : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#FAFAF8' }}>
      {/* Install-to-home-screen banner — only visible when browser offers install */}
      <InstallBanner />

      {/* Page content — padded to clear the bottom tab bar + device notch */}
      <main
        className="flex-1"
        style={{ paddingBottom: 'calc(68px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Outlet />
      </main>

      {/* Bottom Tab Bar — extends into the safe-area zone on notched devices */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-start justify-around border-t border-neutral-100 bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(15,20,27,.07)] z-40"
        style={{
          height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Customer navigation"
      >
        {TABS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-col items-center gap-0.5 min-h-[44px] min-w-[64px] px-2 pt-1.5 rounded-xl transition-all duration-150 hover:bg-neutral-50 active:scale-[0.93] active:bg-neutral-100"
              style={{ color: active ? '#0E9AA7' : '#9CA3AF' }}
            >
              {/* Active pip */}
              {active && (
                <span
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-accent-500 animate-scale-in"
                  aria-hidden="true"
                />
              )}
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[11px] transition-all duration-150 ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;
