# LonApp Frontend — Claude Code Guide

## Read wiki/ first
Start every session with `wiki/INDEX.md` to find the relevant page. Append discoveries to `wiki/log.md`.

## Session logging (required)
At the **start** of every session, append a `session` entry to `wiki/log.md` with:
- The session ID (found in the transcript path shown in the system context, e.g. `006ec48c-...`)
- A one-line summary of the session's goal
- The full transcript path

Format:
```
YYYY-MM-DD | session | Session <id> — <goal summary>. Transcript: <full path to .jsonl>
```

At the **end** of the session, append `log` entries for every significant change made (refactor, fix, feat, scaffold, merge).

## Project
LonApp is a laundry business management platform for Ghana. Two apps in one repo:
- **Business/Staff app** — desktop-led, dense operational UI (default theme)
- **Customer app** — mobile-first, warmer teal theme (`data-theme="customer"` on root)

## Stack
- React 18 + Vite (JavaScript/JSX — no TypeScript)
- Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- Redux Toolkit + redux-persist (auth only)
- React Router v6
- Lucide React (only icon library — no mixing)
- Axios with JWT refresh interceptor

## Key entry points
| File | Purpose |
|------|---------|
| `src/main.jsx` | Providers: Redux → PersistGate → Auth → App |
| `src/App.jsx` | Route tree — business/customer/auth/admin splits |
| `src/store/index.js` | Store config; only `auth` slice persists |
| `src/styles/tokens.css` | Design system tokens (import once, already done) |
| `tailwind.config.js` | Tailwind theme extending design system tokens |

## Redux pattern (mangotv-style)
Slices hold **state only**. Async logic lives in `store/actions/`.
- `store/slices/authSlice.js` → session state (persisted)
- `store/slices/onboardingSlice.js` → wizard state (NOT persisted — in-memory only)
- `store/slices/uiSlice.js` → toast queue, modal state
- `store/actions/auth.js` → login, logout, verifyOTP (dispatches to authSlice)
- `store/actions/onboarding.js` → wizard step submission

## Component hierarchy
```
pages/ → features/{epic}/ → components/ui|forms|tables|cards/ → base atoms
```
- `components/ui/` — atoms: Button, Input, Badge, Alert, Toast, Modal, etc.
- `components/forms/` — OtpInput, Stepper, FileUpload, PhoneInput
- `components/layout/` — AppShell (sidebar + topbar), AuthLayout, CustomerLayout
- `components/shared/` — ProtectedRoute, RBACGate
- `features/{epic}/` — screen-level compositions per epic (EP-01 → EP-07)

## Design system rules
- **Colors**: use Tailwind token names only (`bg-primary-500`, `text-error-text`). No raw hex.
- **Icons**: Lucide only, 20px default in UI, 16px inline with text, 24px for empty states.
- **Numbers**: always apply `tabular-nums` class (or `data-numeric`) to money, counts, IDs.
- **Focus**: always visible — `focus:ring-[3px] focus:ring-primary-100`.
- **Touch targets**: min 44px (business), min 48px (customer via `--tap-min`).
- **Status colors**: success/warning/error/info only. Never use `accent` for status.
- **Accent (teal)**: customer CTAs and non-status highlights only.

## Two-theme rule
Customer routes in `App.jsx` are wrapped `<div data-theme="customer">`.
Business/staff routes use default tokens. Same components — the CSS overlay adjusts radius, spacing, and tap targets automatically.

## RBAC
- 6 roles: `super_admin`, `manager`, `customer_service`, `factory_processor`, `driver`, `quality_checker`
- Gate by permission using `<RBACGate permission={PERM.X}>` — always render disabled + tooltip, never hide.
- Permission constants: `src/utils/rbac.js`
- Hook: `useRBAC()` → `{ role, can(permission) }`

## Ghana context
- Currency: GHS — use `formatGHS()` from `utils/formatCurrency.js`
- Phone: +233 default — use `toE164()` / `displayPhone()` from `utils/formatPhone.js`
- Payment methods: mobile money (MTN, Vodafone, AirtelTigo) + bank transfer + cash

## Collaboration
The product designer pushes code to this repo. The developer (Quazor) reviews structure.
When adding a new screen, update the relevant `wiki/epics/ep-XX-*.md` page.

## Pre-commit rule
Run `npm run build` before every commit. A build failure = do not commit.

## Build conventions
- File extensions: `.jsx` for React components, `.js` for utilities/hooks/config
- Component names: PascalCase matching the design spec exactly
- No comments explaining what the code does — name things clearly instead
- Validate only at system boundaries (user input, API responses)
