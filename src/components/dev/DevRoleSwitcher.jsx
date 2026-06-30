import { useState } from 'react';
import { ChevronDown, ChevronRight, LogOut, Monitor } from 'lucide-react';
import { PERSONA_TIERS, ROLE_HOME } from '../../lib/rbac/permissions.js';

const DEV_BADGE_KEY = 'lonapp_dev_persona';

const setAuth = (persona) => {
  localStorage.setItem(
    'persist:__lonapp_auth__',
    JSON.stringify({
      isAuthenticated: 'true',
      user: JSON.stringify({ id: 'dev-user', name: persona.name, email: persona.email, role: persona.role }),
      accessToken: JSON.stringify('mock-token'),
      refreshToken: JSON.stringify('mock-refresh'),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  );
  localStorage.setItem(DEV_BADGE_KEY, JSON.stringify({ role: persona.role, name: persona.name, org: persona.org }));
  window.location.href = ROLE_HOME[persona.role] ?? '/';
}

function clearSession() {
  localStorage.removeItem('persist:__lonapp_auth__');
  localStorage.removeItem(DEV_BADGE_KEY);
  window.location.href = '/login';
}

const DevRoleSwitcher = () => {
  const [open, setOpen] = useState(false);

  const badge = (() => {
    try { return JSON.parse(localStorage.getItem(DEV_BADGE_KEY)); } catch { return null; }
  })();

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
    }}>

      {/* ── Panel ─────────────────────────────────────────── */}
      {open && (
        <div style={{
          marginBottom: 10,
          width: 272,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Monitor size={12} color="#9CA3AF" />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                View As — Persona Switcher
              </span>
            </div>
            {badge && (
              <div style={{ marginTop: 4, fontSize: 11, color: '#6B7280' }}>
                Currently: <strong style={{ color: '#111827' }}>{badge.name}</strong>
                {badge.org && <span style={{ color: '#9CA3AF' }}> · {badge.org}</span>}
              </div>
            )}
          </div>

          {/* Tier groups — scrollable */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '6px 8px 4px' }}>
            {PERSONA_TIERS.map(({ tier, personas }) => (
              <div key={tier} style={{ marginBottom: 6 }}>
                {/* Tier label */}
                <div style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#D1D5DB',
                  padding: '4px 10px 2px',
                }}>
                  {tier}
                </div>

                {/* Persona cards */}
                {personas.map(persona => (
                  <button
                    key={persona.role}
                    onClick={() => setAuth(persona)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 9,
                      border: 'none',
                      background: badge?.role === persona.role ? persona.bgColor : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (badge?.role !== persona.role) e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { if (badge?.role !== persona.role) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 34, height: 34,
                      borderRadius: 9,
                      flexShrink: 0,
                      background: persona.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: badge?.role === persona.role ? `2px solid ${persona.accentColor}` : '2px solid transparent',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: persona.accentColor }}>{persona.initials}</span>
                    </div>

                    {/* Text */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{persona.name}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {persona.org}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={14} color="#D1D5DB" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '4px 8px 8px', borderTop: '1px solid #F3F4F6', flexShrink: 0 }}>
            <button
              onClick={clearSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={13} color="#EF4444" />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#EF4444' }}>Clear session → Login</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger pill ──────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 32,
          padding: '0 14px',
          background: open ? '#1F2937' : '#111827',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          transition: 'background 0.15s',
          marginLeft: 'auto',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>
          {badge ? badge.role.replace(/_/g, ' ').toUpperCase() : 'DEV'}
        </span>
        <ChevronDown
          size={13}
          color="#6B7280"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );
};

export default DevRoleSwitcher;
