import type {
  CreatedAdministrator,
  CreateAdministratorRequest,
} from "../../../types/managed-administrator";

export default defineEventHandler(async (event): Promise<CreatedAdministrator> => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const fields = [
    "email",
    "fullname",
    "username",
    "phoneNumber",
    "address",
    "password",
  ] as const;

  if (
    !body ||
    typeof body !== "object" ||
    fields.some((field) => typeof body[field] !== "string" || !body[field].trim())
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      message: "All administrator fields are required",
    });
  }

  const input = body as CreateAdministratorRequest;
  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing or invalid token",
    });
  }

  try {
    const response = await $fetch.raw<CreatedAdministrator>(
      `${config.public.apiBaseUrl}/api/users`,
      {
        method: "POST",
        body: {
          email: input.email.trim(),
          fullname: input.fullname.trim(),
          username: input.username.trim(),
          phoneNumber: input.phoneNumber.trim(),
          address: input.address.trim(),
          password: input.password,
          role: "administrator",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setResponseStatus(event, response.status);
    return response._data;
  } catch (error: any) {
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode);
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Unable to create administrator",
        data: error.data,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to create administrator",
    });
  }
});
