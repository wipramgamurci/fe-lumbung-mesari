export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig();
  const body = await readBody(event); // Get form data

  // Basic validation
  if (
    !body.email ||
    !body.password ||
    !body.fullname ||
    !body.username ||
    !body.passwordConfirmation ||
    !body.phoneNumber ||
    !body.address
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
      data: { message: "Please complete all required fields" },
    });
  }

  try {
    // Call the external API using environment-based URL
    const apiBaseUrl = config.public.apiBaseUrl;
    const response: any = await $fetch(`${apiBaseUrl}/api/auth/register`, {
      method: "POST",
      body: {
        email: body.email,
        password: body.password,
        passwordConfirmation: body.passwordConfirmation,
        fullname: body.fullname,
        username: body.username,
        phoneNumber: body.phoneNumber,
        address: body.address,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response from the external API
    setResponseStatus(event, 201);
    return response;
  } catch (error: any) {
    console.error("Registration API error:", error);

    // Handle different types of errors from the external API
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data.message,
      });
    }

    // Handle network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: {
        message: "Unable to connect to registration service. Please try again.",
      },
    });
  }
});
