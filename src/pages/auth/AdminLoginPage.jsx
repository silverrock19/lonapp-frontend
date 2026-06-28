import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
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

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
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
    if (!form.identifier) e.identifier = 'Email or phone is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // TODO: dispatch(adminLogin({ identifier: form.identifier, password: form.password, remember: form.remember }))
      navigate('/');
    } catch {
      setServerError('Incorrect credentials or account not yet approved.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Welcome back</h1>
      <p className="mt-2 mb-7 text-body text-neutral-500">Sign in to manage your laundry account.</p>

      {serverError && (
        <div role="alert" className="mb-5 rounded-md border border-error-bg bg-error-bg px-4 py-3 text-small text-left text-error-text">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-4">
        <Input
          label="Email or phone"
          type="text"
          required
          placeholder="owner@sparkle.com"
          value={form.identifier}
          onChange={set('identifier')}
          error={errors.identifier}
          autoComplete="username"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="current-password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none text-small text-neutral-700">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={set('remember')}
              className="h-4 w-4 rounded border-neutral-300 accent-primary-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-small text-neutral-500 hover:text-neutral-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-caption text-neutral-400">or continue with</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-small font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-small font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Facebook
        </button>
      </div>

      <p className="mt-5 text-small text-neutral-500">
        New to LonApp?{' '}
        <Link to="/register/business" className="font-bold text-primary-600 hover:underline">
          Register your business
        </Link>
      </p>
    </div>
  );
}
