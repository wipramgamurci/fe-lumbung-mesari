import type { UserMeSavingsResponse } from "~~/types/savings";

export default defineEventHandler(async (event): Promise<UserMeSavingsResponse> => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const yearStr = Array.isArray(query.year) ? query.year[0] : query.year;
  const currentYear = new Date().getFullYear();
  const year = yearStr ? parseInt(String(yearStr), 10) : currentYear;

  if (Number.isNaN(year)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Year must be a number",
    });
  }

  // Read access token from httpOnly cookie
  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing or invalid token",
    });
  }

  try {
    const response = await $fetch<UserMeSavingsResponse>(
      `${config.public.apiBaseUrl}/api/users/me/savings`,
      {
        method: "GET",
        query: { year },
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
        message: error.data?.message ?? "Unable to get savings records",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to get savings records",
    });
  }
});
