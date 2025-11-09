<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Lumbung Mesari
      </h2>
      <p class="text-gray-600 dark:text-gray-300">Create your account</p>
    </div>

    <!-- Registration Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleRegister">
        <div class="space-y-6">
          <!-- Personal Information -->
          <UFormField label="Username" name="username">
            <UInput
              v-model="formState.username"
              placeholder="Enter username"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Full Name" name="fullname">
            <UInput
              v-model="formState.fullname"
              placeholder="Enter full name"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Phone Number" name="phoneNumber">
            <UInput
              v-model="formState.phoneNumber"
              type="tel"
              placeholder="Enter phone number"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Address" name="address">
            <UInput
              v-model="formState.address"
              placeholder="Enter address"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Create a password"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Confirm Password" name="passwordConfirmation">
            <UInput
              v-model="formState.passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              required
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            Create Account
          </UButton>
        </div>
      </UForm>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { RegisterRequest, RegisterResponse } from "../../types/auth";
import type { ApiError } from "../../types/api";

definePageMeta({
  layout: "auth",
});

const { register } = useAuth();

const formState = ref<RegisterRequest>({
  username: "",
  fullname: "",
  email: "",
  phoneNumber: "",
  address: "",
  password: "",
  passwordConfirmation: "",
});

const isLoading = ref<boolean>(false);

const handleRegister = async (): Promise<void> => {
  if (formState.value.password !== formState.value.passwordConfirmation) {
    alert("Passwords do not match");
    return;
  }

  if (
    !formState.value.email ||
    !formState.value.password ||
    !formState.value.fullname ||
    !formState.value.username ||
    !formState.value.phoneNumber ||
    !formState.value.address ||
    !formState.value.passwordConfirmation
  ) {
    alert("Please fill in all required fields");
    return;
  }

  isLoading.value = true;

  try {
    const response: RegisterResponse = await register(formState.value);

    alert(response.message);

    navigateTo("/verify-otp");
  } catch (error: any) {
    console.error("Registration error:", error.data);
    const errorData = error.data as ApiError;
    alert("Registration failed: " + errorData.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
