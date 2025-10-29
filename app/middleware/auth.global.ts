export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn } = useAuth();

  const publicRoutes = ["/login", "/register"];

  if (!isLoggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  } else if (isLoggedIn.value && publicRoutes.includes(to.path)) {
    return navigateTo("/dashboard");
  }
});
