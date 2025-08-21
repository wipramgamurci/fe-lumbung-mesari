export default defineEventHandler(async (event) => {
  const body = await readBody(event)  // Get form data

  // Basic validation (remove idCardPhoto check)
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
      data: { message: 'Please complete all fields' }
    })
  }

  // Simulate success
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock response (201 Created)
  setResponseStatus(event, 201)
  return { message: 'Registration successful' }
})
