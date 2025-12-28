import type { ResendOtpResponse } from "../../../types/auth";

export default defineEventHandler(async (event): Promise<ResendOtpResponse> => {
  const accessToken = getCookie(event, "accessToken");

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Access token is required.",
    });
  }
  const config = useRuntimeConfig();

  try {
    // Call the external API for resending OTP
    const apiBaseUrl = config.public.apiBaseUrl;
    const response = await $fetch<ResendOtpResponse>(
      `${apiBaseUrl}/api/auth/resend-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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
      message: "Unable to resend OTP. Please try again.",
    });
  }
});
