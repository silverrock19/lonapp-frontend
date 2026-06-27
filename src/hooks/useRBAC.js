import { useAppSelector } from './useAppSelector.js';
import { selectUserRole } from '../store/slices/authSlice.js';
import { PERMISSIONS } from '../utils/rbac.js';

export function useRBAC() {
  const role = useAppSelector(selectUserRole);
  return {
    role,
    can: (permission) => {
      if (!role) return false;
      const allowed = PERMISSIONS[role] || [];
      return allowed.includes('*') || allowed.includes(permission);
    },
  };
}
