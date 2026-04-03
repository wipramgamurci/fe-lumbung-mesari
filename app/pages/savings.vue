<template>
  <div
    class="mb-8 flex gap-4 flex-col md:flex-row justify-between items-start md:items-center"
  >
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t("savings.myMandatorySavings") }}
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ $t("savings.myMandatorySavingsDescription") }}
      </p>
    </div>
    <UButton
      color="neutral"
      variant="outline"
      icon="i-heroicons-arrow-path"
      :loading="loading"
      @click="refreshData"
    >
      {{ $t("common.refresh") }}
    </UButton>
  </div>

  <UCard class="mb-6">
    <div class="flex flex-wrap items-center gap-4">
      <USelectMenu
        v-model="selectedYear"
        :items="yearMenuItems"
        value-key="value"
        :placeholder="$t('savings.selectYear')"
        class="w-40"
      />
    </div>
  </UCard>

  <!-- Loading State -->
  <div v-if="showLoading" class="flex justify-center py-12">
    <UIcon
      name="i-heroicons-arrow-path"
      class="animate-spin w-12 h-12 text-primary-600"
    />
  </div>

  <!-- Error State -->
  <UAlert
    v-else-if="error"
    icon="i-heroicons-exclamation-triangle"
    color="error"
    variant="soft"
    :title="$t('common.errorLoadingData')"
    :description="error"
  />

  <!-- Empty State -->
  <UCard
    v-else-if="!displayRecords.length"
    class="text-center py-20 border-dashed"
  >
    <UIcon
      name="i-heroicons-banknotes"
      class="mx-auto h-12 w-12 text-gray-400"
    />
    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ $t("savings.noMandatorySavingsRecords") }}
    </h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ $t("savings.noMandatorySavingsDescription") }}
    </p>
  </UCard>

  <!-- Records grid -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    <UCard v-for="row in displayRecords" :key="row.id">
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-2">
          <p
            class="text-xs font-medium text-gray-600 dark:text-gray-300 min-w-0 truncate"
            :title="formatPeriod(row.periodDate)"
          >
            {{ formatPeriod(row.periodDate) }}
          </p>
          <UBadge
            class="capitalize shrink-0"
            size="sm"
            variant="solid"
            :color="getSavingStatusColor(row.status)"
          >
            {{ formatSavingStatus(row.status) }}
          </UBadge>
        </div>
        <p
          class="text-lg font-bold text-gray-900 dark:text-white tabular-nums leading-tight"
        >
          {{ formatCurrency(row.amount) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t("savings.paidDate") }}:
          {{ formatDate(row.paidAt) }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { formatCurrency, formatDate, formatPeriod } from "~~/utils/formatters";
import { useUserSavingsStore } from "~/stores/useUserSavings";
import type { UserMeSavingsRecord } from "~~/types/savings";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const config = useRuntimeConfig();
const userSavingsStore = useUserSavingsStore();
const { loading, error } = storeToRefs(userSavingsStore);

const currentYear = new Date().getFullYear();
const startYear = config.public.startYear as number;
const yearsCount = Math.max(1, currentYear - startYear + 1);

const yearMenuItems = Array.from({ length: yearsCount }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

const selectedYear = ref<number | undefined>(currentYear);

const displayRecords = computed((): UserMeSavingsRecord[] => {
  const year = selectedYear.value;
  if (year === undefined) return [];
  const payload = userSavingsStore.savingsForYear(year);
  return payload?.data ?? [];
});

const showLoading = computed(
  () => loading.value && displayRecords.value.length === 0 && !error.value,
);

function formatSavingStatus(status: UserMeSavingsRecord["status"]): string {
  return $t(`savings.statusOptions.${status}`);
}

function getSavingStatusColor(
  status: UserMeSavingsRecord["status"],
): "success" | "warning" | "error" | "neutral" {
  const colorMap: Record<
    UserMeSavingsRecord["status"],
    "success" | "warning" | "error"
  > = {
    paid: "success",
    due: "warning",
    overdue: "error",
  };
  return colorMap[status] ?? "neutral";
}

async function loadYear(year: number, force = false) {
  await userSavingsStore.fetchSavings(year, force);
}

function refreshData() {
  const year = selectedYear.value ?? currentYear;
  loadYear(year, true);
}

watch(
  selectedYear,
  async (year) => {
    if (year !== undefined) {
      await loadYear(year);
    }
  },
  { immediate: true },
);
</script>
