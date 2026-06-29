import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice.js';
import {
  User, Building2, MapPin, ClipboardList, Info, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import CollapsibleSection from '../../components/ui/CollapsibleSection.jsx';
import SelectField from '../../components/forms/SelectField.jsx';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import DuplicateCheckBanner from '../../features/staff/DuplicateCheckBanner.jsx';
import { MOCK_OUTLETS } from '../../data/mockStaff.js';
import { ID_TYPES } from '../../utils/identityOptions.js';

const REFERRAL_SOURCES = [
  'Walk-by / Signage', 'Referral from existing customer', 'Social media',
  'Google / Online search', 'Flyer / Brochure', 'Radio / TV', 'Other',
];
const SUBURB_SUGGESTIONS = ['Osu', 'Cantonments', 'Labone', 'Airport City', 'East Legon', 'Adabraka'];

const randomId = () => `CUST-2024-${String(Math.floor(1000 + Math.random() * 9000))}`;
const isValidGhanaPhone = val => /^0\d{9}$/.test(val.replace(/\s/g, ''));
const isValidGpsCode    = val => !val || /^[A-Z]{2}-\d{3,4}-\d{4}$/i.test(val);

const CustomerTypeCard = ({ type, selected, onClick }) => {
  const isIndividual = type === 'individual';
  const Icon  = isIndividual ? User : Building2;
  const label = isIndividual ? 'Individual Customer' : 'Corporate / Business Account';
  const desc  = isIndividual ? 'Personal laundry account' : 'Company or business billing account';
  return (
    <button type="button" onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-3 rounded-xl border-2 px-6 py-6 text-center transition-all ${
        selected ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={selected ? { background: '#EBF2FD' } : { background: '#F3F4F6' }}>
        <Icon className="h-6 w-6" style={{ color: selected ? '#0C5FC5' : '#6B7280' }} />
      </div>
      <div>
        <p className={`text-small font-semibold ${selected ? 'text-primary-700' : 'text-neutral-800'}`}>{label}</p>
        <p className="mt-0.5 text-caption text-neutral-400">{desc}</p>
      </div>
      <div className={`h-4 w-4 rounded-full border-2 transition-all ${selected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white'}`} />
    </button>
  );
};

const SuccessState = ({ customerId, onCreateOrder, onViewProfile, onRegisterAnother }) => (
  <div className="rounded-xl border border-green-200 bg-green-50 p-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-7 w-7 text-green-600" />
      </div>
      <div>
        <p className="text-body font-bold text-green-900">Customer registered successfully!</p>
        <p className="mt-1 text-small text-green-700">Customer ID: <span className="font-mono font-bold">{customerId}</span></p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <Button variant="primary" onClick={onCreateOrder}>Create Order Now</Button>
        <Button variant="outline" onClick={onViewProfile}>View Profile</Button>
        <Button variant="ghost" onClick={onRegisterAnother}>Register Another</Button>
      </div>
    </div>
  </div>
);

const INIT_STATE = {
  customerType: 'individual',
  firstName: '', lastName: '', phone: '', email: '',
  dob: '', gender: '', altPhone: '', companyName: '',
  idType: '', idNumber: '',
  referralSource: '', referralCode: '', staffNotes: '',
  street: '', suburb: '', city: 'Accra', gps: '',
  outlet: '', instructions: '',
};

const WalkInRegistrationPage = () => {
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const allowedRoles = ['owner', 'ops_manager', 'receptionist', 'cashier', 'front_desk'];
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="mb-1 text-lg font-semibold text-neutral-800">Access restricted</h2>
        <p className="max-w-xs text-sm text-neutral-500">You don't have permission to register walk-in customers. Contact your manager.</p>
      </div>
    );
  }

  const [form, setForm]           = useState(INIT_STATE);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showAddress, setShowAddress]       = useState(false);
  const [showPrefs, setShowPrefs]           = useState(false);
  const [showSuburbSuggestions, setShowSuburbSuggestions] = useState(false);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId]   = useState(null);

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!form.phone.trim())     e.phone     = 'Phone number is required.';
    else if (!isValidGhanaPhone(form.phone)) e.phone = 'Enter a valid Ghana phone number (starts with 0, 10 digits).';
    if (form.customerType === 'corporate' && !form.companyName.trim()) e.companyName = 'Company name is required for corporate accounts.';
    if (form.gps && !isValidGpsCode(form.gps)) e.gps = 'Format: GA-XXX-XXXX (e.g. GA-123-4567).';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccessId(randomId()); }, 1000);
  };

  const handleRegisterAnother = () => {
    setSuccessId(null);
    setForm(INIT_STATE);
    setShowAdditional(false);
    setErrors({});
  };

  const inputCls = (err) =>
    `h-11 flex-1 rounded-lg border px-3.5 text-small text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-2 ${
      err ? 'border-error bg-error-bg focus:border-error focus:ring-error-bg'
          : 'border-neutral-200 bg-white focus:border-primary-400 focus:ring-primary-100'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Management', to: '/' }, { label: 'Customers', to: '/customers' }, { label: 'Register Walk-In' }]} />
        <h1 className="text-[22px] font-bold tracking-tight text-neutral-900">Register Walk-In Customer</h1>
        <p className="mt-0.5 text-sm text-neutral-400">Create a customer account for a new walk-in customer</p>
      </div>

      {successId && (
        <SuccessState
          customerId={successId}
          onCreateOrder={() => navigate('/staff/orders/new')}
          onViewProfile={() => navigate('/staff/customers')}
          onRegisterAnother={handleRegisterAnother}
        />
      )}

      {!successId && (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Customer type */}
          <div>
            <p className="mb-3 text-caption font-semibold uppercase tracking-widest text-neutral-400">CUSTOMER TYPE</p>
            <div className="flex gap-4">
              <CustomerTypeCard type="individual" selected={form.customerType === 'individual'} onClick={() => setForm(f => ({ ...f, customerType: 'individual' }))} />
              <CustomerTypeCard type="corporate"  selected={form.customerType === 'corporate'}  onClick={() => setForm(f => ({ ...f, customerType: 'corporate' }))} />
            </div>
          </div>

          {/* Personal information */}
          <div className="space-y-5 rounded-lg border border-neutral-200 bg-white p-6">
            <p className="text-caption font-semibold uppercase tracking-widest text-neutral-400">PERSONAL INFORMATION</p>

            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" required placeholder="e.g. Kwame" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
              <Input label="Last name"  required placeholder="e.g. Mensah" value={form.lastName}  onChange={set('lastName')}  error={errors.lastName} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Phone number <span className="ml-0.5 text-error">*</span></label>
              <div className="flex gap-2">
                <div className="flex h-11 flex-shrink-0 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3">
                  <span className="text-body">🇬🇭</span>
                  <span className="text-small text-neutral-500">+233</span>
                </div>
                <input type="tel" placeholder="0XX XXX XXXX" value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(err => ({ ...err, phone: undefined })); }}
                  className={inputCls(errors.phone)} />
              </div>
              {errors.phone
                ? <p className="text-caption text-error-text">{errors.phone}</p>
                : <p className="text-caption text-neutral-400">Ghana format: starts with 0, 10 digits total</p>
              }
            </div>

            <DuplicateCheckBanner phone={form.phone} />

            {form.customerType === 'corporate' && (
              <Input label="Company / Business name" required placeholder="e.g. Accra Textiles Ltd."
                value={form.companyName} onChange={set('companyName')} error={errors.companyName} />
            )}

            <Input label="Email address" type="email" placeholder="optional" value={form.email} onChange={set('email')}
              helper="Optional — used for order notifications and receipts" />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Date of birth" type="date" value={form.dob} onChange={set('dob')} helper="Optional" />
              <SelectField label="Gender" value={form.gender} onChange={set('gender')}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </SelectField>
            </div>

            <Input label="Alternate phone" type="tel" placeholder="Optional secondary number" value={form.altPhone} onChange={set('altPhone')}
              helper="Optional — family member or emergency contact" />

            <div className="grid grid-cols-2 gap-4">
              <SelectField label="ID type" value={form.idType} onChange={set('idType')}>
                <option value="">Select…</option>
                {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
              <Input label="ID number" placeholder={form.idType ? 'Enter ID number' : '—'} value={form.idNumber}
                disabled={!form.idType} onChange={set('idNumber')} helper="Optional — for KYC compliance" />
            </div>
          </div>

          {/* Address */}
          <CollapsibleSection title="Add delivery address?" icon={MapPin} open={showAddress} onToggle={() => setShowAddress(v => !v)}>
            <Input label="Street address" placeholder="e.g. 14 Cantonments Road" value={form.street} onChange={set('street')} />

            <div className="relative flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Suburb / Area</label>
              <input type="text" placeholder="e.g. Osu" value={form.suburb}
                onChange={e => { setForm(f => ({ ...f, suburb: e.target.value })); setShowSuburbSuggestions(true); }}
                onFocus={() => setShowSuburbSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuburbSuggestions(false), 150)}
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              {showSuburbSuggestions && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
                  {SUBURB_SUGGESTIONS
                    .filter(s => !form.suburb || s.toLowerCase().includes(form.suburb.toLowerCase()))
                    .map(s => (
                      <button key={s} type="button" onMouseDown={() => { setForm(f => ({ ...f, suburb: s })); setShowSuburbSuggestions(false); }}
                        className="flex w-full items-center px-4 py-2.5 text-small text-neutral-800 transition-colors hover:bg-neutral-50">
                        {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <Input label="City" value={form.city} onChange={set('city')} />
            <Input label="Ghana Post GPS" placeholder="GA-XXX-XXXX" value={form.gps}
              onChange={e => { setForm(f => ({ ...f, gps: e.target.value })); setErrors(err => ({ ...err, gps: undefined })); }}
              error={errors.gps} helper="Optional — format: GA-123-4567" />
          </CollapsibleSection>

          {/* Laundry preferences */}
          <CollapsibleSection title="Laundry preferences" icon={ClipboardList} open={showPrefs} onToggle={() => setShowPrefs(v => !v)}>
            <SelectField label="Preferred outlet" value={form.outlet} onChange={set('outlet')}>
              <option value="">Select outlet…</option>
              {MOCK_OUTLETS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </SelectField>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Special instructions</label>
              <textarea rows={3} value={form.instructions} onChange={set('instructions')}
                placeholder="e.g. Handle with care, no bleach"
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-small text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
          </CollapsibleSection>

          {/* Additional info */}
          <CollapsibleSection title="Additional info & referral" icon={Info} open={showAdditional} onToggle={() => setShowAdditional(v => !v)}>
            <SelectField label="How did they hear about us?" value={form.referralSource} onChange={set('referralSource')}>
              <option value="">Select source…</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectField>
            <Input label="Referral code" placeholder="e.g. REF-ABC123" value={form.referralCode} onChange={set('referralCode')}
              helper="Optional — if referred by an existing customer" />
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Staff notes</label>
              <textarea rows={3} value={form.staffNotes} onChange={set('staffNotes')}
                placeholder="e.g. Customer prefers call-back, items include delicate fabrics…"
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-small text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              <p className="text-caption text-neutral-400">Internal only — not visible to customer</p>
            </div>
          </CollapsibleSection>

          {/* Footer */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-6 py-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Register Customer</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WalkInRegistrationPage;
