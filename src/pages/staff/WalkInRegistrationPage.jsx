import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice.js';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import {
  User, Building2, ChevronDown, ChevronUp, CheckCircle2,
  AlertTriangle, Loader2, MapPin, ClipboardList, Info,
} from 'lucide-react';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_OUTLETS = [
  { id: 'osu',     label: 'HQ — Osu' },
  { id: 'spintex', label: 'Spintex Outlet' },
  { id: 'tema',    label: 'Tema Factory' },
];

const REFERRAL_SOURCES = [
  'Walk-by / Signage', 'Referral from existing customer', 'Social media',
  'Google / Online search', 'Flyer / Brochure', 'Radio / TV', 'Other',
];

const ID_TYPES = [
  'Ghana Card (National ID)', 'Voter ID', "Driver's License", 'Passport',
];

const SUBURB_SUGGESTIONS = ['Osu', 'Cantonments', 'Labone', 'Airport City', 'East Legon', 'Adabraka'];

// Simulated duplicate-check: phone 0200000000 returns a match
const MOCK_DUPLICATE = { phone: '0200000000', name: 'Adwoa M.' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const randomId = () => `CUST-2024-${String(Math.floor(1000 + Math.random() * 9000))}`;

const isValidGhanaPhone = (val) => /^0\d{9}$/.test(val.replace(/\s/g, ''));

const isValidGpsCode = (val) => !val || /^[A-Z]{2}-\d{3,4}-\d{4}$/i.test(val);

// ─── Select (reusable small) ─────────────────────────────────────────────────

const SelectField = ({ label, required, value, onChange, children, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-small font-semibold text-neutral-800">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
      style={{ borderRadius: 8 }}
    >
      {children}
    </select>
    {error && <p className="text-caption text-error-text">{error}</p>}
  </div>
);

// ─── Customer Type Card ────────────────────────────────────────────────────────

const CustomerTypeCard = ({ type, selected, onClick }) => {
  const isIndividual = type === 'individual';
  const Icon = isIndividual ? User : Building2;
  const label = isIndividual ? 'Individual Customer' : 'Corporate / Business Account';
  const desc  = isIndividual ? 'Personal laundry account' : 'Company or business billing account';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-3 rounded-xl border-2 px-6 py-6 text-center transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={selected ? { background: '#EBF2FD' } : { background: '#F3F4F6' }}
      >
        <Icon className="h-6 w-6" style={{ color: selected ? '#0C5FC5' : '#6B7280' }} />
      </div>
      <div>
        <p className={`text-small font-semibold ${selected ? 'text-primary-700' : 'text-neutral-800'}`}>{label}</p>
        <p className="mt-0.5 text-caption text-neutral-400">{desc}</p>
      </div>
      <div
        className={`h-4 w-4 rounded-full border-2 transition-all ${
          selected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white'
        }`}
      />
    </button>
  );
};

// ─── Collapsible Section ───────────────────────────────────────────────────────

const CollapsibleSection = ({ title, icon: Icon, open, onToggle, children }) => (
  <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-neutral-400" />
        <span className="text-small font-semibold text-neutral-800">{title}</span>
      </div>
      {open ? (
        <ChevronUp className="h-4 w-4 text-neutral-400" />
      ) : (
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      )}
    </button>
    {open && (
      <div className="border-t border-neutral-100 px-5 pb-5 pt-4 space-y-4">
        {children}
      </div>
    )}
  </div>
);

// ─── Duplicate Check Banner ───────────────────────────────────────────────────

const DuplicateCheckBanner = ({ phone }) => {
  const [status, setStatus] = useState('idle'); // idle | checking | clear | match
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isValidGhanaPhone(phone)) {
      setStatus('idle');
      return;
    }
    setStatus('checking');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (phone.replace(/\s/g, '') === MOCK_DUPLICATE.phone) {
        setStatus('match');
      } else {
        setStatus('clear');
      }
    }, 1200);
    return () => clearTimeout(timerRef.current);
  }, [phone]);

  if (status === 'idle') return null;

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
        <p className="text-small text-neutral-500">Checking for existing account…</p>
      </div>
    );
  }

  if (status === 'clear') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
        <p className="text-small text-green-700 font-medium">No existing account found. Proceed to register.</p>
      </div>
    );
  }

  if (status === 'match') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-small font-semibold text-amber-800">
              Customer with this phone may already exist: {MOCK_DUPLICATE.name}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-caption font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
              >
                View profile
              </button>
              <button
                type="button"
                className="rounded-md border border-transparent px-3 py-1.5 text-caption font-semibold text-amber-600 hover:bg-amber-100 transition-colors"
              >
                Continue anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ─── Success State ────────────────────────────────────────────────────────────

