import type { UsersResponse } from "../../types/user";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const role = query.role;
  const status = query.status;
  const pageStr = Array.isArray(query.page) ? query.page[0] : query.page;

  const page = pageStr ? parseInt(pageStr, 10) || 1 : 1;

  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Missing or invalid token" },
    });
  }

  try {
    // Build query string with optional role and status
    const queryParams: string[] = [`page=${page}`];
    if (role) {
      queryParams.push(`role=${role}`);
    }
    if (status) {
      queryParams.push(`status=${status}`);
    }

    const queryString = `?${queryParams.join("&")}`;

    const response = await $fetch<UsersResponse>(
      `${config.public.apiBaseUrl}/api/users${queryString}`,
      {
        method: "GET",
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
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        data: { message: error.data.message },
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: { message: "Unable to get users" },
    });
  }
});
