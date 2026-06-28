import { useState, useMemo } from 'react';
import {
  User, Building2, Bell, Lock, Monitor, ClipboardList,
  Upload, AlertTriangle, Info, Check, X,
  Smartphone, Globe, LogOut, Trash2, Search, ChevronDown,
  Download, ShieldAlert, PauseCircle, XCircle, ShieldCheck, Key,
} from 'lucide-react';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import { adminProfile } from '../../data/mock.js';
import { mockSessions, mockAuditLogs, AUDIT_CATEGORIES, AUDIT_CATEGORY_META } from '../../data/mockStaff.js';

// ─── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'personal',      label: 'Personal',      icon: User          },
  { key: 'business',      label: 'Business',       icon: Building2     },
  { key: 'notifications', label: 'Notifications',  icon: Bell          },
  { key: 'security',      label: 'Security',        icon: Lock          },
  { key: 'sessions',      label: 'Sessions',        icon: Monitor       },
  { key: 'audit',         label: 'Audit Log',       icon: ClipboardList },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Profile completeness ─────────────────────────────────────────────────────

const COMPLETENESS_CHECKS = [
  p => !!p.fullName,
  p => !!p.email,
  p => !!p.phone,
  p => !!p.jobTitle,
  p => !!p.photo,
  p => !!p.business.description,
  p => !!p.business.website,
  p => Object.values(p.business.hours).some(h => h.enabled),
];

