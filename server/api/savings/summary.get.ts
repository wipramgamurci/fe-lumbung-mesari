import type { SavingsSummaryResponse } from "../../../types/savings";

export default defineEventHandler(
  async (event): Promise<SavingsSummaryResponse> => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const period = Array.isArray(query.period)
      ? query.period[0]
      : query.period;
    const yearStr = Array.isArray(query.year) ? query.year[0] : query.year;

    const accessToken = getCookie(event, "accessToken");
    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Missing or invalid token",
      });
    }

    try {
      const queryParams: string[] = [];

      if (period) {
        queryParams.push(`period=${period}`);
      }
      if (yearStr) {
        const year = parseInt(yearStr, 10);
        if (!isNaN(year)) {
          queryParams.push(`year=${year}`);
        }
      }

      const queryString = queryParams.length
        ? `?${queryParams.join("&")}`
        : "";

      const response = await $fetch<SavingsSummaryResponse>(
        `${config.public.apiBaseUrl}/api/savings/summary${queryString}`,
        {
          method: "GET",
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
          message: error.data?.message ?? "Unable to get savings summary",
          data: error.data,
        });
      }

      setResponseStatus(event, 500);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
        message: "Unable to get savings summary",
      });
    }
  },
);
