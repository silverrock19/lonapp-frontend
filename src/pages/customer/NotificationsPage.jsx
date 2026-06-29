import { useState } from 'react';
import {
  Bell, Mail, MessageSquare, Smartphone, Lock,
  ShoppingBag, Star, Tag, Shield, Info,
} from 'lucide-react';
import CustomerSettingsLayout, { SettingsSection } from '../../components/layout/CustomerSettingsLayout.jsx';

// ── Channels ──────────────────────────────────────────────────────────────────
const CHANNELS = [
  { key: 'email',    icon: Mail,          label: 'Email'    },
  { key: 'sms',      icon: MessageSquare, label: 'SMS'      },
  { key: 'whatsapp', icon: MessageSquare, label: 'WA'       },
  { key: 'push',     icon: Smartphone,    label: 'Push'     },
];

// ── Notification categories (per US-0046) ─────────────────────────────────────
const CATEGORIES = [
  {
    key: 'order',
    icon: ShoppingBag,
    label: 'Order updates',
    sub: 'Status changes, pickup reminders, delivery',
    locked: [],
    defaults: { email: true, sms: true, whatsapp: false, push: true },
  },
  {
    key: 'promotions',
    icon: Tag,
    label: 'Promotions & offers',
    sub: 'Discounts, flash sales, seasonal deals',
    locked: [],
    defaults: { email: true, sms: false, whatsapp: false, push: true },
  },
  {
    key: 'loyalty',
    icon: Star,
    label: 'Loyalty & rewards',
    sub: 'Points earned, tier upgrades, reward expiry',
    locked: [],
    defaults: { email: true, sms: false, whatsapp: false, push: true },
  },
  {
    key: 'security',
    icon: Shield,
    label: 'Security alerts',
    sub: 'Sign-ins, password changes, suspicious activity',
    locked: ['email', 'sms'],
    defaults: { email: true, sms: true, whatsapp: false, push: true },
  },
  {
    key: 'account',
    icon: Info,
    label: 'Account notices',
    sub: 'Profile updates, policy changes, receipts',
    locked: ['email'],
    defaults: { email: true, sms: false, whatsapp: false, push: false },
  },
];

