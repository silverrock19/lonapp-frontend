import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/slices/authSlice.js';
import { PERMISSIONS } from '../utils/rbac.js';

export function useRBAC() {
  const role = useSelector(selectUserRole);
  return {
    role,
    can: (permission) => {
      if (!role) return false;
      const allowed = PERMISSIONS[role] || [];
      return allowed.includes('*') || allowed.includes(permission);
    },
  };
}
