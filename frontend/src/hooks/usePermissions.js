import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions } from '../services/permissions';

/**
 * Hook to check user permissions
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const usePermission = (permission) => {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  return useMemo(() => {
    return hasPermission(role, permission);
  }, [role, permission]);
};

/**
 * Hook to check if user has any of the specified permissions
 * @param {Array<string>} permissions - Permissions to check
 * @returns {boolean} - True if user has any permission
 */
export const useAnyPermission = (permissions) => {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  return useMemo(() => {
    return hasAnyPermission(role, permissions);
  }, [role, permissions]);
};

/**
 * Hook to check if user has all of the specified permissions
 * @param {Array<string>} permissions - Permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const useAllPermissions = (permissions) => {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  return useMemo(() => {
    return hasAllPermissions(role, permissions);
  }, [role, permissions]);
};

/**
 * Hook to get all permissions for current user
 * @returns {Array<string>} - Array of permissions
 */
export const useRolePermissions = () => {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  return useMemo(() => {
    return getRolePermissions(role);
  }, [role]);
};

export default usePermission;
