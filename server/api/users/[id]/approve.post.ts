import type { UserStatusUpdateResponse } from "../../../../types/user";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const params = event.context.params;
  const userId = params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "User ID is required",
    });
  }

  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Missing or invalid token" },
    });
  }

  try {
    const response = await $fetch<UserStatusUpdateResponse>(
      `${config.public.apiBaseUrl}/api/users/${userId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Failed to approve user",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to approve user",
    });
  }
});
