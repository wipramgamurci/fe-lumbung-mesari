import type { LoansResponse } from "../../../types/loan";

export default defineEventHandler(async (event): Promise<LoansResponse> => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // Extract query parameters
  const pageStr = Array.isArray(query.page) ? query.page[0] : query.page;
  const limitStr = Array.isArray(query.limit) ? query.limit[0] : query.limit;
  const status = Array.isArray(query.status) ? query.status[0] : query.status;
  const sortBy = Array.isArray(query.sortBy) ? query.sortBy[0] : query.sortBy;
  const sortOrder = Array.isArray(query.sortOrder)
    ? query.sortOrder[0]
    : query.sortOrder;

  // Parse and set defaults
  const page = pageStr ? parseInt(pageStr, 10) || 1 : 1;
  const limit = limitStr ? parseInt(limitStr, 10) || 10 : 10;
  const sortByParam = sortBy || "createdAt";
  const sortOrderParam = sortOrder || "desc";

  // Validate status if provided
  const validStatuses = [
    "pending",
    "approved",
    "rejected",
    "active",
    "completed",
  ];
  if (status && !validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  // Validate sortBy if provided
  const validSortBy = [
    "createdAt",
    "updatedAt",
    "id",
    "status",
    "principalAmount",
  ];
  if (sortBy && !validSortBy.includes(sortBy)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Invalid sortBy. Must be one of: ${validSortBy.join(", ")}`,
    });
  }

  // Validate sortOrder if provided
  const validSortOrder = ["asc", "desc"];
  if (sortOrder && !validSortOrder.includes(sortOrder)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `Invalid sortOrder. Must be one of: ${validSortOrder.join(
        ", "
      )}`,
    });
  }

  // Get access token
  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing or invalid token",
    });
  }

  try {
    // Build query string
    const queryParams: string[] = [`page=${page}`, `limit=${limit}`];

    if (status) {
      queryParams.push(`status=${status}`);
    }
    if (sortByParam) {
      queryParams.push(`sortBy=${sortByParam}`);
    }
    if (sortOrderParam) {
      queryParams.push(`sortOrder=${sortOrderParam}`);
    }

    const queryString = `?${queryParams.join("&")}`;

    const response = await $fetch<LoansResponse>(
      `${config.public.apiBaseUrl}/api/loans${queryString}`,
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
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Unable to get loans",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to get loans",
    });
  }
});
