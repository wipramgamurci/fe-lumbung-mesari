import type {
  ResetPasswordConfirmRequest,
  ResetPasswordConfirmResponse,
} from "~~/types/auth";

export default defineEventHandler(
  async (event): Promise<ResetPasswordConfirmResponse> => {
    const config = useRuntimeConfig();
    const body = (await readBody(event)) as ResetPasswordConfirmRequest;

    if (!body?.token || !body?.newPassword || !body?.confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Token, newPassword, and confirmPassword are required",
      });
    }

    try {
      const apiBaseUrl = config.public.apiBaseUrl;
      const response = await $fetch<ResetPasswordConfirmResponse>(
        `${apiBaseUrl}/api/auth/reset-password/confirm`,
        {
          method: "POST",
          body: {
            token: body.token,
            newPassword: body.newPassword,
            confirmPassword: body.confirmPassword,
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setResponseStatus(event, 200);
      return response;
    } catch (error: any) {
      console.error("Reset password confirm API error:", {
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message:
          error.data?.message ?? "Unable to confirm password reset request.",
        data: error.data,
      });

      if (error.statusCode) {
        setResponseStatus(event, error.statusCode);
        throw createError({
          statusCode: error.statusCode,
          statusMessage: error.statusMessage,
          message:
            error.data?.message ?? "Unable to confirm password reset request.",
          data: error.data,
        });
      }

      setResponseStatus(event, 500);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
        message: "Unable to reset password. Please try again.",
      });
    }
  },
);
