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

export interface LoginResponse {
  data: LoginResponseData;
  token: TokenData;
}

export interface RegisterResponse {
  token: TokenData;
  data: RegisterResponseData;
  message: string;
  otpSent: boolean;
}

export interface ResendOtpResponse {
  message: string;
  otpSent: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  token: TokenData;
  data: VerifyOtpResponseData;
}

export interface LoginResponseData {
  emailSent: boolean;
  message: string;
  status: string;
}

export interface RegisterResponseData {
  id: string;
  email: string;
  fullname: string;
  username: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit";
}

export interface VerifyOtpResponseData {
  email: string;
  fullname: string;
  id: string;
  status: "pending" | "active" | "rejected" | "waiting_deposit";
  username: string;
}
