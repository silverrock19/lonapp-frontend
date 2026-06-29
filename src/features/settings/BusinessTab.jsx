import { useState } from 'react';
import { AlertTriangle, PauseCircle, XCircle, Check, Download } from 'lucide-react';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Toggle from '../../components/ui/Toggle.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { adminProfile } from '../../data/mock.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PAUSE_REASONS = [
  'Taking a break / vacation',
  'Staff shortage',
  'Equipment maintenance',
  'Moving to a new location',
  'Seasonal closure',
  'Other',
];

const HoursEditor = ({ hours, onChange }) => (
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

const DangerZone = () => {
  const BUSINESS_NAME = 'Sparkle Laundry';

  const [isPaused, setIsPaused]       = useState(false);
  const [pauseModal, setPauseModal]   = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [closeModal, setCloseModal]   = useState(false);
  const [closeStep, setCloseStep]     = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [isClosed, setIsClosed]       = useState(false);

  const confirmClose = () => {
    if (confirmText !== BUSINESS_NAME) return;
    setIsClosed(true);
    setCloseModal(false);
    setConfirmText('');
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#FDECEA' }}>
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
            {isPaused
              ? <Button size="sm" onClick={() => setIsPaused(false)}>Reactivate</Button>
              : <Button size="sm" variant="warning" onClick={() => setPauseModal(true)}>Pause business</Button>
            }
          </div>
        </div>

        {!isClosed ? (
          <div className="flex items-center justify-between gap-6 px-6 py-5">
            <div className="flex min-w-0 items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
              <div className="min-w-0">
                <p className="text-small font-semibold text-neutral-900">Permanently close your business</p>
                <p className="mt-0.5 text-small text-neutral-500">This is irreversible. All data will be scheduled for deletion within 30 days.</p>
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
              <Button size="sm" variant="warning" disabled={!pauseReason}
                onClick={() => { setIsPaused(true); setPauseModal(false); setPauseReason(''); }}>
                Pause business
              </Button>
            </div>
          </div>
        </div>
      )}

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
                  <Button size="sm" variant="danger" disabled={confirmText !== BUSINESS_NAME} onClick={confirmClose}>
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
};

const BusinessTab = () => {
  const init = adminProfile.business;
  const [form, setForm] = useState({
    ...init,
    hours: JSON.parse(JSON.stringify(init.hours)),
    socialLinks: { ...init.socialLinks },
  });
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
          onChange={(day, key, val) => {
            setForm(f => ({ ...f, hours: { ...f.hours, [day]: { ...f.hours[day], [key]: val } } }));
            setSaved(false);
          }} />
      </SectionCard>

      <SectionCard title="Social media" description="Links shown on your public-facing business profile">
        <div className="space-y-4">
          {[
            { key: 'facebook',  label: 'Facebook',    placeholder: 'facebook.com/yourbusiness'   },
            { key: 'instagram', label: 'Instagram',   placeholder: 'instagram.com/yourbusiness'  },
            { key: 'twitter',   label: 'Twitter / X', placeholder: 'twitter.com/yourbusiness'    },
            { key: 'tiktok',    label: 'TikTok',      placeholder: 'tiktok.com/@yourbusiness'    },
            { key: 'whatsapp',  label: 'WhatsApp',    placeholder: '+233 24 000 0000 or wa.me/…' },
          ].map(({ key, label, placeholder }) => (
            <Input key={key} label={label} type={key === 'whatsapp' ? 'tel' : 'url'}
              value={form.socialLinks[key] ?? ''}
              onChange={e => { setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } })); setSaved(false); }}
              placeholder={placeholder} />
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          setForm({ ...init, hours: JSON.parse(JSON.stringify(init.hours)), socialLinks: { ...init.socialLinks } });
          setSaved(false);
        }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save changes</Button>
      </div>

      <DangerZone />
    </div>
  );
};

export default BusinessTab;
