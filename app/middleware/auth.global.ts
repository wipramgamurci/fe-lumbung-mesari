export default defineNuxtRouteMiddleware((to, from) => {
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];

  // Server-side: Can read httpOnly cookies
  // This is the PRIMARY protection - runs during SSR
  if (import.meta.server) {
    const accessToken = useCookie("accessToken");
    const hasToken = !!accessToken.value;

    // Redirect logged-in users away from auth pages
    // But let status middleware handle redirects for status-specific pages
    if (hasToken && publicRoutes.includes(to.path)) {
      // Status middleware will redirect to appropriate page based on status
      return navigateTo("/dashboard");
    }

    // Protect routes - redirect to login if no token
    // All routes except public routes require authentication
    if (!hasToken && !publicRoutes.includes(to.path)) {
      return navigateTo("/login");
    }
  }

  // Client-side: Can't read httpOnly cookies
  // Server already protected it, but we can do UX optimization
  // Skip client-side check to avoid issues - server-side already handled it
  // Middleware runs on both server and client, but server check is sufficient

  if (import.meta.client) {
    return;
  }
});
