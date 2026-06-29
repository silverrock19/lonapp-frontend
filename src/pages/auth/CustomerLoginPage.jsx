import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronLeft, Fingerprint, Shield } from 'lucide-react';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
import useForm from '../../hooks/useForm.js';
import Brandmark from '../../components/ui/Brandmark.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';
import FacebookIcon from '../../components/icons/FacebookIcon.jsx';
import AppleIcon from '../../components/icons/AppleIcon.jsx';
import WhatsAppIcon from '../../components/icons/WhatsAppIcon.jsx';

// ── Mock social profiles returned by OAuth providers ─────────────────────────
const MOCK_SOCIAL = {
  google:   { firstName: 'Adwoa',  lastName: 'Mensah',  email: 'adwoa.mensah@gmail.com',   provider: 'Google',   color: '#4285F4' },
  facebook: { firstName: 'Kofi',   lastName: 'Asante',  email: 'kofi.asante@outlook.com',  provider: 'Facebook', color: '#1877F2' },
  apple:    { firstName: 'Ama',    lastName: 'Boateng', email: 'ama.boateng@icloud.com',   provider: 'Apple',    color: '#1D1D1F' },
  whatsapp: { firstName: '',       lastName: '',          email: '',                          provider: 'WhatsApp', color: '#25D366' },
};

// Mock: this account has 2FA enabled
const MOCK_PHONE_HINT = '+233 24 *** 7890';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

function detectMode(val) {
  if (!val) return 'email';
  if (/^[\d+()\s-]/.test(val)) return 'phone';
  return 'email';
}

// ── Reusable 6-digit OTP boxes ───────────────────────────────────────────────
function OtpBoxes({ otp, setOtp, autoFocus }) {
  const refs = useRef([]);
  useEffect(() => { if (autoFocus) refs.current[0]?.focus(); }, [autoFocus]);

  function handleChange(i, val) {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  }
  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  }
  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...Array(6).fill('')];
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className="h-14 w-12 rounded-xl border text-center text-[22px] font-bold outline-none transition-all"
          style={{ borderRadius: 8, borderColor: digit ? '#0E9AA7' : '#E5E7EB', color: '#111827' }}
          onFocus={e => { e.target.style.borderColor = '#0E9AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(14,154,167,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = digit ? '#0E9AA7' : '#E5E7EB'; e.target.style.boxShadow = ''; }}
        />
      ))}
    </div>
  );
}

