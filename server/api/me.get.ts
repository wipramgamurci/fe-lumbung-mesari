export default defineEventHandler((event) => {
  const authHeader = event.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Missing or invalid token" },
    });
  }

  const token = authHeader.split(" ")[1];

  // Mock token validation (in real app, use JWT verify)
  type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };

  const mockTokens: Record<string, User> = {
    "fake-jwt-token-user-1": {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "member",
      status: "approved",
      createdAt: new Date().toISOString(),
    },
    "fake-jwt-token-admin-1": {
      id: "admin-1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "approved",
      createdAt: new Date().toISOString(),
    },
  };

  const user = mockTokens[token as string];
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Invalid token" },
    });
  }

  return { user };
});
