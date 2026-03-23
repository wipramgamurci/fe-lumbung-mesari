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
  </div>
</template>

<script setup lang="ts">
import type {
  CashbookBalancesResponse,
  CashbookTransaction,
  CashbookTransactionsResponse,
} from "~~/types/cashbook";
import { formatCurrency, formatDate } from "~~/utils/formatters";

definePageMeta({
  layout: "default",
});

const loading = ref(false);
const cashbookBalances = ref<CashbookBalancesResponse | null>(null);
const error = ref<string | null>(null);

const transactionsLoading = ref(false);
const transactionsError = ref<string | null>(null);
const recentTransactions = ref<CashbookTransaction[]>([]);

const getTransactionAmount = (transaction: CashbookTransaction): number => {
  return transaction.capitalAmount + transaction.shuAmount;
};

const getRecentTransactions = async () => {
  transactionsLoading.value = true;
  transactionsError.value = null;
  try {
    const response = await $fetch<CashbookTransactionsResponse>(
      "/api/cashbook/transactions",
      { query: { page: 1, limit: 10 } },
    );
    recentTransactions.value = response.data;
  } catch (err: any) {
    transactionsError.value =
      err.data?.message || err.message || "Failed to fetch transactions";
    console.error("Error fetching cashbook transactions:", err);
  } finally {
    transactionsLoading.value = false;
  }
};

const getCashbookBalances = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<CashbookBalancesResponse>(
      "/api/cashbook/balances",
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
  getRecentTransactions();
});
</script>