function buildDefaults() {
  const p = {};
  CATEGORIES.forEach(c => { p[c.key] = { ...c.defaults }; });
  return p;
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ on, onChange, locked }) {
  if (locked) {
    return (
      <div
        title="Required — cannot be disabled"
        className="relative inline-flex h-6 w-11 cursor-not-allowed rounded-full border-2 border-transparent bg-neutral-200"
      >
        <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-neutral-400 shadow" />
        <Lock className="absolute right-0.5 top-0.5 h-3 w-3 text-neutral-500" />
      </div>
    );
  }
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${on ? 'bg-[#0E9AA7]' : 'bg-neutral-300'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

const NAV_SECTIONS = [
  { id: 'global', icon: Bell,   label: 'Master toggle' },
  { id: 'matrix', icon: Mail,   label: 'By category'   },
  { id: 'quiet',  icon: Shield, label: 'Quiet hours'   },
];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [globalOn, setGlobalOn] = useState(true);
  const [prefs, setPrefs]       = useState(buildDefaults);
  const [savedPrefs, setSaved]  = useState(null);
  const [quietHours, setQuietHours] = useState({ enabled: true, from: '22:00', to: '07:00' });
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  const isDirty = savedPrefs !== null
    ? JSON.stringify(prefs) !== JSON.stringify(savedPrefs)
    : false;

  function toggle(cat, channel) {
    setPrefs(p => ({ ...p, [cat]: { ...p[cat], [channel]: !p[cat][channel] } }));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setSaved(JSON.parse(JSON.stringify(prefs)));
      showToast('Notification preferences saved');
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    if (savedPrefs) setPrefs(JSON.parse(JSON.stringify(savedPrefs)));
  }

  return (
    <CustomerSettingsLayout
      title="Notifications"
      sections={NAV_SECTIONS}
      dirty={isDirty}
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
    >
      {toast && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">
          {toast}
        </div>
      )}

      {/* ── Master toggle ─────────────────────────────────────────────────── */}
      <SettingsSection id="global" icon={Bell} title="Master toggle" helper="Pause all non-essential notifications at once">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-neutral-900">All notifications</p>
            <p className="text-[13px] text-neutral-400 mt-0.5">
              {globalOn ? 'Notifications are active' : 'All non-essential notifications are paused'}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={globalOn}
            onClick={() => setGlobalOn(v => !v)}
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors ${globalOn ? 'bg-[#0E9AA7]' : 'bg-neutral-300'}`}
          >
            <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${globalOn ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        {!globalOn && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            Security alerts (sign-ins, password changes) will still be delivered even when paused.
          </div>
        )}
      </SettingsSection>

      {/* ── Channel × category matrix ─────────────────────────────────────── */}
      <SettingsSection id="matrix" icon={Mail} title="By category & channel" helper="Choose how each type of notification reaches you">
        {/* Column headers */}
        <div className="mb-1 grid items-center gap-2" style={{ gridTemplateColumns: '1fr repeat(4, 44px)' }}>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Category</span>
          {CHANNELS.map(ch => (
            <div key={ch.key} className="flex flex-col items-center gap-0.5">
              <ch.icon className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] font-semibold text-neutral-400">{ch.label}</span>
            </div>
          ))}
        </div>

        <div className="divide-y divide-neutral-100">
          {CATEGORIES.map(cat => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.key} className="grid items-center gap-2 py-3.5" style={{ gridTemplateColumns: '1fr repeat(4, 44px)' }}>
                <div className="flex items-start gap-2.5 min-w-0 pr-1">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <CatIcon className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-neutral-800 leading-tight">{cat.label}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">{cat.sub}</p>
                  </div>
                </div>
                {CHANNELS.map(ch => {
                  const locked = cat.locked.includes(ch.key);
                  return (
                    <div key={ch.key} className="flex items-center justify-center">
                      <Toggle
                        on={prefs[cat.key][ch.key]}
                        locked={locked}
                        onChange={() => !locked && toggle(cat.key, ch.key)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2.5">
          <Lock className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <p className="text-[12px] text-neutral-500">
            Locked toggles are required for account security and cannot be disabled.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 rounded-xl px-5 text-[14px] font-semibold text-white transition-colors disabled:opacity-60"
            style={{ background: '#0E9AA7' }}
          >
            {saving ? 'Saving…' : 'Save preferences'}
          </button>
        </div>
      </SettingsSection>

      {/* ── Quiet hours ────────────────────────────────────────────────────── */}
      <SettingsSection id="quiet" icon={Shield} title="Quiet hours" helper="Silence push and SMS notifications during set hours">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-neutral-800">Enable quiet hours</p>
              <p className="text-[12px] text-neutral-400 mt-0.5">
                {quietHours.enabled
                  ? `Silenced from ${quietHours.from} to ${quietHours.to}`
                  : 'Notifications delivered at all times'}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={quietHours.enabled}
              onClick={() => setQuietHours(q => ({ ...q, enabled: !q.enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${quietHours.enabled ? 'bg-[#0E9AA7]' : 'bg-neutral-300'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${quietHours.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-neutral-600">Start (do not disturb)</label>
                <input
                  type="time"
                  value={quietHours.from}
                  onChange={e => setQuietHours(q => ({ ...q, from: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-900 outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-neutral-600">End (resume)</label>
                <input
                  type="time"
                  value={quietHours.to}
                  onChange={e => setQuietHours(q => ({ ...q, to: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-900 outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                />
              </div>
            </div>
          )}

          <p className="text-[12px] text-neutral-400">
            Security and order-ready alerts are always delivered regardless of quiet hours.
          </p>
        </div>
      </SettingsSection>
    </CustomerSettingsLayout>
  );
}
