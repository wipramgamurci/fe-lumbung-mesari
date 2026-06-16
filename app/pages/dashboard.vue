<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("navigation.dashboard") }}
    </h1>

    <!-- Cashbook Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{
          $t("dashboard.lastFetchedAt", {
            datetime: formatDateTime(cashbookLastFetchedAt),
          })
        }}
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          v-if="isAdminUser"
          color="primary"
          variant="outline"
          size="sm"
          class="w-fit"
          icon="i-heroicons-arrow-down-tray"
          :loading="isDownloadingCashbookReport"
          @click="isCashbookReportModalOpen = true"
        >
          {{ $t("common.downloadReport") }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          class="w-fit"
          icon="i-heroicons-arrow-path"
          :loading="loading || transactionsLoading"
          @click="refreshCashbookData"
        >
          {{ $t("common.refresh") }}
        </UButton>
      </div>
    </div>

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
    <!-- Member Only Section -->
    <UCard v-if="isMember" class="mb-8">
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4"
      >
        <div class="flex flex-col sm:flex-row gap-1 sm:items-baseline">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t("dashboard.mandatorySaving.title") }}
          </h2>
          <p
            v-if="mandatorySavingsYear !== null"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            {{
              $t("dashboard.mandatorySaving.yearLabel", {
                year: mandatorySavingsYear,
              })
            }}
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{
              $t("dashboard.lastFetchedAt", {
                datetime: formatDateTime(mandatorySavingsLastFetchedAt),
              })
            }}
          </p>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-path"
            :loading="userSavingsLoading"
            @click="refreshMandatorySavings"
          >
            {{ $t("common.refresh") }}
          </UButton>
        </div>
      </div>

      <p
        v-if="userSavingsLoading || (!userSavingsData && !userSavingsError)"
        class="text-sm text-gray-500 dark:text-gray-400 py-2"
      >
        {{ $t("common.loading") }}
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
          {{ $t("common.noDataFound") }}
        </p>

        <template v-else>
          <UCard>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {{ $t("dashboard.mandatorySaving.thisMonth") }}
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
              {{ $t("common.noDataFound") }}
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

        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("dashboard.mandatorySaving.detailCtaPrefix") }}
          <NuxtLink
            to="/savings"
            class="text-primary-600 dark:text-primary-400"
          >
            {{ $t("dashboard.mandatorySaving.detailCtaLink") }}
          </NuxtLink>
        </p>
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

    <UModal
      v-model:open="isCashbookReportModalOpen"
      :title="$t('dashboard.cashbookReportModalTitle')"
      :description="$t('dashboard.cashbookReportModalDescription')"
    >
      <template #body>
        <div class="flex gap-2">
          <USelect
            v-model="selectedReportMonth"
            :items="monthOptions"
            value-key="value"
            :placeholder="$t('loan.selectMonth')"
            class="w-32"
          />
          <USelect
            v-model="selectedReportYear"
            :items="yearOptions"
            value-key="value"
            :placeholder="$t('loan.selectYear')"
            class="w-24"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isDownloadingCashbookReport"
            @click="isCashbookReportModalOpen = false"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="primary"
            :loading="isDownloadingCashbookReport"
            :disabled="!selectedReportMonth || !selectedReportYear"
            @click="downloadCashbookReport"
          >
            {{ $t("common.downloadReport") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { CashbookTransaction } from "~~/types/cashbook";
import { storeToRefs } from "pinia";
import { useCashbookStore } from "~/stores/useCashbook";
import { useUserSavingsStore } from "~/stores/useUserSavings";
import { useUserStore } from "~/stores/useUser";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPeriod,
} from "~~/utils/formatters";
import { downloadBlobReport } from "~~/utils/downloadBlob";
import type { NuxtUIColor } from "~~/types/nuxt-ui";
import type { UserMeSavingsRecord } from "~~/types/savings";

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
  lastFetchedAt: cashbookLastFetchedAt,
} = storeToRefs(cashbookStore);

const userSavingsStore = useUserSavingsStore();
const {
  savings: userSavingsData,
  loading: userSavingsLoading,
  error: userSavingsError,
  lastFetchedAtByYear,
} = storeToRefs(userSavingsStore);
const userStore = useUserStore();
const isMember = computed(() => userStore.isMember);
const isAdminUser = computed(
  () => userStore.isAdmin || userStore.isSuperadministrator,
);
const currentUserId = computed(() => userStore.user?.id ?? null);

