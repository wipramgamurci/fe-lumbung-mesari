import type { LoginRequest, LoginResponse } from "../../../types/auth";

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as LoginRequest; // Get POST data (email, password)

  // Basic validation
  if (!body.identifier || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
      message: "Identifier and password are required",
    });
  }

  try {
    const apiBaseUrl = config.public.apiBaseUrl;
    const response = await $fetch<LoginResponse>(
      `${apiBaseUrl}/api/auth/login`,
      {
        method: "POST",
        body: {
          identifier: body.identifier,
          password: body.password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set httpOnly cookies for tokens (secure)
    if (response.token) {
      setCookie(event, "accessToken", response.token.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // CSRF protection
        maxAge: 60 * 60, // 1 hour (adjust as needed)
      });

      setCookie(event, "refreshToken", response.token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1, // 1 day for refresh token
      });
    }

    // Return the response from the external API with the same status code
    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    console.error("Login API error:", error);

    // Forward the external API error response directly
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Unable to login. Please try again.",
        data: error.data,
      });
    }

    // Handle network or other errors
    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to login. Please try again.",
    });
  }
});
