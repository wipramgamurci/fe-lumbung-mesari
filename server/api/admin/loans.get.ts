export default defineEventHandler(() => {
  function generateInstallments(amount, tenor) {
    const installments = [];
    const principalPerMonth = amount / tenor;
    const interestPerMonth = amount * 0.01;
    const monthlyPayment = principalPerMonth + interestPerMonth;
    let dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    for (let i = 0; i < tenor; i++) {
      installments.push({
        amount: monthlyPayment,
        dueDate: dueDate.toISOString(),
        status: "unpaid",
      });
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    return installments;
  }

  const mockLoans = [
    {
      id: "loan1",
      amount: 5000000,
      tenor: 12,
      status: "pending",
      createdAt: "2023-10-01T00:00:00Z",
      installments: generateInstallments(5000000, 12),
    },
    {
      id: "loan2",
      amount: 3000000,
      tenor: 6,
      status: "approved",
      createdAt: "2023-09-01T00:00:00Z",
      installments: generateInstallments(3000000, 6),
    },
    {
      id: "loan3",
      amount: 10000000,
      tenor: 18,
      status: "rejected",
      createdAt: "2023-08-01T00:00:00Z",
      installments: generateInstallments(10000000, 18),
    },
  ];

  return mockLoans;
});
