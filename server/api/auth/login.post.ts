export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Get POST data (email, password)

  // Simple validation (mimic real API)
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing email or password",
      data: { message: "Invalid credentials" },
    });
  }

  // Mock user database
  type MockUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    password: string;
  };

  const mockUsers: Record<string, MockUser> = {
    "test@example.com": {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "member",
      status: "approved",
      createdAt: new Date().toISOString(),
      password: "password",
    },
    "admin@example.com": {
      id: "admin-1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "approved",
      createdAt: new Date().toISOString(),
      password: "password",
    },
  };

  const user = mockUsers[body.email as string];
  if (!user || user.password !== body.password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
      data: { message: "Invalid email or password" },
    });
  }

  // Simulate success
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    token: "fake-jwt-token-" + user.id,
    user: { ...user, password: undefined }, // Exclude password
  };
});
