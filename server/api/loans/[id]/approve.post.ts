import type { LoanStatusUpdateResponse } from "../../../../types/loan";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const params = event.context.params;
  const loanId = params?.id;

  if (!loanId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Loan ID is required",
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

  try {
    const response = await $fetch<LoanStatusUpdateResponse>(
      `${config.public.apiBaseUrl}/api/loans/${loanId}/approve`,
      {
        method: "POST",
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
        message: error.data?.message ?? "Failed to approve loan",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to approve loan",
    });
  }
});
