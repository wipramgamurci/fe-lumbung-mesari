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

    <!-- Mandatory savings -->
    <UCard class="mb-8">
      <div class="flex flex-col sm:flex-row gap-1 sm:items-end mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Mandatory saving
        </h2>
        <p
          v-if="mandatorySavingsYear !== null"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          Year {{ mandatorySavingsYear }}
        </p>
      </div>

      <p
        v-if="userSavingsLoading || (!userSavingsData && !userSavingsError)"
        class="text-sm text-gray-500 dark:text-gray-400 py-2"
      >
        Loading…
      </p>
      <p
        v-else-if="userSavingsError"
        class="text-sm text-red-600 dark:text-red-400 py-2"
      >
        {{ userSavingsError }}
      </p>
      <div v-else class="flex flex-col gap-4">
        <p
          v-if="mandatoryRecords.length === 0"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          No mandatory savings records for this year.
        </p>

        <template v-else>
          <UCard>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
              This month
            </p>
            <template v-if="thisMonthMandatoryRecord">
              <p class="text-base font-semibold text-gray-900 dark:text-white">
                {{ formatPeriod(thisMonthMandatoryRecord.periodDate) }}
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-2">
                {{ formatCurrency(thisMonthMandatoryRecord.amount) }}
              </p>
              <UBadge
                class="mt-3"
                variant="subtle"
                :color="getSavingStatusColor(thisMonthMandatoryRecord.status)"
              >
                {{ formatSavingStatus(thisMonthMandatoryRecord.status) }}
              </UBadge>
            </template>
            <p v-else class="text-sm text-gray-500 dark:text-gray-400">
              No record for the current month in this year’s data.
            </p>
          </UCard>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UCard>
              <div class="flex flex-col items-center justify-center">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ $t("savings.statusOptions.paid") }}
                </p>
                <p
                  class="text-2xl font-bold text-green-600 dark:text-green-400"
                >
                  {{ statusCounts.paid }}
                </p>
              </div>
            </UCard>
            <UCard>
              <div class="flex flex-col items-center justify-center">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ $t("savings.statusOptions.due") }}
                </p>
                <p
                  class="text-2xl font-bold text-amber-600 dark:text-amber-400"
                >
                  {{ statusCounts.due }}
                </p>
              </div>
            </UCard>
            <UCard>
              <div class="flex flex-col items-center justify-center">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ $t("savings.statusOptions.overdue") }}
                </p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ statusCounts.overdue }}
                </p>
              </div>
            </UCard>
          </div>
        </template>

        <!-- <p class="text-sm text-gray-600 dark:text-gray-300">
          For details, go to
          <UButton
            to="/savings"
            color="primary"
            variant="link"
            icon="i-heroicons-arrow-right"
            trailing
            class="align-baseline"
          >
            mandatory saving page
          </UButton>
        </p> -->
      </div>
    </UCard>

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
        >{{ userSavingsPretty }}</pre
      >

      <p v-else class="text-sm text-gray-500 dark:text-gray-400">
        Click “Fetch” to call <code>/api/users/me/savings</code>.
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CashbookTransaction } from "~~/types/cashbook";
import { storeToRefs } from "pinia";
import { useCashbookStore } from "~/stores/useCashbook";
import { useUserSavingsStore } from "~/stores/useUserSavings";
import { formatCurrency, formatDate, formatPeriod } from "~~/utils/formatters";
import type { UserMeSavingsRecord } from "~~/server/api/users/me/savings.get";

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

const userSavingsStore = useUserSavingsStore();
const {
  savings: userSavingsData,
  loading: userSavingsLoading,
  error: userSavingsError,
} = storeToRefs(userSavingsStore);

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

const userSavingsPretty = computed(() => {
  return userSavingsData.value
    ? JSON.stringify(userSavingsData.value, null, 2)
    : "";
});

const mandatoryRecords = computed((): UserMeSavingsRecord[] => {
  return userSavingsData.value?.data ?? [];
});

const mandatorySavingsYear = computed((): number | null => {
  return userSavingsData.value?.year ?? null;
});

const thisMonthMandatoryRecord = computed((): UserMeSavingsRecord | null => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  for (const row of mandatoryRecords.value) {
    const d = new Date(row.periodDate);
    if (Number.isNaN(d.getTime())) continue;
    if (d.getFullYear() === y && d.getMonth() === m) return row;
  }
  return null;
});

const statusCounts = computed(() => {
  const paid = mandatoryRecords.value.filter((r) => r.status === "paid").length;
  const due = mandatoryRecords.value.filter((r) => r.status === "due").length;
  const overdue = mandatoryRecords.value.filter(
    (r) => r.status === "overdue",
  ).length;
  return { paid, due, overdue };
});

function formatSavingStatus(status: UserMeSavingsRecord["status"]): string {
  return $t(`savings.statusOptions.${status}`);
}

function getSavingStatusColor(status: UserMeSavingsRecord["status"]) {
  const colorMap: Record<UserMeSavingsRecord["status"], any> = {
    paid: "success",
    due: "warning",
    overdue: "error",
  };
  return colorMap[status] || "neutral";
}

const fetchUserSavings = () => userSavingsStore.fetchSavings();

onMounted(() => {
  getDashboardData();
  fetchUserSavings();
});
</script>
