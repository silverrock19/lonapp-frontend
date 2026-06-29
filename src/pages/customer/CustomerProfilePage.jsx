import { useState, useRef, useCallback } from 'react';
import {
  Camera, User, AlertCircle, Trophy, Link2,
  CheckCircle2, XCircle, ChevronRight, Pencil,
  Upload, Trash2, X, Phone, Mail,
} from 'lucide-react';
import CustomerSettingsLayout, { SettingsSection } from '../../components/layout/CustomerSettingsLayout.jsx';
import { MOCK_CUSTOMER } from '../../data/mockCustomer.js';
import Input from '../../components/ui/Input.jsx';

// ── Mock initial profile ──────────────────────────────────────────────────────

const INITIAL = {
  firstName:  MOCK_CUSTOMER.firstName ?? 'Adwoa',
  lastName:   MOCK_CUSTOMER.lastName  ?? 'Mensah',
  email:      MOCK_CUSTOMER.email     ?? 'adwoa.mensah@gmail.com',
  emailVerified: MOCK_CUSTOMER.emailVerified ?? true,
  phone:      MOCK_CUSTOMER.phone     ?? '+233 24 456 7890',
  phoneVerified: MOCK_CUSTOMER.phoneVerified ?? true,
  dateOfBirth: '1991-04-18',
  gender:     'female',
  photo:      null,
  // Emergency contact
  emergencyName:  'Kweku Mensah',
  emergencyPhone: '+233 20 345 6789',
  emergencyRel:   'Spouse',
  // Account
  tier:           MOCK_CUSTOMER.tier           ?? 'Silver',
  loyaltyPoints:  620,
  preferredOutlet: MOCK_CUSTOMER.preferredOutlet ?? 'CleanPro Osu',
  memberSince:    'June 2024',
  // Social
  linkedGoogle:    true,
  linkedFacebook:  false,
  linkedApple:     false,
  linkedWhatsApp:  false,
};

const SECTIONS = [
  { id: 'photo',     icon: Camera,       label: 'Profile photo'      },
  { id: 'personal',  icon: User,         label: 'Personal info'      },
  { id: 'emergency', icon: AlertCircle,  label: 'Emergency contact'  },
  { id: 'account',   icon: Trophy,       label: 'Account & loyalty'  },
  { id: 'linked',    icon: Link2,        label: 'Linked accounts'    },
];

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male',   label: 'Male'   },
  { value: 'other',  label: 'Other'  },
  { value: '',       label: 'Prefer not to say' },
];

const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];

// ── Tier badge colors ─────────────────────────────────────────────────────────
const TIER_META = {
  Bronze: { bg: '#FDF3E7', color: '#92400E', label: 'Bronze' },
  Silver: { bg: '#F3F4F6', color: '#374151', label: 'Silver' },
  Gold:   { bg: '#FEF9E7', color: '#92600E', label: 'Gold'   },
};

// ── Small field helpers ───────────────────────────────────────────────────────

function FieldHint({ children }) {
  return <p className="mt-1 text-[12px] text-neutral-400">{children}</p>;
}

