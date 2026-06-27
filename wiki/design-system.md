# Design System

Source: Google Drive folder `1PcNAgFQFniQq36sD-3wexLy5JxCAaXZp` (v1.1)
Wired via: `src/styles/tokens.css` + `tailwind.config.js`

## Colors

| Token | Value | Use |
|-------|-------|-----|
| `primary-500` | `#0C5FC5` | Business CTAs, active nav, focus rings |
| `accent-500`  | `#0E9AA7` | Customer CTAs, non-status highlights only |
| `neutral-900` | `#0F141B` | Sidebar background |
| `neutral-50`  | `#F7F8FA` | App background |

**Semantic (each has DEFAULT / bg / text variants):**
| | DEFAULT | bg | text |
|--|---------|----|----|
| success | `#1F9D57` | `#E6F6EE` | `#13753F` |
| warning | `#C77700` | `#FFF4E0` | `#945800` |
| error   | `#D92D20` | `#FDECEA` | `#A31C12` |
| info    | `#0C5FC5` | `#EAF2FC` | `#093F84` |

Rule: use `-text` variant for body copy (meets 4.5:1). Use DEFAULT for badges/icons/borders.
Rule: **never** use `accent` for status badges.

**Chart palette (categorical):** `chart-1…6` = blue, teal, violet, orange, pink, green.

## Typography (Manrope)

Tailwind classes: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body-lg`, `text-body`, `text-small`, `text-caption`

Business/staff body text is 14px (dense). Customer body is 15px (spacious, set via theme overlay).

**Tabular figures rule:** Apply `tabular-nums` class (or `data-numeric` attr) to all numeric columns — money (GHS), counts, order IDs, dates, KPI values.

## Spacing

4px base grid. Use Tailwind's default scale (p-1=4px, p-2=8px, p-4=16px, p-6=24px, p-8=32px, p-12=48px, p-16=64px).

## Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded-sm` | 6px | — |
| `rounded-md` | 10px | Inputs, buttons |
| `rounded-lg` | 14px | Cards, panels |
| `rounded-xl` | 20px | Modals, large containers |
| `rounded-full` | 999px | Badges, avatars |

Customer theme overrides: `rounded-md`→14px, `rounded-lg`→20px, `rounded-xl`→28px.

## Elevation

| Class | Use |
|-------|-----|
| `shadow-sm` | Cards |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals |

## Two-Theme Implementation

Wrap customer app root in `<div data-theme="customer">` (done in `App.jsx`).
The CSS overlay in `tokens.css` remaps `--radius-*` and `--tap-min` automatically.
Primary CTA in customer context uses `accent-500` (teal), set via `--cta-color`.

## Component Rules

- **Button** variants: `primary | secondary | outline | ghost | danger`; sizes: `sm | default | lg`
- **Badge** variants: `success | warning | error | info | neutral`; add `dot` prop for status dot
- **Alert** variants match Badge. Use `title` prop for heading.
- **Input**: always use label + `required` prop. Surface server errors with `error` prop.
- **RBACGate**: render disabled + tooltip for denied permissions. Never hide controls.
- **Tooltip**: required for all RBAC-gated disabled actions — explain the reason.
- **Stepper**: `steps` array + `currentStep` index (0-based). States: done / active / upcoming.
- **OtpInput**: 6-cell. Handles paste, backspace navigation, numeric only.
