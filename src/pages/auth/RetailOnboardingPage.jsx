import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

const METHODS = [
  { id: 'phone', label: 'Phone number', icon: Phone },
  { id: 'email', label: 'Email address', icon: Mail },
];

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

export default function RetailOnboardingPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue(e) {
    e.preventDefault();
    if (!value.trim()) { setError(`${method === 'phone' ? 'Phone number' : 'Email address'} is required`); return; }
    setLoading(true);
    try {
      // TODO: dispatch(startRetailOnboarding({ method, value }))
      navigate('/customer/register');
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(provider) {
    // TODO: dispatch(socialLogin(provider))
  }

  return (
    <div className="space-y-6">
      {method && (
        <button
          type="button"
          onClick={() => { setMethod(null); setValue(''); setError(''); }}
          className="flex items-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      )}

      <div className="text-center">
        <h1 className="text-h2 font-bold text-neutral-900">Get started with LonApp</h1>
        <p className="mt-1 text-body text-neutral-500">
          {method ? `Enter your ${method === 'phone' ? 'phone number' : 'email address'}` : 'Choose how you want to sign up'}
        </p>
      </div>

      {!method ? (
        <div className="space-y-3">
          {/* Social options */}
          <button
            type="button"
            onClick={() => handleSocial('google')}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-small font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100"
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleSocial('facebook')}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-small font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100"
          >
            <FacebookIcon /> Continue with Facebook
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-neutral-50 px-3 text-caption text-neutral-400">or continue with</span>
            </div>
          </div>

          {/* Phone / Email method buttons */}
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className="flex flex-col items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-4 text-small font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100"
              >
                <Icon className="h-5 w-5 text-neutral-400" />
                {label}
              </button>
            ))}
          </div>

          <p className="text-center text-small text-neutral-500">
            Already have an account?{' '}
            <Link to="/customer/login" className="font-medium text-primary-600 hover:underline">Sign in</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleContinue} noValidate className="space-y-5">
          {method === 'phone' ? (
            <Input
              label="Phone number"
              type="tel"
              required
              placeholder="+233 24 000 0000"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              error={error}
              autoComplete="tel"
              autoFocus
            />
          ) : (
            <Input
              label="Email address"
              type="email"
              required
              placeholder="you@email.com"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              error={error}
              autoComplete="email"
              autoFocus
            />
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Continue
          </Button>
        </form>
      )}
    </div>
  );
}
