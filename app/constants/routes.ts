/**
 * Route constants for middleware and navigation
 * Single source of truth for route definitions
 */

// Public routes that don't require authentication
export const PUBLIC_ROUTES = ["/login", "/register"] as const;

// Status-specific routes that require authentication but have status restrictions
export const STATUS_ROUTES = [
  "/verify-otp",
  "/waiting-deposit",
  "/rejected",
] as const;

// Default route for active users
export const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";
