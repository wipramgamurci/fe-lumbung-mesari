export type LoanStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

export interface LoanPeriod {
  id: string;
  tenor: number;
  interestRate: number;
}

export interface LoanCalculateRequest {
  amount: number;
  loanPeriodId: string;
}

export interface LoanCalculateResponse {
  principalAmount: number;
  adminFee: number;
  disbursedAmount: number;
  tenor: number;
  interestRate: number;
  monthlyInterest: number;
  monthlyPayment: number;
  lastMonthPayment?: number;
}

export interface LoanCreateRequest {
  loanPeriodId: string;
  amount: number;
  notes?: string;
}

export interface LoanUser {
  id: string;
  fullname: string;
}

export interface LoanListItem {
  id: string;
  principalAmount: number;
  adminFeeAmount: number;
  disbursedAmount: number;
  interestAmount: number;
  monthlyPayment: number;
  lastMonthPayment?: number;
  totalPayableAmount: number;
  installmentLateAmount: number | null;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  tenor: number;
  interestRate: number;
  user: LoanUser;
}

export interface LoansResponse {
  data: LoanListItem[];
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  next: boolean;
  prev: boolean;
}

export interface LoanStatusUpdateResponse {
  message: string;
  status: LoanStatus;
  loanId: string;
}
export type MemberLoan = Omit<LoanListItem, "user">;
