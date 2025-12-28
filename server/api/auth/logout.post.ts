export default defineEventHandler(async (event) => {
  try {
    // Delete httpOnly cookies
    // Note: deleteCookie requires the same options as when the cookie was set
    deleteCookie(event, "accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    deleteCookie(event, "refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Optionally: Call backend API to invalidate the token
    // This depends on your backend implementation
    // const config = useRuntimeConfig();
    // const accessToken = getCookie(event, "accessToken");
    // if (accessToken) {
    //   try {
    //     await $fetch(`${config.public.apiBaseUrl}/api/auth/logout`, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });
    //   } catch (error) {
    //     // Log but don't fail - cookies are already cleared
    //     console.error("Backend logout failed:", error);
    //   }
    // }

    setResponseStatus(event, 200);
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("Logout error:", error);
    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to logout. Please try again.",
    });
  }
});
