<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("app.title") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("auth.signInToAccount") }}
      </p>
    </div>

    <!-- Login Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleLogin">
        <div class="space-y-6">
          <UFormField :label="$t('common.identifier')" name="identifier">
            <UInput
              v-model="formState.identifier"
              type="text"
              :placeholder="$t('auth.enterUsernameOrEmail')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('common.password')" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              :placeholder="$t('auth.enterPassword')"
              required
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            {{ $t("common.signIn") }}
          </UButton>
        </div>
      </UForm>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("auth.dontHaveAccount") }}
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t("auth.registerHere") }}
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from "../../types/auth";
import { useUserStore } from "../stores/useUser";

definePageMeta({
  layout: "auth",
});

// Use the auth composable
const { login } = useAuth();

const userStore = useUserStore();

const formState = ref<LoginRequest>({
  identifier: "",
  password: "",
});

const isLoading = ref<boolean>(false);

const handleLogin = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await login(formState.value.identifier, formState.value.password);

    // Fetch user data after successful login (cookies are now set)
    await userStore.fetchUser();
  } catch (error: any) {
    console.error("Login error:", error);
    alert(
      "Login failed: " +
        (error.message || error.data?.message || "Unknown error")
    );
  } finally {
    isLoading.value = false;
  }
};
</script>
