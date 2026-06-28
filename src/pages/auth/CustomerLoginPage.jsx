import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Brandmark from '../../components/ui/Brandmark.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';
import FacebookIcon from '../../components/icons/FacebookIcon.jsx';

const CustomerLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('email');
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm(f => ({ ...f, [field]: val }));
      setErrors(err => ({ ...err, [field]: '' }));
      setServerError('');
    };
  }

  function validate() {
    const e = {};
    if (!form.identifier) e.identifier = `${mode === 'phone' ? 'Phone number' : 'Email address'} is required`;
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // TODO: dispatch(customerLogin({ mode, identifier: form.identifier, password: form.password }))
      navigate('/app');
    } catch {
      setServerError('Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Welcome back</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">Sign in to your account.</p>

      {/* Social login */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={() => {/* TODO: socialLogin('google') */}}
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={() => {/* TODO: socialLogin('facebook') */}}
        >
          <FacebookIcon /> Continue with Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-neutral-300" />
        <span className="text-caption text-neutral-500">or</span>
        <div className="flex-1 h-px bg-neutral-300" />
      </div>

      {serverError && (
        <div role="alert" className="mb-5 rounded-md border border-error-bg bg-error-bg px-4 py-3 text-small text-left text-error-text">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-5">
        {/* Mode toggle */}
        <div className="flex rounded-md border border-neutral-200 p-0.5 bg-neutral-100">
          {(['email', 'phone']).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setForm(f => ({ ...f, identifier: '' })); setErrors({}); }}
              className={`flex-1 rounded py-1.5 text-small font-medium transition-colors ${
                mode === m ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {m === 'email' ? 'Email' : 'Phone'}
            </button>
          ))}
        </div>

        {mode === 'email' ? (
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@email.com"
            value={form.identifier}
            onChange={set('identifier')}
            error={errors.identifier}
            autoComplete="email"
          />
        ) : (
          <Input
            label="Phone number"
            type="tel"
            required
            placeholder="+233 24 000 0000"
            value={form.identifier}
            onChange={set('identifier')}
            error={errors.identifier}
            autoComplete="tel"
          />
        )}

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
          <label className="flex items-center gap-2 cursor-pointer select-none text-small text-neutral-700">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={set('remember')}
              className="h-4 w-4 rounded border-neutral-300 accent-accent-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-small text-neutral-500 hover:text-neutral-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-5 text-small text-neutral-500">
        New to LonApp?{' '}
        <Link to="/customer/onboard" className="font-semibold text-accent-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default CustomerLoginPage;


