import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import useForm from '../../hooks/useForm.js';
import Brandmark from '../../components/ui/Brandmark.jsx';

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, setForm, errors, setErrors, set } = useForm({ identifier: '', password: '', remember: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Welcome back</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">Sign in to manage your laundry account.</p>

      {serverError && (
        <div role="alert" className="mb-5 rounded-md border border-error-bg bg-error-bg px-4 py-3 text-small text-left text-error-text">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="text-left space-y-5">
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
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-300 accent-primary-500"
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
        <Link to="/register/business" className="font-semibold text-primary-600 hover:underline">
          Register your business
        </Link>
      </p>
    </div>
  );
}

export default AdminLoginPage;