const config = useRuntimeConfig();
const currentYear = new Date().getFullYear();
const startYear = config.public.startYear as number;
const yearsCount = Math.max(1, currentYear - startYear + 1);
const yearOptions = Array.from({ length: yearsCount }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

const monthOptions = [
  { label: $t("common.monthNames.january"), value: 1 },
  { label: $t("common.monthNames.february"), value: 2 },
  { label: $t("common.monthNames.march"), value: 3 },
  { label: $t("common.monthNames.april"), value: 4 },
  { label: $t("common.monthNames.may"), value: 5 },
  { label: $t("common.monthNames.june"), value: 6 },
  { label: $t("common.monthNames.july"), value: 7 },
  { label: $t("common.monthNames.august"), value: 8 },
  { label: $t("common.monthNames.september"), value: 9 },
  { label: $t("common.monthNames.october"), value: 10 },
  { label: $t("common.monthNames.november"), value: 11 },
  { label: $t("common.monthNames.december"), value: 12 },
];

const isCashbookReportModalOpen = ref(false);
const isDownloadingCashbookReport = ref(false);
const selectedReportMonth = ref<number>(new Date().getMonth() + 1);
const selectedReportYear = ref<number>(currentYear);

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
  return mandatoryRecords.value.reduce(
    (acc, r) => {
      if (r.status === "paid") acc.paid += 1;
      else if (r.status === "due") acc.due += 1;
      else if (r.status === "overdue") acc.overdue += 1;
      return acc;
    },
    { paid: 0, due: 0, overdue: 0 },
  );
});

function formatSavingStatus(status: UserMeSavingsRecord["status"]): string {
  return $t(`savings.statusOptions.${status}`);
}

function getSavingStatusColor(
  status: UserMeSavingsRecord["status"],
): NuxtUIColor {
  const colorMap: Record<UserMeSavingsRecord["status"], NuxtUIColor> = {
    paid: "success",
    due: "warning",
    overdue: "error",
  };
  return colorMap[status] ?? "neutral";
}

const fetchUserSavings = () => userSavingsStore.fetchSavings();

const refreshCashbookData = async () => {
  try {
    await cashbookStore.fetchDashboardData(true);
  } catch (err) {
    console.error("Error refreshing dashboard cashbook data:", err);
  }
};

const downloadCashbookReport = async () => {
  if (!selectedReportMonth.value || !selectedReportYear.value) return;

  isDownloadingCashbookReport.value = true;
  try {
    await downloadBlobReport("/api/reports/cashbook", {
      query: {
        month: selectedReportMonth.value,
        year: selectedReportYear.value,
      },
      fileName: `laporan-buku-kas-${selectedReportYear.value}-${String(
        selectedReportMonth.value,
      ).padStart(2, "0")}.xlsx`,
      fallbackErrorMessage: $t("common.downloadReportError"),
      onSuccess: () => {
        isCashbookReportModalOpen.value = false;
      },
    });
  } catch (err: unknown) {
    console.error("Error downloading cashbook report:", err);
    const toast = useToast();
    toast.add({
      title: $t("common.error.title"),
      description:
        err instanceof Error ? err.message : $t("common.downloadReportError"),
      color: "error",
    });
  } finally {
    isDownloadingCashbookReport.value = false;
  }
};

const refreshMandatorySavings = async () => {
  try {
    await userSavingsStore.fetchSavings(undefined, true);
  } catch (err) {
    console.error("Error refreshing mandatory savings data:", err);
  }
};

const mandatorySavingsLastFetchedAt = computed(() => {
  const year = mandatorySavingsYear.value;
  if (year === null) return null;
  return lastFetchedAtByYear.value[year] ?? null;
});

onMounted(() => {
  getDashboardData();
});

watch(
  [currentUserId, isMember],
  async ([userId, member]) => {
    if (!userId || !member) {
      userSavingsStore.clearSavings();
      return;
    }

    await fetchUserSavings();
  },
  { immediate: true },
);
</script>
