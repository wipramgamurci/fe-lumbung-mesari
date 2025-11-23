// Simplified Role Middleware
// This is a simplified version - you can replace role.ts with this

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  // Get required roles from route meta (always an array)
  const requiredRoles = to.meta.roles as
    | ("member" | "administrator" | "superadministrator")[]
    | undefined;

  // If no roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return;
  }

  const userRole = userStore.userRole;
  if (!userRole) {
    // No user role means not authenticated - redirect to login
    // Note: auth.global should have caught this, but this is a safety check
    return navigateTo("/login");
  }

  // Check if user has required role using store getters
  const hasAccess = requiredRoles.includes(userRole);

  if (!hasAccess) {
    return navigateTo("/error/403");
  }
});
