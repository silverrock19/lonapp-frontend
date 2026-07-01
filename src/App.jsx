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
// EP-05 Pricing & Settings
import PricingIndexPage       from './pages/settings/pricing/PricingIndexPage.jsx';
import PerItemPricingPage     from './pages/settings/pricing/PerItemPricingPage.jsx';
import PerWeightPricingPage   from './pages/settings/pricing/PerWeightPricingPage.jsx';
import TurnaroundPricingPage  from './pages/settings/pricing/TurnaroundPricingPage.jsx';
import BundlePricingPage      from './pages/settings/pricing/BundlePricingPage.jsx';
import TaxConfigPage          from './pages/settings/pricing/TaxConfigPage.jsx';
import CurrencyPage           from './pages/settings/pricing/CurrencyPage.jsx';
import BulkDiscountsPage      from './pages/settings/pricing/BulkDiscountsPage.jsx';
import LoyaltyPricingPage     from './pages/settings/pricing/LoyaltyPricingPage.jsx';
import PromotionsPage         from './pages/settings/pricing/PromotionsPage.jsx';
import CustomerContractsPage  from './pages/settings/pricing/CustomerContractsPage.jsx';
import QuoteCalculatorPage    from './pages/settings/pricing/QuoteCalculatorPage.jsx';
import PriceHistoryPage       from './pages/settings/pricing/PriceHistoryPage.jsx';
// EP-04 Intake & Condition
import IntakePage from './pages/intake/IntakePage.jsx';
import ItemIntakeFormPage from './pages/intake/ItemIntakeFormPage.jsx';
// EP-04 Tracking & Status
import TrackingPage from './pages/tracking/TrackingPage.jsx';
import CheckpointScanPage from './pages/tracking/CheckpointScanPage.jsx';
import ItemLocationPage from './pages/tracking/ItemLocationPage.jsx';
import BatchBoardPage from './pages/tracking/BatchBoardPage.jsx';
import TransferPage from './pages/tracking/TransferPage.jsx';
// EP-04 Exceptions
import ExceptionsPage from './pages/exceptions/ExceptionsPage.jsx';
// EP-04 Item Search & Detail
import ItemSearchPage from './pages/items/ItemSearchPage.jsx';
import ItemDetailPage from './pages/items/ItemDetailPage.jsx';
// EP-04 Delivery
import DeliveryPage from './pages/delivery/DeliveryPage.jsx';
// EP-04 Customer — Photos & History
import ItemPhotoGalleryPage from './pages/customer/ItemPhotoGalleryPage.jsx';
import ItemProcessingHistoryPage from './pages/customer/ItemProcessingHistoryPage.jsx';
// Inventory
import InventoryPage from './pages/inventory/InventoryPage.jsx';
// EP-04 Tagging & Identification
import TaggingPage from './pages/tagging/TaggingPage.jsx';
import BarcodeGenerationPage from './pages/tagging/BarcodeGenerationPage.jsx';
import HydroTagPage from './pages/tagging/HydroTagPage.jsx';
import RFIDAssignmentPage from './pages/tagging/RFIDAssignmentPage.jsx';
import TagReplacementPage from './pages/tagging/TagReplacementPage.jsx';
import ServiceDiscoveryPage from './pages/customer/ServiceDiscoveryPage.jsx';
import OutletDetailPage from './pages/customer/OutletDetailPage.jsx';
import OrderCreatePage from './pages/customer/OrderCreatePage.jsx';
import OrderReviewPage from './pages/customer/OrderReviewPage.jsx';
import UpgradeExpressPage from './pages/customer/UpgradeExpressPage.jsx';
import SameDayRequestPage from './pages/customer/SameDayRequestPage.jsx';
import OrdersListPage from './pages/customer/OrdersListPage.jsx';
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx';
import EditOrderItemsPage from './pages/customer/EditOrderItemsPage.jsx';
import ReschedulePickupPage from './pages/customer/ReschedulePickupPage.jsx';
import RescheduleDeliveryPage from './pages/customer/RescheduleDeliveryPage.jsx';
import ChangeAddressPage from './pages/customer/ChangeAddressPage.jsx';
import CancelOrderPage from './pages/customer/CancelOrderPage.jsx';
import OrderReceiptPage from './pages/customer/OrderReceiptPage.jsx';
import OrderInvoicePage from './pages/customer/OrderInvoicePage.jsx';
import BulkReceiptPage from './pages/customer/BulkReceiptPage.jsx';
import ExportOrdersPage from './pages/customer/ExportOrdersPage.jsx';
// EP-03 Reorder & Recurring
import ReorderWithModificationsPage from './pages/customer/ReorderWithModificationsPage.jsx';
import OrderTemplatesPage from './pages/customer/OrderTemplatesPage.jsx';
import CreateTemplatePage from './pages/customer/CreateTemplatePage.jsx';
import SubscriptionsPage from './pages/customer/SubscriptionsPage.jsx';
import SubscriptionDetailPage from './pages/customer/SubscriptionDetailPage.jsx';
import SetupRecurringPage from './pages/customer/SetupRecurringPage.jsx';
// EP-03 Issues, Disputes & Refunds
import ReportIssuePage from './pages/customer/ReportIssuePage.jsx';
import DisputesListPage from './pages/customer/DisputesListPage.jsx';
import DisputeDetailPage from './pages/customer/DisputeDetailPage.jsx';
import RequestRefundPage from './pages/customer/RequestRefundPage.jsx';
import RequestRecleaningPage from './pages/customer/RequestRecleaningPage.jsx';
// EP-03 Commercial & Advanced
import BulkOrderPage from './pages/customer/BulkOrderPage.jsx';
import CorporateAccountPage from './pages/customer/CorporateAccountPage.jsx';
import RushOrderPage from './pages/customer/RushOrderPage.jsx';
import SplitDeliveryPage from './pages/customer/SplitDeliveryPage.jsx';
import GiftOrderPage from './pages/customer/GiftOrderPage.jsx';
// POS
import POSShell from './components/layout/POSShell.jsx';
import POSLoginPage from './pages/pos/POSLoginPage.jsx';
import POSLockPage from './pages/pos/POSLockPage.jsx';
import POSLandingPage from './pages/pos/POSLandingPage.jsx';
import WalkInOrderPage from './pages/pos/WalkInOrderPage.jsx';
import ItemIntakePage from './pages/pos/ItemIntakePage.jsx';
import PaymentPage from './pages/pos/PaymentPage.jsx';
import ReceiptPage from './pages/pos/ReceiptPage.jsx';
import TodaysOrdersPage from './pages/pos/TodaysOrdersPage.jsx';
import ReprintPage from './pages/pos/ReprintPage.jsx';
import OutletsPage from './pages/settings/OutletsPage.jsx';
// EP-06 Payment & Billing
import PaymentsHubPage from './pages/payments/PaymentsHubPage.jsx';
import WalletPage from './pages/customer/WalletPage.jsx';
import PaymentHistoryPage from './pages/customer/PaymentHistoryPage.jsx';
import BillingDisputePage from './pages/customer/BillingDisputePage.jsx';
// Reports, Support, Inventory
import ReportsHubPage from './pages/reports/ReportsHubPage.jsx';
import SupportPage from './pages/support/SupportPage.jsx';
// EP-07 Production & Processing
import ProductionDashboardPage from './pages/production/ProductionDashboardPage.jsx';
import MachineMaintenancePage from './pages/production/MachineMaintenancePage.jsx';
import ChemicalUsagePage from './pages/production/ChemicalUsagePage.jsx';
import EnergyConsumptionPage from './pages/production/EnergyConsumptionPage.jsx';
import ProcessingCostPage from './pages/production/ProcessingCostPage.jsx';
import SOPViewerPage from './pages/production/SOPViewerPage.jsx';
import EnvironmentalCompliancePage from './pages/production/EnvironmentalCompliancePage.jsx';
import TempHumidityPage from './pages/production/TempHumidityPage.jsx';

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
              <Route path="outlets"  element={<OutletsPage />} />
              <Route path="staff"    element={<StaffPage />} />
              <Route path="profile"  element={<MyProfilePage />} />
              <Route path="services">
                <Route index                  element={<PricingIndexPage />} />
                <Route path="per-item"        element={<PerItemPricingPage />} />
                <Route path="per-weight"      element={<PerWeightPricingPage />} />
                <Route path="turnaround"      element={<TurnaroundPricingPage />} />
                <Route path="bundles"         element={<BundlePricingPage />} />
                <Route path="tax"             element={<TaxConfigPage />} />
                <Route path="currency"        element={<CurrencyPage />} />
                <Route path="bulk-discounts"  element={<BulkDiscountsPage />} />
                <Route path="loyalty"         element={<LoyaltyPricingPage />} />
                <Route path="promotions"      element={<PromotionsPage />} />
                <Route path="contracts"         element={<CustomerContractsPage />} />
                <Route path="quote-calculator" element={<QuoteCalculatorPage />} />
                <Route path="price-history"    element={<PriceHistoryPage />} />
              </Route>
              <Route path="payments"   element={<PaymentsHubPage />} />
              <Route path="reports"    element={<ReportsHubPage />} />
              <Route path="support"    element={<SupportPage />} />
              <Route path="inventory"  element={<InventoryPage />} />
              <Route path="business"           element={<BusinessProfilePage />} />
              <Route path="settings"           element={<SettingsPage />} />
              <Route path="customers"          element={<CustomerSearchPage />} />
              <Route path="customers/walkin"   element={<WalkInRegistrationPage />} />
              {/* EP-04 Tagging & Identification */}
              <Route path="tagging"            element={<TaggingPage />} />
              <Route path="tagging/barcodes"   element={<BarcodeGenerationPage />} />
              <Route path="tagging/hydro"      element={<HydroTagPage />} />
              <Route path="tagging/rfid"       element={<RFIDAssignmentPage />} />
              <Route path="tagging/replace"    element={<TagReplacementPage />} />
              {/* EP-04 Intake & Condition */}
              <Route path="intake"             element={<IntakePage />} />
              <Route path="intake/items/:itemId" element={<ItemIntakeFormPage />} />
              {/* EP-04 Tracking & Status */}
              <Route path="tracking"           element={<TrackingPage />} />
              <Route path="tracking/scan"      element={<CheckpointScanPage />} />
              <Route path="tracking/items"     element={<ItemLocationPage />} />
              <Route path="tracking/batches"   element={<BatchBoardPage />} />
              <Route path="tracking/transfer"  element={<TransferPage />} />
              {/* EP-04 Exceptions */}
              <Route path="exceptions"         element={<ExceptionsPage />} />
              {/* EP-04 Item Search & Detail */}
              <Route path="items"              element={<ItemSearchPage />} />
              <Route path="items/:itemId"      element={<ItemDetailPage />} />
              {/* EP-04 Delivery */}
              <Route path="delivery"           element={<DeliveryPage />} />
              {/* EP-07 Production & Processing */}
              <Route path="production"             element={<ProductionDashboardPage />} />
              <Route path="production/machines"    element={<MachineMaintenancePage />} />
              <Route path="production/chemicals"   element={<ChemicalUsagePage />} />
              <Route path="production/energy"      element={<EnergyConsumptionPage />} />
              <Route path="production/costs"       element={<ProcessingCostPage />} />
              <Route path="production/sops"        element={<SOPViewerPage />} />
              <Route path="production/environment" element={<EnvironmentalCompliancePage />} />
              <Route path="production/sensors"     element={<TempHumidityPage />} />
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
            {/* EP-03 Phase 1 — Order Creation */}
            <Route path="discover"         element={<ServiceDiscoveryPage />} />
            <Route path="outlet/:id"       element={<OutletDetailPage />} />
            <Route path="order/new"        element={<OrderCreatePage />} />
            <Route path="order/review"     element={<OrderReviewPage />} />
            <Route path="order/upgrade"    element={<UpgradeExpressPage />} />
            <Route path="order/same-day"   element={<SameDayRequestPage />} />
            {/* EP-03 Phase 2 — Track & Modify */}
            <Route path="orders"                               element={<OrdersListPage />} />
            <Route path="orders/:id"                           element={<OrderTrackingPage />} />
            <Route path="orders/:id/edit"                      element={<EditOrderItemsPage />} />
            <Route path="orders/:id/reschedule-pickup"         element={<ReschedulePickupPage />} />
            <Route path="orders/:id/reschedule-delivery"       element={<RescheduleDeliveryPage />} />
            <Route path="orders/:id/change-address"            element={<ChangeAddressPage />} />
            <Route path="orders/:id/cancel"                    element={<CancelOrderPage />} />
            {/* EP-03 Phase 3 — History & Documents */}
            <Route path="orders/export"                        element={<ExportOrdersPage />} />
            <Route path="orders/bulk-receipt"                  element={<BulkReceiptPage />} />
            <Route path="orders/:id/receipt"                   element={<OrderReceiptPage />} />
            <Route path="orders/:id/invoice"                   element={<OrderInvoicePage />} />
            {/* EP-03 Phase 4 — Reorder & Recurring */}
            <Route path="orders/:id/reorder"                   element={<ReorderWithModificationsPage />} />
            <Route path="templates"                            element={<OrderTemplatesPage />} />
            <Route path="templates/new"                        element={<CreateTemplatePage />} />
            <Route path="order-subscriptions"                  element={<SubscriptionsPage />} />
            <Route path="order-subscriptions/new"              element={<SetupRecurringPage />} />
            <Route path="order-subscriptions/:id"              element={<SubscriptionDetailPage />} />
            {/* EP-03 Phase 5 — Issues, Disputes & Refunds */}
            <Route path="orders/:id/report"                    element={<ReportIssuePage />} />
            <Route path="orders/:id/refund"                    element={<RequestRefundPage />} />
            <Route path="orders/:id/recleaning"                element={<RequestRecleaningPage />} />
            <Route path="disputes"                             element={<DisputesListPage />} />
            <Route path="disputes/:id"                         element={<DisputeDetailPage />} />
            {/* EP-03 Phase 6 — Commercial & Advanced */}
            <Route path="commercial/bulk-order"                element={<BulkOrderPage />} />
            <Route path="commercial/corporate"                 element={<CorporateAccountPage />} />
            <Route path="order/rush"                           element={<RushOrderPage />} />
            <Route path="order/split-delivery"                 element={<SplitDeliveryPage />} />
            <Route path="order/gift"                           element={<GiftOrderPage />} />
            {/* EP-06 Payment & Billing — Customer */}
            <Route path="wallet"                               element={<WalletPage />} />
            <Route path="payment-history"                      element={<PaymentHistoryPage />} />
            <Route path="billing/dispute"                      element={<BillingDisputePage />} />
            <Route path="billing/dispute/:invoiceId"           element={<BillingDisputePage />} />
            {/* EP-04 Customer — Photos & History */}
            <Route path="orders/:id/photos"                    element={<ItemPhotoGalleryPage />} />
            <Route path="orders/:id/item-history"              element={<ItemProcessingHistoryPage />} />
          </Route>

          {/* ── Platform admin ── */}
          <Route element={<ProtectedRoute requiredRole={['super_admin', 'platform_admin']} />}>
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

          {/* ── POS Auth (standalone, no shell) ── */}
          <Route path="/pos/login" element={<POSLoginPage />} />
          <Route path="/pos/lock"  element={<POSLockPage />} />

          {/* ── POS / Counter (Front Desk Staff primary workspace) ── */}
          <Route path="/pos" element={<POSShell />}>
            <Route index                           element={<POSLandingPage />} />
            <Route path="order/new"                element={<WalkInOrderPage />} />
            <Route path="order/:id/intake"         element={<ItemIntakePage />} />
            <Route path="order/:id/payment"        element={<PaymentPage />} />
            <Route path="order/:id/receipt"        element={<ReceiptPage />} />
            <Route path="orders"                   element={<TodaysOrdersPage />} />
            <Route path="receipt"                  element={<ReprintPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <DevRoleSwitcher />
      </BrowserRouter>
    </LogoProvider>
  );
}

export default App;

