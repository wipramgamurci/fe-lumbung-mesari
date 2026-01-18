<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("verifyOtp.verifyYourAccount") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("verifyOtp.weveSentAVerificationCodeToYourEmail") }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ $t("verifyOtp.pleaseCheckYourEmailForTheVerificationCode") }}
      </p>
    </div>

    <!-- OTP Verification Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleVerifyOtp">
        <div class="space-y-6">
          <!-- OTP Input -->
          <UFormField :label="$t('verifyOtp.verificationCode')" name="otp">
            <UInput
              v-model="formState.otpCode"
              :placeholder="$t('verifyOtp.enter6DigitCode')"
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
              {{ $t("verifyOtp.resendCodeIn", { timeLeft }) }}
            </p>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("verifyOtp.didntReceiveTheCode") }}
            </p>

            <UButton
              v-if="timeLeft === 0"
              type="button"
              variant="ghost"
              size="sm"
              :loading="isResending"
              @click="handleResendOtp"
            >
              {{ $t("verifyOtp.resendCode") }}
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
            {{ $t("verifyOtp.verifyAccount") }}
          </UButton>
        </div>
      </UForm>

      <!-- Back to Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("verifyOtp.needToStartOver") }}
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t("verifyOtp.registerAgain") }}
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { verifyOtp, resendOtp } = useAuth();
const userStore = useUserStore();
const toast = useToast();
// Form state
const formState = ref<{
  otpCode: string;
}>({
  otpCode: "",
});

// Loading states
const isVerifying = ref(false);
const isResending = ref(false);

// Timer for resend functionality
const timeLeft = ref(60); // 60 seconds
const timer = ref<ReturnType<typeof setInterval> | null>(null);

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
    if (timeLeft.value <= 0 && timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};

// Simple counter 60 -> 0; no formatter needed

// Handle OTP input (only allow numbers)
const handleOtpInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, ""); // Remove non-digits
  formState.value.otpCode = value;
};

// Verify OTP
const handleVerifyOtp = async () => {
  isVerifying.value = true;

  try {
    const response = await verifyOtp(formState.value.otpCode);

    console.log("OTP verification successful:", response);

    // Fetch user data after successful verification (cookies are now set)
    await userStore.fetchUser();

    // Show success message
    toast.add({
      title: "Success",
      description: response.message,
      color: "success",
    });

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
  } catch (error: any) {
    console.error("OTP verification error:", error);
    toast.add({
      title: "Error",
      description: $t("verifyOtp.otpVerificationFailed", {
        message: error.data?.message || "Unknown error",
      }),
      color: "error",
    });
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
    toast.add({
      title: "Success",
      description: response.message,
      color: "success",
    });

    // Restart timer
    startTimer();
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    toast.add({
      title: "Error",
      description: $t("verifyOtp.otpRequestFailed", {
        message: error.data?.message || "Unknown error",
      }),
      color: "error",
    });
  } finally {
    isResending.value = false;
  }
};
</script>
