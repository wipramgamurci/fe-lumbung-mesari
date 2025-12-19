import type {
  LoanCalculateRequest,
  LoanCalculateResponse,
} from "../../../types/loan";
import type { ApiError } from "../../../types/api";

export default defineEventHandler(
  async (event): Promise<LoanCalculateResponse> => {
    const config = useRuntimeConfig();
    const body = (await readBody(event)) as LoanCalculateRequest;

    // Basic validation
    if (!body.amount || !body.loanPeriodId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: {
          message: "Amount and loanPeriodId are required",
        } as ApiError,
      });
    }

    // Get access token
    const accessToken = getCookie(event, "accessToken");
    if (!accessToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        data: { message: "Invalid credentials" },
      });
    }

    try {
      const response = await $fetch<LoanCalculateResponse>(
        `${config.public.apiBaseUrl}/api/loans/calculate`,
        {
          method: "POST",
          body: {
            amount: body.amount,
            loanPeriodId: body.loanPeriodId,
          },
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
          message:
            error.data?.message ??
            "Unable to calculate loan. Please try again.",
          data: error.data,
        });
      }

      setResponseStatus(event, 500);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
        data: {
          message: "Unable to calculate loan. Please try again.",
          error: "INTERNAL_ERROR",
        } as ApiError,
      });
    }
  }
);
