# Architecture

## Route Tree

```
/                          → ProtectedRoute → AppShell → business pages
/admin/*                   → ProtectedRoute (super_admin) → AppShell → admin pages
/app/*                     → <div data-theme="customer"> → CustomerLayout → customer pages
/login                     → AuthLayout
/register/*                → AuthLayout
/forgot-password           → AuthLayout
/reset-password            → AuthLayout
*                          → NotFoundPage
```

Business and admin routes require authentication. Customer routes (`/app/*`) have their own auth guard added per feature.

## Redux Pattern (mangotv-style)

Slices = state containers only. Actions files = async orchestration.

```
store/slices/authSlice.js        persisted (localStorage key: __lonapp_auth__)
store/slices/onboardingSlice.js  NOT persisted (in-memory; reset after wizard completes)
store/slices/uiSlice.js          NOT persisted (toast queue, modal state)

store/actions/auth.js            → imports from authSlice; handles login/logout/OTP
store/actions/onboarding.js      → imports from onboardingSlice + authSlice; handles wizard
```

Pattern: dispatch `setIsLoading(true)` → call API → dispatch result actions → `setIsLoading(false)` in finally.

## API Client (`src/api/client.js`)

- Base URL: `VITE_API_BASE_URL` env var or `http://localhost:3001/api/v1`
- Request interceptor: injects `Authorization: Bearer {accessToken}`
- Response interceptor: on 401, queues requests, calls `/auth/refresh-token`, retries. If refresh fails, calls logout callback.
- Token injection: `setClientTokens(access, refresh)` called from store subscription after login

## Status Field Convention

All slices with async operations use:
```
isLoading: false  →  true (on fetch start)  →  false (in finally)
error: null       →  null (on start)        →  message string (on failure)
```

Check `isLoading` for skeleton/spinner states. Check `error` for error display.

## Component Folders

| Folder | Contents |
|--------|----------|
| `components/ui/` | Display atoms: Button, Badge, Alert, Toast, Brandmark, SectionCard, Stepper, AuthCard |
| `components/forms/` | Field primitives: Input, PasswordInput, OtpInput, FileUpload, PhoneInput |
| `components/layout/` | AppShell, AdminShell, AuthLayout, CustomerLayout |
| `components/shared/` | ProtectedRoute, RBACGate |
| `components/icons/` | SVG icon components (GoogleIcon, FacebookIcon, CheckIcon) |

**Rule**: `forms/` owns any component that renders an editable field. `ui/` owns everything else.

## Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useForm` | `hooks/useForm.js` | Shared form state — returns `{ form, setForm, errors, setErrors, set }`. `set(field)` returns an onChange handler that updates the field and clears its error. Use for standard text/email/password fields. For checkboxes or selects with boolean values, wire `setForm` directly. |
| `useRBAC` | `hooks/useRBAC.js` | Exposes `{ role, can(permission) }` from Redux auth state |

## Key Utilities

| Utility | File | Purpose |
|---------|------|---------|
| `cn()` | `utils/classNames.js` | Conditional Tailwind class joining |
| `formatGHS()` | `utils/formatCurrency.js` | GHS currency formatting with tabular-nums |
| `toE164()` / `displayPhone()` | `utils/formatPhone.js` | Phone number normalisation (+233) |
| `isValidEmail()` | `utils/validate.js` | Email format check |
| `passwordStrength()` | `utils/validate.js` | Returns `{ score, label, color }` — use for strength meter UI |
| `PERMISSIONS` / `ROLES` / `PERM` | `utils/rbac.js` | Permission constants for all 6 roles |

## Auth State

`AuthContext` was removed. Consumers read Redux directly:

```js
import { selectIsAuthenticated, selectUser, selectUserRole } from '../store/slices/authSlice';
const isAuthenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
```

`logout` in `store/actions/auth.js` uses `store.dispatch` internally — call it as a plain async function, no `useDispatch` needed in the component.
