import type { User, UpdateUserRequest } from "~~/types/user";

const UPDATABLE_FIELDS = [
  "username",
  "fullname",
  "address",
  "phoneNumber",
] as const satisfies ReadonlyArray<keyof UpdateUserRequest>;

export default defineEventHandler(async (event): Promise<User> => {
  const config = useRuntimeConfig();

  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing or invalid token",
    });
  }

  const body = await readBody(event);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid request body",
    });
  }

  const payload: UpdateUserRequest = {};

  for (const field of UPDATABLE_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;

    if (typeof value !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `${field} must be a string`,
      });
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: `${field} cannot be empty`,
      });
    }

    payload[field] = trimmed;
  }

  if (Object.keys(payload).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "No valid fields to update",
    });
  }

  try {
    return await $fetch<User>(`${config.public.apiBaseUrl}/api/users/me`, {
      method: "PATCH",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.data?.message ?? "Unable to update user data",
        data: error.data,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      message: "Unable to update user data",
    });
  }
});
