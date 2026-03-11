export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const params = event.context.params;
  const installmentId = params?.id;

  if (!installmentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Installment ID is required",
    });
  }

  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing or invalid token",
    });
  }

  try {
    const response = await $fetch<{ message: string }>(
      `${config.public.apiBaseUrl}/api/loans/installments/${installmentId}/settle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Failed to settle installment",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to settle installment",
    });
  }
});
