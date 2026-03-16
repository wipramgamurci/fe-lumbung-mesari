import type { VerifyOtpRequest, VerifyOtpResponse } from "../../../types/auth";

export default defineEventHandler(async (event): Promise<VerifyOtpResponse> => {
  const accessToken = getCookie(event, "accessToken");

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Access token is required.",
    });
  }
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as VerifyOtpRequest;

  // Basic validation
  if (!body.otpCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
      message: "OTP is required",
    });
  }

  try {
    // Call the external API for OTP verification
    const apiBaseUrl = config.public.apiBaseUrl;
    const response = await $fetch<VerifyOtpResponse>(
      `${apiBaseUrl}/api/auth/verify-otp`,
      {
        method: "POST",
        body: {
          otpCode: body.otpCode,
        },
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
    console.error("OTP verification API error:", {
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      message: error.data?.message ?? error.message,
      data: error.data,
    });

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
      message: "Unable to verify OTP. Please try again.",
    });
  }
});
