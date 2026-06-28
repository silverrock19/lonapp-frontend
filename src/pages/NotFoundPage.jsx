import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-display font-bold text-neutral-200">404</p>
      <h1 className="text-h2 font-bold text-neutral-800">Page not found</h1>
      <p className="text-body text-neutral-500">The page you're looking for doesn't exist.</p>
      <Button as={Link} to="/" variant="primary">Go home</Button>
    </div>
  );
}

export default NotFoundPage;


