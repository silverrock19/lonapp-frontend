import { Outlet } from 'react-router-dom';

// Centered single-column auth shell (384px col, dotted bg available via data-dotted).
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-5 py-14">
      <div className="w-full max-w-[430px]">
        <Outlet />
      </div>
    </div>
  );
}
