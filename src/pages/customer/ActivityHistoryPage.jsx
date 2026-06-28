import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  LogIn,
  ShoppingBag,
  UserCheck,
  ShieldAlert,
  CreditCard,
  AlertTriangle,
  X,
} from 'lucide-react';
import { MOCK_ACTIVITIES } from '../../data/mockCustomer.js';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'login', label: 'Login' },
  { key: 'orders', label: 'Orders' },
  { key: 'payments', label: 'Payments' },
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
];

const TYPE_TO_FILTER = {
  LOGIN_SUCCESS: 'login',
  LOGIN_FAILED: 'login',
  ORDER_CREATED: 'orders',
  PAYMENT_COMPLETED: 'payments',
  PROFILE_UPDATED: 'profile',
  SECURITY_CHANGE: 'security',
};

const ICON_MAP = {
  LogIn,
  ShoppingBag,
  UserCheck,
  ShieldAlert,
  CreditCard,
};

const EXTENDED_ACTIVITIES = [
  ...MOCK_ACTIVITIES,
  {
    id: 6,
    type: 'LOGIN_FAILED',
    label: 'Suspicious login attempt',
    desc: 'Sign-in attempted from an unrecognised device',
    time: '6 days ago',
    device: 'Android · Firefox',
    location: 'Kumasi, Ghana',
    status: 'suspicious',
    icon: 'ShieldAlert',
  },
  {
    id: 7,
    type: 'SECURITY_CHANGE',
    label: 'Password changed',
    desc: 'Your account password was updated',
    time: '2 weeks ago',
    device: 'iPhone · LonApp',
    location: 'Accra, Ghana',
    status: 'success',
    icon: 'ShieldAlert',
  },
];

const statusColors = {
  success: { circle: '#0E9AA7', badge: { background: '#E8F9FA', color: '#0E9AA7' } },
  failed: { circle: '#EF4444', badge: { background: '#FEF2F2', color: '#EF4444' } },
  suspicious: { circle: '#F97316', badge: { background: '#FFF7ED', color: '#F97316' } },
};

const statusLabel = {
  success: 'Success',
  failed: 'Failed',
  suspicious: 'Suspicious',
};

const ActivityHistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = EXTENDED_ACTIVITIES.filter((a) => {
    if (activeFilter === 'all') return true;
    return TYPE_TO_FILTER[a.type] === activeFilter;
  });

  const handleSecureAccount = () => {
    setShowModal(false);
    setToast('Account secured. Check your email.');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Back header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center -ml-2">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Account Activity</h1>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pt-2 pointer-events-none">
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700 shadow-sm">
            {toast}
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex-none h-8 rounded-full px-4 text-[13px] font-medium transition-colors ${
              activeFilter === f.key
                ? 'text-white'
                : 'border border-neutral-300 bg-white text-neutral-600'
            }`}
            style={activeFilter === f.key ? { backgroundColor: '#0E9AA7' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="px-4 pt-1 space-y-2">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-[14px] text-neutral-400">No activity found.</p>
        )}
        {filtered.map((activity) => {
          const colors = statusColors[activity.status] || statusColors.success;
          const IconComponent = ICON_MAP[activity.icon] || ShieldAlert;
          const isSuspicious = activity.status === 'suspicious';

          return (
            <div
              key={activity.id}
              className="rounded-2xl bg-white p-4"
              style={
                isSuspicious
                  ? { border: '1.5px solid #FCD34D' }
                  : { border: '1px solid #E5E7EB' }
              }
            >
              {isSuspicious && (
                <div className="flex items-center gap-1 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#F97316' }} />
                  <span className="text-[12px] font-semibold" style={{ color: '#F97316' }}>
                    Suspicious activity
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Icon circle */}
                <div
                  className="flex-none flex items-center justify-center rounded-full"
                  style={{ width: 36, height: 36, backgroundColor: colors.circle }}
                >
                  <IconComponent className="text-white" style={{ width: 16, height: 16 }} />
                </div>

                {/* Middle content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-neutral-900 leading-snug">{activity.label}</p>
                  <p className="text-[13px] text-neutral-600 mt-0.5 leading-snug">{activity.desc}</p>
                  <p className="text-[13px] text-neutral-400 mt-1 leading-snug">
                    {activity.time} · {activity.location} · {activity.device}
                  </p>
                </div>

                {/* Status badge */}
                <div
                  className="flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={colors.badge}
                >
                  {statusLabel[activity.status]}
                </div>
              </div>

              {/* This wasn't me button */}
              {isSuspicious && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-3 w-full h-10 rounded-2xl border text-[13px] font-semibold transition-colors"
                  style={{ borderColor: '#F97316', color: '#F97316' }}
                >
                  This wasn't me
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0">
          <div className="w-full max-w-md rounded-t-3xl bg-white px-6 pt-6 pb-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" style={{ color: '#F97316' }} />
                <h2 className="text-[17px] font-semibold text-neutral-900">Flag Suspicious Activity</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
              >
                <X className="h-4 w-4 text-neutral-600" />
              </button>
            </div>

            <p className="text-[14px] text-neutral-600 mb-6 leading-relaxed">
              If this wasn't you, we'll secure your account immediately.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSecureAccount}
                className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Secure My Account
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full h-12 rounded-2xl border border-neutral-300 text-neutral-700 text-[15px] font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;