const SuccessState = ({ customerId, onCreateOrder, onViewProfile, onRegisterAnother }) => (
  <div className="rounded-xl border border-green-200 bg-green-50 p-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-7 w-7 text-green-600" />
      </div>
      <div>
        <p className="text-body font-bold text-green-900">Customer registered successfully!</p>
        <p className="mt-1 text-small text-green-700">
          Customer ID: <span className="font-mono font-bold">{customerId}</span>
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <Button variant="primary" onClick={onCreateOrder}>
          Create Order Now
        </Button>
        <Button variant="outline" onClick={onViewProfile}>
          View Profile
        </Button>
        <Button variant="ghost" onClick={onRegisterAnother}>
          Register Another
        </Button>
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const WalkInRegistrationPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const allowedRoles = ['owner', 'ops_manager', 'receptionist', 'cashier', 'front_desk'];
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-1">Access restricted</h2>
        <p className="text-sm text-neutral-500 max-w-xs">You don't have permission to register walk-in customers. Contact your manager.</p>
      </div>
    );
  }

  // Customer type
  const [customerType, setCustomerType] = useState('individual');

  // Personal info
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]     = useState('');
  const [phone,       setPhone]        = useState('');
  const [email,       setEmail]        = useState('');
  const [dob,         setDob]          = useState('');
  const [gender,      setGender]       = useState('');
  const [altPhone,    setAltPhone]     = useState('');
  const [companyName, setCompanyName]  = useState('');
  const [idType,      setIdType]       = useState('');
  const [idNumber,    setIdNumber]     = useState('');

  // Additional info (collapsible)
  const [showAdditional, setShowAdditional] = useState(false);
  const [referralSource, setReferralSource] = useState('');
  const [referralCode,   setReferralCode]   = useState('');
  const [staffNotes,     setStaffNotes]     = useState('');

  // Address (collapsible)
  const [showAddress, setShowAddress]   = useState(false);
  const [street,      setStreet]        = useState('');
  const [suburb,      setSuburb]        = useState('');
  const [showSuburbSuggestions, setShowSuburbSuggestions] = useState(false);
  const [city,        setCity]          = useState('Accra');
  const [gps,         setGps]           = useState('');

  // Preferences (collapsible)
  const [showPrefs,    setShowPrefs]   = useState(false);
  const [outlet,       setOutlet]      = useState('');
  const [instructions, setInstructions] = useState('');

  // Form state
  const [errors,    setErrors]    = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successId,  setSuccessId] = useState(null);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!firstName.trim())                  e.firstName = 'First name is required.';
    if (!lastName.trim())                   e.lastName  = 'Last name is required.';
    if (!phone.trim())                      e.phone     = 'Phone number is required.';
    else if (!isValidGhanaPhone(phone))     e.phone     = 'Enter a valid Ghana phone number (starts with 0, 10 digits).';
    if (customerType === 'corporate' && !companyName.trim()) e.companyName = 'Company name is required for corporate accounts.';
    if (gps && !isValidGpsCode(gps))        e.gps       = 'Format: GA-XXX-XXXX (e.g. GA-123-4567).';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Simulate async registration
    setTimeout(() => {
      setSubmitting(false);
      setSuccessId(randomId());
    }, 1000);
  };

  const handleRegisterAnother = () => {
    setSuccessId(null);
    setFirstName(''); setLastName(''); setPhone(''); setEmail('');
    setDob(''); setGender(''); setAltPhone(''); setCompanyName('');
    setIdType(''); setIdNumber(''); setReferralSource(''); setReferralCode('');
    setStaffNotes(''); setStreet(''); setSuburb('');
    setCity('Accra'); setGps(''); setOutlet(''); setInstructions('');
    setCustomerType('individual'); setShowAdditional(false);
    setErrors({});
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <Breadcrumbs items={[
          { label: 'Management', to: '/' },
          { label: 'Customers', to: '/customers' },
          { label: 'Register Walk-In' },
        ]} />
        <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Register Walk-In Customer</h1>
        <p className="mt-0.5 text-sm text-neutral-400">
          Create a customer account for a new walk-in customer
        </p>
      </div>

      {/* Success state */}
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

          {/* ── Customer type selector ─────────────────────────────────────── */}
          <div>
            <p className="mb-3 text-caption font-semibold uppercase tracking-widest text-neutral-400">
              CUSTOMER TYPE
            </p>
            <div className="flex gap-4">
              <CustomerTypeCard
                type="individual"
                selected={customerType === 'individual'}
                onClick={() => setCustomerType('individual')}
              />
              <CustomerTypeCard
                type="corporate"
                selected={customerType === 'corporate'}
                onClick={() => setCustomerType('corporate')}
              />
            </div>
          </div>

          {/* ── Personal information card ──────────────────────────────────── */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-5">
            <p className="text-caption font-semibold uppercase tracking-widest text-neutral-400">
              PERSONAL INFORMATION
            </p>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                required
                placeholder="e.g. Kwame"
                value={firstName}
                onChange={e => { setFirstName(e.target.value); setErrors(err => ({ ...err, firstName: undefined })); }}
                error={errors.firstName}
              />
              <Input
                label="Last name"
                required
                placeholder="e.g. Mensah"
                value={lastName}
                onChange={e => { setLastName(e.target.value); setErrors(err => ({ ...err, lastName: undefined })); }}
                error={errors.lastName}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">
                Phone number <span className="text-error ml-0.5">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 flex-shrink-0">
                  <span className="text-body">🇬🇭</span>
                  <span className="text-small text-neutral-500">+233</span>
                </div>
                <input
                  type="tel"
                  placeholder="0XX XXX XXXX"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(err => ({ ...err, phone: undefined })); }}
                  className={`h-11 flex-1 rounded-lg border px-3.5 text-small text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-2 ${
                    errors.phone
                      ? 'border-error bg-error-bg focus:border-error focus:ring-error-bg'
                      : 'border-neutral-200 bg-white focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  style={{ borderRadius: 8 }}
                />
              </div>
              {errors.phone && <p className="text-caption text-error-text">{errors.phone}</p>}
              {!errors.phone && (
                <p className="text-caption text-neutral-400">Ghana format: starts with 0, 10 digits total</p>
              )}
            </div>

            {/* Duplicate check */}
            <DuplicateCheckBanner phone={phone} />

            {/* Company name (corporate only) */}
            {customerType === 'corporate' && (
              <Input
                label="Company / Business name"
                required
                placeholder="e.g. Accra Textiles Ltd."
                value={companyName}
                onChange={e => { setCompanyName(e.target.value); setErrors(err => ({ ...err, companyName: undefined })); }}
                error={errors.companyName}
              />
            )}

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              placeholder="optional"
              value={email}
              onChange={e => setEmail(e.target.value)}
              helper="Optional — used for order notifications and receipts"
            />

            {/* Date of birth + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                helper="Optional"
              />
              <SelectField
                label="Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </SelectField>
            </div>

            {/* Alternate phone */}
            <Input
              label="Alternate phone"
              type="tel"
              placeholder="Optional secondary number"
              value={altPhone}
              onChange={e => setAltPhone(e.target.value)}
              helper="Optional — family member or emergency contact"
            />

            {/* ID verification */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="ID type"
                value={idType}
                onChange={e => setIdType(e.target.value)}
              >
                <option value="">Select…</option>
                {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
              <Input
                label="ID number"
                placeholder={idType ? 'Enter ID number' : '—'}
                value={idNumber}
                disabled={!idType}
                onChange={e => setIdNumber(e.target.value)}
                helper="Optional — for KYC compliance"
              />
            </div>
          </div>

          {/* ── Address (collapsible) ──────────────────────────────────────── */}
          <CollapsibleSection
            title="Add delivery address?"
            icon={MapPin}
            open={showAddress}
            onToggle={() => setShowAddress(v => !v)}
          >
            <Input
              label="Street address"
              placeholder="e.g. 14 Cantonments Road"
              value={street}
              onChange={e => setStreet(e.target.value)}
            />

            {/* Suburb with suggestions */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-small font-semibold text-neutral-800">Suburb / Area</label>
              <input
                type="text"
                placeholder="e.g. Osu"
                value={suburb}
                onChange={e => { setSuburb(e.target.value); setShowSuburbSuggestions(true); }}
                onFocus={() => setShowSuburbSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuburbSuggestions(false), 150)}
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                style={{ borderRadius: 8 }}
              />
              {showSuburbSuggestions && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden">
                  {SUBURB_SUGGESTIONS
                    .filter(s => !suburb || s.toLowerCase().includes(suburb.toLowerCase()))
                    .map(s => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => { setSuburb(s); setShowSuburbSuggestions(false); }}
                        className="flex w-full items-center px-4 py-2.5 text-small text-neutral-800 hover:bg-neutral-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <Input
              label="City"
              value={city}
              onChange={e => setCity(e.target.value)}
            />

            <Input
              label="Ghana Post GPS"
              placeholder="GA-XXX-XXXX"
              value={gps}
              onChange={e => { setGps(e.target.value); setErrors(err => ({ ...err, gps: undefined })); }}
              error={errors.gps}
              helper="Optional — format: GA-123-4567"
            />
          </CollapsibleSection>

          {/* ── Laundry preferences (collapsible) ─────────────────────────── */}
          <CollapsibleSection
            title="Laundry preferences"
            icon={ClipboardList}
            open={showPrefs}
            onToggle={() => setShowPrefs(v => !v)}
          >
            <SelectField
              label="Preferred outlet"
              value={outlet}
              onChange={e => setOutlet(e.target.value)}
            >
              <option value="">Select outlet…</option>
              {MOCK_OUTLETS.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </SelectField>

            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Special instructions</label>
              <textarea
                rows={3}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Handle with care, no bleach"
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-small text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                style={{ borderRadius: 8 }}
              />
            </div>
          </CollapsibleSection>

          {/* ── Additional info (collapsible) ─────────────────────────────── */}
          <CollapsibleSection
            title="Additional info & referral"
            icon={Info}
            open={showAdditional}
            onToggle={() => setShowAdditional(v => !v)}
          >
            <SelectField
              label="How did they hear about us?"
              value={referralSource}
              onChange={e => setReferralSource(e.target.value)}
            >
              <option value="">Select source…</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectField>

            <Input
              label="Referral code"
              placeholder="e.g. REF-ABC123"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value)}
              helper="Optional — if referred by an existing customer"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">Staff notes</label>
              <textarea
                rows={3}
                value={staffNotes}
                onChange={e => setStaffNotes(e.target.value)}
                placeholder="e.g. Customer prefers call-back, items include delicate fabrics…"
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-small text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                style={{ borderRadius: 8 }}
              />
              <p className="text-caption text-neutral-400">Internal only — not visible to customer</p>
            </div>
          </CollapsibleSection>

          {/* ── Footer actions ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
            >
              Register Customer
            </Button>
          </div>

        </form>
      )}
    </div>
  );
};

export default WalkInRegistrationPage;
