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

export interface Loan {
  id: string;
  userId: string;
  loanPeriodId: string;
  principalAmount: number;
  adminFeeAmount: number;
  disbursedAmount: number;
  interestAmount: number;
  monthlyPayment: number;
  lastMonthPayment: number;
  totalPayableAmount: number;
  installmentLateAmount: number | null;
  startDate: string;
  endDate: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoanListItem {
  id: string;
  user_id: string;
  loan_period_id: string;
  principal_amount: string;
  admin_fee_amount: string;
  disbursed_amount: string;
  interest_amount: string;
  monthly_payment: string;
  last_month_payment: string;
  total_payable_amount: string;
  installment_late_amount: string | null;
  disbursed_at: string | null;
  start_date: string;
  end_date: string;
  status: string;
  approved_by: string | null;
  notes: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  user_fullname: string;
  user_email: string;
  tenor: number;
  interest_rate: string;
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
