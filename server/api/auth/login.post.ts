export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event); // Get POST data (email, password)

  // Basic validation
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
      data: { message: "Email and password are required" },
    });
  }

  try {
    const apiBaseUrl = config.public.apiBaseUrl;
    const response: any = await $fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      body: {
        identifier: body.email,
        password: body.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

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
        message: error.data.message,
      });
    }

    // Handle network or other errors
    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: {
        message: "Unable to login. Please try again.",
        error: "INTERNAL_ERROR",
      },
    });
  }
});
