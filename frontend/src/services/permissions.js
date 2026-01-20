/**
 * ============================================================================
 * Permissions Service
 * ============================================================================
 * Service for managing user permissions and access control
 * ============================================================================
 */

/**
 * Permission types
 */
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
  MINT: 'mint',
  TRANSFER: 'transfer',
  BURN: 'burn',
};

/**
 * User roles
 */
export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

/**
 * Role permissions mapping
 */
const rolePermissions = {
  [ROLES.GUEST]: [PERMISSIONS.READ],
  [ROLES.USER]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.MINT, PERMISSIONS.TRANSFER],
  [ROLES.MODERATOR]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.DELETE],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};

/**
 * Check if user has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Permissions to check
 * @returns {boolean} - True if user has any permission
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {Array<string>} - Array of permissions
 */
export const getRolePermissions = (role) => {
  if (!role) return [];
  return rolePermissions[role] || [];
};
