import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  function set(field) {
    return e => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm(f => ({ ...f, [field]: val }));
      setErrors(err => ({ ...err, [field]: '' }));
    };
  }

  function validate() {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setServerError('');
    try {
      // TODO: dispatch(login({ email: form.email, password: form.password, remember: form.remember }))
      // navigate('/');
    } catch {
      setServerError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-body text-neutral-500">Sign in to your business account</p>
      </div>

      {serverError && (
        <div role="alert" className="rounded-md border border-error-bg bg-error-bg px-4 py-3 text-small text-error-text">
          {serverError}
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        required
        placeholder="you@company.com"
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
        <label className="flex cursor-pointer items-center gap-2 text-small text-neutral-600">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={set('remember')}
            className="h-4 w-4 rounded border-neutral-300 accent-primary-500"
          />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-small text-primary-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Sign in
      </Button>

      <p className="text-center text-small text-neutral-500">
        New to LonApp?{' '}
        <Link to="/register/business" className="font-medium text-primary-600 hover:underline">
          Register your business
        </Link>
      </p>
    </form>
  );
}
