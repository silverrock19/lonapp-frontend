import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { OtpInput } from '../../components/ui/OtpInput.jsx';
import { Brandmark } from '../../components/ui/Brandmark.jsx';

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ firstName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(err => ({ ...err, [field]: '' }));
    };
  }

  function validateStep0() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters';
    return e;
  }

  async function handleStep0(e) {
    e.preventDefault();
    const errs = validateStep0();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // TODO: dispatch(registerCustomer(form)) → sends OTP to email
      setStep(1);
    } catch {
      setErrors({ email: 'This email is already registered.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length < 6) { setOtpError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      // TODO: dispatch(verifyOtp({ email: form.email, otp }))
      navigate('/customer/login');
    } catch {
      setOtpError('Incorrect code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    // TODO: dispatch(resendOtp({ email: form.email }))
    setResendCooldown(60);
    const t = setInterval(() => setResendCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  }

  // Step 1 — OTP verification (centered column, no card)
  if (step === 1) {
    return (
      <div className="text-center">
        <Brandmark />
        <h1 className="text-h2 font-bold text-neutral-900">Verify your email</h1>
        <p className="mt-2 mb-6 text-body text-neutral-500">
          Enter the 6-digit code sent to{' '}
          <strong className="text-neutral-700">{form.email}</strong>
        </p>

        <form onSubmit={handleVerify} noValidate className="space-y-5">
          <div className="flex justify-center">
            <OtpInput
              length={6}
              value={otp}
              onChange={v => { setOtp(v); setOtpError(''); }}
              error={otpError}
              disabled={loading}
            />
          </div>

          {otpError && (
            <p className="text-small text-error">{otpError}</p>
          )}

          <Button type="submit" pill variant="accent" className="w-full justify-center" size="lg" loading={loading}>
            Verify &amp; continue
          </Button>

          <Button
            type="button"
            variant="ghost"
            pill
            className="w-full justify-center"
            size="lg"
            disabled={resendCooldown > 0}
            onClick={handleResend}
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't get it? Resend code"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setStep(0)}
          className="mt-5 flex items-center justify-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700 w-full"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      </div>
    );
  }

  // Step 0 — Ferndesk card
  return (
    <div
      className="w-full bg-white border border-neutral-200 rounded-[14px] shadow-md overflow-hidden"
      style={{ backgroundImage: 'none' }}
    >
      {/* Banner */}
      <div
        className="h-[92px]"
        style={{ background: 'linear-gradient(140deg, var(--color-primary-400), var(--color-accent-500))' }}
      />

      {/* Inner */}
      <div className="px-7 pt-6 pb-8 relative">
        {/* Logo-mark avatar overlapping the banner */}
        <div
          className="absolute -top-[30px] left-7 h-14 w-14 rounded-[14px] border-[3px] border-white shadow-sm flex items-center justify-center bg-primary-100 text-primary-700 text-2xl font-extrabold"
          aria-hidden="true"
        >
          L
        </div>

        <h2 className="text-h2 font-extrabold mt-4 mb-1.5 leading-snug text-neutral-900">
          Get started with<br />LonApp in 2 minutes
        </h2>
        <p className="text-body text-neutral-500 mb-6">Create an account to start booking laundry.</p>

        <form onSubmit={handleStep0} noValidate className="space-y-4">
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
            label="Email or phone"
            type="text"
            required
            placeholder="adwoa@email.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              required
              placeholder="Min 8 characters"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <p className="mt-1 text-caption text-neutral-400">Min 8 chars · 1 uppercase · 1 number · 1 special</p>
          </div>

          <Button type="submit" pill className="w-full justify-center mt-2" size="lg" loading={loading}>
            Create account
          </Button>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-neutral-200 bg-white px-4 py-2.5 text-small font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors h-12"
            onClick={() => {/* TODO: socialLogin('google') */}}
          >
            <GoogleIcon /> Sign up with Google
          </button>
        </form>

        <p className="mt-4 text-small text-neutral-500">
          Already have an account?{' '}
          <Link to="/customer/login" className="font-bold text-primary-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
