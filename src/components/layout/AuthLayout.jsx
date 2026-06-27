import { Outlet } from 'react-router-dom';

// Centered single-column auth layout (Linear-style).
// Used for: login, register wizard, forgot-password, reset-password.
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-h2 font-bold text-neutral-900 tracking-tight">LonApp</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
