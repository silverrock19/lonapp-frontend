import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { isValidEmail } from '../../utils/validate.js';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Brandmark from '../../components/ui/Brandmark.jsx';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return; }
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
      <div className="text-center w-full space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Mail className="h-7 w-7 text-primary-500" />
        </div>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Check your email</h1>
          <p className="mt-2 text-body text-neutral-500">
            We sent a reset link to{' '}
            <strong className="text-neutral-700">{email}</strong>
          </p>
          <p className="mt-1 text-small text-neutral-400">Didn't get it? Check your spam folder.</p>
        </div>
        <Button variant="outline" pill className="w-full justify-center" size="lg" onClick={() => { setSent(false); setEmail(''); }}>
          Try a different email
        </Button>
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900">Forgot your password?</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-5">
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

        <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
          Send reset link
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-small text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </div>
  );
}

export default ForgotPasswordPage;


