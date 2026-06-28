import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { Brandmark } from '../../components/ui/Brandmark.jsx';
import { AuthCard } from '../../components/ui/AuthCard.jsx';

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function RetailOnboardingPage() {
  const navigate = useNavigate();

  async function handleSocial(provider) {
    // TODO: dispatch(socialLogin(provider))
    navigate('/customer/register');
  }

  return (
    <AuthCard>
    <div className="text-center">
      <Brandmark />
      <h1 className="text-h2 font-bold text-neutral-900 tracking-tight">Create your LonApp account</h1>
      <p className="mt-2 mb-7 text-body text-neutral-500">Book laundry pickups and track every order.</p>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          pill
          className="w-full justify-center gap-2.5"
          size="lg"
          onClick={() => handleSocial('google')}
        >
          <GoogleIcon /> Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          pill
          className="w-full justify-center"
          size="lg"
          onClick={() => navigate('/customer/register')}
        >
          Continue with email
        </Button>

        <Button
          type="button"
          variant="outline"
          pill
          className="w-full justify-center"
          size="lg"
          onClick={() => navigate('/customer/register')}
        >
          Continue with phone number
        </Button>
      </div>

      <p className="mt-6 text-caption text-neutral-400 leading-relaxed">
        By signing up, you agree to our{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="font-semibold text-neutral-600 hover:underline">Privacy Policy</a>.
      </p>

      <p className="mt-5 text-small text-neutral-500">
        Already have an account?{' '}
        <Link to="/customer/login" className="font-bold text-accent-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
    </AuthCard>
  );
}
