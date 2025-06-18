<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Lumbung Mesari</h1>
        <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <!-- Login Form -->
      <div class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex justify-between">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div class="mt-1">
              <Password
                v-model="form.password"
                :feedback="false"
                toggle-mask
                class="w-full"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <Checkbox
              input-id="remember-me"
              v-model="form.rememberMe"
              :binary="true"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <div>
            <Button type="submit" :loading="isLoading" class="w-full">
              Sign in
            </Button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <div>
              <Button
                type="button"
                @click="signInWithGoogle"
                :loading="isLoading"
                class="w-full"
              >
                <span class="pi pi-google mr-2"></span>
                <span>Sign in with Google</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center text-sm">
        <span class="text-gray-600">Don't have an account?</span>
        <a
          href="/register"
          class="font-medium text-primary-600 hover:text-primary-500 ml-1"
        >
          Sign up
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "@/src/volt/Button.vue";
import InputText from "@/src/volt/InputText.vue";
import Password from "@/src/volt/Password.vue";
import Checkbox from "@/src/volt/Checkbox.vue";

const form = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const isLoading = ref(false);

const handleLogin = () => {
  isLoading.value = true;
  // TODO: Implement login logic
  console.log("Login form submitted:", form.value);
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const signInWithGoogle = () => {
  // TODO: Implement Google OAuth
  console.log("Sign in with Google");
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
