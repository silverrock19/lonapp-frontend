import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/slices/authSlice.js';
import { getAccessLevel, canView, canEdit, canCreate, canApprove } from './permissions.js';

/**
 * Returns permission info for the active role on a given feature.
 *
 * @param {string} feature  Feature slug (e.g. 'pricing', 'orders', 'delivery')
 * @returns {{ level: string, canView: boolean, canEdit: boolean, canCreate: boolean, canApprove: boolean }}
 */
export function usePermission(feature) {
  const role = useSelector(selectUserRole);
  const level = getAccessLevel(role, feature);
  return {
    level,
    canView:   canView(level),
    canEdit:   canEdit(level),
    canCreate: canCreate(level),
    canApprove: canApprove(level),
  };
}

/**
 * Returns whether the active role has ANY non-N access to the given feature.
 * Useful for simple show/hide guards.
 */
export function useCanView(feature) {
  const role = useSelector(selectUserRole);
  return canView(getAccessLevel(role, feature));
}
