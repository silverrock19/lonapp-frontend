# RBAC — Roles & Permissions

Source: EP-01 design spec (US-0024)

## Roles

| Role constant | Label |
|---------------|-------|
| `super_admin` | Super Admin — all permissions |
| `manager` | Manager — most ops, no system config |
| `customer_service` | Customer Service — view customer data + orders |
| `factory_processor` | Factory Processor — production workflow |
| `driver` | Driver — deliveries + view orders |
| `quality_checker` | Quality Checker — QC + view orders |

Constants defined in `src/utils/rbac.js` (`ROLES`, `PERM`, `PERMISSIONS`).

## Permission Matrix (MVP)

| Permission | super_admin | manager | customer_service | factory_processor | driver | quality_checker |
|------------|:-----------:|:-------:|:----------------:|:-----------------:|:------:|:---------------:|
| view_dashboard | ✅ | ✅ | — | — | — | — |
| manage_staff | ✅ | ✅ | — | — | — | — |
| manage_orders | ✅ | ✅ | — | — | — | — |
| view_orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| manage_customers | ✅ | ✅ | — | — | — | — |
| view_customers | ✅ | ✅ | ✅ | — | — | — |
| manage_payments | ✅ | — | — | — | — | — |
| view_payments | ✅ | ✅ | — | — | — | — |
| manage_settings | ✅ | — | — | — | — | — |
| view_audit_log | ✅ | ✅ | — | — | — | — |
| process_orders | ✅ | — | — | ✅ | — | — |
| manage_deliveries | ✅ | — | — | — | ✅ | — |
| quality_check | ✅ | — | — | — | — | ✅ |

## Usage

```jsx
import { RBACGate } from '../../components/shared/RBACGate.jsx';
import { PERM } from '../../utils/rbac.js';

<RBACGate permission={PERM.MANAGE_STAFF} disabledMessage="Managers and above can manage staff">
  <Button variant="primary">Add Staff Member</Button>
</RBACGate>
```

Hook for conditional logic:
```jsx
import { useRBAC } from '../../hooks/useRBAC.js';
const { can } = useRBAC();
if (can(PERM.VIEW_AUDIT_LOG)) { /* ... */ }
```

## Principle
Always render disabled controls with a tooltip explanation — **never hide UI elements** based on role.
This keeps the interface predictable and surfaces what permissions the user lacks.
