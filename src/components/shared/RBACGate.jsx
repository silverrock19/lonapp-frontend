import { useRBAC } from '../../hooks/useRBAC.js';

// Renders children if the current user has the required permission.
// If not, renders a disabled clone with a tooltip explaining why — never hides the control.
export function RBACGate({ permission, disabledMessage = 'You do not have permission to perform this action', children }) {
  const { can } = useRBAC();

  if (can(permission)) return children;

  return (
    <span title={disabledMessage} className="inline-block cursor-not-allowed opacity-50">
      <span className="pointer-events-none" aria-disabled="true">
        {children}
      </span>
    </span>
  );
}
