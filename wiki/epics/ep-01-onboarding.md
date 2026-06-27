# EP-01 — Onboarding & User Management

32 user stories. Current scope (MVP). Non-MVP stories flagged.

## Screen Layout Rule
Auth / onboarding layout: **centered single-column** (Linear-style) for auth entry screens.
Business registration wizard uses `AuthLayout` with `Stepper` at the top.

## A. Business Registration Wizard (5 steps)

| Step | Story | Screen | Key components |
|------|-------|--------|----------------|
| 0 | US-0001 | Company Information | `Input`, `Select`, `PhoneInput`, `FileUpload` (document) |
| 1 | US-0002 | Outlets & Factories | Dynamic list of outlets; type select, hours, contact |
| 2 | US-0003 | Service Configuration | Checkbox list of services; Standard/Express turnaround |
| 3 | US-0004 | Payment Method Setup | `Radio` group: bank transfer / mobile money / cash |
| 4 | US-0005 | Admin Account + OTP | `Input`, `OtpInput`; submits to onboarding API |

Wizard state: `store/slices/onboardingSlice.js` (`currentStep`, `formData.*`).
Wizard actions: `store/actions/onboarding.js` (`submitStep`, `completeOnboarding`).

## B. Authentication & Recovery

| Story | Screen | Notes |
|-------|--------|-------|
| US-0008 | Admin login | Email + password + remember me |
| US-0009 | Forgot / reset password | Email link flow |
| US-0012 | Change password | Authenticated; strength meter |
| US-0013 | 2FA setup (TOTP) | **non-MVP** |
| US-0016 | Secure logout | Confirmation modal + session invalidation |
| US-0020 | Customer login | Phone / email / social |

## C. Customer Registration

| Story | Screen | Notes |
|-------|--------|-------|
| US-0011 | Customer self-registration + OTP | `OtpInput` (6-cell) |
| US-0019 | Retail onboarding | Phone/email/Google/Facebook, progressive profiling |
| US-0021 | Address management | Home/office/other; map integration |

## D. Business Profile & Lifecycle

| Story | Screen | Notes |
|-------|--------|-------|
| US-0006 | Platform admin approval dashboard | Review/approve/reject list |
| US-0007 | Social media links | **non-MVP** |
| US-0010 | Business profile management | Tabbed: company / outlets / services / payments |
| US-0014 | Temporary deactivation | Reversible; confirmation modal |
| US-0015 | Permanent closure + data export | Irreversible; strong verification |
| US-0018 | Profile & settings hub | — |
| US-0022 | Document updates & renewals | Upload + expiry tracking; `DatePicker` |
| US-0028 | Logo & branding upload | **non-MVP** |
| US-0029 | Holiday hours & special schedules | `DatePicker` |

## E. Staff & Access

| Story | Screen | Notes |
|-------|--------|-------|
| US-0023 | Staff account creation | driver / processor / QC / manager roles |
| US-0024 | Role-based access control | Roles + permission matrix view |
| US-0025 | Staff profile & status management | `Badge` for status, `DropdownMenu` for actions |
| US-0030 | Bulk staff import CSV | **non-MVP** |
| US-0032 | Staff self-profile management | — |

## F. Security & Monitoring

| Story | Screen | Notes |
|-------|--------|-------|
| US-0017 | Session management & activity | Active sessions list |
| US-0026 | Activity audit trail & logging | `DataTable` with pagination |
| US-0027 | Notification preferences | Email/SMS/push/WhatsApp toggles |
| US-0031 | Active session management | Revoke sessions; confirmation modal |
