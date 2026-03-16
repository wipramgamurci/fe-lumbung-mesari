<template>
  <div>
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("app.title") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("forgotPassword.title") }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ $t("forgotPassword.description") }}
      </p>
    </div>

    <!-- Form -->
    <UCard class="mt-8">
      <UForm v-if="!success" :state="formState" @submit="handleSubmit">
        <div class="space-y-6">
          <UFormField :label="$t('register.label.email')" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="$t('forgotPassword.emailPlaceholder')"
              required
              class="w-full"
              autocomplete="email"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            {{ $t("forgotPassword.submitButton") }}
          </UButton>
        </div>
      </UForm>

      <!-- Success state -->
      <div v-else class="space-y-4">
        <UAlert
          color="success"
          variant="soft"
          :title="$t('forgotPassword.successMessage')"
        />
        <NuxtLink to="/login">
          <UButton color="primary" block variant="soft">
            {{ $t("forgotPassword.backToLogin") }}
          </UButton>
        </NuxtLink>
      </div>

      <!-- Back to login (when form is shown) -->
      <div v-if="!success" class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t("forgotPassword.backToLogin") }}
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "~~/types/auth";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();

const formState = ref<ResetPasswordRequest>({
  email: "",
});

const isLoading = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  success.value = false;

  try {
    await $fetch<ResetPasswordResponse>("/api/auth/reset-password", {
      method: "POST",
      body: { email: formState.value.email },
    });
    success.value = true;
  } catch (error: any) {
    const message = error?.data?.message || error?.message || "Unknown error";
    alert(t("forgotPassword.error", { message }));
  } finally {
    isLoading.value = false;
  }
};
</script>
