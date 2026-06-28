import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import AdminLoginPage from './pages/auth/AdminLoginPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import CustomerRegisterPage from './pages/auth/CustomerRegisterPage.jsx';
import RetailOnboardingPage from './pages/auth/RetailOnboardingPage.jsx';
import CustomerLoginPage from './pages/auth/CustomerLoginPage.jsx';

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

        {/* ── Business auth (light theme) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ── Customer auth (teal theme overlay) ── */}
        <Route element={<div data-theme="customer"><AuthLayout /></div>}>
          <Route path="/customer/login" element={<CustomerLoginPage />} />
          <Route path="/customer/register" element={<CustomerRegisterPage />} />
          <Route path="/customer/onboard" element={<RetailOnboardingPage />} />
        </Route>

        {/* ── Customer app (mobile-first, teal theme) ── */}
        <Route path="/app/*" element={
          <div data-theme="customer">
            <CustomerLayout />
          </div>
        } />

        {/* ── Platform admin ── */}
        <Route element={<ProtectedRoute requiredRole="super_admin" />}>
          <Route path="/admin/*" element={<AppShell />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
