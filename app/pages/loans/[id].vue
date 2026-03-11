<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div
      class="flex gap-4 flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div>
        <UButton
          to="/loans"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          class="mb-2 -ml-2"
          size="md"
        >
          {{ $t("common.back") }}
        </UButton>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t("loan.loanDetailsTitle") }}
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ $t("loan.appliedAt", { date: formatDate(loan?.createdAt) }) }}
        </p>
      </div>
      <UBadge
        v-if="loan"
        class="capitalize"
        variant="solid"
        size="lg"
        :color="getStatusColor(loan.status)"
      >
        {{ formatStatus(loan.status) }}
      </UBadge>
    </div>

    <!-- Loading -->
    <div v-if="pendingLoan" class="flex justify-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin w-12 h-12 text-primary-600"
      />
    </div>

    <!-- Error -->
    <UAlert
      v-else-if="loanError"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      :title="$t('common.errorLoadingData')"
      :description="loanError.message || $t('common.pleaseTryAgainLater')"
    />

    <template v-else-if="loan">
      <!-- Loan Summary Card -->
      <UCard>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t("loan.loanSummaryTitle") }}
        </h2>

        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t("loan.principalAmount") }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(loan.principalAmount) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
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
              {{ $t("loan.interestRate") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatPercentage(loan.interestRate) }}
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
          <div v-if="loan.lastMonthPayment" class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.lastMonthPayment") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(loan.lastMonthPayment) }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.totalPayableAmount") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(loan.totalPayableAmount) }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.adminFeeAmount") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(loan.adminFeeAmount) }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.disbursedAmount") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(loan.disbursedAmount) }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.interestAmount") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(loan.interestAmount) }}
            </p>
          </div>
          <div v-if="loan.startDate" class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.startDate") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatDate(loan.startDate) }}
            </p>
          </div>
          <div v-if="loan.endDate" class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.endDate") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatDate(loan.endDate) }}
            </p>
          </div>
          <div v-if="loan.disbursedAt" class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.disburseDate") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatDate(loan.disbursedAt) }}
            </p>
          </div>
          <div v-if="loan.installmentLateAmount" class="flex flex-col gap-1">
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("loan.installmentLateAmount") }}
            </p>
            <p class="text-sm font-semibold text-error-600 dark:text-error-400">
              {{ formatCurrency(loan.installmentLateAmount) }}
            </p>
          </div>
        </div>

        <div
          v-if="loan.notes"
          class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <p
            class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1"
          >
            {{ $t("loan.notes") }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 italic">
            "{{ loan.notes }}"
          </p>
        </div>
      </UCard>

      <!-- Installments Card -->
      <UCard>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t("installments.title") }}
        </h2>

        <div v-if="pendingInstallments" class="flex justify-center py-8">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin w-8 h-8 text-primary-600"
          />
        </div>

        <UAlert
          v-else-if="installmentsError"
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          :title="$t('common.errorLoadingData')"
          :description="
            installmentsError.message || $t('common.pleaseTryAgainLater')
          "
        />

        <div
          v-else-if="installments?.length"
          class="flex flex-col divide-y divide-gray-100 dark:divide-gray-700"
        >
          <div
            v-for="installment in installments"
            :key="installment.id"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-2 py-3"
          >
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{
                  $t("installments.installmentNumber", {
                    number: installment.installmentNumber,
                  })
                }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{
                  $t("installments.dueDate", {
                    date: formatDate(installment.dueDate),
                  })
                }}
              </p>
              <p
                v-if="installment.paidAt"
                class="text-xs text-green-600 dark:text-green-400"
              >
                {{
                  $t("installments.paidDate", {
                    date: formatDate(installment.paidAt),
                  })
                }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-left sm:text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(installment.totalAmount) }}
                </p>
                <p
                  v-if="installment.penaltyAmount > 0"
                  class="text-xs text-error-600 dark:text-error-400"
                >
                  {{
                    $t("installments.penaltyAmount", {
                      amount: formatCurrency(installment.penaltyAmount),
                    })
                  }}
                </p>
              </div>
              <UBadge
                class="capitalize shrink-0"
                variant="soft"
                :color="getInstallmentStatusColor(installment.status)"
              >
                {{ formatInstallmentStatus(installment.status) }}
              </UBadge>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t("installments.noInstallments") }}
          </p>
        </div>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  LoanListItem,
  Installment,
  InstallmentStatus,
  LoanStatus,
} from "~~/types/loan";
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const route = useRoute();
const id = route.params.id as string;

const {
  data: loan,
  pending: pendingLoan,
  error: loanError,
} = await useFetch<LoanListItem>(`/api/loans/${id}`);
const {
  data: installments,
  pending: pendingInstallments,
  error: installmentsError,
} = await useFetch<Installment[]>(`/api/loans/${id}/installments`);

const formatStatus = (status: LoanStatus) => {
  return $t(`loan.statusOptions.${status}`);
};

const getStatusColor = (status: LoanStatus) => {
  const colorMap: Record<string, any> = {
    pending: "warning",
    approved: "success",
    active: "info",
    completed: "success",
    rejected: "error",
  };
  return colorMap[status] || "neutral";
};

const formatInstallmentStatus = (status: InstallmentStatus) => {
  return $t(`installments.status.${status}`);
};

const getInstallmentStatusColor = (status: InstallmentStatus) => {
  const colorMap: Record<InstallmentStatus, any> = {
    due: "neutral",
    paid: "success",
    overdue: "error",
    partial: "warning",
  };
  return colorMap[status] || "neutral";
};
</script>