function ProfileCompleteness({ profile }) {
  const done  = COMPLETENESS_CHECKS.filter(fn => fn(profile)).length;
  const total = COMPLETENESS_CHECKS.length;
  const pct   = Math.round((done / total) * 100);
  const complete = pct === 100;

  return (
    <div
      className="flex items-center gap-4 rounded-lg border px-5 py-4"
      style={{ borderColor: complete ? '#1F9D57' : '#E5E7EB', background: complete ? '#E6F6EE' : '#FAFAFA' }}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-small font-semibold text-neutral-800">
            {complete ? 'Profile 100% complete' : `Profile ${pct}% complete`}
          </p>
          <span className="text-caption text-neutral-500">{done}/{total} fields</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: complete ? '#1F9D57' : '#0C5FC5' }}
          />
        </div>
        {!complete && (
          <p className="mt-1.5 text-caption text-neutral-500">
            Add a profile photo, job title, and business description to complete your profile.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Shared ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-primary-500' : 'bg-neutral-200'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

function VerificationNote() {
  return (
    <p className="mt-1 flex items-center gap-1 text-caption text-neutral-400">
      <Lock className="h-3 w-3" /> Changing this field requires OTP verification
    </p>
  );
}

// ─── Personal tab ─────────────────────────────────────────────────────────────

function PersonalTab({ profile, onChange }) {
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  function set(field) {
    return e => { setForm(f => ({ ...f, [field]: e.target.value })); setSaved(false); onChange({ ...profile, [field]: e.target.value }); };
  }

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Personal information updated">Your details have been saved.</Alert>}

      <SectionCard title="Profile photo" description="Shown in the admin dashboard">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-h3 font-bold text-primary-700">
            {form.fullName ? form.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Upload photo</Button>
            <p className="mt-1.5 text-caption text-neutral-400">JPG or PNG · max 2 MB · min 200×200 px</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal information" description="Your name and contact details">
        <div className="grid grid-cols-2 gap-5">
          <Input label="Full name" required value={form.fullName} onChange={set('fullName')} autoComplete="name" />
          <Input label="Display name" value={form.displayName} onChange={set('displayName')} />
          <Input label="Job title" value={form.jobTitle} onChange={set('jobTitle')} placeholder="e.g. General Manager" />
          <div />
          <div>
            <Input label="Email address" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            <VerificationNote />
          </div>
          <div>
            <Input label="Phone number" type="tel" required value={form.phone} onChange={set('phone')} autoComplete="tel" />
            <VerificationNote />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setForm({ ...profile }); setSaved(false); }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Business tab ─────────────────────────────────────────────────────────────

function HoursEditor({ hours, onChange }) {
  return (
    <div className="space-y-2">
      {DAYS.map(day => {
        const h = hours[day];
        return (
          <div key={day} className="flex items-center gap-4">
            <Toggle checked={h.enabled} onChange={val => onChange(day, 'enabled', val)} />
            <span className="w-8 text-small font-medium text-neutral-700">{day}</span>
            {h.enabled ? (
              <>
                <input type="time" value={h.open ?? ''} onChange={e => onChange(day, 'open', e.target.value)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                <span className="text-caption text-neutral-400">to</span>
                <input type="time" value={h.close ?? ''} onChange={e => onChange(day, 'close', e.target.value)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              </>
            ) : (
              <span className="text-small text-neutral-400">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BusinessTab() {
  const init = adminProfile.business;
  const [form, setForm] = useState({ ...init, hours: JSON.parse(JSON.stringify(init.hours)), socialLinks: { ...init.socialLinks } });
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Business information updated">Changes will reflect on the customer app within 30 seconds.</Alert>}

      <SectionCard title="Business description" description="Shown to customers on your public profile">
        <div>
          <label className="mb-1.5 block text-small font-medium text-neutral-700">Description</label>
          <textarea rows={3} maxLength={500}
            className="w-full resize-none rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            value={form.description}
            onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setSaved(false); }}
            placeholder="Describe your laundry business…" />
          <p className="mt-1 text-right text-caption text-neutral-400">{form.description.length}/500</p>
        </div>
        <div className="mt-4">
          <Input label="Website" type="url" value={form.website}
            onChange={e => { setForm(f => ({ ...f, website: e.target.value })); setSaved(false); }}
            placeholder="https://yoursite.com" />
        </div>
      </SectionCard>

      <SectionCard title="Operating hours" description="Shown to customers when booking">
        <HoursEditor hours={form.hours}
          onChange={(day, key, val) => { setForm(f => ({ ...f, hours: { ...f.hours, [day]: { ...f.hours[day], [key]: val } } })); setSaved(false); }} />
      </SectionCard>

      <SectionCard title="Social media" description="Links shown on your public-facing business profile">
        <div className="space-y-4">
          {[
            { key: 'facebook',  label: 'Facebook',   placeholder: 'facebook.com/yourbusiness'  },
            { key: 'instagram', label: 'Instagram',  placeholder: 'instagram.com/yourbusiness' },
            { key: 'twitter',   label: 'Twitter / X', placeholder: 'twitter.com/yourbusiness'  },
            { key: 'tiktok',    label: 'TikTok',     placeholder: 'tiktok.com/@yourbusiness'   },
            { key: 'whatsapp',  label: 'WhatsApp',   placeholder: '+233 24 000 0000 or wa.me/…' },
          ].map(({ key, label, placeholder }) => (
            <Input key={key} label={label} type={key === 'whatsapp' ? 'tel' : 'url'}
              value={form.socialLinks[key] ?? ''}
              onChange={e => { setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } })); setSaved(false); }}
              placeholder={placeholder} />
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setForm({ ...init, hours: JSON.parse(JSON.stringify(init.hours)), socialLinks: { ...init.socialLinks } }); setSaved(false); }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save changes</Button>
      </div>

      {/* ── Danger zone (US-0014, US-0015) ── */}
      <DangerZone />
    </div>
  );
}

// ─── Danger zone (US-0014 pause · US-0015 close) ────────────────────────────

const PAUSE_REASONS = [
  'Taking a break / vacation',
  'Staff shortage',
  'Equipment maintenance',
  'Moving to a new location',
  'Seasonal closure',
  'Other',
];

function DangerZone() {
  const BUSINESS_NAME = 'Sparkle Laundry';

  const [isPaused, setIsPaused]       = useState(false);
  const [pauseModal, setPauseModal]   = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [closeModal, setCloseModal]   = useState(false);
  const [closeStep, setCloseStep]     = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [isClosed, setIsClosed]       = useState(false);

  function confirmClose() {
    if (confirmText !== BUSINESS_NAME) return;
    setIsClosed(true);
    setCloseModal(false);
    setConfirmText('');
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#FDECEA' }}>
      {/* Header — faint error-tinted bg */}
      <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: '#FDECEA', background: '#FFF8F7' }}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: '#FDECEA' }}>
          <AlertTriangle className="h-4 w-4 text-error" />
        </div>
        <div>
          <h3 className="text-h4 font-semibold text-neutral-900">Danger zone</h3>
          <p className="mt-0.5 text-small text-neutral-500">These actions affect your business's visibility and data.</p>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {/* US-0014 – Pause */}
        <div className="flex items-center justify-between gap-6 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="min-w-0">
              <p className="text-small font-semibold text-neutral-900">
                {isPaused ? 'Business is currently paused' : 'Temporarily pause your business'}
              </p>
              <p className="mt-0.5 text-small text-neutral-500">
                {isPaused
                  ? 'Customers cannot find or book your business. Existing orders continue normally.'
                  : 'Your business becomes invisible to new customers. Existing orders are not affected.'}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {isPaused ? (
              <Button size="sm" onClick={() => setIsPaused(false)}>Reactivate</Button>
            ) : (
              <Button size="sm" variant="warning" onClick={() => setPauseModal(true)}>
                Pause business
              </Button>
            )}
          </div>
        </div>

        {/* US-0015 – Permanent closure */}
        {!isClosed ? (
          <div className="flex items-center justify-between gap-6 px-6 py-5">
            <div className="flex min-w-0 items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
              <div className="min-w-0">
                <p className="text-small font-semibold text-neutral-900">Permanently close your business</p>
                <p className="mt-0.5 text-small text-neutral-500">
                  This is irreversible. All data will be scheduled for deletion within 30 days.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Button size="sm" variant="danger" onClick={() => { setCloseStep(1); setConfirmText(''); setCloseModal(true); }}>
                Close account
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-6 py-5">
            <Check className="h-4 w-4 text-neutral-400" />
            <p className="text-small text-neutral-500">Your closure request has been submitted. You'll receive a confirmation email within 24 hours.</p>
          </div>
        )}
      </div>

      {/* Pause modal */}
      {pauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
                <PauseCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-neutral-900">Pause your business?</h3>
                <p className="text-small text-neutral-500">You can reactivate at any time.</p>
              </div>
            </div>
            <label className="mb-1.5 block text-small font-medium text-neutral-700">
              Reason <span className="text-error">*</span>
            </label>
            <select
              value={pauseReason}
              onChange={e => setPauseReason(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— Select a reason —</option>
              {PAUSE_REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <div className="mt-5 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setPauseModal(false)}>Cancel</Button>
              <Button
                size="sm"
                variant="warning"
                disabled={!pauseReason}
                onClick={() => { setIsPaused(true); setPauseModal(false); setPauseReason(''); }}
              >
                Pause business
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close account modal — 2 steps */}
      {closeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            {closeStep === 1 ? (
              <>
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: '#FDECEA' }}>
                    <Download className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <h3 className="text-h4 font-bold text-neutral-900">Export your data first?</h3>
                    <p className="mt-1 text-small text-neutral-600">
                      Before closing your account, you can download a copy of all your business data — orders, customers, invoices, and staff records.
                    </p>
                  </div>
                </div>
                <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-small font-medium text-neutral-700">Export includes:</p>
                  <ul className="mt-1.5 space-y-0.5 text-small text-neutral-500">
                    {['All order history', 'Customer records', 'Payment & invoice history', 'Staff records & activity logs'].map(i => (
                      <li key={i} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button size="sm" variant="outline" onClick={() => setCloseModal(false)}>Cancel</Button>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5" /> Export data</Button>
                    <Button size="sm" variant="danger" onClick={() => setCloseStep(2)}>Skip &amp; continue</Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-error" />
                  <h3 className="text-h4 font-bold text-neutral-900">This cannot be undone</h3>
                </div>
                <p className="mb-4 text-small text-neutral-600">
                  Permanently closing your account will remove all business data, cancel active subscriptions, and prevent customers from placing new orders.
                </p>
                <div className="mb-4 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-small text-error">
                  All data will be permanently deleted within 30 days. This action cannot be reversed.
                </div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">
                  Type <strong>{BUSINESS_NAME}</strong> to confirm
                </label>
                <Input
                  placeholder={BUSINESS_NAME}
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  error={confirmText && confirmText !== BUSINESS_NAME ? 'Exact business name required' : ''}
                />
                <div className="mt-5 flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCloseModal(false)}>Cancel</Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={confirmText !== BUSINESS_NAME}
                    onClick={confirmClose}
                  >
                    Permanently close account
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notifications tab ────────────────────────────────────────────────────────

const NOTIF_EVENTS = [
  { key: 'newOrders',    label: 'New orders',    desc: 'When a customer places an order'     },
  { key: 'orderUpdates', label: 'Order updates',  desc: 'Status changes and delivery updates' },
  { key: 'payments',     label: 'Payments',       desc: 'Payment confirmations and payouts'   },
];

function NotificationsTab() {
  const init = adminProfile.notifications;
  const [prefs, setPrefs] = useState(JSON.parse(JSON.stringify(init)));
  const [saved, setSaved] = useState(false);

  function toggleChannel(eventKey, channel) {
    setPrefs(p => ({ ...p, [eventKey]: { ...p[eventKey], [channel]: !p[eventKey][channel] } }));
    setSaved(false);
  }
  function toggleBool(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Preferences saved">Notification settings updated.</Alert>}

      <SectionCard title="Notification channels" description="Choose how you receive alerts for each event type">
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">Event</th>
                {['Email', 'SMS', 'WhatsApp'].map(ch => (
                  <th key={ch} className="px-4 py-3 text-center text-caption font-semibold uppercase tracking-wide text-neutral-400">{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {NOTIF_EVENTS.map(ev => (
                <tr key={ev.key}>
                  <td className="px-4 py-3.5">
                    <p className="text-small font-medium text-neutral-900">{ev.label}</p>
                    <p className="text-caption text-neutral-400">{ev.desc}</p>
                  </td>
                  {['email', 'sms', 'whatsapp'].map(ch => (
                    <td key={ch} className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <Toggle checked={prefs[ev.key][ch]} onChange={() => toggleChannel(ev.key, ch)} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-caption" style={{ background: '#EAF2FC', color: '#093F84' }}>
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          At least one channel must remain enabled per event type. WhatsApp requires a verified WhatsApp number in Business settings.
        </div>
      </SectionCard>

      <SectionCard title="Digest & marketing">
        <div className="divide-y divide-neutral-100">
          {[
            { key: 'weeklyReport', label: 'Weekly business report', desc: 'Analytics digest every Monday morning' },
            { key: 'marketing',    label: 'Marketing & tips',       desc: 'Product updates and promotional content' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-small font-medium text-neutral-900">{item.label}</p>
                <p className="text-caption text-neutral-400">{item.desc}</p>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => toggleBool(item.key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setPrefs(JSON.parse(JSON.stringify(init))); setSaved(false); }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save preferences</Button>
      </div>
    </div>
  );
}

// ─── Security tab (US-0012, US-0013, US-0016) ────────────────────────────────

const TOTP_SECRET  = 'JBSW Y3DP EHPK 3PXP';
const BACKUP_CODES = [
  'AB12-CD34', 'EF56-GH78', 'IJ90-KL12', 'MN34-OP56',
  'QR78-ST90', 'UV12-WX34', 'YZ56-AB78', 'CD90-EF12',
];

// Simplified QR-code SVG (visual mock — not an encoded TOTP URI)
function QRCodeMock() {
  const CELL = 6;
  const rows = [
    '111111100010001111111',
    '100000101010101000001',
    '101110101111101011101',
    '101110101011101011101',
    '101110100100101011101',
    '100000100110101000001',
    '111111101010101111111',
    '000000001011000000000',
    '110110111001001101101',
    '010101001110100101010',
    '101010110100110100101',
    '010100010011001001010',
    '110111001000101110010',
    '000000010100000000010',
    '111111101100111111101',
    '100000100011001000001',
    '101110110001101011101',
    '101110101100101011101',
    '101110101010001011101',
    '100000100001001000001',
    '111111100110001111111',
  ];
  const size = 21 * CELL;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {rows.map((row, y) =>
        [...row].map((bit, x) =>
          bit === '1' ? (
            <rect
              key={`${x}-${y}`}
              x={x * CELL} y={y * CELL}
              width={CELL} height={CELL}
              fill="#1a1a1a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function passwordStrength(pw) {
  const checks = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'Uppercase letter',       ok: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter',       ok: /[a-z]/.test(pw) },
    { label: 'Number',                 ok: /[0-9]/.test(pw) },
    { label: 'Special character (!@#$…)', ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter(c => c.ok).length;
  return { checks, score };
}

const STRENGTH_LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['', '#D92D20', '#F79009', '#F79009', '#1F9D57', '#1F9D57'];

function SecurityTab() {
  const [current, setCurrent]     = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirm, setConfirm]     = useState('');
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState('');
  const [logoutSent, setLogoutSent] = useState(false);

  // 2FA state (US-0013)
  const [twoFAEnabled,     setTwoFAEnabled]     = useState(false);
  const [twoFAStep,        setTwoFAStep]        = useState(null); // null | 'setup' | 'backup' | 'disable'
  const [twoFACode,        setTwoFACode]        = useState('');
  const [twoFADisableCode, setTwoFADisableCode] = useState('');
  const [twoFAVerifyError, setTwoFAVerifyError] = useState('');

  const { checks, score } = passwordStrength(newPw);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!current) { setError('Enter your current password.'); return; }
    if (score < 3)  { setError('Password is too weak. Meet at least 3 criteria.'); return; }
    if (newPw !== confirm) { setError('New passwords do not match.'); return; }
    setSaved(true);
    setCurrent(''); setNewPw(''); setConfirm('');
  }

  return (
    <div className="space-y-6">
      {/* Change password */}
      <SectionCard title="Change password" description="Use a strong, unique password you don't use elsewhere.">
        <form onSubmit={handleSubmit} className="space-y-5">
          {saved && <Alert type="success" title="Password updated">Your password has been changed. You may need to re-login on other devices.</Alert>}
          {error && <Alert type="error" title={error} />}

          {/* Current password */}
          <PasswordInput
            label="Current password"
            value={current}
            onChange={e => { setCurrent(e.target.value); setSaved(false); }}
            autoComplete="current-password"
          />

          {/* New password */}
          <PasswordInput
            label="New password"
            value={newPw}
            onChange={e => { setNewPw(e.target.value); setSaved(false); }}
            autoComplete="new-password"
          />

          {/* Strength meter */}
          {newPw && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-colors"
                      style={{ background: i <= score ? STRENGTH_COLORS[score] : '#E5E7EB' }}
                    />
                  ))}
                </div>
                <span className="text-caption font-medium" style={{ color: STRENGTH_COLORS[score] }}>
                  {STRENGTH_LABELS[score]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {checks.map(c => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    {c.ok
                      ? <Check className="h-3 w-3 text-success flex-shrink-0" />
                      : <X className="h-3 w-3 text-neutral-300 flex-shrink-0" />}
                    <span className={`text-caption ${c.ok ? 'text-success-text' : 'text-neutral-400'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm */}
          <div>
            <PasswordInput
              label="Confirm new password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setSaved(false); }}
              autoComplete="new-password"
            />
            {confirm && newPw && (
              <p className={`mt-1 text-caption ${confirm === newPw ? 'text-success-text' : 'text-error-text'}`}>
                {confirm === newPw ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </SectionCard>

      {/* Secure logout */}
      <SectionCard title="Session security" description="Manage active sessions and sign out of all devices.">
        <div className="space-y-4">
          {logoutSent ? (
            <Alert type="success" title="All other sessions terminated">You have been signed out from all other devices and browsers.</Alert>
          ) : (
            <div className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: '#FDECEA' }}>
                <ShieldAlert className="h-4 w-4" style={{ color: '#A31C12' }} />
              </div>
              <div className="flex-1">
                <p className="text-small font-semibold text-neutral-900">Log out all other sessions</p>
                <p className="mt-0.5 text-caption text-neutral-500">
                  Sign out from all other browsers and devices. Your current session will remain active.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLogoutSent(true)}>
                <LogOut className="h-3.5 w-3.5" /> Log out others
              </Button>
            </div>
          )}
          <p className="text-caption text-neutral-400">
            If you suspect unauthorized access, log out all sessions and change your password immediately.
          </p>
        </div>
      </SectionCard>

      {/* ── 2FA (US-0013) ── */}
      <SectionCard
        title="Two-factor authentication"
        description="Protect your account with a time-based code from an authenticator app."
        action={
          twoFAEnabled ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold"
              style={{ background: '#E6F6EE', color: '#13753F' }}
            >
              <Check className="h-3 w-3" /> Enabled
            </span>
          ) : null
        }
      >
        {twoFAEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: '#E6F6EE' }}>
                <ShieldCheck className="h-4 w-4" style={{ color: '#1F9D57' }} />
              </div>
              <div className="flex-1">
                <p className="text-small font-semibold text-neutral-900">2FA is active</p>
                <p className="mt-0.5 text-caption text-neutral-500">
                  Your account is protected with an authenticator app. 8 backup codes available.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setTwoFAStep('backup')}>
                <Key className="h-3.5 w-3.5" /> View backup codes
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => { setTwoFAStep('disable'); setTwoFADisableCode(''); }}
                style={{ borderColor: '#D92D20', color: '#D92D20' }}
              >
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <Smartphone className="h-4 w-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-small font-medium text-neutral-900">Not enabled</p>
                <p className="mt-0.5 text-caption text-neutral-500">
                  Add an extra layer of security — you'll need an authenticator app such as Google Authenticator or Authy.
                </p>
              </div>
            </div>
            <Button onClick={() => { setTwoFAStep('setup'); setTwoFACode(''); setTwoFAVerifyError(''); }}>
              Enable 2FA
            </Button>
          </div>
        )}

        {/* ── Setup modal ── */}
        {twoFAStep === 'setup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900">Set up 2FA</h3>
                  <p className="mt-0.5 text-small text-neutral-500">Step 1 of 2 — Scan and verify</p>
                </div>
                <button
                  onClick={() => { setTwoFAStep(null); setTwoFACode(''); setTwoFAVerifyError(''); }}
                  className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <p className="text-small text-neutral-600">
                  Open your authenticator app and scan the QR code below, then enter the 6-digit code it shows.
                </p>

                {/* QR code + manual key */}
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border-2 border-neutral-200 p-3">
                    <QRCodeMock />
                  </div>
                  <div className="w-full">
                    <p className="mb-2 text-center text-caption text-neutral-500">Or enter the key manually:</p>
                    <code
                      className="block select-all rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-center font-mono text-small text-neutral-800"
                    >
                      {TOTP_SECRET}
                    </code>
                  </div>
                </div>

                {/* 6-digit input */}
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral-700">
                    Verification code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000 000"
                    value={twoFACode}
                    onChange={e => { setTwoFACode(e.target.value.replace(/\D/g, '')); setTwoFAVerifyError(''); }}
                    className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-center font-mono text-body tracking-[0.35em] text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  {twoFAVerifyError && (
                    <p className="mt-1 text-caption text-error">{twoFAVerifyError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setTwoFAStep(null); setTwoFACode(''); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (twoFACode.length !== 6) {
                        setTwoFAVerifyError('Enter the 6-digit code from your authenticator app.');
                        return;
                      }
                      setTwoFAStep('backup');
                      setTwoFACode('');
                    }}
                  >
                    Verify &amp; enable
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Backup codes modal ── */}
        {twoFAStep === 'backup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900">Save your backup codes</h3>
                  <p className="mt-0.5 text-small text-neutral-500">
                    {twoFAEnabled ? 'Your one-time backup codes' : 'Step 2 of 2 — Store these safely'}
                  </p>
                </div>
                {twoFAEnabled && (
                  <button
                    onClick={() => setTwoFAStep(null)}
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-small text-neutral-600">
                  <strong>Each code can only be used once.</strong> If you lose access to your authenticator
                  app, use one of these to sign in. Keep them somewhere safe.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {BACKUP_CODES.map(code => (
                    <code
                      key={code}
                      className="select-all rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-center font-mono text-small text-neutral-800"
                    >
                      {code}
                    </code>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                  <Button
                    variant="outline" size="sm" className="flex-1"
                    onClick={() => navigator.clipboard?.writeText(BACKUP_CODES.join('\n'))}
                  >
                    Copy all
                  </Button>
                </div>

                <div className="flex justify-end gap-3">
                  {!twoFAEnabled ? (
                    <Button onClick={() => { setTwoFAEnabled(true); setTwoFAStep(null); }}>
                      <Check className="h-4 w-4" /> Done — codes saved
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setTwoFAStep(null)}>Close</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Disable modal ── */}
        {twoFAStep === 'disable' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <h3 className="text-h4 font-bold text-neutral-900">Disable 2FA</h3>
                <button
                  onClick={() => { setTwoFAStep(null); setTwoFADisableCode(''); }}
                  className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div
                  className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-small"
                  style={{ background: '#FFF4E0', color: '#945800', border: '1px solid #F5C76E' }}
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>Disabling 2FA will make your account less secure. Enter your current authenticator code to confirm.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral-700">
                    Current 2FA code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000 000"
                    value={twoFADisableCode}
                    onChange={e => setTwoFADisableCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-center font-mono text-body tracking-[0.35em] text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setTwoFAStep(null); setTwoFADisableCode(''); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={twoFADisableCode.length !== 6}
                    onClick={() => { setTwoFAEnabled(false); setTwoFAStep(null); setTwoFADisableCode(''); }}
                    style={{
                      background: '#D92D20', color: '#fff', borderColor: '#D92D20',
                      opacity: twoFADisableCode.length !== 6 ? 0.4 : 1,
                    }}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Sessions tab (US-0017) ───────────────────────────────────────────────────

function SessionsTab() {
  const [sessions, setSessions] = useState(mockSessions);
  const [revokeModal, setRevokeModal] = useState(null);
  const [revokeAll, setRevokeAll] = useState(false);
  const [revokeAllDone, setRevokeAllDone] = useState(false);

  function handleRevoke(id) {
    setSessions(s => s.filter(sess => sess.id !== id));
    setRevokeModal(null);
  }
  function handleRevokeAll() {
    setSessions(s => s.filter(sess => sess.current));
    setRevokeAll(false);
    setRevokeAllDone(true);
  }

  return (
    <div className="space-y-6">
      {revokeAllDone && (
        <Alert type="success" title="All other sessions revoked">
          Only your current session remains active.
        </Alert>
      )}

      <SectionCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        action={
          sessions.filter(s => !s.current).length > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setRevokeAll(true)}>
              <LogOut className="h-3.5 w-3.5" /> Revoke all others
            </Button>
          ) : null
        }
      >
        <div className="divide-y divide-neutral-100">
          {sessions.map(sess => (
            <div key={sess.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: sess.current ? '#EAF2FC' : '#F3F4F6' }}
              >
                {sess.device.toLowerCase().includes('iphone') || sess.device.toLowerCase().includes('android')
                  ? <Smartphone className="h-4 w-4" style={{ color: sess.current ? '#0C5FC5' : '#6B7280' }} />
                  : <Globe className="h-4 w-4" style={{ color: sess.current ? '#0C5FC5' : '#6B7280' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-small font-semibold text-neutral-900 truncate">{sess.device}</p>
                  {sess.current && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#EAF2FC', color: '#0C5FC5' }}>
                      This device
                    </span>
                  )}
                  {sess.unusualLocation && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#FFF4E0', color: '#945800' }}>
                      <AlertTriangle className="h-3 w-3" /> New location
                    </span>
                  )}
                </div>
                <p className="text-caption text-neutral-500">
                  {sess.location} · {sess.ip} · Last active {sess.lastActive}
                </p>
                <p className="text-caption text-neutral-400">Signed in {sess.loginTime}</p>
              </div>
              <button
                onClick={() => !sess.current && setRevokeModal(sess)}
                disabled={sess.current}
                title={sess.current ? 'Cannot revoke your current session' : 'Revoke this session'}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-error disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {sessions.length <= 1 && (
            <p className="text-small text-neutral-500 text-center py-4">Only your current session is active.</p>
          )}
        </div>
      </SectionCard>

      <div className="flex items-start gap-2 rounded-lg px-4 py-3 text-caption" style={{ background: '#EAF2FC', color: '#093F84' }}>
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        Sessions expire automatically after 30 days of inactivity. Revoking a session signs the device out immediately.
      </div>

      {/* Revoke single session modal */}
      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-h4 font-bold text-neutral-900">Revoke session?</h3>
            <p className="mt-2 text-small text-neutral-600">
              <strong>{revokeModal.device}</strong> in {revokeModal.location} will be signed out immediately.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRevokeModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleRevoke(revokeModal.id)}>Revoke session</Button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke all modal */}
      {revokeAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-h4 font-bold text-neutral-900">Revoke all other sessions?</h3>
            <p className="mt-2 text-small text-neutral-600">
              All {sessions.filter(s => !s.current).length} other active sessions will be signed out immediately. Your current session will remain active.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRevokeAll(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleRevokeAll}><LogOut className="h-3.5 w-3.5" /> Revoke all others</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audit Log tab (US-0026) ──────────────────────────────────────────────────

const PAGE_SIZE = 8;

function AuditLogTab() {
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [result, setResult]       = useState('');
  const [page, setPage]           = useState(1);
  const [detail, setDetail]       = useState(null);

  const filtered = useMemo(() => {
    return mockAuditLogs.filter(e => {
      const q = search.toLowerCase();
      const matchQ = !q || e.event.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q);
      const matchC = !category || e.category === category;
      const matchR = !result   || e.result   === result;
      return matchQ && matchC && matchR;
    });
  }, [search, category, result]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() { setPage(1); }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search events, actors, entities…"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); resetPage(); }}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          {AUDIT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={result}
          onChange={e => { setResult(e.target.value); resetPage(); }}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All results</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              {['Timestamp', 'Event', 'Actor', 'Entity', 'Result', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-small text-neutral-400">No events match your filters.</td>
              </tr>
            )}
            {paginated.map(entry => {
              const catMeta = AUDIT_CATEGORY_META[entry.category] || { bg: '#F3F4F6', text: '#374151' };
              return (
                <tr key={entry.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3.5 text-caption text-neutral-500 whitespace-nowrap">{entry.timestamp}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold"
                      style={{ background: catMeta.bg, color: catMeta.text }}>
                      {entry.event}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-small text-neutral-900">{entry.actor}</td>
                  <td className="px-4 py-3.5 text-small text-neutral-700">{entry.entity}</td>
                  <td className="px-4 py-3.5">
                    {entry.result === 'success'
                      ? <span className="inline-flex items-center gap-1 text-caption font-semibold" style={{ color: '#13753F' }}><Check className="h-3 w-3" /> Success</span>
                      : <span className="inline-flex items-center gap-1 text-caption font-semibold" style={{ color: '#A31C12' }}><X className="h-3 w-3" /> Failed</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setDetail(entry)}
                      className="text-caption text-primary-500 hover:text-primary-700 hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-caption text-neutral-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} events
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-caption text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="h-8 w-8 rounded-md border text-caption font-semibold transition-colors"
                  style={p === page
                    ? { borderColor: '#0C5FC5', background: '#0C5FC5', color: 'white' }
                    : { borderColor: '#E5E7EB', background: 'white', color: '#374151' }
                  }
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-caption text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <h3 className="text-h4 font-bold text-neutral-900">Event detail</h3>
              <button onClick={() => setDetail(null)} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              {[
                { label: 'Event ID',   value: detail.id        },
                { label: 'Timestamp',  value: detail.timestamp },
                { label: 'Event type', value: detail.event     },
                { label: 'Category',   value: detail.category  },
                { label: 'Actor',      value: detail.actor     },
                { label: 'Entity',     value: detail.entity    },
                { label: 'IP address', value: detail.ip        },
                { label: 'Result',     value: detail.result.charAt(0).toUpperCase() + detail.result.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-28 flex-shrink-0 text-caption text-neutral-400">{label}</dt>
                  <dd className="text-small text-neutral-900">{value}</dd>
                </div>
              ))}
              <div className="flex gap-4">
                <dt className="w-28 flex-shrink-0 text-caption text-neutral-400">Details</dt>
                <dd className="text-small text-neutral-700">{detail.detail}</dd>
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-100 px-6 py-4">
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile]     = useState(adminProfile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Settings</h1>
        <p className="mt-0.5 text-small text-neutral-500">Manage your profile, security, sessions, and account preferences.</p>
      </div>

      <ProfileCompleteness profile={profile} />

      {/* Tab nav */}
      <div className="flex flex-wrap border-b border-neutral-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex items-center gap-1.5 px-5 pb-3 pt-1 text-small font-semibold transition-colors ${
              activeTab === key ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {activeTab === key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'personal'      && <PersonalTab profile={profile} onChange={setProfile} />}
      {activeTab === 'business'      && <BusinessTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'security'      && <SecurityTab />}
      {activeTab === 'sessions'      && <SessionsTab />}
      {activeTab === 'audit'         && <AuditLogTab />}
    </div>
  );
}

export default SettingsPage;


