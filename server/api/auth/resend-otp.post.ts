export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Get authorization header
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Access token is required" },
    });
  }

  try {
    // Call the external API for resending OTP
    const apiBaseUrl = config.public.apiBaseUrl;
    const response: any = await $fetch(`${apiBaseUrl}/api/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    // Return the response from the external API with the same status code
    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    console.error("Resend OTP API error:", error);

    // Forward the external API error response directly
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data.message,
      });
    }

    // Handle network or other errors
    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: {
        message: "Unable to resend OTP. Please try again.",
        error: "INTERNAL_ERROR",
      },
    });
  }
});
