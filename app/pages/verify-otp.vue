<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Verify Your Account
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        We've sent a verification code to your email
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Please check your email for the verification code
      </p>
    </div>

    <!-- OTP Verification Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleVerifyOtp">
        <div class="space-y-6">
          <!-- OTP Input -->
          <UFormField label="Verification Code" name="otp">
            <UInput
              v-model="formState.otp"
              placeholder="Enter 6-digit code"
              maxlength="6"
              required
              class="w-full text-center text-2xl tracking-widest"
              @input="handleOtpInput"
            />
          </UFormField>

          <!-- Timer and Resend -->
          <div class="text-center space-y-2">
            <p
              v-if="timeLeft > 0"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              Resend code in {{ formatTime(timeLeft) }}
            </p>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?
            </p>

            <UButton
              v-if="timeLeft === 0"
              type="button"
              variant="ghost"
              size="sm"
              :loading="isResending"
              @click="handleResendOtp"
            >
              Resend Code
            </UButton>
          </div>

          <!-- Verify Button -->
          <UButton
            type="submit"
            color="primary"
            block
            :loading="isVerifying"
            :disabled="formState.otp.length !== 6"
          >
            Verify Account
          </UButton>
        </div>
      </UForm>

      <!-- Back to Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Need to start over?
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Register again
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { UCard, UForm, UFormField, UInput, UButton } from "#components";

definePageMeta({
  layout: "auth",
});

// Get access token from localStorage
const accessToken = ref("");

// Form state
const formState = ref({
  otp: "",
});

// Loading states
const isVerifying = ref(false);
const isResending = ref(false);

// Timer for resend functionality
const timeLeft = ref(60); // 60 seconds
const timer = ref(null);

// Start timer on mount and get token
onMounted(() => {
  accessToken.value = localStorage.getItem("accessToken") || "";
  if (!accessToken.value) {
    alert("No access token found. Please register or login again.");
    navigateTo("/login");
    return;
  }
  startTimer();
});

// Clean up timer on unmount
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

// Timer functions
const startTimer = () => {
  timeLeft.value = 60;
  timer.value = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Handle OTP input (only allow numbers)
const handleOtpInput = (event) => {
  const value = event.target.value.replace(/\D/g, ""); // Remove non-digits
  formState.value.otp = value;
};

// Verify OTP
const handleVerifyOtp = async () => {
  if (formState.value.otp.length !== 6) {
    alert("Please enter a valid 6-digit code");
    return;
  }

  isVerifying.value = true;

  try {
    const response = await $fetch("/api/auth/verify-otp", {
      method: "POST",
      body: {
        otp: formState.value.otp,
      },
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    console.log("OTP verification successful:", response);

    // Store new tokens if available
    if (response.token) {
      localStorage.setItem("accessToken", response.token.access_token);
      localStorage.setItem("refreshToken", response.token.refresh_token);
    }

    // Show success message
    alert(response.message || "Account verified successfully!");

    // Check user status and navigate accordingly
    if (response.user?.status === "waiting_deposit") {
      // User needs to submit deposit proof
      navigateTo("/deposit-proof");
    } else {
      // User is fully verified
      navigateTo("/dashboard");
    }
  } catch (error) {
    console.error("OTP verification error:", error);

    let errorMessage = "Verification failed. Please try again.";
    let shouldRestartTimer = false;

    // Handle specific error cases
    if (error.data?.error) {
      switch (error.data.error) {
        case "OTP_EXPIRED":
          errorMessage = "OTP has expired. Please request a new one.";
          shouldRestartTimer = true;
          break;
        case "INVALID_OTP":
          errorMessage = "Invalid OTP code. Please check and try again.";
          break;
        default:
          errorMessage = error.data.message || errorMessage;
      }
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.statusMessage) {
      errorMessage = error.statusMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);

    // Restart timer if OTP expired
    if (shouldRestartTimer) {
      startTimer();
    }
  } finally {
    isVerifying.value = false;
  }
};

// Resend OTP
const handleResendOtp = async () => {
  if (!accessToken.value) {
    alert("No access token found. Please register again.");
    navigateTo("/register");
    return;
  }

  isResending.value = true;

  try {
    const response = await $fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    console.log("OTP resent successfully:", response);
    alert(response.message || "Verification code sent!");

    // Restart timer
    startTimer();
  } catch (error) {
    console.error("Resend OTP error:", error);

    let errorMessage = "Failed to resend code. Please try again.";

    // Handle specific error cases
    if (error.data?.error) {
      switch (error.data.error) {
        case "OTP_EXPIRED":
          errorMessage = "OTP has expired. Please request a new one.";
          break;
        case "INVALID_OTP":
          errorMessage = "Invalid OTP code. Please check and try again.";
          break;
        default:
          errorMessage = error.data.message || errorMessage;
      }
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.statusMessage) {
      errorMessage = error.statusMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  } finally {
    isResending.value = false;
  }
};
</script>
