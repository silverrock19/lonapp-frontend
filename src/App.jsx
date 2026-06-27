import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Business / Staff (desktop-led) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {/* EP-01+ business pages mount here */}
          </Route>
        </Route>

        {/* ── Customer app (mobile-first, teal theme overlay) ── */}
        <Route path="/app/*" element={
          <div data-theme="customer">
            <CustomerLayout />
          </div>
        } />

        {/* ── Auth screens (centered single-column) ── */}
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register/*" element={<AuthLayout />} />
        <Route path="/forgot-password" element={<AuthLayout />} />
        <Route path="/reset-password" element={<AuthLayout />} />

        {/* ── Platform admin ── */}
        <Route element={<ProtectedRoute requiredRole="super_admin" />}>
          <Route path="/admin/*" element={<AppShell />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