// ── Social login button ───────────────────────────────────────────────────────
function SocialBtn({ icon: Icon, label, onClick, iconColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 text-[14px] font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 active:bg-neutral-100"
    >
      <Icon style={{ color: iconColor }} />
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // step: 'login' | 'two_fa' | 'social_review' | 'locked'
  const [step, setStep] = useState('login');
  const [provider, setProvider] = useState(null);
  const [socialForm, setSocialForm] = useState({ firstName: '', lastName: '', email: '', phone: '', terms: false, privacy: false });
  const [socialErrors, setSocialErrors] = useState({});

  const { form, setForm, errors, setErrors, set } = useForm({ identifier: '', password: '', remember: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // 2FA state
  const [twoFaOtp, setTwoFaOtp] = useState(Array(6).fill(''));
  const [twoFaTrust, setTwoFaTrust] = useState(false);
  const [twoFaCooldown, setTwoFaCooldown] = useState(30);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');

  // Lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const t = setInterval(() => {
      setLockoutRemaining(s => {
        if (s <= 1) { setStep('login'); setFailedAttempts(0); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutRemaining]);

  // 2FA resend countdown
  useEffect(() => {
    if (step !== 'two_fa' || twoFaCooldown <= 0) return;
    const t = setInterval(() => setTwoFaCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step, twoFaCooldown]);

  const inputMode = detectMode(form.identifier);

  function validate() {
    const e = {};
    if (!form.identifier) {
      e.identifier = 'Email or phone number is required';
    } else if (inputMode === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)) {
      e.identifier = 'Enter a valid email address';
    } else if (inputMode === 'phone' && !/^\+?[\d\s\-().]{7,}$/.test(form.identifier)) {
      e.identifier = 'Enter a valid phone number';
    }
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      await new Promise(r => setTimeout(r, 700));
      // Mock: wrong password on first 4 tries if identifier is "fail@test.com"
      if (form.identifier === 'fail@test.com') {
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        if (next >= MAX_ATTEMPTS) {
          setLockoutRemaining(LOCKOUT_SECONDS);
          setStep('locked');
        } else {
          setServerError(`Incorrect email or password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? 's' : ''} remaining.`);
        }
        return;
      }
      // Mock: 2FA required for demo@test.com
      if (form.identifier === 'demo@test.com' || form.identifier === '0241234567') {
        setTwoFaOtp(Array(6).fill(''));
        setTwoFaCooldown(30);
        setStep('two_fa');
        return;
      }
      // Success — navigate to app
      navigate('/app');
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSocialClick(providerKey) {
    const profile = MOCK_SOCIAL[providerKey];
    setProvider(providerKey);
    setSocialForm({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email, phone: '', terms: false, privacy: false });
    setSocialErrors({});
    setStep('social_review');
  }

  function handleSocialSubmit(e) {
    e.preventDefault();
    const se = {};
    if (!socialForm.firstName.trim()) se.firstName = 'First name is required';
    if (!socialForm.lastName.trim()) se.lastName = 'Last name is required';
    if (!socialForm.email.trim()) se.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socialForm.email)) se.email = 'Enter a valid email address';
    if (!socialForm.terms) se.terms = 'You must agree to the Terms of Service';
    if (!socialForm.privacy) se.privacy = 'You must agree to the Privacy Policy';
    if (Object.keys(se).length) { setSocialErrors(se); return; }
    navigate('/app');
  }

  async function handleTwoFaVerify() {
    if (twoFaOtp.join('').length < 6) { setTwoFaError('Enter all 6 digits'); return; }
    setTwoFaLoading(true);
    setTwoFaError('');
    try {
      await new Promise(r => setTimeout(r, 800));
      navigate('/app');
    } catch {
      setTwoFaError('Incorrect code. Please try again.');
    } finally {
      setTwoFaLoading(false);
    }
  }

  function handleTwoFaResend() {
    if (twoFaCooldown > 0) return;
    setTwoFaCooldown(60);
    setTwoFaOtp(Array(6).fill(''));
  }

  const providerInfo = provider ? MOCK_SOCIAL[provider] : null;

  // ── 2FA screen ──────────────────────────────────────────────────────────────
  if (step === 'two_fa') {
    const isComplete = twoFaOtp.every(d => d !== '');
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#E8F9FA' }}>
          <Shield className="h-7 w-7" style={{ color: '#0E9AA7' }} />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Two-Step Verification</h1>
          <p className="mt-2 text-[15px] text-neutral-500 leading-relaxed">
            We sent a 6-digit code to <strong className="text-neutral-700">{MOCK_PHONE_HINT}</strong>.
            <br />It expires in 5 minutes.
          </p>
        </div>

        {twoFaError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {twoFaError}
          </div>
        )}

        <OtpBoxes otp={twoFaOtp} setOtp={setTwoFaOtp} autoFocus />

        <label className="flex cursor-pointer items-center justify-center gap-2 text-[14px] text-neutral-600">
          <input
            type="checkbox"
            checked={twoFaTrust}
            onChange={e => setTwoFaTrust(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
            style={{ accentColor: '#0E9AA7' }}
          />
          Trust this device for 30 days
        </label>

        <button
          onClick={handleTwoFaVerify}
          disabled={!isComplete || twoFaLoading}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all"
          style={{ background: isComplete && !twoFaLoading ? '#0E9AA7' : '#a5d8dd', cursor: isComplete && !twoFaLoading ? 'pointer' : 'not-allowed' }}
        >
          {twoFaLoading ? 'Verifying…' : 'Verify'}
        </button>

        <p className="text-[14px] text-neutral-500">
          {twoFaCooldown > 0
            ? <>Resend in <span className="font-semibold" style={{ color: '#0E9AA7' }}>{twoFaCooldown}s</span></>
            : <button onClick={handleTwoFaResend} className="font-semibold" style={{ color: '#0E9AA7' }}>Resend code</button>
          }
        </p>

        <button
          onClick={() => setStep('login')}
          className="flex items-center justify-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-700 w-full"
        >
          <ChevronLeft className="h-4 w-4" /> Back to sign in
        </button>
      </div>
    );
  }

  // ── Account locked screen ───────────────────────────────────────────────────
  if (step === 'locked') {
    const mins = Math.floor(lockoutRemaining / 60);
    const secs = lockoutRemaining % 60;
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Shield className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Account Temporarily Locked</h1>
          <p className="mt-2 text-[15px] text-neutral-500 leading-relaxed">
            Too many incorrect attempts. Your account is locked for:
          </p>
          <p className="mt-3 text-[36px] font-bold tabular-nums" style={{ color: '#0E9AA7' }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left space-y-2">
          <p className="text-[14px] text-neutral-600">To access your account sooner:</p>
          <Link to="/customer/forgot-password" className="block text-[14px] font-semibold" style={{ color: '#0E9AA7' }}>
            → Reset your password
          </Link>
          <p className="text-[13px] text-neutral-400">Or wait for the lockout to expire.</p>
        </div>
        <p className="text-[13px] text-neutral-400">
          Need help?{' '}
          <a href="mailto:support@lonapp.com" className="underline">Contact support</a>
        </p>
      </div>
    );
  }

  // ── Social profile review screen (US-0032) ──────────────────────────────────
  if (step === 'social_review' && providerInfo) {
    const initials = (socialForm.firstName[0] || '') + (socialForm.lastName[0] || '');
    return (
      <div className="w-full">
        <button
          onClick={() => setStep('login')}
          className="mb-4 flex items-center gap-1 text-[14px] text-neutral-500 hover:text-neutral-700"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <Brandmark />

        <div className="mb-6 text-center">
          <h1 className="text-[22px] font-bold text-neutral-900">Complete Your Profile</h1>
          <p className="mt-1.5 text-[14px] text-neutral-500">
            Review and confirm your details from {providerInfo.provider}
          </p>
        </div>

        {/* Avatar */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-[20px] font-bold text-white"
            style={{ background: providerInfo.color }}
          >
            {initials || '?'}
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{ background: '#E8F9FA', color: '#0B7C87' }}
          >
            Linked with {providerInfo.provider}
          </span>
        </div>

        <form onSubmit={handleSocialSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-neutral-700">First name <span className="text-red-500">*</span></label>
              <input
                value={socialForm.firstName}
                onChange={e => setSocialForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="First name"
                className="h-12 rounded-xl border border-neutral-200 px-3 text-[15px] outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                  style={{ borderRadius: 8 }}
              />
              {socialErrors.firstName && <p className="text-[12px] text-red-600">{socialErrors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-neutral-700">Last name <span className="text-red-500">*</span></label>
              <input
                value={socialForm.lastName}
                onChange={e => setSocialForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Last name"
                className="h-12 rounded-xl border border-neutral-200 px-3 text-[15px] outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                  style={{ borderRadius: 8 }}
              />
              {socialErrors.lastName && <p className="text-[12px] text-red-600">{socialErrors.lastName}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-neutral-700">Email address <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={socialForm.email}
              onChange={e => setSocialForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="h-12 rounded-xl border border-neutral-200 px-3 text-[15px] outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                  style={{ borderRadius: 8 }}
            />
            {socialErrors.email && <p className="text-[12px] text-red-600">{socialErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-neutral-700">
              Phone number
              <span className="ml-1 font-normal text-neutral-400">(optional — for SMS order updates)</span>
            </label>
            <input
              type="tel"
              value={socialForm.phone}
              onChange={e => setSocialForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+233 24 000 0000"
              className="h-12 rounded-xl border border-neutral-200 px-3 text-[15px] outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
                  style={{ borderRadius: 8 }}
            />
          </div>

          {/* Consent checkboxes */}
          <div className="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-4">
            <label className="flex cursor-pointer items-start gap-3 text-[14px] text-neutral-700">
              <input
                type="checkbox"
                checked={socialForm.terms}
                onChange={e => setSocialForm(f => ({ ...f, terms: e.target.checked }))}
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                style={{ accentColor: '#0E9AA7' }}
              />
              <span>
                I agree to LonApp's{' '}
                <a href="#" className="font-semibold underline" style={{ color: '#0E9AA7' }}>Terms of Service</a>
              </span>
            </label>
            {socialErrors.terms && <p className="text-[12px] text-red-600 pl-7">{socialErrors.terms}</p>}

            <label className="flex cursor-pointer items-start gap-3 text-[14px] text-neutral-700">
              <input
                type="checkbox"
                checked={socialForm.privacy}
                onChange={e => setSocialForm(f => ({ ...f, privacy: e.target.checked }))}
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                style={{ accentColor: '#0E9AA7' }}
              />
              <span>
                I acknowledge the{' '}
                <a href="#" className="font-semibold underline" style={{ color: '#0E9AA7' }}>Privacy Policy</a>
                {' '}and consent to data processing
              </span>
            </label>
            {socialErrors.privacy && <p className="text-[12px] text-red-600 pl-7">{socialErrors.privacy}</p>}
          </div>

          <button
            type="submit"
            disabled={!socialForm.terms || !socialForm.privacy}
            className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all"
            style={{
              background: socialForm.terms && socialForm.privacy ? '#0E9AA7' : '#a5d8dd',
              cursor: socialForm.terms && socialForm.privacy ? 'pointer' : 'not-allowed',
            }}
          >
            Complete Registration
          </button>
        </form>

        <button
          onClick={() => setStep('login')}
          className="mt-4 w-full text-center text-[14px] text-neutral-400 hover:text-neutral-600"
        >
          Use a different method
        </button>
      </div>
    );
  }

  // ── Main login screen ────────────────────────────────────────────────────────
  return (
    <div className="w-full text-center">
      <Brandmark />
      <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight">Welcome back</h1>
      <p className="mt-1.5 mb-7 text-[15px] text-neutral-500">Sign in to your account.</p>

      {/* Social login — 2+2 grid */}
      <div className="mb-6 grid grid-cols-2 gap-2.5">
        <SocialBtn icon={GoogleIcon}   label="Google"   iconColor="#4285F4" onClick={() => handleSocialClick('google')}   />
        <SocialBtn icon={FacebookIcon} label="Facebook" iconColor="#1877F2" onClick={() => handleSocialClick('facebook')} />
        <SocialBtn icon={AppleIcon}    label="Apple"    iconColor="#1D1D1F" onClick={() => handleSocialClick('apple')}    />
        <SocialBtn icon={WhatsAppIcon} label="WhatsApp" iconColor="#25D366" onClick={() => handleSocialClick('whatsapp')} />
      </div>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-[13px] text-neutral-400">or continue with</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      {serverError && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-left text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-4">
        {/* Single auto-detect field */}
        <div>
          <Input
            label="Email or phone number"
            type={inputMode === 'phone' ? 'tel' : 'email'}
            required
            placeholder="you@email.com or 0241234567"
            value={form.identifier}
            onChange={set('identifier')}
            error={errors.identifier}
            autoComplete={inputMode === 'phone' ? 'tel' : 'email'}
          />
          {form.identifier && (
            <p className="mt-1 text-[12px] text-neutral-400">
              Signing in with {inputMode === 'phone' ? 'phone number' : 'email'}
            </p>
          )}
        </div>

        <PasswordInput
          label="Password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 select-none text-[14px] text-neutral-700">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-300"
              style={{ accentColor: '#0E9AA7' }}
            />
            Remember me
          </label>
          <Link to="/customer/forgot-password" className="text-[14px] text-neutral-500 hover:text-neutral-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="accent" className="w-full justify-center" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Biometric hint (mobile UX signal) */}
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 text-[14px] text-neutral-500 transition-colors hover:bg-neutral-50"
        onClick={() => alert('Biometric login requires the LonApp mobile app.')}
      >
        <Fingerprint className="h-5 w-5" style={{ color: '#0E9AA7' }} />
        Sign in with Face ID / Touch ID
      </button>

      <p className="mt-5 text-[14px] text-neutral-500">
        New to LonApp?{' '}
        <Link to="/customer/onboard" className="font-semibold hover:underline" style={{ color: '#0E9AA7' }}>
          Create an account
        </Link>
      </p>

      {/* Demo hint */}
      <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-[12px] text-neutral-400 leading-relaxed">
        Demo: use <code className="font-mono">demo@test.com</code> to trigger 2FA,{' '}
        <code className="font-mono">fail@test.com</code> to test lockout
      </p>
    </div>
  );
};

export default CustomerLoginPage;
