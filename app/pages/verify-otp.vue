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
              v-model="formState.otpCode"
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
              Resend code in {{ timeLeft }}s
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
            :disabled="formState.otpCode.length !== 6"
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
definePageMeta({
  layout: "auth",
});

const { verifyOtp, resendOtp } = useAuth();
const userStore = useUserStore();

// Form state
const formState = ref({
  otpCode: "",
});

// Loading states
const isVerifying = ref(false);
const isResending = ref(false);

// Timer for resend functionality
const timeLeft = ref(60); // 60 seconds
const timer = ref(null);

// Start timer on mount and get token
onMounted(() => {
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

// Simple counter 60 -> 0; no formatter needed

// Handle OTP input (only allow numbers)
const handleOtpInput = (event) => {
  const value = event.target.value.replace(/\D/g, ""); // Remove non-digits
  formState.value.otpCode = value;
};

// Verify OTP
const handleVerifyOtp = async () => {
  if (formState.value.otpCode.length !== 6) {
    alert("Please enter a valid 6-digit code");
    return;
  }

  isVerifying.value = true;

  try {
    const response = await verifyOtp(formState.value.otpCode);

    console.log("OTP verification successful:", response);

    // Fetch user data after successful verification (cookies are now set)
    await userStore.fetchUser();

    // Show success message
    alert(response.message);

    // Redirect based on user status after verification
    const userStatus = userStore.user?.status;
    if (userStatus === "waiting_deposit") {
      navigateTo("/waiting-deposit");
    } else if (userStatus === "active") {
      navigateTo("/dashboard");
    } else {
      // For other statuses, let the status middleware handle it
      navigateTo("/dashboard");
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    alert("OTP verification failed: " + error.data.message);
  } finally {
    isVerifying.value = false;
  }
};

// Resend OTP
const handleResendOtp = async () => {
  isResending.value = true;

  try {
    const response = await resendOtp();

    console.log("OTP resent successfully:", response);
    alert(response.message);

    // Restart timer
    startTimer();
  } catch (error) {
    console.error("Resend OTP error:", error);
    alert("OTP request failed: " + error.data.message);
  } finally {
    isResending.value = false;
  }
};
</script>
