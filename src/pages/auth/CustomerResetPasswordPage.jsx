import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import useForm from '../../hooks/useForm.js';
import Brandmark from '../../components/ui/Brandmark.jsx';

function pwStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: 'Weak',   color: '#EF4444' };
  if (s === 2) return { score: s, label: 'Fair',   color: '#F59E0B' };
  if (s === 3) return { score: s, label: 'Good',   color: '#0E9AA7' };
  return              { score: s, label: 'Strong', color: '#16A34A' };
}

const CustomerResetPasswordPage = () => {
  const navigate = useNavigate();
  const { form, errors, setErrors, set } = useForm({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const str = pwStrength(form.password);

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = {};
    if (!form.password) e2.password = 'Password is required';
    else if (str.score < 4) e2.password = 'Too weak — use 8+ chars, uppercase, number, and special character';
    if (!form.confirm) e2.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e2.confirm = 'Passwords do not match';
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      setDone(true);
    } catch {
      setErrors({ password: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-neutral-900">Password updated</h1>
          <p className="mt-2 text-[15px] text-neutral-500">
            Your password has been reset. Sign in with your new password.
          </p>
        </div>
        <button
          onClick={() => navigate('/customer/login')}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold"
          style={{ background: '#0E9AA7' }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Brandmark />
      <div className="mb-7 text-center">
        <h1 className="text-[22px] font-bold text-neutral-900">Set a new password</h1>
        <p className="mt-1.5 text-[15px] text-neutral-500">
          Must be 8+ characters with uppercase, number, and special character.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <PasswordInput
            label="New password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          {form.password && (
            <div className="space-y-1 pt-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <div
                    key={n}
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{ background: str.score >= n ? str.color : '#E5E7EB' }}
                  />
                ))}
              </div>
              <p className="text-[12px] text-neutral-500">
                Strength:{' '}
                <span className="font-medium" style={{ color: str.color }}>{str.label}</span>
              </p>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm new password"
          required
          placeholder="••••••••"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <Button type="submit" pill className="w-full justify-center" size="lg" loading={loading}>
          Reset Password
        </Button>
      </form>

      <Link
        to="/customer/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-[14px] text-neutral-500 hover:text-neutral-700"
      >
        <ChevronLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
};

export default CustomerResetPasswordPage;
