import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import AdminShell from './components/layout/AdminShell.jsx';
import DevRoleSwitcher from './components/dev/DevRoleSwitcher.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { LogoProvider } from './context/LogoContext.jsx';

import AdminLoginPage from './pages/auth/AdminLoginPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import CustomerRegisterPage from './pages/auth/CustomerRegisterPage.jsx';
import RetailOnboardingPage from './pages/auth/RetailOnboardingPage.jsx';
import CustomerLoginPage from './pages/auth/CustomerLoginPage.jsx';

import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import BusinessProfilePage from './pages/business/BusinessProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import StaffPage from './pages/staff/StaffPage.jsx';
import MyProfilePage from './pages/staff/MyProfilePage.jsx';
import BusinessWizardPage from './pages/register/BusinessWizardPage.jsx';
import BusinessApprovalPage from './pages/admin/BusinessApprovalPage.jsx';
import AddressesPage from './pages/customer/AddressesPage.jsx';

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 text-[40px] text-neutral-300">◳</div>
      <h2 className="text-h3 font-semibold text-neutral-800">{title}</h2>
      <p className="mt-2 text-small text-neutral-500">This section is coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <LogoProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Business / Staff (desktop-led) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppShell />}>
              <Route index           element={<DashboardPage />} />
              <Route path="orders"   element={<ComingSoon title="Orders" />} />
              <Route path="outlets"  element={<ComingSoon title="Outlets & Factories" />} />
              <Route path="staff"    element={<StaffPage />} />
              <Route path="profile"  element={<MyProfilePage />} />
              <Route path="services" element={<ComingSoon title="Services & Pricing" />} />
              <Route path="payments" element={<ComingSoon title="Payments" />} />
              <Route path="business" element={<BusinessProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── Business registration wizard (public) ── */}
          <Route path="/register/business" element={<BusinessWizardPage />} />

          {/* ── Business auth (light theme) ── */}
          <Route element={<AuthLayout />}>
            <Route path="/login"            element={<AdminLoginPage />} />
            <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
            <Route path="/reset-password"   element={<ResetPasswordPage />} />
          </Route>

          {/* ── Customer auth (teal theme overlay) ── */}
          <Route element={<div data-theme="customer"><AuthLayout /></div>}>
            <Route path="/customer/login"    element={<CustomerLoginPage />} />
            <Route path="/customer/register" element={<CustomerRegisterPage />} />
            <Route path="/customer/onboard"  element={<RetailOnboardingPage />} />
          </Route>

          {/* ── Customer app (mobile-first, teal theme) ── */}
          <Route path="/app" element={<div data-theme="customer"><CustomerLayout /></div>}>
            <Route path="addresses" element={<AddressesPage />} />
          </Route>

          {/* ── Platform admin ── */}
          <Route element={<ProtectedRoute requiredRole="super_admin" />}>
            <Route path="/admin" element={<AdminShell />}>
              <Route index                   element={<ComingSoon title="Platform Overview" />} />
              <Route path="businesses"       element={<BusinessApprovalPage />} />
              <Route path="clarifications"   element={<ComingSoon title="Clarification Requests" />} />
              <Route path="users"            element={<ComingSoon title="Users & Accounts" />} />
              <Route path="analytics"        element={<ComingSoon title="Platform Analytics" />} />
              <Route path="audit"            element={<ComingSoon title="Audit Log" />} />
              <Route path="settings"         element={<ComingSoon title="Platform Settings" />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {import.meta.env.DEV && <DevRoleSwitcher />}
      </BrowserRouter>
    </LogoProvider>
  );
}
