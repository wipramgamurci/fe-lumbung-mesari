export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();

  // Only fetch if user is not already loaded
  if (!userStore.user) {
    try {
      // Try to fetch user - httpOnly cookies are automatically sent with $fetch
      // On server: useCookie can read httpOnly cookies
      // On client: $fetch automatically includes httpOnly cookies in the request
      await userStore.fetchUser();
    } catch (error) {
      // Silently fail if no token or invalid token
      // The middleware will handle redirecting unauthenticated users
      userStore.clearUser();
    }
  }
});
