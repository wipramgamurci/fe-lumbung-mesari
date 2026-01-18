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
    createdBy: string
    loanId: string | null
    notes: string | null
    source: string
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
