import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setLoading(true);
    try {
      // TODO: dispatch(requestPasswordReset(email))
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
          <Mail className="h-7 w-7 text-primary-500" />
        </div>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Check your email</h1>
          <p className="mt-2 text-body text-neutral-500">
            We sent a reset link to <span className="font-medium text-neutral-700">{email}</span>
          </p>
          <p className="mt-1 text-small text-neutral-400">Didn't get it? Check your spam folder.</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => { setSent(false); setEmail(''); }}
        >
          Try a different email
        </Button>
        <Link to="/login" className="flex items-center justify-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="text-center">
        <h1 className="text-h2 font-bold text-neutral-900">Forgot your password?</h1>
        <p className="mt-2 text-body text-neutral-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(''); }}
        error={error}
        autoComplete="email"
      />

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Send reset link
      </Button>

      <Link
        to="/login"
        className="flex items-center justify-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </form>
  );
}
