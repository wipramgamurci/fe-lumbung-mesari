import type { LoanCreateRequest, LoanListItem } from "../../../types/loan";

export default defineEventHandler(async (event): Promise<LoanListItem> => {
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as LoanCreateRequest;

  // Basic validation
  if (!body.loanPeriodId || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      message: "loanPeriodId and amount are required",
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
    const response = await $fetch<LoanListItem>(
      `${config.public.apiBaseUrl}/api/loans`,
      {
        method: "POST",
        body: {
          loanPeriodId: body.loanPeriodId,
          amount: body.amount,
          notes: body.notes,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setResponseStatus(event, 201);
    return response;
  } catch (error: any) {
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message:
          error.data?.message ?? "Unable to create loan. Please try again.",
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to create loan. Please try again.",
    });
  }
});
