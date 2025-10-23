import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  AuthResponse,
  TokenData,
} from "../../types/auth";
import type { ApiResponse } from "../../types/api";

export const useAuth = () => {
  const storeTokens = (tokenData: TokenData) => {
    if (tokenData) {
      useCookie("accessToken").value = tokenData.accessToken;
      useCookie("refreshToken").value = tokenData.refreshToken;
    }
  };

  const clearTokens = () => {
    useCookie("accessToken").value = null;
    useCookie("refreshToken").value = null;
  };

  const login = async (
    identifier: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: {
          identifier,
          password,
        } as LoginRequest,
        headers: {
          "Content-Type": "application/json",
        },
      });

      storeTokens(response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isLoggedIn = computed(() => {
    const token = useCookie("accessToken").value;
    return token !== null && token !== undefined && token !== "";
  });

  const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      storeTokens(response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (otpCode: string): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/verify-otp", {
        method: "POST",
        body: { otpCode } as VerifyOtpRequest,
        headers: {
          Authorization: `Bearer ${useCookie("accessToken").value}`,
        },
      });

      storeTokens(response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (): Promise<ApiResponse> => {
    try {
      const response = await $fetch<ApiResponse>("/api/auth/resend-otp", {
        headers: {
          Authorization: `Bearer ${useCookie("accessToken").value}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    navigateTo("/login");
  };

  return {
    login,
    isLoggedIn,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };
};
