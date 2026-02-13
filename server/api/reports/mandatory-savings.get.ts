export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const year = query.year;

    if (!year) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Year is required",
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
        const response = await $fetch<Blob>(
            `${config.public.apiBaseUrl}/api/reports/mandatory-savings`,
            {
                method: "GET",
                query: {
                    year: year,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "blob",
            }
        );

        setResponseStatus(event, 200);
        setResponseHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        setResponseHeader(event, "Content-Disposition", `attachment; filename="simpanan-wajib-${year}.xlsx"`);
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
