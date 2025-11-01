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

export interface LoginResponse {
  data: loginResponseData;
  token: TokenData;
}

export interface registerResponse {
  token: TokenData;
  data: registerResponseData;
  message: string;
  otpSent: boolean;
}

export interface verifyOtpResponse {
  message: string;
  token: TokenData;
  data: verifyOtpResponseData;
}

export interface loginResponseData {
  emailSent: boolean;
  message: string;
  status: string;
}

export interface registerResponseData {
  id: string;
  email: string;
  fullname: string;
  username: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit";
}

export interface verifyOtpResponseData {
  email: string;
  fullname: string;
  id: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit";
  username: string;
}

export interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
  address: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit";
  phoneNumber: string;
  roleId: "member" | "administrator";
  depositImageUrl?: string;
  otpVerified: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}
