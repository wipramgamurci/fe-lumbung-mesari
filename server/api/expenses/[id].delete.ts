export default defineEventHandler(async (event): Promise<void> => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Missing expense ID",
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
    await $fetch<void>(`${config.public.apiBaseUrl}/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setResponseStatus(event, 204);
  } catch (error: any) {
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Unable to delete expense",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to delete expense",
    });
  }
});
