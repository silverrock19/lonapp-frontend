import { useState, useRef } from 'react';
import { Lock, Upload, Check, Camera, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { ROLES, STAFF_STATUS, MOCK_ME } from '../../data/mockStaff.js';

const AVATAR_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];

function avatarColor(name) {
  return AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Colleague', 'Other'];

// ─── Shared components ────────────────────────────────────────────────────────

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-4">
        <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
        {description && <p className="mt-0.5 text-small text-neutral-500">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ReadOnlyField({ label, children, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-small font-medium text-neutral-600">{label}</span>
        <Lock className="h-3 w-3 text-neutral-300" title="Managed by your administrator" />
      </div>
      {children ?? (
        <p className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2 text-small text-neutral-600">
          {value || '—'}
        </p>
      )}
    </div>
  );
}

function VerificationNote() {
  return (
    <p className="mt-1 flex items-center gap-1 text-caption text-neutral-400">
      <Lock className="h-3 w-3" /> Changing this requires OTP verification
    </p>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MyProfilePage() {
  const [form, setForm]   = useState({ ...MOCK_ME });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  function set(field) {
    return e => { setForm(f => ({ ...f, [field]: e.target.value })); setSaved(false); };
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoUrl(ev.target.result);
    reader.readAsDataURL(file);
  }

  const roleInfo   = ROLES.find(r => r.code === form.roleCode) || { name: form.roleCode, color: '#6B7280', bg: '#F3F4F6' };
  const statusInfo = STAFF_STATUS[form.status] || STAFF_STATUS.active;
  const pal        = avatarColor(form.fullName);

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">My profile</h1>
        <p className="mt-0.5 text-small text-neutral-500">
          Manage your personal and contact information.
        </p>
      </div>

      {saved && (
        <Alert type="success" title="Profile updated">
          Your changes have been saved.
        </Alert>
      )}

      {/* ── Profile photo ── */}
      <SectionCard title="Profile photo" description="Shown in the staff directory and your activity feed">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={form.fullName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-[22px] font-bold"
                style={pal}
              >
                {initials(form.fullName)}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
            >
              <Camera className="h-3.5 w-3.5 text-neutral-600" />
            </button>
          </div>
          <div>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Upload photo
            </Button>
            <p className="mt-1.5 text-caption text-neutral-400">
              JPG or PNG · max 2 MB · min 200×200 px
            </p>
            {photoUrl && (
              <button
                onClick={() => setPhotoUrl(null)}
                className="mt-1 text-caption text-error hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </SectionCard>

      {/* ── Personal information ── */}
      <SectionCard title="Personal information" description="Your name and contact details">
        <div className="grid grid-cols-2 gap-5">
          <Input label="Full name" required value={form.fullName} onChange={set('fullName')} autoComplete="name" />
          <Input label="Display name" value={form.displayName} onChange={set('displayName')} placeholder="e.g. Akua D." />
          <div>
            <Input label="Personal email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            <VerificationNote />
          </div>
          <div>
            <Input label="Phone number" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            <VerificationNote />
          </div>
          <Input label="WhatsApp number" type="tel" value={form.whatsapp} onChange={set('whatsapp')} />
        </div>
      </SectionCard>

      {/* ── Emergency contact ── */}
      <SectionCard
        title="Emergency contact"
        description="Who to notify in case of a workplace emergency"
      >
        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Contact name"
            value={form.emergencyName}
            onChange={set('emergencyName')}
            placeholder="e.g. Kofi Darko"
          />
          <Input
            label="Contact phone"
            type="tel"
            value={form.emergencyPhone}
            onChange={set('emergencyPhone')}
            placeholder="+233 24 000 0000"
          />
          <div>
            <label className="mb-1.5 block text-small font-medium text-neutral-700">
              Relationship
            </label>
            <select
              value={form.emergencyRelationship}
              onChange={set('emergencyRelationship')}
              className="w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── Employment details (read-only) ── */}
      <SectionCard
        title="Employment details"
        description="Managed by your administrator — contact them to request changes"
      >
        <div className="grid grid-cols-2 gap-5">

          <ReadOnlyField label="Role">
            <span
              className="mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold"
              style={{ background: roleInfo.bg, color: roleInfo.color }}
            >
              {roleInfo.name}
            </span>
          </ReadOnlyField>

          <ReadOnlyField label="Employment status">
            <span
              className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold"
              style={{ background: statusInfo.bg, color: statusInfo.text }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusInfo.dot }} />
              {statusInfo.label}
            </span>
          </ReadOnlyField>

          <ReadOnlyField label="Assigned outlet"   value={form.outlet}         />
          <ReadOnlyField label="Employee ID"        value={form.employeeId}     />
          <ReadOnlyField label="Start date"         value={form.startDate}      />
          <ReadOnlyField label="Department"         value={form.department}     />
          <ReadOnlyField label="Employment type"    value={form.employmentType} />
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
          <p className="text-caption text-neutral-500">
            To update your role, outlet assignment, or employment status, contact your administrator
            or HR through <strong>Settings → Sessions</strong> or email your manager directly.
          </p>
        </div>
      </SectionCard>

      {/* Save / discard */}
      <div className="flex justify-end gap-3 pb-4">
        <Button
          variant="outline"
          onClick={() => { setForm({ ...MOCK_ME }); setPhotoUrl(null); setSaved(false); }}
        >
          Discard changes
        </Button>
        <Button onClick={() => setSaved(true)}>Save changes</Button>
      </div>
    </div>
  );
}
