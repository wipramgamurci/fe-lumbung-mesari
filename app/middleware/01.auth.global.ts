import { PUBLIC_ROUTES } from "../constants/routes";

export default defineNuxtRouteMiddleware((to, from) => {
  // Server-side: Can read httpOnly cookies
  // This is the PRIMARY protection - runs during SSR
  if (import.meta.server) {
    const accessToken = useCookie("accessToken");
    const hasToken = !!accessToken.value;

    // Redirect logged-in users away from auth pages
    // Let status.global.ts handle the redirect based on user status
    // This prevents double redirects (e.g., pending user -> /dashboard -> /verify-otp)
    if (hasToken && (PUBLIC_ROUTES as readonly string[]).includes(to.path)) {
      // Don't redirect here - let status.global determine the correct destination
      // Status middleware will redirect based on status (pending -> /verify-otp, active -> /dashboard, etc.)
      return;
    }

    // Protect routes - redirect to login if no token
    // All routes except public routes require authentication
    if (!hasToken && !(PUBLIC_ROUTES as readonly string[]).includes(to.path)) {
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
