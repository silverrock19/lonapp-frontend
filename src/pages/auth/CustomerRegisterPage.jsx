import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { OtpInput } from '../../components/ui/OtpInput.jsx';

const STEPS = ['account', 'verify'];

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
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
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone) e.phone = 'Phone number is required';
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
      // TODO: dispatch(registerCustomer(form)) → sends OTP to email/phone
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

  if (step === 1) {
    return (
      <form onSubmit={handleVerify} noValidate className="space-y-6">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="flex items-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <div className="text-center">
          <h1 className="text-h2 font-bold text-neutral-900">Verify your email</h1>
          <p className="mt-2 text-body text-neutral-500">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-neutral-700">{form.email}</span>
          </p>
        </div>

        <OtpInput
          length={6}
          value={otp}
          onChange={v => { setOtp(v); setOtpError(''); }}
          error={otpError}
          disabled={loading}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Verify & create account
        </Button>

        <p className="text-center text-small text-neutral-500">
          Didn't receive it?{' '}
          {resendCooldown > 0 ? (
            <span className="text-neutral-400">Resend in {resendCooldown}s</span>
          ) : (
            <button type="button" onClick={handleResend} className="font-medium text-primary-600 hover:underline">
              Resend code
            </button>
          )}
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleStep0} noValidate className="space-y-5">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-neutral-900">Create your account</h1>
        <p className="mt-1 text-body text-neutral-500">Start using LonApp in minutes</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" required placeholder="Ada" value={form.firstName} onChange={set('firstName')} error={errors.firstName} autoComplete="given-name" />
        <Input label="Last name" required placeholder="Osei" value={form.lastName} onChange={set('lastName')} error={errors.lastName} autoComplete="family-name" />
      </div>

      <Input label="Email address" type="email" required placeholder="you@email.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
      <Input label="Phone number" type="tel" required placeholder="+233 24 000 0000" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />

      <div className="relative">
        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          required
          placeholder="Min. 8 characters"
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
      </div>

      <p className="text-caption text-neutral-400">
        By signing up you agree to our{' '}
        <a href="#" className="text-primary-600 hover:underline">Terms</a>{' '}
        and{' '}
        <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
      </p>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Continue
      </Button>

      <p className="text-center text-small text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-medium text-primary-600 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
