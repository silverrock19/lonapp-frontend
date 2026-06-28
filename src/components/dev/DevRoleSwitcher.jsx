import { useState } from 'react';

const ROLES = [
  {
    label: 'Business Owner',
    sublabel: 'Sparkle Laundry Ltd',
    role: 'admin',
    name: 'Ama Kufuor',
    email: 'owner@sparkle.com',
    to: '/',
    initials: 'AK',
    accent: '#0C5FC5',
    bg: '#EBF2FD',
    dot: '#0C5FC5',
  },
  {
    label: 'Platform Admin',
    sublabel: 'LonApp HQ',
    role: 'super_admin',
    name: 'Platform Admin',
    email: 'admin@lonapp.com',
    to: '/admin/businesses',
    initials: 'PA',
    accent: '#7C3AED',
    bg: '#F3F0FF',
    dot: '#7C3AED',
  },
];

function setAuth(r) {
  localStorage.setItem(
    'persist:__lonapp_auth__',
    JSON.stringify({
      isAuthenticated: 'true',
      user: JSON.stringify({ id: 'dev-user', name: r.name, email: r.email, role: r.role }),
      accessToken: JSON.stringify('mock-token'),
      refreshToken: JSON.stringify('mock-refresh'),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  );
  window.location.href = r.to;
}

export default function DevRoleSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
    >
      {/* Panel */}
      {open && (
        <div style={{
          marginBottom: 10,
          width: 248,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                Dev — Switch Role
              </span>
            </div>
          </div>

          {/* Role cards */}
          <div style={{ padding: '8px 8px 4px' }}>
            {ROLES.map(r => (
              <button
                key={r.role}
                onClick={() => setAuth(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 10px',
                  borderRadius: 9, border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.accent }}>{r.initials}</span>
                </div>

                {/* Text */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.email}
                  </div>
                </div>

                {/* Arrow */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: '#D1D5DB' }}>
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '4px 8px 8px', borderTop: '1px solid #F3F4F6', marginTop: 2 }}>
            <button
              onClick={() => { localStorage.removeItem('persist:__lonapp_auth__'); window.location.href = '/login'; }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                width: '100%', padding: '7px 10px',
                borderRadius: 7, border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M5 2H2.5A1 1 0 001.5 3v7a1 1 0 001 1H5M9 9.5l3-3-3-3M12 6.5H5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#EF4444' }}>Clear session → Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Trigger pill */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 14px',
          background: open ? '#1F2937' : '#111827',
          borderRadius: 999, border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          transition: 'background 0.15s',
          marginLeft: 'auto',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>DEV</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ color: '#6B7280', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
