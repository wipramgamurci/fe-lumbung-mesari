export const useAuth = () => {
  const login = async (identifier: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: {
          identifier,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isLoggedIn = computed(() => {
    const token = useCookie("accessToken").value;
    return token !== null && token !== undefined && token !== "";
  });

  const register = async (payload: {
    email: string;
    password: string;
    passwordConfirmation: string;
    fullname: string;
    username: string;
    phoneNumber: string;
    address: string;
  }) => {
    try {
      const response = await $fetch("/api/auth/register", {
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

  const verifyOtp = async (otpCode: string) => {
    try {
      const response = await $fetch("/api/auth/verify-otp", {
        method: "POST",
        body: { otpCode },
        headers: {
          Authorization: `Bearer ${useCookie("accessToken").value}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async () => {
    try {
      const response = await $fetch("/api/auth/resend-otp", {
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
    useCookie("accessToken").value = null;
    useCookie("refreshToken").value = null;
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
