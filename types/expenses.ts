export interface ExpenseCategory {
    id: string
    code: string
    name: string
    description: string
    defaultSource: string
}

export interface Expense {
    id: string
    expenseCategoryId: string
    name: string
    shuAmount: number
    capitalAmount: number
    totalAmount: number
    createdBy: {
        id: string
        fullname: string
    }
    loanId: string | null
    notes: string | null
    source: 'auto' | 'shu' | 'capital'
    txnDate: string
    createdAt: string
    updatedAt: string
    category: {
        id: string
        code: string
        name: string
    }
}

export interface ExpensesResponse {
    data: Expense[]
    page: number
    limit: number
    totalData: number
    totalPage: number
    next: boolean
    prev: boolean
}

export interface CreateExpenseRequest {
    expenseCategoryId: string
    name: string
    amount: number
    notes?: string
    source: 'auto' | 'shu' | 'capital'
    transactionDate: string
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> { }
