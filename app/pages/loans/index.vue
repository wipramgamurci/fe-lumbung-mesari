<template>
  <div
    class="mb-8 flex gap-4 flex-col md:flex-row justify-between items-start md:items-center"
  >
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t("loan.myLoans") }}
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ $t("loan.myLoansDescription") }}
      </p>
    </div>
    <UButton to="/loans/request" color="primary" icon="i-heroicons-plus">
      {{ $t("loan.applyForLoan") }}
    </UButton>
  </div>

  <!-- Loading State -->
  <div v-if="pending" class="flex justify-center py-12">
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
    :description="error.message || $t('common.pleaseTryAgainLater')"
  />

  <!-- Empty State -->
  <UCard v-else-if="!loans?.length" class="text-center py-20 border-dashed">
    <UIcon
      name="i-heroicons-document-text"
      class="mx-auto h-12 w-12 text-gray-400"
    />
    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ $t("loan.noLoans") }}
    </h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ $t("loan.noLoansDescription") }}
    </p>
    <div class="mt-6 flex justify-center">
      <UButton to="/loans/request" color="primary" icon="i-heroicons-plus">
        {{ $t("loan.applyForLoan") }}
      </UButton>
    </div>
  </UCard>

  <!-- Loan List -->
  <div v-else class="space-y-4">
    <UCard v-for="loan in loans" :key="loan.id">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1 min-w-0">
          <p
            v-if="loan.disbursedAt"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            {{ $t("loan.disbursedAt", { date: formatDate(loan.disbursedAt) }) }}
          </p>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t("loan.appliedAt", { date: formatDate(loan.createdAt) }) }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(loan.principalAmount) }}
          </p>
        </div>
        <UBadge
          class="capitalize shrink-0"
          variant="solid"
          :color="getStatusColor(loan.status)"
        >
          {{ formatStatus(loan.status) }}
        </UBadge>
      </div>

      <div
        class="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-700 pt-4"
      >
        <div class="flex flex-col gap-1">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ $t("loan.tenor") }}
          </p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ loan.tenor }} {{ $t("common.months") }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ $t("loan.monthlyPayment") }}
          </p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(loan.monthlyPayment) }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p
            class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ $t("loan.endDate") }}
          </p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ formatDate(loan.endDate) }}
          </p>
        </div>
        <div class="">
          <UButton
            :to="`/loans/${loan.id}`"
            color="primary"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-right"
            trailing
          >
            {{ $t("common.viewDetail") }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MemberLoan } from "~~/types/loan";
import { formatCurrency, formatDate } from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const {
  data: loans,
  pending,
  error,
} = await useFetch<MemberLoan[]>("/api/users/me/loans");

const formatStatus = (status: string) => {
  return $t(`loan.statusOptions.${status}`);
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, any> = {
    pending: "warning",
    approved: "success",
    active: "info",
    completed: "success",
    rejected: "error",
  };
  return colorMap[status] || "neutral";
};
</script>
