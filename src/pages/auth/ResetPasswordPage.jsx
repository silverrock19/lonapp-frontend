import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
import useForm from '../../hooks/useForm.js';
import Brandmark from '../../components/ui/Brandmark.jsx';
import { passwordStrength } from '../../utils/validate.js';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { form, errors, setErrors, set } = useForm({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = passwordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.password) {
      e.password = 'Password is required';
    } else if (strength.score < 4) {
      e.password = 'Password is too weak — use 8+ characters, 1 uppercase, 1 number, and 1 special character';
    }
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  }

  const handleSubmit = async (e) => {
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
      <p className="mt-2 mb-8 text-body text-neutral-500">Must be 8+ characters with uppercase, number, and special character.</p>

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-5">
        <div className="space-y-1">
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

        <PasswordInput
          label="Confirm password"
          required
          placeholder="••••••••"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />

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

export default ResetPasswordPage;


