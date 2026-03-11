<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <div class="mb-6">
        <UIcon
          name="i-heroicons-clock"
          class="mx-auto text-yellow-500 dark:text-yellow-400"
          style="width: 4rem; height: 4rem"
          aria-label="Waiting for Principal Savings"
        />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("waitingDeposit.waitingForPrincipalSavings") }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("waitingDeposit.yourAccountIsPendingPrincipalSavings") }}
      </p>
    </div>

    <!-- Information Card -->
    <UCard class="mt-8">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t("waitingDeposit.toAccessYourDashboard") }}
            <strong class="text-primary-600 dark:text-primary-400">{{
              $t("waitingDeposit.principalSavings")
            }}</strong>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t("waitingDeposit.pleaseContactTheAdministrator") }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <UButton color="primary" block @click="handleLogout">
            {{ $t("common.signOut") }}
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
