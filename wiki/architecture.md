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

## Key Utilities

| Utility | File | Purpose |
|---------|------|---------|
| `cn()` | `utils/classNames.js` | Conditional Tailwind class joining |
| `formatGHS()` | `utils/formatCurrency.js` | GHS currency formatting with tabular-nums |
| `toE164()` / `displayPhone()` | `utils/formatPhone.js` | Phone number normalisation (+233) |
| `PERMISSIONS` / `ROLES` / `PERM` | `utils/rbac.js` | Permission constants for all 6 roles |
