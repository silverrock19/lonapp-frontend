import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brandmark from '../../components/ui/Brandmark.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';
import FacebookIcon from '../../components/icons/FacebookIcon.jsx';

const RetailOnboardingPage = () => {
  const navigate = useNavigate();
  const [socialToast, setSocialToast] = useState('');

  function showSocialToast() {
    setSocialToast('Social login is coming soon.');
    setTimeout(() => setSocialToast(''), 3000);
  }

  return (
    <div className="text-center w-full">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Create your LonApp account</h1>
      <p className="mt-2 mb-8 text-body text-neutral-500">Book laundry pickups and track every order.</p>

      {socialToast && (
        <div className="mb-4 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-small text-neutral-600">
          {socialToast}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={showSocialToast}
        >
          <GoogleIcon /> Continue with Google
        </button>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={showSocialToast}
        >
          <FacebookIcon /> Continue with Facebook
        </button>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={() => navigate('/customer/register')}
        >
          Continue with email
        </button>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 text-small font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
          onClick={() => navigate('/customer/register')}
        >
          Continue with phone number
        </button>
      </div>

      <p className="mt-6 text-caption text-neutral-400 leading-relaxed">
        By signing up, you agree to our{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Privacy Policy</a>.
      </p>

      <p className="mt-5 text-small text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-bold text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RetailOnboardingPage;


