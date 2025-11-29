<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <div class="mb-6">
        <UIcon
          name="i-heroicons-x-circle"
          class="mx-auto text-red-500 dark:text-red-400"
          style="width: 4rem; height: 4rem"
        />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Account Rejected
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        Your account registration has been rejected
      </p>
    </div>

    <!-- Information Card -->
    <UCard class="mt-8">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Unfortunately, your account registration has been
            <strong class="text-red-600 dark:text-red-400">rejected</strong>.
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            If you believe this is an error or have questions about your
            rejection, please contact the administrator for assistance.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <UButton color="primary" block @click="handleLogout">
            Sign Out
          </UButton>
          <UButton variant="ghost" block @click="handleContactAdmin">
            Contact Administrator
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

const handleContactAdmin = () => {
  // You can customize this to navigate to a contact page or open email
  alert(
    "Please contact the administrator for assistance regarding your account rejection."
  );
};
</script>
