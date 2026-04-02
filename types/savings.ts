import type { User } from "./user";

export type SavingsStatus = "due" | "paid" | "overdue";

/** Current member's mandatory savings row from `/api/users/me/savings` */
export interface UserMeSavingsRecord {
  id: string;
  userId: string;
  periodDate: string;
  amount: string;
  status: SavingsStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  processedBy: string | null;
}

export interface UserMeSavingsResponse {
  data: UserMeSavingsRecord[];
  year: number;
}

export interface SavingsUser {
  id: string;
  fullname: string;
  email: string;
  username: string;
}

export interface SavingsProcessedByUser {
  id: string;
  fullname: string;
}

export interface SavingsRecord {
  id: string;
  periodDate: string; // ISO 8601 date string (YYYY-MM-DD)
  amount: string; // Decimal string, e.g., "500000.0000"
  status: SavingsStatus;
  paidAt: string | null; // ISO 8601 date string or null
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
  user: SavingsUser;
  processedByUser: SavingsProcessedByUser | null;
}

export interface SavingsResponse {
  data: SavingsRecord[];
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  next: boolean;
  prev: boolean;
}

export interface SavingsSettleResponse {
  message: string;
  savingsId: string;
}
