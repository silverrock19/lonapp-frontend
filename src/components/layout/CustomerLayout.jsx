import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { House, ClipboardList, Heart, User } from 'lucide-react';
import { resetAuth } from '../../store/slices/authSlice.js';

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
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Bottom Tab Bar — constrained to 430px on desktop */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex h-16 items-center justify-around border-t border-neutral-100 bg-white z-40"
        aria-label="Customer navigation"
      >
        {TABS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 min-w-0 px-3 py-1"
              style={{ color: active ? '#0E9AA7' : '#9CA3AF' }}
            >
              <Icon size={22} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;
