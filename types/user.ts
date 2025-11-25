export interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
  address: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit" | "inactive";
  phoneNumber: string;
  roleId: "member" | "administrator" | "superadministrator";
  otpVerified: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface UsersResponse {
  data: User[];
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  next: boolean;
  prev: boolean;
}
