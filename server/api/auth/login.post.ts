export default defineEventHandler(async (event) => {
  const body = await readBody(event)  // Get POST data (email, password)

  // Simple validation (mimic real API)
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or password',
      data: { message: 'Invalid credentials' }
    })
  }

  // Simulate success (fake delay for realism)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock response (based on docs/api-endpoints.md)
  return {
    token: 'fake-jwt-token-123',
    user: {
      id: 'user-1',
      name: 'Test User',
      email: body.email,
      role: 'member',
      status: 'approved',
      createdAt: new Date().toISOString()
    }
  }
})
