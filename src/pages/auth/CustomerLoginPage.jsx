import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function CustomerLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('email');
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
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

  async function handleSocial(provider) {
    // TODO: dispatch(socialLogin(provider))
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-body text-neutral-500">Sign in to your account</p>
      </div>

      {/* Social login */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocial('google')}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-small font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-100"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial('facebook')}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-small font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-100"
        >
          <FacebookIcon /> Continue with Facebook
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-neutral-50 px-3 text-caption text-neutral-400">or sign in with</span>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && (
          <div role="alert" className="rounded-md border border-error-bg bg-error-bg px-4 py-3 text-small text-error-text">
            {serverError}
          </div>
        )}

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

        <div className="text-right">
          <Link to="/forgot-password" className="text-small text-accent-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full"
          size="lg"
          loading={loading}
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-small text-neutral-500">
        New to LonApp?{' '}
        <Link to="/customer/register" className="font-medium text-accent-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
