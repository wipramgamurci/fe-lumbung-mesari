// Authentication related types

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  fullname: string;
  username: string;
  phoneNumber: string;
  address: string;
}

export interface VerifyOtpRequest {
  otpCode: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  token: TokenData;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "member" | "admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO 8601 string
}
