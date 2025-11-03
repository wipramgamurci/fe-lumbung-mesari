import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
} from "../../types/auth";
import type { ApiResponse } from "../../types/api";
import { useUserStore } from "../stores/useUser";

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

      if (response.data.status === "pending") {
        await navigateTo("/verify-otp");
        return response;
      } else {
        await navigateTo("/dashboard");
        return response;
      }
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

  const resendOtp = async (): Promise<ResendOtpResponse> => {
    try {
      const response = await $fetch<ResendOtpResponse>("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    // Clear user store
    const userStore = useUserStore();
    userStore.user = null;

    // Clear cookies by calling a logout endpoint if you have one
    // Or just navigate to login - cookies will be cleared server-side on logout
    await navigateTo("/login");
  };

  return {
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };
};
