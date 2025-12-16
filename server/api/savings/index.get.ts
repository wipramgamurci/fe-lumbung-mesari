import type { SavingsResponse } from "../../../types/savings";

export default defineEventHandler(async (event): Promise<SavingsResponse> => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // Extract query parameters
  const pageStr = Array.isArray(query.page) ? query.page[0] : query.page;
  const limitStr = Array.isArray(query.limit) ? query.limit[0] : query.limit;
  const sortBy = Array.isArray(query.sortBy) ? query.sortBy[0] : query.sortBy;
  const sortOrder = Array.isArray(query.sortOrder)
    ? query.sortOrder[0]
    : query.sortOrder;
  const period = Array.isArray(query.period) ? query.period[0] : query.period;
  const yearStr = Array.isArray(query.year) ? query.year[0] : query.year;

  // Parse and set defaults
  const page = pageStr ? parseInt(pageStr, 10) || 1 : 1;
  const limit = limitStr ? parseInt(limitStr, 10) || 10 : 10;
  const sortByParam = sortBy || "period_date";
  const sortOrderParam = sortOrder || "asc";

  // Get access token
  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Missing or invalid token" },
    });
  }

  try {
    // Build query string
    const queryParams: string[] = [`page=${page}`, `limit=${limit}`];

    if (sortByParam) {
      queryParams.push(`sortBy=${sortByParam}`);
    }
    if (sortOrderParam) {
      queryParams.push(`sortOrder=${sortOrderParam}`);
    }
    if (period) {
      queryParams.push(`period=${period}`);
    }
    if (yearStr) {
      const year = parseInt(yearStr, 10);
      if (!isNaN(year)) {
        queryParams.push(`year=${year}`);
      }
    }

    const queryString = `?${queryParams.join("&")}`;

    const response = await $fetch<SavingsResponse>(
      `${config.public.apiBaseUrl}/api/savings${queryString}`,
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
        message: error.data?.message || error.message,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to get savings records",
    });
  }
});
