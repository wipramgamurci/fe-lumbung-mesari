<template>
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
                : formatCurrency(balances?.total || 0)
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
                : formatCurrency(balances?.capital || 0)
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
                : formatCurrency(balances?.shu || 0)
          }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CashbookBalancesResponse } from "~~/types/cashbook";
import { formatCurrency } from "~~/utils/formatters";

defineProps<{
  loading: boolean;
  error: string | null;
  balances: CashbookBalancesResponse | null;
}>();
</script>
