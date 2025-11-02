import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
  User,
} from "../../types/auth";
import type { ApiResponse } from "../../types/api";

export const useAuth = () => {
  // Store user data in SSR-compatible state
  // useState automatically persists across navigations and is SSR-safe
  const currentUser = useState<User | null>("auth:user", () => null);

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

  const resendOtp = async (): Promise<ApiResponse> => {
    try {
      const response = await $fetch<ApiResponse>("/api/auth/resend-otp", {
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

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      // Fetch user data from server route (which reads from cookies)
      const user = await $fetch<User>("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store user data in state
      currentUser.value = user;
      return user;
    } catch (error: any) {
      // Clear user state on error (e.g., token expired)
      currentUser.value = null;
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    // Clear user state
    currentUser.value = null;

    // Clear cookies by calling a logout endpoint if you have one
    // Or just navigate to login - cookies will be cleared server-side on logout
    await navigateTo("/login");
  };

  return {
    login,
    register,
    verifyOtp,
    resendOtp,
    getCurrentUser,
    currentUser: readonly(currentUser),
    logout,
  };
};
