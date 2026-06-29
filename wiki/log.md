# LonApp Wiki — Change Log
Append-only. Most recent first. Format: `YYYY-MM-DD | action | detail`

---

2026-06-29 | session  | Session 9e5327fb-ee14-4770-bc01-9540b196b8a9 — refactor session (reusability, forms/ reorganisation, AuthContext removal, hooks, utils). Transcript: C:\Users\DELL PRECISION 5530\.claude\projects\c--Users-DELL-PRECISION-5530-OneDrive-Desktop-js-files-lonapp-frontend\9e5327fb-ee14-4770-bc01-9540b196b8a9.jsonl
2026-06-29 | refactor | Move field primitives (Input, PasswordInput, OtpInput) from components/ui/ to components/forms/; delete dead forms/Stepper (was never imported)
2026-06-29 | refactor | Remove AuthContext — was a thin Redux wrapper with no added value; consumers now use useSelector(selectIsAuthenticated) / useSelector(selectUser) directly
2026-06-29 | refactor | Extract useForm hook (src/hooks/useForm.js) — eliminates set(field) factory duplication across 6 pages; returns { form, setForm, errors, setErrors, set }
2026-06-29 | refactor | Extract isValidEmail and passwordStrength into src/utils/validate.js — shared validation helpers no longer duplicated per page
2026-06-29 | refactor | Extract PasswordInput component (src/components/forms/PasswordInput.jsx) — eliminates Eye/EyeOff toggle duplication across 5 auth pages
2026-06-29 | refactor | Extract SectionCard component (src/components/ui/SectionCard.jsx) — replaces 3 identical inline card layouts in settings/profile pages
2026-06-29 | refactor | Convert all components/pages to const arrow-function style (const X = () => {}; export default X); extract Google/Facebook SVG icons to components/icons/
2026-06-29 | scaffold | Initial project scaffold: Vite React JS + Tailwind v4 + Redux Toolkit + react-router-dom v6 + lucide-react
2026-06-27 | scaffold | Design system tokens wired: src/styles/tokens.css + tailwind.config.js from Drive v1.1
2026-06-27 | scaffold | Store: authSlice (persisted), onboardingSlice (transient), uiSlice
2026-06-27 | scaffold | Base components: Button, Badge, Input, Alert, Toast, Stepper, OtpInput, AppShell, AuthLayout, CustomerLayout
2026-06-27 | scaffold | Utilities: classNames, formatCurrency (GHS), formatPhone (E.164/+233), rbac permission matrix
2026-06-27 | scaffold | CLAUDE.md + wiki/ created
