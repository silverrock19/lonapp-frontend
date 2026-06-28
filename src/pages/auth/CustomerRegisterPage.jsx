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
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', terms: false, privacy: false });
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
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.password) {
      e.password = 'Password is required';
    } else {
      const rules = [
        form.password.length >= 8,
        /[A-Z]/.test(form.password),
        /\d/.test(form.password),
        /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
      ];
      if (!rules.every(Boolean)) e.password = 'Password does not meet all requirements';
    }
    if (!form.terms)   e.terms   = 'You must agree to the Terms of Service';
    if (!form.privacy) e.privacy = 'You must acknowledge the Privacy Policy';
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

  // Step 1 — OTP verification
  if (step === 1) {
    return (
      <div className="text-center w-full">
        <Brandmark />
        <h1 className="text-h2 font-bold text-neutral-900">Verify your email</h1>
        <p className="mt-2 mb-8 text-body text-neutral-500">
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

          <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
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

  // Step 0 — Registration form
  return (
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Create your account</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">Start booking laundry in minutes.</p>

      {/* Social sign-up */}
      <div className="mb-6">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={() => {/* TODO: socialLogin('google') */}}
        >
          <GoogleIcon /> Sign up with Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-neutral-300" />
        <span className="text-caption text-neutral-500">or</span>
        <div className="flex-1 h-px bg-neutral-300" />
      </div>

      <form onSubmit={handleStep0} noValidate className="text-left space-y-5">
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
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <p className="mt-1 text-caption text-neutral-400">8+ chars · 1 uppercase · 1 number · 1 special character</p>
        </div>

        <div className="space-y-2.5 pt-1">
          {[
            { key: 'terms',   label: 'I agree to the Terms of Service',  error: errors.terms },
            { key: 'privacy', label: 'I have read the Privacy Policy',    error: errors.privacy },
          ].map(({ key, label, error }) => (
            <div key={key}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-primary-500"
                  checked={form[key]}
                  onChange={e => { setForm(f => ({ ...f, [key]: e.target.checked })); setErrors(err => ({ ...err, [key]: '' })); }}
                />
                <span className="text-small text-neutral-700">{label}</span>
              </label>
              {error && <p className="mt-0.5 ml-7 text-caption text-error">{error}</p>}
            </div>
          ))}
        </div>

        <Button type="submit" pill className="w-full justify-center mt-2" size="lg" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-small text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-bold text-primary-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
