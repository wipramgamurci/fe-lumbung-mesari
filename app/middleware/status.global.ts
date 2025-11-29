export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only check status if user is authenticated (has token)
  let hasToken = false;
  if (import.meta.server) {
    const accessToken = useCookie("accessToken");
    hasToken = !!accessToken.value;
  } else {
    // On client, we can't read httpOnly cookies directly
    // But if user store has a user, they're authenticated
    const userStore = useUserStore();
    hasToken = !!userStore.user;
  }

  // If no token, skip status check (auth.global will handle authentication)
  if (!hasToken) {
    return;
  }

  // Get user store
  const userStore = useUserStore();

  // Wait for user to be loaded if not already
  if (!userStore.isInitialized || !userStore.user) {
    try {
      await userStore.fetchUser();
    } catch (error) {
      // If fetch fails, user is not authenticated, let auth.global handle it
      return;
    }
  }

  // If still no user after fetch, skip status check
  if (!userStore.user) {
    return;
  }

  const userStatus = userStore.user.status;

  // Redirect based on status
  switch (userStatus) {
    case "pending":
      // Pending users can only access verify-otp page
      if (to.path !== "/verify-otp") {
        return navigateTo("/verify-otp");
      }
      break;

    case "waiting_deposit":
      // Waiting deposit users can only access waiting-deposit page
      if (to.path !== "/waiting-deposit") {
        return navigateTo("/waiting-deposit");
      }
      break;

    case "rejected":
      // Rejected users can only access rejected page
      if (to.path !== "/rejected") {
        return navigateTo("/rejected");
      }
      break;

    case "active":
      // Active users have full access - no redirect needed
      // But redirect them away from status-specific pages
      if (
        to.path === "/verify-otp" ||
        to.path === "/waiting-deposit" ||
        to.path === "/rejected"
      ) {
        return navigateTo("/dashboard");
      }
      break;

    case "inactive":
      // Inactive users - treat similar to rejected or redirect to login
      // You can customize this behavior
      if (to.path !== "/rejected") {
        return navigateTo("/rejected");
      }
      break;

    default:
      // Unknown status - allow access (or redirect to login if needed)
      break;
  }
});
