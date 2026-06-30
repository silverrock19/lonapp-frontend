import { Navigate } from 'react-router-dom';

// Profile editing is handled by CustomerProfilePage (/app/profile) via its inline
// edit sections. This route now redirects there to avoid a duplicated, incomplete page.
export default function CustomerProfileEditPage() {
  return <Navigate to="/app/profile" replace />;
}
