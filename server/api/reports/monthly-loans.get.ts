export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const monthStr = Array.isArray(query.month) ? query.month[0] : query.month;
    const yearStr = Array.isArray(query.year) ? query.year[0] : query.year;

    const month = monthStr ? parseInt(monthStr as string, 10) : undefined;
    const year = yearStr ? parseInt(yearStr as string, 10) : undefined;

    if (monthStr && (month === undefined || isNaN(month))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Month must be a number",
        });
    }

    if (month !== undefined && (month < 1 || month > 12)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Month must be between 1 and 12",
        });
    }

    if (yearStr && (year === undefined || isNaN(year))) {
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
        const requestQuery: { month?: number; year?: number } = {};
        if (month !== undefined) requestQuery.month = month;
        if (year !== undefined) requestQuery.year = year;

        const response = await $fetch<Blob>(
            `${config.public.apiBaseUrl}/api/reports/monthly-loans`,
            {
                method: "GET",
                query: requestQuery,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "blob",
            }
        );

        setResponseStatus(event, 200);
        setResponseHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        const fileNameSuffix =
            year !== undefined && month !== undefined
                ? `-${year}-${String(month).padStart(2, "0")}`
                : "";
        setResponseHeader(event, "Content-Disposition", `attachment; filename="pinjaman-bulanan${fileNameSuffix}.xlsx"`);
        return response;
    } catch (error: any) {
        if (error.statusCode) {
            setResponseStatus(event, error.statusCode);
            throw createError({
                statusCode: error.statusCode,
                statusMessage: error.statusMessage,
                message: error.data?.message ?? "Unable to download report",
                data: error.data,
            });
        }

        setResponseStatus(event, 500);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal server error",
            message: "Unable to download report",
        });
    }
});
