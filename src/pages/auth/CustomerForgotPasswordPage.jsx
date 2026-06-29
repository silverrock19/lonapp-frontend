import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { isValidEmail, passwordStrength } from '../../utils/validate.js';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
import useForm from '../../hooks/useForm.js';
import Brandmark from '../../components/ui/Brandmark.jsx';

// ── Detect input type ─────────────────────────────────────────────────────────
const detectMode = val => {
  if (!val) return 'email';
  if (/^[\d+()\s-]/.test(val)) return 'phone';
  return 'email';
};

// ── OTP boxes ─────────────────────────────────────────────────────────────────
const OtpBoxes = ({ otp, setOtp }) => {
  const refs = useRef([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (i, val) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handlePaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...Array(6).fill('')];
    p.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    refs.current[Math.min(p.length, 5)]?.focus();
  };

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
          style={{ borderColor: digit ? '#0E9AA7' : '#E5E7EB', color: '#111827' }}
          onFocus={e => { e.target.style.borderColor = '#0E9AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(14,154,167,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = digit ? '#0E9AA7' : '#E5E7EB'; e.target.style.boxShadow = ''; }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
// Steps: 'entry' → email: 'email_sent' / phone: 'phone_otp' → 'new_password' → 'done'

const CustomerForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('entry');
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [otpLoading, setOtpLoading] = useState(false);

  // New password state
  const { form, errors, setErrors, set } = useForm({ password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const mode = detectMode(identifier);

  // Resend countdown
  useEffect(() => {
    if (step !== 'phone_otp' || cooldown <= 0) return;
    const t = setInterval(() => setCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step, cooldown]);

  const handleSendCode = async e => {
    e.preventDefault();
    setIdentifierError('');
    if (!identifier.trim()) {
      setIdentifierError('Email or phone number is required');
      return;
    }
    if (mode === 'email' && !isValidEmail(identifier)) {
      setIdentifierError('Enter a valid email address');
      return;
    }
    if (mode === 'phone' && !/^\+?[\d\s\-().]{7,}$/.test(identifier)) {
      setIdentifierError('Enter a valid Ghana phone number');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      if (mode === 'email') {
        setStep('email_sent');
      } else {
        setCooldown(60);
        setOtp(Array(6).fill(''));
        setStep('phone_otp');
      }
    } catch {
      setIdentifierError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleOtpVerify = async () => {
    if (otp.join('').length < 6) { setOtpError('Enter all 6 digits'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      await new Promise(r => setTimeout(r, 800));
      setStep('new_password');
    } catch {
      setOtpError('Incorrect or expired code. Try again.');
    } finally {
      setOtpLoading(false);
    }
  }

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(60);
    setOtp(Array(6).fill(''));
  }

  const handleNewPassword = async e => {
    e.preventDefault();
    const str = passwordStrength(form.password);
    const e2 = {};
    if (!form.password) e2.password = 'Password is required';
    else if (str.score < 4) e2.password = 'Too weak — use 8+ chars, uppercase, number, and special character';
    if (!form.confirm) e2.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e2.confirm = 'Passwords do not match';
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setPwLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setStep('done');
    } catch {
      setErrors({ password: 'Something went wrong. Please try again.' });
    } finally {
      setPwLoading(false);
    }
  }

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Password updated</h1>
          <p className="mt-2 text-[15px] text-neutral-500">Your password has been changed successfully. Sign in with your new password.</p>
        </div>
        <button
          onClick={() => navigate('/customer/login')}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold"
          style={{ background: '#0E9AA7' }}
        >
          Sign In
        </button>
      </div>
    );
  }

  // ── Email sent confirmation ──────────────────────────────────────────────────
  if (step === 'email_sent') {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#E8F9FA' }}>
          <Mail className="h-7 w-7" style={{ color: '#0E9AA7' }} />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Check your email</h1>
          <p className="mt-2 text-[15px] text-neutral-500">
            We sent a reset link to{' '}
            <strong className="text-neutral-700">{identifier}</strong>
          </p>
          <p className="mt-1 text-[13px] text-neutral-400">Link expires in 30 minutes. Check your spam folder if it doesn't arrive.</p>
        </div>
        <button
          onClick={() => { setStep('entry'); setIdentifier(''); }}
          className="w-full h-12 rounded-2xl border border-neutral-200 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Try a different email
        </button>
        <Link to="/customer/login" className="flex items-center justify-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-700">
          <ChevronLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  // ── Phone OTP screen ─────────────────────────────────────────────────────────
  if (step === 'phone_otp') {
    const isComplete = otp.every(d => d !== '');
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#E8F9FA' }}>
          <Phone className="h-7 w-7" style={{ color: '#0E9AA7' }} />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Enter the code</h1>
          <p className="mt-2 text-[15px] text-neutral-500">
            We sent a 6-digit code to <strong className="text-neutral-700">{identifier}</strong>. Expires in 10 minutes.
          </p>
        </div>

        {otpError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {otpError}
          </div>
        )}

        <OtpBoxes otp={otp} setOtp={setOtp} />

        <button
          onClick={handleOtpVerify}
          disabled={!isComplete || otpLoading}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all"
          style={{ background: isComplete && !otpLoading ? '#0E9AA7' : '#a5d8dd', cursor: isComplete && !otpLoading ? 'pointer' : 'not-allowed' }}
        >
          {otpLoading ? 'Verifying…' : 'Verify Code'}
        </button>

        <p className="text-[14px] text-neutral-500">
          {cooldown > 0
            ? <>Resend in <span className="font-semibold" style={{ color: '#0E9AA7' }}>{cooldown}s</span></>
            : <button onClick={handleResend} className="font-semibold" style={{ color: '#0E9AA7' }}>Resend code</button>
          }
        </p>

        <button onClick={() => setStep('entry')} className="flex items-center justify-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-700 w-full">
          <ChevronLeft className="h-4 w-4" /> Use a different number
        </button>
      </div>
    );
  }

  // ── New password screen (phone flow, after OTP verified) ─────────────────────
  if (step === 'new_password') {
    const str = passwordStrength(form.password);
    return (
      <div className="w-full">
        <button onClick={() => setStep('phone_otp')} className="mb-4 flex items-center gap-1 text-[14px] text-neutral-500 hover:text-neutral-700">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <Brandmark />
        <div className="mb-7 text-center">
          <h1 className="text-[22px] font-bold text-neutral-900">Set a new password</h1>
          <p className="mt-1.5 text-[15px] text-neutral-500">Must be 8+ characters with uppercase, number, and special character.</p>
        </div>
        <form onSubmit={handleNewPassword} noValidate className="space-y-5">
          <div className="space-y-1.5">
            <PasswordInput
              label="New password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="new-password"
            />
            {form.password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${str.score >= n ? str.color : 'bg-neutral-200'}`} />
                  ))}
                </div>
                <p className="text-[12px] text-neutral-500">Strength: <span className="font-medium text-neutral-700">{str.label}</span></p>
              </div>
            )}
          </div>
          <PasswordInput
            label="Confirm password"
            required
            placeholder="••••••••"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={pwLoading}
            className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold disabled:opacity-60"
            style={{ background: '#0E9AA7' }}
          >
            {pwLoading ? 'Saving…' : 'Reset Password'}
          </button>
        </form>
      </div>
    );
  }

  // ── Entry screen (default) ───────────────────────────────────────────────────
  return (
    <div className="w-full text-center">
      <Brandmark />
      <h1 className="text-[22px] font-bold text-neutral-900">Reset your password</h1>
      <p className="mt-1.5 mb-7 text-[15px] text-neutral-500">
        Enter your email or phone number and we'll send you a reset {mode === 'phone' && identifier ? 'code' : 'link'}.
      </p>

      <form onSubmit={handleSendCode} noValidate className="text-left space-y-5">
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-neutral-700">
            Email or phone number
          </label>
          <input
            type={mode === 'phone' ? 'tel' : 'email'}
            value={identifier}
            onChange={e => { setIdentifier(e.target.value); setIdentifierError(''); }}
            placeholder="you@email.com or 0241234567"
            autoComplete={mode === 'phone' ? 'tel' : 'email'}
            className="w-full h-12 rounded-xl border border-neutral-200 px-4 text-[15px] outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
            style={{ borderRadius: 8, borderColor: identifierError ? '#EF4444' : undefined }}
          />
          {identifierError && <p className="mt-1 text-[13px] text-red-600">{identifierError}</p>}
          {identifier && !identifierError && (
            <p className="mt-1 flex items-center gap-1 text-[12px] text-neutral-400">
              {mode === 'phone'
                ? <><Phone className="h-3 w-3" /> We'll send an SMS code to this number</>
                : <><Mail className="h-3 w-3" /> We'll email a reset link to this address</>
              }
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold disabled:opacity-60 transition-all"
          style={{ background: '#0E9AA7' }}
        >
          {loading ? 'Sending…' : mode === 'phone' && identifier ? 'Send OTP Code' : 'Send Reset Link'}
        </button>
      </form>

      <Link to="/customer/login" className="mt-5 flex items-center justify-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-700">
        <ChevronLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
};

export default CustomerForgotPasswordPage;
