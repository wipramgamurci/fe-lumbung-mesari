import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "~~/types/auth";

export default defineEventHandler(
  async (event): Promise<ResetPasswordResponse> => {
    const config = useRuntimeConfig();
    const body = (await readBody(event)) as ResetPasswordRequest;

    if (!body?.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Email is required",
      });
    }

    try {
      const apiBaseUrl = config.public.apiBaseUrl;
      const response = await $fetch<ResetPasswordResponse>(
        `${apiBaseUrl}/api/auth/reset-password`,
        {
          method: "POST",
          body: { email: body.email },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setResponseStatus(event, 200);
      return response;
    } catch (error: any) {
      console.error("Reset password API error:", {
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? error.message,
        data: error.data,
      });

      if (error.statusCode) {
        setResponseStatus(event, error.statusCode);
        throw createError({
          statusCode: error.statusCode,
          statusMessage: error.statusMessage,
          message: error.data?.message ?? "Unable to request password reset.",
          data: error.data,
        });
      }

      setResponseStatus(event, 500);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
        message: "Unable to request password reset. Please try again.",
      });
    }
  },
);
