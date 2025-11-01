import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
} from "../../types/auth";
import type { ApiResponse } from "../../types/api";

export const useAuth = () => {
  const login = async (
    identifier: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await $fetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: {
          identifier,
          password,
        } as LoginRequest,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    payload: RegisterRequest
  ): Promise<RegisterResponse> => {
    try {
      const response = await $fetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (otpCode: string): Promise<VerifyOtpResponse> => {
    try {
      const response = await $fetch<VerifyOtpResponse>("/api/auth/verify-otp", {
        method: "POST",
        body: { otpCode } as VerifyOtpRequest,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (): Promise<ApiResponse> => {
    try {
      const response = await $fetch<ApiResponse>("/api/auth/resend-otp", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    login,
    register,
    verifyOtp,
    resendOtp,
  };
};
