<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      Test Loans API
    </h1>

    <div class="mb-4">
      <UButton
        :loading="loading"
        :disabled="loading"
        @click="fetchLoans"
        color="primary"
      >
        Fetch Loans
      </UButton>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 rounded">
      <p class="text-red-800 dark:text-red-200">Error: {{ error }}</p>
    </div>

    <div v-if="response" class="mt-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Response:
      </h2>
      <pre
        class="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-sm"
        >{{ JSON.stringify(response, null, 2) }}</pre
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoansResponse } from "~~/types/loan";

definePageMeta({
  layout: "default",
});

const loading = ref(false);
const error = ref<string | null>(null);
const response = ref<LoansResponse | null>(null);

const fetchLoans = async () => {
  loading.value = true;
  error.value = null;
  response.value = null;

  try {
    const data = await $fetch<LoansResponse>("/api/loans", {
      query: {
        page: 1,
        limit: 10,
      },
    });

    response.value = data;
  } catch (err: any) {
    console.error("Error fetching loans:", err);
    error.value =
      err.data?.message || err.message || "Failed to fetch loans";
  } finally {
    loading.value = false;
  }
};
</script>

