<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Lumbung Mesari
      </h2>
      <p class="text-gray-600 dark:text-gray-300">Sign in to your account</p>
    </div>

    <!-- Login Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleLogin">
        <div class="space-y-6">
          <UFormField label="Identifier" name="identifier">
            <UInput
              v-model="formState.identifier"
              type="text"
              placeholder="Enter your username or email"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Enter your password"
              required
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            Sign In
          </UButton>
        </div>
      </UForm>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Register here
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from "../../types/auth";
import type { ApiError } from "../../types/api";

definePageMeta({
  layout: "auth",
});

// Use the auth composable
const { login } = useAuth();

const formState = ref<LoginRequest>({
  identifier: "",
  password: "",
});

const isLoading = ref<boolean>(false);

const handleLogin = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await login(formState.value.identifier, formState.value.password);

    // Navigate on success
    navigateTo("/dashboard");
  } catch (error: any) {
    console.error("Login error:", error.data);
    const errorData = error.data as ApiError;
    alert("Login failed: " + errorData.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
