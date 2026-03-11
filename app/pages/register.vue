<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("app.title") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("register.createAccount") }}
      </p>
    </div>

    <!-- Registration Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleRegister">
        <div class="space-y-6">
          <!-- Personal Information -->
          <UFormField :label="$t('register.label.username')" name="username">
            <UInput
              v-model="formState.username"
              :placeholder="$t('register.placeholder.username')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.fullname')" name="fullname">
            <UInput
              v-model="formState.fullname"
              :placeholder="$t('register.placeholder.fullname')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.email')" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="$t('register.placeholder.email')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="$t('register.label.phoneNumber')"
            name="phoneNumber"
          >
            <UInput
              v-model="formState.phoneNumber"
              type="tel"
              :placeholder="$t('register.placeholder.phoneNumber')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.address')" name="address">
            <UInput
              v-model="formState.address"
              :placeholder="$t('register.placeholder.address')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.password')" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              :placeholder="$t('register.placeholder.password')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="$t('register.label.passwordConfirmation')"
            name="passwordConfirmation"
          >
            <UInput
              v-model="formState.passwordConfirmation"
              type="password"
              :placeholder="$t('register.placeholder.passwordConfirmation')"
              required
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            {{ $t("register.createAccount") }}
          </UButton>
        </div>
      </UForm>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("register.alreadyHaveAccount") }}
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t("register.signInHere") }}
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { RegisterRequest, RegisterResponse } from "../../types/auth";

definePageMeta({
  layout: "auth",
});

const { register } = useAuth();
const toast = useToast();

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
    toast.add({
      title: "Error",
      description: $t("register.error.passwordsDoNotMatch"),
      color: "error",
    });
    return;
  }

  isLoading.value = true;

  try {
    const response: RegisterResponse = await register(formState.value);

    toast.add({
      title: "Success",
      description: response.message,
      color: "success",
    });

    navigateTo("/verify-otp");
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.add({
      title: "Error",
      description: $t("register.error.registrationFailed", {
        message: error.data?.message,
      }),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
