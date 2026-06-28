import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isValidEmail } from '../../utils/validate.js';
import useForm from '../../hooks/useForm.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import Brandmark from '../../components/ui/Brandmark.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';
import FacebookIcon from '../../components/icons/FacebookIcon.jsx';
import AppleIcon from '../../components/icons/AppleIcon.jsx';
import WhatsAppIcon from '../../components/icons/WhatsAppIcon.jsx';

// ── Social button ─────────────────────────────────────────────────────────────
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

// ── OTP boxes (inline, same as login) ────────────────────────────────────────
import { useRef } from 'react';
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
          className="h-14 w-12 rounded-xl border text-center text-[22px] font-bold outline-none transition-all"
          style={{ borderRadius: 8, borderColor: digit ? '#0E9AA7' : '#E5E7EB', color: '#111827' }}
          onFocus={e => { e.target.style.borderColor = '#0E9AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(14,154,167,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = digit ? '#0E9AA7' : '#E5E7EB'; e.target.style.boxShadow = ''; }}
        />
      ))}
    </div>
  );
}

// ── Password strength meter ───────────────────────────────────────────────────
function strengthScore(pw) {
  if (!pw) return { score: 0, label: '', color: '#E5E7EB' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) s++;
  const map = [
    { label: '', color: '#E5E7EB' },
    { label: 'Weak', color: '#EF4444' },
    { label: 'Fair', color: '#F97316' },
    { label: 'Good', color: '#EAB308' },
    { label: 'Strong', color: '#22C55E' },
  ];
  return { score: s, ...map[s] };
}

// ── Main component ────────────────────────────────────────────────────────────
const CustomerRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=form, 1=otp
  const { form, setForm, errors, setErrors, set } = useForm({
    firstName: '', lastName: '', email: '', password: '', terms: false, privacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(30);

  // OTP resend countdown
  useEffect(() => {
    if (step !== 1 || cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [step, cooldown]);

  const str = strengthScore(form.password);

  function validateStep0() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) {
      e.password = 'Password is required';
    } else if (str.score < 4) {
      e.password = 'Password does not meet all requirements';
    }
    if (!form.terms)   e.terms   = 'You must agree to the Terms of Service';
    if (!form.privacy) e.privacy = 'You must acknowledge the Privacy Policy';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateStep0();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      setOtp(Array(6).fill(''));
      setCooldown(30);
      setStep(1);
    } catch {
      setErrors({ email: 'This email is already registered.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const filled = otp.filter(Boolean).length;
    if (filled < 6) { setOtpError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      navigate('/customer/login');
    } catch {
      setOtpError('Incorrect code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setCooldown(60);
    setOtp(Array(6).fill(''));
    setOtpError('');
  }

  // ── Step 1: OTP verification ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="w-full text-center">
        <Brandmark />
        <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight mt-1">Verify your email</h1>
        <p className="mt-2 mb-8 text-[15px] text-neutral-500">
          We sent a 6-digit code to{' '}
          <strong className="text-neutral-700">{form.email}</strong>
        </p>

        <form onSubmit={handleVerify} noValidate className="space-y-5">
          <OtpBoxes otp={otp} setOtp={v => { setOtp(v); setOtpError(''); }} autoFocus />

          {otpError && <p className="text-[13px] text-red-500">{otpError}</p>}

          <button
            type="submit"
            disabled={loading || otp.filter(Boolean).length < 6}
            className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all disabled:opacity-50"
            style={{ background: '#0E9AA7' }}
          >
            {loading ? 'Verifying…' : 'Verify & create account'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full text-[14px] text-neutral-500 disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get it? Resend"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setStep(0)}
          className="mt-6 flex items-center justify-center gap-1.5 text-[13px] text-neutral-400 hover:text-neutral-600 w-full transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
        </button>
      </div>
    );
  }

  // ── Step 0: Registration form ─────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <Brandmark />
        <h1 className="text-[24px] font-bold text-neutral-900 tracking-tight mt-1">Create your account</h1>
        <p className="mt-1.5 text-[15px] text-neutral-500">Start booking laundry in minutes.</p>
      </div>

      {/* Social sign-up — 2×2 grid matching login */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <SocialBtn icon={GoogleIcon}   label="Google"   iconColor="#4285F4" onClick={() => {}} />
        <SocialBtn icon={FacebookIcon} label="Facebook" iconColor="#1877F2" onClick={() => {}} />
        <SocialBtn icon={AppleIcon}    label="Apple"    iconColor="#1D1D1F" onClick={() => {}} />
        <SocialBtn icon={WhatsAppIcon} label="WhatsApp" iconColor="#25D366" onClick={() => {}} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-[13px] text-neutral-400">or continue with email</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            required
            placeholder="Adwoa"
            value={form.firstName}
            onChange={set('firstName')}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            required
            placeholder="Mensah"
            value={form.lastName}
            onChange={set('lastName')}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email address"
          type="email"
          required
          placeholder="adwoa@email.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <PasswordInput
            label="Password"
            required
            placeholder="Min 8 characters"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          {/* Strength meter */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1,2,3,4].map(n => (
                  <div
                    key={n}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{ background: str.score >= n ? str.color : '#E5E7EB' }}
                  />
                ))}
              </div>
              {str.label && (
                <p className="mt-1 text-[12px] font-medium" style={{ color: str.color }}>{str.label}</p>
              )}
            </div>
          )}
          {!errors.password && (
            <p className="mt-1 text-[12px] text-neutral-400">8+ chars · 1 uppercase · 1 number · 1 special character</p>
          )}
        </div>

        <div className="space-y-2.5 pt-1">
          {[
            { key: 'terms',   label: 'I agree to the Terms of Service',  href: '#' },
            { key: 'privacy', label: 'I have read the Privacy Policy',    href: '#' },
          ].map(({ key, label, href }) => (
            <div key={key}>
              <label className="flex cursor-pointer items-start gap-3">
                <span
                  onClick={() => { setForm(f => ({ ...f, [key]: !f[key] })); setErrors(err => ({ ...err, [key]: '' })); }}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                    form[key] ? 'border-[#0E9AA7] bg-[#0E9AA7]' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {form[key] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[14px] text-neutral-700">
                  {label.split(' ').slice(0, -3).join(' ')}{' '}
                  <a href={href} className="text-[#0E9AA7] underline underline-offset-2">
                    {label.split(' ').slice(-3).join(' ')}
                  </a>
                </span>
              </label>
              {errors[key] && <p className="mt-0.5 ml-8 text-[12px] text-red-500">{errors[key]}</p>}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all disabled:opacity-60 mt-2"
          style={{ background: '#0E9AA7' }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-[14px] text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-bold text-[#0E9AA7] hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default CustomerRegisterPage;
