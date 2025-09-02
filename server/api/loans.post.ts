export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Get POST data (amount, tenor)

  // Simple validation
  if (!body.amount || !body.tenor) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing amount or tenor",
      data: { message: "Invalid loan application" },
    });
  }

  // Simulate success (fake delay for realism)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate mock Loan (based on docs/types-and-models.md)
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  // Compute installments
  const installments = [];
  const principalPerMonth = body.amount / body.tenor;
  const interestPerMonth = body.amount * 0.01; // 1% of original amount per month
  const monthlyPayment = principalPerMonth + interestPerMonth;

  let dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + 1); // First due next month

  for (let i = 0; i < body.tenor; i++) {
    installments.push({
      amount: monthlyPayment,
      dueDate: dueDate.toISOString(),
      status: "unpaid",
    });
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  const mockLoan = {
    id,
    amount: body.amount,
    tenor: body.tenor,
    status: "pending",
    createdAt: now,
    installments,
  };

  // Mock response (201 Created with Loan object)
  setResponseStatus(event, 201);
  return mockLoan;
});
