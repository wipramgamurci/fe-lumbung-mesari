# 🧾 Types and Models - Lumbung Mesari Frontend

This document defines the TypeScript interfaces used in the Lumbung Mesari frontend. These interfaces are derived from the assumed API responses listed in `api-endpoints.md`.

---

## 1. Auth & User

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO 8601 string
}
```

---

## 2. Savings

```ts
export type SavingType = 'deposit' | 'withdrawal';

export interface Saving {
  id: string;
  amount: number;
  type: SavingType;
  date: string; // ISO 8601 string
  status: 'pending' | 'approved' | 'rejected';
}
```

---

## 3. Loans

```ts
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'paid_off' | 'late';

export interface Loan {
  id: string;
  amount: number;
  tenor: 6 | 12 | 18; // in months
  status: LoanStatus;
  createdAt: string; // ISO 8601 string
  installments: {
    amount: number;
    dueDate: string; // ISO 8601 string
    status: 'paid' | 'unpaid';
  }[];
}
```

---

## 4. Generic API Responses

```ts
export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>; // For form validation errors
}
```

---

## Notes
- All date fields will use the `ISO 8601` string format.
- These interfaces should ideally be placed in a `/types` or `/interfaces` directory within the Nuxt project, separated by domain if necessary.