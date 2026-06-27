import { Outlet } from 'react-router-dom';

// Mobile-first customer app layout with bottom tab bar.
// Wrapped in <div data-theme="customer"> by App.jsx for the teal theme overlay.
export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[--app-bg]">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      {/* Bottom tab bar placeholder — populated in EP-02+ */}
      <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-neutral-200 bg-white" aria-label="Customer navigation">
        {/* Tabs added as customer features are built */}
      </nav>
    </div>
  );
}
