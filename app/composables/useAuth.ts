import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  AuthResponse,
  TokenData,
  User,
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

  const currentUser = useState<User | null>("currentUser", () => null);

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
      if (response.token) {
        storeTokens(response.token);
        // Use the token directly from response instead of reading from cookie
        await getCurrentUser(response.token.accessToken);
      }
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

      if (response.token) {
        storeTokens(response.token);
        // Use the token directly from response
        await getCurrentUser(response.token.accessToken);
      }
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
    currentUser.value = null;
    navigateTo("/login");
  };

  const getCurrentUser = async (token?: string): Promise<User> => {
    if (currentUser.value) {
      return currentUser.value;
    }
    try {
      // Use provided token or fall back to cookie
      const accessToken = token || useCookie("accessToken").value;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await $fetch<User>("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      currentUser.value = response;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Initialize auth: load user data if token exists
  const initAuth = async () => {
    const token = useCookie("accessToken").value;
    if (token && !currentUser.value) {
      try {
        await getCurrentUser(token);
      } catch (error) {
        // Token might be invalid, clear it
        console.error("Failed to load user on init:", error);
        clearTokens();
      }
    }
  };

  return {
    login,
    isLoggedIn,
    register,
    verifyOtp,
    resendOtp,
    logout,
    getCurrentUser,
    currentUser,
    initAuth,
  };
};
