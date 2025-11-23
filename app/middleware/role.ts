export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();

  // Get required roles from route meta
  const requiredRoles = to.meta.roles as
    | ("member" | "administrator")[]
    | undefined;

  // If no roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return;
  }

  // On server, ensure user is loaded before checking roles
  if (import.meta.server) {
    // If user is not loaded yet, try to fetch it
    if (!userStore.user && !userStore.isInitialized) {
      try {
        await userStore.fetchUser();
      } catch (error) {
        // If fetch fails, user is not authenticated
        // auth.global middleware will handle redirect, but we can also redirect here
        return navigateTo("/login");
      }
    }
  }

  // Check if user has one of the required roles
  const userRole = userStore.userRole;
  if (!userRole) {
    // No user role means not authenticated - redirect to login
    // Note: auth.global should have caught this, but this is a safety check
    return navigateTo("/login");
  }

  const hasRequiredRole = requiredRoles.includes(userRole);

  if (!hasRequiredRole) {
    // User doesn't have required role - redirect to 403 page
    return navigateTo("/error/403");
  }
});