// ── Verified badge ────────────────────────────────────────────────────────────
function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
      <CheckCircle2 className="h-3 w-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-600">
      <XCircle className="h-3 w-3" /> Unverified
    </span>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-[14px] font-medium text-neutral-800">{label}</p>
        {sub && <p className="text-[12px] text-neutral-400">{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-[#0E9AA7]' : 'bg-neutral-300'}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// ── Photo crop modal ──────────────────────────────────────────────────────────
function PhotoModal({ preview, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-neutral-900">Adjust photo</h3>
          <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100">
            <X className="h-4 w-4 text-neutral-500" />
          </button>
        </div>
        {/* Simulated crop frame */}
        <div className="relative mx-auto mb-5 h-56 w-56 overflow-hidden rounded-full border-2 border-dashed" style={{ borderColor: '#0E9AA7' }}>
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 0 2px rgba(14,154,167,0.4)' }} />
        </div>
        <p className="mb-4 text-center text-[13px] text-neutral-400">Drag to reposition · Pinch to zoom</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-neutral-200 text-[15px] font-semibold text-neutral-700 hover:bg-neutral-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl text-white text-[15px] font-semibold" style={{ background: '#0E9AA7' }}>
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CustomerProfilePage() {
  const [form, setForm]       = useState({ ...INITIAL });
  const [saved, setSaved]     = useState({ ...INITIAL });
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileRef = useRef(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  function set(field) {
    return (e) => {
      const val = e && e.target ? e.target.value : e;
      setForm(f => ({ ...f, [field]: val }));
      setErrors(er => { const c = { ...er }; delete c[field]; return c; });
    };
  }

  function setFlag(field) {
    return (val) => setForm(f => ({ ...f, [field]: val }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = 'First name is required';
    if (!form.lastName.trim())   e.lastName   = 'Last name is required';
    if (!form.email.trim())      e.email      = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())      e.phone      = 'Phone number is required';
    if (form.emergencyPhone && !/^\+?[\d\s\-().]{7,}$/.test(form.emergencyPhone))
      e.emergencyPhone = 'Enter a valid phone number';
    return e;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setSaved({ ...form });
      showToast('Profile saved', 'success');
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setForm({ ...saved });
    setErrors({});
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Photo upload
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setShowCropModal(true);
  }

  function confirmPhoto() {
    setForm(f => ({ ...f, photo: photoPreview }));
    setShowCropModal(false);
  }

  function removePhoto() {
    setForm(f => ({ ...f, photo: null }));
    setPhotoPreview(null);
  }

  const initials = ((form.firstName[0] ?? '') + (form.lastName[0] ?? '')).toUpperCase();
  const tierMeta = TIER_META[form.tier] ?? TIER_META.Silver;

  return (
    <>
      <CustomerSettingsLayout
        title="My Profile"
        sections={SECTIONS}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saving={saving}
      >
        {/* Toast */}
        {toast && (
          <div className={`rounded-xl border px-4 py-3 text-[14px] font-medium ${
            toast.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* ── 1. Profile photo ───────────────────────────────────────────────── */}
        <SettingsSection id="photo" icon={Camera} title="Profile photo" helper="Shown to laundry staff when your order is picked up">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-[#E8F9FA] flex items-center justify-center">
                {form.photo ? (
                  <img src={form.photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[30px] font-bold" style={{ color: '#0E9AA7' }}>{initials || '?'}</span>
                )}
              </div>
              {/* Camera overlay */}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0E9AA7] text-white shadow"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                {form.photo ? 'Change photo' : 'Upload photo'}
              </button>
              {form.photo && (
                <button
                  onClick={removePhoto}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove photo
                </button>
              )}
              <p className="text-[12px] text-neutral-400">JPG or PNG · Max 5 MB · Cropped to circle</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </SettingsSection>

        {/* ── 2. Personal information ────────────────────────────────────────── */}
        <SettingsSection id="personal" icon={User} title="Personal information" helper="Your name, contact details, and identity">
          <div className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                required
                placeholder="First name"
                value={form.firstName}
                onChange={set('firstName')}
                error={errors.firstName}
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                required
                placeholder="Last name"
                value={form.lastName}
                onChange={set('lastName')}
                error={errors.lastName}
                autoComplete="family-name"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100" />

            {/* Email */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] font-medium text-neutral-700">
                  Email address <span className="ml-0.5 text-red-500">*</span>
                </span>
                <VerifiedBadge verified={form.emailVerified} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-[calc(0.625rem+1px)] h-4 w-4 text-neutral-400 z-10 pointer-events-none" />
                <Input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="pl-10"
                  helper={!errors.email ? 'Changing your email will require verification via OTP' : undefined}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] font-medium text-neutral-700">
                  Phone number <span className="ml-0.5 text-red-500">*</span>
                </span>
                <VerifiedBadge verified={form.phoneVerified} />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-[calc(0.625rem+1px)] h-4 w-4 text-neutral-400 z-10 pointer-events-none" />
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  placeholder="+233 24 000 0000"
                  autoComplete="tel"
                  className="pl-10"
                  helper={!errors.phone ? 'Changing your phone number will require SMS verification' : undefined}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100" />

            {/* DOB */}
            <Input
              label="Date of birth"
              type="date"
              value={form.dateOfBirth}
              onChange={set('dateOfBirth')}
              helper="Used for age verification and birthday offers"
            />

            {/* Gender */}
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">Gender</label>
              <select value={form.gender} onChange={set('gender')} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] text-neutral-900 outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20">
                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* ── 3. Emergency contact ───────────────────────────────────────────── */}
        <SettingsSection id="emergency" icon={AlertCircle} title="Emergency contact" helper="Someone we can reach if we're unable to contact you">
          <div className="space-y-4">
            <Input
              label="Full name"
              placeholder="Contact name"
              value={form.emergencyName}
              onChange={set('emergencyName')}
              autoComplete="off"
            />
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-[calc(0.625rem+1px)] h-4 w-4 text-neutral-400 z-10 pointer-events-none" />
                <Input
                  type="tel"
                  value={form.emergencyPhone}
                  onChange={set('emergencyPhone')}
                  error={errors.emergencyPhone}
                  placeholder="+233 20 000 0000"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">Relationship</label>
              <select value={form.emergencyRel} onChange={set('emergencyRel')} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] text-neutral-900 outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20">
                <option value="">— Select —</option>
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* ── 4. Account & loyalty ──────────────────────────────────────────── */}
        <SettingsSection id="account" icon={Trophy} title="Account & loyalty" helper="Your membership tier, points, and preferences">
          {/* Tier card */}
          <div className="mb-4 flex items-center gap-3 rounded-xl p-4" style={{ background: tierMeta.bg }}>
            <Trophy className="h-6 w-6 shrink-0" style={{ color: tierMeta.color }} />
            <div className="flex-1">
              <p className="text-[14px] font-bold" style={{ color: tierMeta.color }}>{form.tier} Member</p>
              <p className="text-[12px]" style={{ color: tierMeta.color + 'CC' }}>{form.loyaltyPoints} loyalty points</p>
            </div>
            <span className="text-[13px] font-semibold" style={{ color: '#0E9AA7' }}>View tiers →</span>
          </div>

          <div className="divide-y divide-neutral-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[14px] font-medium text-neutral-800">Loyalty points</p>
                <p className="text-[12px] text-neutral-400">Earn 1 pt per GH₵1 spent</p>
              </div>
              <span className="text-[15px] font-bold text-neutral-900">{form.loyaltyPoints} pts</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[14px] font-medium text-neutral-800">Preferred outlet</p>
                <p className="text-[12px] text-neutral-400">Shown first when booking</p>
              </div>
              <button className="flex items-center gap-1 text-[14px] text-neutral-600 hover:text-neutral-900">
                {form.preferredOutlet} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="text-[14px] font-medium text-neutral-800">Member since</p>
              <span className="text-[14px] text-neutral-500">{form.memberSince}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="text-[14px] font-medium text-neutral-800">Customer ID</p>
              <span className="font-mono text-[13px] text-neutral-400">{MOCK_CUSTOMER.id}</span>
            </div>
          </div>
        </SettingsSection>

        {/* ── 5. Linked accounts ────────────────────────────────────────────── */}
        <SettingsSection id="linked" icon={Link2} title="Linked accounts" helper="Sign in faster by connecting a social account">
          {[
            { key: 'linkedGoogle',    label: 'Google',    color: '#4285F4', bg: '#EEF3FE' },
            { key: 'linkedFacebook',  label: 'Facebook',  color: '#1877F2', bg: '#EEF3FE' },
            { key: 'linkedApple',     label: 'Apple',     color: '#1D1D1F', bg: '#F3F4F6' },
            { key: 'linkedWhatsApp',  label: 'WhatsApp',  color: '#25D366', bg: '#E8F9EE' },
          ].map(({ key, label, color, bg }) => {
            const linked = form[key];
            return (
              <div key={key} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: bg }}>
                    <span className="text-[12px] font-bold" style={{ color }}>{label[0]}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-800">{label}</p>
                    <p className="text-[12px] text-neutral-400">{linked ? 'Connected' : 'Not connected'}</p>
                  </div>
                </div>
                {linked ? (
                  <button
                    onClick={() => setForm(f => ({ ...f, [key]: false }))}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setForm(f => ({ ...f, [key]: true }))}
                    className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:opacity-90"
                    style={{ background: color }}
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </SettingsSection>
      </CustomerSettingsLayout>

      {/* Photo crop modal */}
      {showCropModal && photoPreview && (
        <PhotoModal
          preview={photoPreview}
          onConfirm={confirmPhoto}
          onCancel={() => { setShowCropModal(false); setPhotoPreview(null); }}
        />
      )}
    </>
  );
}
