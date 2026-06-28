import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isValidEmail } from '../../utils/validate.js';
import useForm from '../../hooks/useForm.js';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
import OtpInput from '../../components/forms/OtpInput.jsx';
import Brandmark from '../../components/ui/Brandmark.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';

const CustomerRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { form, setForm, errors, setErrors, set } = useForm({ firstName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  function validateStep0() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
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
          <p className="mt-1 text-caption text-neutral-400">Min 8 chars · 1 uppercase · 1 number · 1 special</p>
        </div>

        <Button type="submit" pill className="w-full justify-center mt-2" size="lg" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-caption text-neutral-400 leading-relaxed">
        By signing up, you agree to our{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Privacy Policy</a>.
      </p>

      <p className="mt-4 text-small text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-bold text-primary-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default CustomerRegisterPage;


