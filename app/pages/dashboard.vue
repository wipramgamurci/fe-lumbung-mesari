<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("navigation.dashboard") }}
    </h1>

    <!-- Balance Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ $t("dashboard.totalBalance") }}
          </p>
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
                ? $t("common.loading")
                : error
                  ? $t("common.errorLoadingData")
                  : formatCurrency(cashbookBalances?.total || 0)
            }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ $t("dashboard.capital") }}
          </p>
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
                ? $t("common.loading")
                : error
                  ? $t("common.errorLoadingData")
                  : formatCurrency(cashbookBalances?.capital || 0)
            }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ $t("dashboard.shu") }}
          </p>
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
                ? $t("common.loading")
                : error
                  ? $t("common.errorLoadingData")
                  : formatCurrency(cashbookBalances?.shu || 0)
            }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Recent Transactions -->
    <UCard>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t("dashboard.recentTransactions") }}
      </h2>

      <p
        v-if="transactionsLoading"
        class="text-sm text-gray-500 dark:text-gray-400 py-2"
      >
        {{ $t("common.loading") }}
      </p>
      <p
        v-else-if="transactionsError"
        class="text-sm text-red-600 dark:text-red-400 py-2"
      >
        {{ transactionsError }}
      </p>
      <p
        v-else-if="recentTransactions.length === 0"
        class="text-sm text-gray-500 dark:text-gray-400 py-2"
      >
        {{ $t("common.noDataFound") }}
      </p>

      <div v-else class="space-y-3">
        <div
          v-for="(trx, idx) in recentTransactions"
          :key="trx.id"
          class="flex items-start justify-between py-2"
          :class="{
            'border-b border-gray-100 dark:border-gray-700':
              idx < recentTransactions.length - 1,
          }"
        >
          <div class="min-w-0 pr-4">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ trx.category.name }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ formatDate(trx.txnDate) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t("dashboard.totalBalance") }}:
              {{ formatCurrency(trx.totalBalanceAfter) }}
            </p>
          </div>
          <span
            class="font-semibold text-right whitespace-nowrap"
            :class="
              trx.type === 'expense'
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            "
          >
            {{ trx.type === "expense" ? "-" : "+"
            }}{{ formatCurrency(getTransactionAmount(trx)) }}
          </span>
        </div>
      </div>
    </UCard>

    <!-- User Savings (Debug) -->
    <UCard class="mt-8">
      <div class="flex items-center justify-between gap-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          User Savings
        </h2>

        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-arrow-path"
          :loading="userSavingsLoading"
          @click="fetchUserSavings"
        >
          Fetch
        </UButton>
      </div>

      <p
        v-if="userSavingsError"
        class="text-sm text-red-600 dark:text-red-400 mb-3"
      >
        {{ userSavingsError }}
      </p>

      <pre
        v-if="userSavingsPretty"
        class="text-xs overflow-auto max-h-96 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
      >{{ userSavingsPretty }}</pre>

      <p
        v-else
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        Click “Fetch” to call <code>/api/users/me/savings</code>.
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CashbookTransaction } from "~~/types/cashbook";
import { storeToRefs } from "pinia";
import { useCashbookStore } from "~/stores/useCashbook";
import { formatCurrency, formatDate } from "~~/utils/formatters";
import type { UserMeSavingsResponse } from "~~/server/api/users/me/savings.get";

definePageMeta({
  layout: "default",
});

const cashbookStore = useCashbookStore();
const {
  balances: cashbookBalances,
  loadingBalances: loading,
  errorBalances: error,
  recentTransactions,
  loadingTransactions: transactionsLoading,
  errorTransactions: transactionsError,
} = storeToRefs(cashbookStore);

const getTransactionAmount = (transaction: CashbookTransaction): number => {
  return transaction.capitalAmount + transaction.shuAmount;
};

const getDashboardData = async () => {
  try {
    await cashbookStore.fetchDashboardData();
  } catch (err) {
    console.error("Error fetching dashboard cashbook data:", err);
  }
};

const userSavingsLoading = ref(false);
const userSavingsError = ref<string | null>(null);
const userSavingsData = ref<UserMeSavingsResponse | null>(null);

const userSavingsPretty = computed(() => {
  return userSavingsData.value
    ? JSON.stringify(userSavingsData.value, null, 2)
    : "";
});

const fetchUserSavings = async () => {
  userSavingsLoading.value = true;
  userSavingsError.value = null;

  try {
    const response = await $fetch<UserMeSavingsResponse>("/api/users/me/savings");
    userSavingsData.value = response;
  } catch (err: any) {
    userSavingsData.value = null;
    userSavingsError.value =
      err.data?.message || err.message || "Failed to fetch user savings";
    console.error("Error fetching user savings:", err);
  } finally {
    userSavingsLoading.value = false;
  }
};

onMounted(() => {
  getDashboardData();
});
</script>
