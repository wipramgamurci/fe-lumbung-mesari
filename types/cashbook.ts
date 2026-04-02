export interface CashbookBalancesResponse {
  total: number;
  capital: number;
  shu: number;
}

export interface CashbookTransactionCategory {
  id: string;
  code: string;
  name: string;
}

export interface CashbookTransaction {
  id: string;
  txnDate: string;
  type: string;
  capitalAmount: number;
  shuAmount: number;
  totalBalanceAfter: number;
  category: CashbookTransactionCategory;
  createdAt: string;
}

export interface CashbookTransactionsResponse {
  data: CashbookTransaction[];
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  next: boolean;
  prev: boolean;
}
