<template>
  <div>
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("app.title") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("profile.resetPasswordTitle") }}
      </p>
    </div>

    <UCard class="mt-8">
      <!-- Invalid / missing token -->
      <div v-if="!token" class="space-y-4">
        <UAlert
          color="error"
          variant="soft"
          :title="$t('profile.resetPasswordInvalidToken')"
        />
        <NuxtLink to="/login">
          <UButton color="primary" block variant="soft">
            {{ $t("forgotPassword.backToLogin") }}
          </UButton>
        </NuxtLink>
      </div>

      <!-- Form -->
      <UForm
        v-else-if="!success"
        :state="formState"
        @submit="handleSubmit"
        class="space-y-6"
      >
        <UFormField :label="$t('register.label.password')" name="newPassword">
          <UInput
            v-model="formState.newPassword"
            type="password"
            autocomplete="new-password"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="$t('register.label.passwordConfirmation')"
          name="confirmPassword"
        >
          <UInput
            v-model="formState.confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" color="primary" block :loading="isLoading">
          {{ $t("profile.resetPasswordSubmit") }}
        </UButton>
      </UForm>

      <!-- Success state -->
      <div v-else class="space-y-4">
        <UAlert
          color="success"
          variant="soft"
          :title="$t('profile.resetPasswordSuccess')"
        />
        <NuxtLink to="/login">
          <UButton color="primary" block variant="soft">
            {{ $t("forgotPassword.backToLogin") }}
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { ResetPasswordConfirmRequest } from "~~/types/auth";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const route = useRoute();

function normalizeQueryToken(
  value: string | string[] | null | undefined | (string | null)[],
): string | undefined {
  if (value == null) return undefined;
  const raw = Array.isArray(value) ? (value[0] ?? "") : value;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || undefined;
}

const token = computed(() => normalizeQueryToken(route.query.token));

const formState = ref<
  Pick<ResetPasswordConfirmRequest, "newPassword" | "confirmPassword">
>({
  newPassword: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  if (!token.value) return;

  if (formState.value.newPassword !== formState.value.confirmPassword) {
    alert(t("register.error.passwordsDoNotMatch"));
    return;
  }

  isLoading.value = true;
  success.value = false;

  try {
    await $fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      body: {
        token: token.value,
        newPassword: formState.value.newPassword,
        confirmPassword: formState.value.confirmPassword,
      },
    });

    success.value = true;
  } catch (error: any) {
    const message = error?.data?.message || error?.message || "Unknown error";
    alert(message);
  } finally {
    isLoading.value = false;
  }
};
</script>
