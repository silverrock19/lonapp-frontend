import { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button.jsx';
import { Eye, EyeOff, Check } from 'lucide-react';
import { TITLES, ADMIN_ROLES } from '../../../utils/businessOptions.js';
import { ID_TYPES } from '../../../utils/identityOptions.js';


const inputCls = (err) =>
  `w-full rounded-md border px-3 py-2.5 text-small text-neutral-900 outline-none focus:ring-2 transition-all ${
    err ? 'border-error focus:ring-error/20' : 'border-neutral-200 focus:border-primary-400 focus:ring-primary-100'
  }`;
const selectCls = `w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all`;

// ── Sub-step 1: Admin Profile ────────────────────────────────
const ProfileForm = ({ data, onNext, onBack, onSaveDraft }) => {
  const [f, setF] = useState({ ...data });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setF(p => ({ ...p, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  const validate = () => {
    const e = {};
    if (!f.firstName.trim()) e.firstName = 'First name is required';
    if (!f.lastName.trim())  e.lastName  = 'Last name is required';
    if (!f.phone.trim())     e.phone     = 'Phone number is required';
    if (!f.role)             e.role      = 'Select your role';
    if (!f.idType)           e.idType    = 'Select an ID type';
    if (!f.idDoc)            e.idDoc     = 'Upload your ID document';
    return e;
  }

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(f);
  }

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Admin Account</h2>
      <p className="mt-1 mb-2 text-body text-neutral-500">Create the primary admin account for your business.</p>
      <div className="mb-6 flex gap-1.5">
        {['Profile', 'Verify', 'Password'].map((s, i) => (
          <div key={s} className={`flex h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-primary-500' : 'bg-neutral-200'}`} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Title</label>
            <select className={selectCls} value={f.title} onChange={e => set('title', e.target.value)}>
              <option value="">—</option>
              {TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">First name *</label>
            <input className={inputCls(errors.firstName)} value={f.firstName}
              placeholder="Ama" onChange={e => set('firstName', e.target.value)} />
            {errors.firstName && <p className="mt-0.5 text-caption text-error">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Last name *</label>
            <input className={inputCls(errors.lastName)} value={f.lastName}
              placeholder="Kufuor" onChange={e => set('lastName', e.target.value)} />
            {errors.lastName && <p className="mt-0.5 text-caption text-error">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Phone *</label>
            <input type="tel" className={inputCls(errors.phone)} value={f.phone}
              placeholder="+233 24 000 0000" onChange={e => set('phone', e.target.value)} />
            {errors.phone && <p className="mt-0.5 text-caption text-error">{errors.phone}</p>}
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">WhatsApp <span className="text-neutral-400">(optional)</span></label>
            <input type="tel" className={inputCls(false)} value={f.whatsapp}
              placeholder="Same as phone?" onChange={e => set('whatsapp', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Role in business *</label>
            <select className={`${selectCls} ${errors.role ? 'border-error' : ''}`}
              value={f.role} onChange={e => set('role', e.target.value)}>
              <option value="">Select role…</option>
              {ADMIN_ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            {errors.role && <p className="mt-0.5 text-caption text-error">{errors.role}</p>}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
          <p className="text-small font-semibold text-neutral-700">Identity verification</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">ID type *</label>
              <select className={`${selectCls} ${errors.idType ? 'border-error' : ''}`}
                value={f.idType} onChange={e => set('idType', e.target.value)}>
                <option value="">Select ID type…</option>
                {ID_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {errors.idType && <p className="mt-0.5 text-caption text-error">{errors.idType}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Upload ID *</label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-small transition-all ${
                errors.idDoc ? 'border-error bg-white' : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50'
              }`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                  onChange={e => { if (e.target.files[0]) set('idDoc', { name: e.target.files[0].name, file: e.target.files[0] }); }} />
                <span className={f.idDoc ? 'text-neutral-800' : 'text-neutral-400'}>
                  {f.idDoc?.name ?? f.idDoc ?? 'Upload PDF or JPG'}
                </span>
              </label>
              {errors.idDoc && <p className="mt-0.5 text-caption text-error">{errors.idDoc}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={() => onSaveDraft(f)}>Save draft</Button>
          <Button type="button" onClick={handleNext}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-step 2: OTP ─────────────────────────────────────────
const OtpForm = ({ phone, onNext, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [resent, setResent] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      refs.current[5]?.focus();
    }
    e.preventDefault();
  }

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }
    if (attempts >= 2) { setError('Too many attempts. Please request a new code.'); return; }

    // Mock: accept "123456" as valid
    if (code !== '123456') {
      setAttempts(a => a + 1);
      setError(`Incorrect code. ${2 - attempts} attempt${attempts === 1 ? '' : 's'} remaining.`);
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
      return;
    }
    onNext();
  }

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setAttempts(0);
    setError('');
    setResent(true);
    refs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Verify Your Phone</h2>
      <p className="mt-1 mb-2 text-body text-neutral-500">
        Enter the 6-digit code sent to <strong className="text-neutral-800">{phone || '+233 ··· ···'}</strong>
      </p>
      <div className="mb-6 flex gap-1.5">
        {['Profile', 'Verify', 'Password'].map((s, i) => (
          <div key={s} className={`flex h-1.5 flex-1 rounded-full ${i <= 1 ? 'bg-primary-500' : 'bg-neutral-200'}`} />
        ))}
      </div>

      <div className="flex gap-3 justify-center mb-5" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`h-14 w-12 rounded-xl border-2 text-center text-h3 font-bold text-neutral-900 outline-none transition-all ${
              error ? 'border-error bg-error/5' :
              digit ? 'border-primary-400 bg-primary-50' :
                      'border-neutral-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
            }`}
          />
        ))}
      </div>

      {error && <p className="mb-4 text-center text-small text-error">{error}</p>}
      {resent && <p className="mb-4 text-center text-small text-success">Code resent successfully.</p>}

      <p className="mb-6 text-center text-small text-neutral-500">
        Code expires in <strong>10 min</strong> ·{' '}
        <button type="button" onClick={handleResend} className="text-primary-600 hover:underline font-medium">
          Resend code
        </button>
      </p>

      <p className="text-center text-caption text-neutral-400 mb-2">
        For testing: use code <strong>123456</strong>
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <Button type="button" onClick={handleVerify}>Verify &amp; Continue →</Button>
      </div>
    </div>
  );
}

// ── Sub-step 3: Password ─────────────────────────────────────
const PasswordForm = ({ email, onNext, onBack, onSaveDraft }) => {
  const [f, setF] = useState({ password: '', confirm: '', terms: false, privacy: false });
  const [show, setShow]   = useState({ pw: false, confirm: false });
  const [errors, setErrors] = useState({});

  const pw = f.password;
  const rules = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: '1 uppercase letter',    ok: /[A-Z]/.test(pw) },
    { label: '1 number',              ok: /\d/.test(pw) },
    { label: '1 special character',   ok: /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const validate = () => {
    const e = {};
    if (!pw)                           e.password = 'Password is required';
    else if (rules.some(r => !r.ok))   e.password = 'Password does not meet requirements';
    if (!f.confirm)                    e.confirm  = 'Confirm your password';
    else if (pw !== f.confirm)         e.confirm  = 'Passwords do not match';
    if (!f.terms)   e.terms   = 'Accept the Terms of Service to continue';
    if (!f.privacy) e.privacy = 'Accept the Privacy Policy to continue';
    return e;
  }

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext({ email, password: f.password });
  }

  const set = (field, value) => {
    setF(p => ({ ...p, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Set Your Password</h2>
      <p className="mt-1 mb-2 text-body text-neutral-500">Create a secure password for your admin account.</p>
      <div className="mb-6 flex gap-1.5">
        {['Profile', 'Verify', 'Password'].map((s, i) => (
          <div key={s} className={`flex h-1.5 flex-1 rounded-full bg-primary-500`} />
        ))}
      </div>

      <div className="space-y-4">
        {/* Read-only email */}
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Email address</label>
          <input readOnly value={email || ''}
            className="w-full rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-small text-neutral-500 outline-none cursor-default" />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Password *</label>
          <div className="relative">
            <input type={show.pw ? 'text' : 'password'}
              className={`${inputCls(errors.password)} pr-10`}
              placeholder="Create a strong password"
              value={f.password} onChange={e => set('password', e.target.value)} />
            <button type="button" onClick={() => setShow(s => ({ ...s, pw: !s.pw }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {show.pw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-caption text-error">{errors.password}</p>}
          {/* Rules */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            {rules.map(r => (
              <div key={r.label} className={`flex items-center gap-1.5 text-caption ${r.ok ? 'text-success' : 'text-neutral-400'}`}>
                <Check className={`h-3 w-3 flex-shrink-0 ${r.ok ? 'text-success' : 'text-neutral-300'}`} />
                {r.label}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Confirm password *</label>
          <div className="relative">
            <input type={show.confirm ? 'text' : 'password'}
              className={`${inputCls(errors.confirm)} pr-10`}
              placeholder="Re-enter your password"
              value={f.confirm} onChange={e => set('confirm', e.target.value)} />
            <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm && <p className="mt-1 text-caption text-error">{errors.confirm}</p>}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2.5 pt-1">
          {[
            { key: 'terms',   label: 'I agree to the Terms of Service', error: errors.terms },
            { key: 'privacy', label: 'I have read the Privacy Policy',  error: errors.privacy },
          ].map(({ key, label, error }) => (
            <div key={key}>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-primary-500"
                  checked={f[key]} onChange={e => set(key, e.target.checked)} />
                <span className="text-small text-neutral-700">{label}</span>
              </label>
              {error && <p className="mt-0.5 ml-7 text-caption text-error">{error}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <Button type="button" onClick={handleNext}>Finish &amp; Review →</Button>
      </div>
    </div>
  );
}

// ── Orchestrator ─────────────────────────────────────────────
const Step5Admin = ({ data, onNext, onBack, onSaveDraft }) => {
  const [sub, setSub] = useState(data.sub || 0);
  const [profileData, setProfileData]   = useState(data.profile   || { title: '', firstName: '', lastName: '', phone: data.companyPhone || '', whatsapp: '', role: '', idType: '', idDoc: '' });
  const [passwordData, setPasswordData] = useState(data.password  || {});

  const onProfileNext = (d) =>  { setProfileData(d);   setSub(1); }
  const onOtpNext = () =>       {                       setSub(2); }
  const onPasswordNext = (d) => { setPasswordData(d); onNext({ profile: profileData, password: d }); }

  if (sub === 0) return <ProfileForm  data={profileData} onNext={onProfileNext}
    onBack={onBack} onSaveDraft={d => onSaveDraft({ profile: d })} />;
  if (sub === 1) return <OtpForm      phone={profileData.phone} onNext={onOtpNext}
    onBack={() => setSub(0)} />;
  return          <PasswordForm email={data.companyEmail || ''} onNext={onPasswordNext}
    onBack={() => setSub(1)} onSaveDraft={d => onSaveDraft({ profile: profileData, password: d })} />;
}

export default Step5Admin;


