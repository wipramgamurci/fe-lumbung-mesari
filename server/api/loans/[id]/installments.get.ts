import type { Installment } from "~~/types/loan";

export default defineEventHandler(async (event): Promise<Installment[]> => {
    const config = useRuntimeConfig();
    const loanId = getRouterParam(event, "id");

    if (!loanId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Missing loan ID",
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
        const response = await $fetch<Installment[]>(
            `${config.public.apiBaseUrl}/api/loans/${loanId}/installments`,
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
                message: error.data?.message ?? "Unable to get installments",
                data: error.data,
            });
        }

        setResponseStatus(event, 500);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal server error",
            message: "Unable to get installments",
        });
    }
});
