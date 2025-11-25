import type { ApiResponse } from "../../../../types/api";
import type { User } from "../../../../types/user";

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

  const body = await readBody(event);
  if (!body.reason || typeof body.reason !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Reason is required",
    });
  }

  try {
    const response = await $fetch<ApiResponse<User>>(
      `${config.public.apiBaseUrl}/api/users/${userId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          reason: body.reason,
        },
      }
    );

    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Failed to reject user",
        data: error.data,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to reject user",
    });
  }
});
