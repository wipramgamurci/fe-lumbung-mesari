import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
} from "../../types/auth";
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
      switch (response.data.status) {
        case "pending":
          await navigateTo("/verify-otp");
          return response;
        case "waiting_deposit":
          await navigateTo("/waiting-deposit");
          return response;
        case "rejected":
          await navigateTo("/rejected");
          return response;
        default:
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
    try {
      // Clear httpOnly cookies by calling logout endpoint
      await $fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      // Log error but continue with logout process
      // Cookies might still be cleared even if request fails
      console.error("Logout API error:", error);
    } finally {
      // Clear user store using action (Pinia best practice)
      const userStore = useUserStore();
      userStore.clearUser();

      // Navigate to login page
      await navigateTo("/login");
    }
  };

  return {
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };
};
