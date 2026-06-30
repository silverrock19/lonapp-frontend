import { useNavigate } from 'react-router-dom';
import { Bell, Shirt, ChevronRight, Navigation, RotateCcw, MapPin, CreditCard, PackageCheck, Droplets, Truck, Star } from 'lucide-react';

const ACTIVE_ORDER = {
  id: 'ORD-2024-1247',
  outlet: 'CleanPro Osu',
  readyBy: '3:00 PM today',
  step: 1, // 0=picked up, 1=washing, 2=delivery
};

const RECENT_ORDERS = [
  { id: 'ORD-2024-1198', outlet: 'CleanPro Osu',           status: 'Delivered', statusColor: '#16A34A', date: 'Dec 15', price: 'GH₵ 85.00' },
  { id: 'ORD-2024-1134', outlet: 'FreshPress Cantonments', status: 'Delivered', statusColor: '#16A34A', date: 'Dec 10', price: 'GH₵ 65.00' },
];

const QUICK_ACTIONS = [
  { label: 'Track',   icon: Navigation,  path: '/app/orders'   },
  { label: 'Reorder', icon: RotateCcw,   path: '/app/orders'   },
  { label: 'Address', icon: MapPin,       path: '/app/addresses' },
  { label: 'Pay',     icon: CreditCard,   path: '/app/payments' },
];

const PROGRESS_STEPS = [
  { label: 'Picked up', icon: PackageCheck },
  { label: 'Washing',   icon: Droplets     },
  { label: 'Delivery',  icon: Truck        },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const CustomerHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white">
        <div>
          <p className="text-[13px] text-neutral-400 font-medium">{getGreeting()},</p>
          <h1 className="text-[22px] font-bold text-neutral-900">Adwoa</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: '#F0FAFB' }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" style={{ color: '#0E9AA7' }} />
          </button>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: '#0E9AA7' }}
          >
            AM
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">

        {/* ── Primary CTA Card ─────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/app/discover')}
          className="w-full rounded-2xl p-5 flex items-center gap-4 text-left active:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #0E9AA7 0%, #0B7C87 100%)' }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <Shirt className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-white">Schedule a Pickup</p>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
              We'll collect within 30 minutes
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-white/60" />
        </button>

        {/* ── Active Order Card ─────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/app/orders')}
          className="w-full rounded-2xl bg-white border border-neutral-100 p-4 text-left active:opacity-70 transition-opacity"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[15px] font-semibold text-neutral-900">{ACTIVE_ORDER.outlet}</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">{ACTIVE_ORDER.id}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: '#0E9AA7' }}
              />
              <span className="text-[12px] font-semibold" style={{ color: '#0E9AA7' }}>In Progress</span>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="flex items-start">
            {PROGRESS_STEPS.map((step, idx) => {
              const isDone   = idx < ACTIVE_ORDER.step;
              const isActive = idx === ACTIVE_ORDER.step;
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="flex items-start flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full mb-1.5"
                      style={{ background: isDone || isActive ? '#0E9AA7' : '#F3F4F6' }}
                    >
                      <StepIcon
                        className="h-4 w-4"
                        style={{ color: isDone || isActive ? '#fff' : '#D1D5DB' }}
                      />
                    </div>
                    <p
                      className="text-[10px] font-medium text-center leading-tight"
                      style={{ color: isDone || isActive ? '#0E9AA7' : '#9CA3AF' }}
                    >
                      {step.label}
                    </p>
                  </div>
                  {idx < PROGRESS_STEPS.length - 1 && (
                    <div
                      className="h-0.5 flex-1 mt-[18px] mx-1"
                      style={{ background: idx < ACTIVE_ORDER.step ? '#0E9AA7' : '#E5E7EB' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-3 pt-3 border-t border-neutral-100 text-[12px] text-neutral-400">
            Ready by{' '}
            <span className="font-semibold text-neutral-700">{ACTIVE_ORDER.readyBy}</span>
          </p>
        </button>

        {/* ── Quick Actions ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-neutral-100 py-3.5 active:opacity-70 transition-opacity"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: '#F0FAFB' }}
              >
                <Icon className="h-5 w-5" style={{ color: '#0E9AA7' }} />
              </div>
              <span className="text-[11px] font-medium text-neutral-500">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Recent Orders ─────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[13px] font-semibold text-neutral-500">Recent Orders</p>
            <button
              onClick={() => navigate('/app/orders')}
              className="text-[13px] font-semibold"
              style={{ color: '#0E9AA7' }}
            >
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white border border-neutral-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-neutral-900 truncate">{order.outlet}</p>
                    <p className="text-[12px] text-neutral-400 mt-0.5">{order.id}</p>
                  </div>
                  <span
                    className="text-[12px] font-semibold px-3 py-1 rounded-full shrink-0"
                    style={{ background: order.statusColor + '18', color: order.statusColor }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-[13px] text-neutral-400">{order.date}</p>
                  <p className="text-[15px] font-bold text-neutral-900">{order.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: '#F0FAFB' }}
        >
          <div className="text-center">
            <p className="text-[17px] font-bold text-neutral-900">47</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Orders</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-center">
            <p className="text-[14px] font-bold text-neutral-900">GH₵ 1,240</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Spent</p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="flex items-center gap-1.5 text-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <div>
              <p className="text-[17px] font-bold" style={{ color: '#0E9AA7' }}>620</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Points</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerHomePage;
