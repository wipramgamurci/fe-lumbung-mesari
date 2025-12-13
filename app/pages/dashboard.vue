<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Dashboard
    </h1>

    <!-- Balance Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">Total Balance</p>
          <p
            class="text-2xl font-bold"
            :class="
              loading || error
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-green-600 dark:text-green-400'
            "
          >
            {{
              loading
                ? "Loading..."
                : error
                ? "Error fetching"
                : formatCurrency(cashbookBalances?.total || 0)
            }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">Capital</p>
          <p
            class="text-2xl font-bold"
            :class="
              loading || error
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-blue-600 dark:text-blue-400'
            "
          >
            {{
              loading
                ? "Loading..."
                : error
                ? "Error fetching"
                : formatCurrency(cashbookBalances?.capital || 0)
            }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">SHU</p>
          <p
            class="text-2xl font-bold"
            :class="
              loading || error
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-purple-600 dark:text-purple-400'
            "
          >
            {{
              loading
                ? "Loading..."
                : error
                ? "Error fetching"
                : formatCurrency(cashbookBalances?.shu || 0)
            }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Recent Transactions -->
    <UCard>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Savings Deposit
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Today</p>
          </div>
          <span class="text-green-600 font-semibold">+Rp 500,000</span>
        </div>

        <div
          class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Loan Payment
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Yesterday</p>
          </div>
          <span class="text-red-600 font-semibold">-Rp 100,000</span>
        </div>

        <div class="flex items-center justify-between py-2">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Interest Earned
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">2 days ago</p>
          </div>
          <span class="text-green-600 font-semibold">+Rp 25,000</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CashbookBalancesResponse } from "~~/types/cashbook";

definePageMeta({
  layout: "default",
});

const loading = ref(false);
const cashbookBalances = ref<CashbookBalancesResponse | null>(null);
const error = ref<string | null>(null);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getCashbookBalances = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<CashbookBalancesResponse>(
      "/api/cashbook/balances"
    );
    cashbookBalances.value = response;
  } catch (err: any) {
    error.value =
      err.data?.message || err.message || "Failed to fetch balances";
    console.error("Error fetching cashbook balances:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCashbookBalances();
});
</script>
