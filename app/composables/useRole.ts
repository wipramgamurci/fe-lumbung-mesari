import type { User } from "~~/types/user";

export type UserRole = User["roleId"];

/**
 * Composable for role-based access control checks
 * Use this in components to conditionally render content based on user roles
 */
export const useRole = () => {
  const userStore = useUserStore();

  /**
   * Check if the current user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return userStore.hasRole(role);
  };

  /**
   * Check if the current user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRole = userStore.userRole;
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  /**
   * Check if the current user has all of the specified roles
   * (Useful if you expand to multi-role system in the future)
   */
  const hasAllRoles = (roles: UserRole[]): boolean => {
    const userRole = userStore.userRole;
    if (!userRole) return false;
    return roles.every((role) => role === userRole);
  };

  /**
   * Check if user is an administrator
   */
  const isAdmin = computed(() => userStore.isAdmin);

  /**
   * Check if user is a member
   */
  const isMember = computed(() => userStore.isMember);

  /**
   * Get the current user's role
   */
  const userRole = computed(() => userStore.userRole);

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isMember,
    userRole,
  };
};
