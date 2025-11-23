<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
  >
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        You don't have permission to access this page.
      </p>
      <UButton color="primary" @click="goToDashboard">
        Go to Dashboard
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const goToDashboard = () => {
  navigateTo("/dashboard");
};
</script>
