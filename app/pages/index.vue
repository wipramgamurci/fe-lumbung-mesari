<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
  >
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Lumbung Mesari
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        Cooperative Savings and Loans
      </p>
      <UButton to="/login" color="primary" size="lg"> Get Started </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect to login page
await navigateTo("/login");
</script>
