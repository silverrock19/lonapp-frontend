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
import CustomerForgotPasswordPage from './pages/auth/CustomerForgotPasswordPage.jsx';
import CustomerResetPasswordPage from './pages/auth/CustomerResetPasswordPage.jsx';

import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import BusinessProfilePage from './pages/business/BusinessProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import StaffPage from './pages/staff/StaffPage.jsx';
import MyProfilePage from './pages/staff/MyProfilePage.jsx';
import BusinessWizardPage from './pages/register/BusinessWizardPage.jsx';
import BusinessApprovalPage from './pages/admin/BusinessApprovalPage.jsx';
import AddressesPage from './pages/customer/AddressesPage.jsx';
import EmailVerificationPage from './pages/auth/EmailVerificationPage.jsx';
import PhoneVerificationPage from './pages/auth/PhoneVerificationPage.jsx';
import CustomerHomePage from './pages/customer/CustomerHomePage.jsx';
import CustomerProfilePage from './pages/customer/CustomerProfilePage.jsx';
import CustomerProfileEditPage from './pages/customer/CustomerProfileEditPage.jsx';
import PaymentMethodsPage from './pages/customer/PaymentMethodsPage.jsx';
import LaundryPreferencesPage from './pages/customer/LaundryPreferencesPage.jsx';
import NotificationsPage from './pages/customer/NotificationsPage.jsx';
import LanguagePage from './pages/customer/LanguagePage.jsx';
import FavoriteLaundriesPage from './pages/customer/FavoriteLaundriesPage.jsx';
import PrivacySettingsPage from './pages/customer/PrivacySettingsPage.jsx';
import ActivityHistoryPage from './pages/customer/ActivityHistoryPage.jsx';
import DataExportPage from './pages/customer/DataExportPage.jsx';
import AccountSettingsPage from './pages/customer/AccountSettingsPage.jsx';
import NewsletterPage from './pages/customer/NewsletterPage.jsx';
import SocialAccountsPage from './pages/customer/SocialAccountsPage.jsx';
import KYCPage from './pages/customer/KYCPage.jsx';
import CustomerSearchPage from './pages/staff/CustomerSearchPage.jsx';
import WalkInRegistrationPage from './pages/staff/WalkInRegistrationPage.jsx';

// Constrains customer pages to phone width on desktop; full-width on mobile.
const MobileShell = ({ children }) => {
  return (
    <div data-theme="customer" className="flex min-h-screen justify-center bg-neutral-100">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_40px_rgba(0,0,0,0.12)]">
        {children}
      </div>
    </div>
  );
}

const ComingSoon = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 text-[40px] text-neutral-300">◳</div>
      <h2 className="text-h3 font-semibold text-neutral-800">{title}</h2>
      <p className="mt-2 text-small text-neutral-500">This section is coming soon.</p>
    </div>
  );
}

const App = () => {
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
              <Route path="business"           element={<BusinessProfilePage />} />
              <Route path="settings"           element={<SettingsPage />} />
              <Route path="customers"          element={<CustomerSearchPage />} />
              <Route path="customers/walkin"   element={<WalkInRegistrationPage />} />
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
          <Route element={<MobileShell><AuthLayout /></MobileShell>}>
            <Route path="/customer/login"         element={<CustomerLoginPage />} />
            <Route path="/customer/register"      element={<CustomerRegisterPage />} />
            <Route path="/customer/onboard"       element={<RetailOnboardingPage />} />
            <Route path="/customer/verify-email"        element={<EmailVerificationPage />} />
            <Route path="/customer/verify-phone"        element={<PhoneVerificationPage />} />
            <Route path="/customer/forgot-password"     element={<CustomerForgotPasswordPage />} />
            <Route path="/customer/reset-password"      element={<CustomerResetPasswordPage />} />
          </Route>

          {/* ── Customer app (mobile-first, teal theme) ── */}
          <Route path="/app" element={<MobileShell><CustomerLayout /></MobileShell>}>
            <Route index                   element={<CustomerHomePage />} />
            <Route path="profile"          element={<CustomerProfilePage />} />
            <Route path="profile/edit"     element={<CustomerProfileEditPage />} />
            <Route path="addresses"        element={<AddressesPage />} />
            <Route path="payments"         element={<PaymentMethodsPage />} />
            <Route path="preferences"      element={<LaundryPreferencesPage />} />
            <Route path="notifications"    element={<NotificationsPage />} />
            <Route path="language"         element={<LanguagePage />} />
            <Route path="favorites"        element={<FavoriteLaundriesPage />} />
            <Route path="privacy"          element={<PrivacySettingsPage />} />
            <Route path="activity"         element={<ActivityHistoryPage />} />
            <Route path="export"           element={<DataExportPage />} />
            <Route path="account"          element={<AccountSettingsPage />} />
            <Route path="subscriptions"    element={<NewsletterPage />} />
            <Route path="social-accounts"  element={<SocialAccountsPage />} />
            <Route path="kyc"              element={<KYCPage />} />
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

export default App;

