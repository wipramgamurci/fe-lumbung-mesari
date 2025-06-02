# 🧾 Types and Models (Assumed) - Lumbung Mesari Frontend

This document defines the assumed TypeScript interfaces used in the Lumbung Mesari frontend. These interfaces are derived from the assumed API responses listed in `api-endpoints.md`.

All types are subject to confirmation once backend schemas are finalized.

---

## 1. Auth & User

```ts
export interface User {
  id: string
  name: string
  email: string
  role: 'member' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface AuthResponse {
  token: string
}
```

---

## 2. Member

```ts
export interface Member {
  id: string
  name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}
```

---

## 3. Savings

```ts
export type SavingType = 'deposit' | 'withdrawal'

export interface Saving {
  id: string
  amount: number
  type: SavingType
  date: string
}
```

---

## 4. Loans

```ts
export interface Loan {
  id: string
  amount: number
  tenor: 6 | 12 | 18
  status: 'pending' | 'approved' | 'rejected' | 'late'
  createdAt: string
  installments: number[] // Monthly payment schedule
}
```

---

## 5. Reports (Optional)

```ts
export interface ReportSummary {
  month: string // e.g., '2025-06'
  totalSavings: number
  totalLoans: number
  balance: number
}
```

---

## 6. Error Response (Generic)

```ts
export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
```

---

## Notes

- All date fields use `ISO 8601` strings
    
- These interfaces should be placed in `/types/` directory, split by domain if needed:
    
    - `/types/user.ts`
        
    - `/types/saving.ts`
        
    - `/types/loan.ts`
        
- Update as backend confirms actual schema