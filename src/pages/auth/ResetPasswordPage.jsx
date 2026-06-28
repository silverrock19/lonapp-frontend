import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Brandmark } from '../../components/ui/Brandmark.jsx';

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-error' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-warning' };
  if (score === 3) return { score, label: 'Good', color: 'bg-accent-400' };
  return { score, label: 'Strong', color: 'bg-success' };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = passwordStrength(form.password);

  function set(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(err => ({ ...err, [field]: '' }));
    };
  }

  function validate() {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // TODO: dispatch(resetPassword({ token: params.get('token'), password: form.password }))
      setDone(true);
    } catch {
      setErrors({ password: 'Reset link is invalid or expired.' });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center w-full space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Password updated</h1>
          <p className="mt-2 text-body text-neutral-500">Your password has been changed successfully.</p>
        </div>
        <Button pill className="w-full justify-center" size="lg" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900">Set a new password</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">Must be at least 8 characters.</p>

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-5">
        <div className="space-y-1">
          <div className="relative">
            <Input
              label="New password"
              type={show.password ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, password: !s.password }))}
              aria-label={show.password ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {show.password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {form.password && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all ${strength.score >= n ? strength.color : 'bg-neutral-200'}`}
                  />
                ))}
              </div>
              <p className="text-caption text-neutral-500">
                Strength: <span className="font-medium text-neutral-700">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm password"
            type={show.confirm ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
            aria-label={show.confirm ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
          Reset password
        </Button>
      </form>

      <p className="mt-5 text-small text-neutral-500">
        Remember it?{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
