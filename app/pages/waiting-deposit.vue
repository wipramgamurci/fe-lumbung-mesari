<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <div class="mb-6">
        <UIcon
          name="i-heroicons-clock"
          class="mx-auto text-yellow-500 dark:text-yellow-400"
          style="width: 4rem; height: 4rem"
        />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Waiting for Initial Deposit
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        Your account is pending initial deposit
      </p>
    </div>

    <!-- Information Card -->
    <UCard class="mt-8">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            To access your dashboard, you need to complete your
            <strong class="text-primary-600 dark:text-primary-400"
              >principal savings</strong
            >
            or
            <strong class="text-primary-600 dark:text-primary-400"
              >initial deposit</strong
            >
            first.
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Please contact the administrator or visit the office to complete
            your initial deposit. Once your deposit is approved, you will be
            able to access all features of the application.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <UButton color="primary" block @click="handleLogout">
            Sign Out
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>
