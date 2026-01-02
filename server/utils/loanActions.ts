import type { LoanStatusUpdateResponse } from "../../types/loan";
import type { EventHandler } from "h3";

type LoanAction = "approve" | "reject" | "disburse";

const actionMessages: Record<LoanAction, { failed: string; unable: string }> = {
  approve: {
    failed: "Failed to approve loan",
    unable: "Unable to approve loan",
  },
  reject: {
    failed: "Failed to reject loan",
    unable: "Unable to reject loan",
  },
  disburse: {
    failed: "Failed to disburse loan",
    unable: "Unable to disburse loan",
  },
};

export const handleLoanAction = async (
  event: Parameters<EventHandler>[0],
  action: LoanAction
): Promise<LoanStatusUpdateResponse> => {
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

  // Read request body if present (for reject action with reason)
  let body: any = undefined;
  try {
    const requestBody = await readBody(event);
    if (requestBody && Object.keys(requestBody).length > 0) {
      body = requestBody;
    }
  } catch {
    // No body present, which is fine for approve and disburse
  }

  try {
    const fetchOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await $fetch<LoanStatusUpdateResponse>(
      `${config.public.apiBaseUrl}/api/loans/${loanId}/${action}`,
      fetchOptions
    );

    setResponseStatus(event, 200);
    return response;
  } catch (error: any) {
    const messages = actionMessages[action];

    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? messages.failed,
        data: error.data,
      });
    }

    setResponseStatus(event, 500);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: messages.unable,
    });
  }
};
