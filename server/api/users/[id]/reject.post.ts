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
      message: "Missing or invalid token",
    });
  }

  const body = await readBody(event);
  const trimmedReason =
    typeof body.reason === "string" ? body.reason.trim() : undefined;

  if (!trimmedReason) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Reason is required",
    });
  }

  try {
    const response = await $fetch<UserStatusUpdateResponse>(
      `${config.public.apiBaseUrl}/api/users/${userId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          reason: trimmedReason,
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
        message: error.data?.message ?? "Failed to reject user",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to reject user",
    });
  }
});
