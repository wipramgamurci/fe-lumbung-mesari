import type { CashbookTransactionsResponse } from "../../../types/cashbook";

export default defineEventHandler(
  async (event): Promise<CashbookTransactionsResponse> => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const pageStr = Array.isArray(query.page) ? query.page[0] : query.page;
    const limitStr = Array.isArray(query.limit) ? query.limit[0] : query.limit;

    const page = pageStr ? parseInt(pageStr as string, 10) || 1 : 1;
    const limit = limitStr ? parseInt(limitStr as string, 10) || 10 : 10;

    const accessToken = getCookie(event, "accessToken");
    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Missing or invalid token",
      });
    }

    const queryString = `?page=${page}&limit=${limit}`;

    try {
      const response = await $fetch<CashbookTransactionsResponse>(
        `${config.public.apiBaseUrl}/api/cashbook/transactions${queryString}`,
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
          message: error.data?.message ?? "Unable to get cashbook transactions",
          data: error.data,
        });
      }

      setResponseStatus(event, 500);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
        message: "Unable to get cashbook transactions",
      });
    }
  }
);
