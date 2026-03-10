<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div
      class="flex gap-4 flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div>
        <UButton
          to="/admin/loans"
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
        <p class="mt-1 text-sm text-gray-700 dark:text-gray-200" v-if="loan">
          {{ $t("loan.borrower") }}:
          <span class="font-semibold">{{ loan.user.fullname }}</span>
        </p>
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

        <!-- Admin actions -->
        <div
          v-if="loan.status === 'pending' || loan.status === 'approved'"
          class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2"
        >
          <UButton
            v-if="loan.status === 'pending'"
            color="success"
            size="sm"
            icon="i-heroicons-check-circle"
            :disabled="isProcessing"
            @click="openApproveModal"
          >
            {{ $t("common.approve") }}
          </UButton>

          <UButton
            v-if="loan.status === 'pending'"
            color="error"
            size="sm"
            icon="i-heroicons-x-circle"
            :disabled="isProcessing"
            @click="openRejectModal"
          >
            {{ $t("common.reject") }}
          </UButton>

          <UButton
            v-if="loan.status === 'approved'"
            color="primary"
            size="sm"
            icon="i-heroicons-banknotes"
            :disabled="isProcessing"
            @click="openDisburseModal"
          >
            {{ $t("loan.disburse") }}
          </UButton>
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
            class="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-3 py-3"
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
              <div class="flex items-center gap-2">
                <UBadge
                  class="capitalize shrink-0"
                  variant="soft"
                  :color="getInstallmentStatusColor(installment.status)"
                >
                  {{ formatInstallmentStatus(installment.status) }}
                </UBadge>

                <UButton
                  v-if="
                    loan.status === 'active' &&
                    (installment.status === 'due' ||
                      installment.status === 'overdue')
                  "
                  color="primary"
                  variant="outline"
                  size="xs"
                  icon="i-heroicons-check"
                  @click="handleMarkInstallmentPaid(installment)"
                >
                  {{ $t("installments.markAsPaid") }}
                </UButton>
              </div>
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

    <!-- Approve Modal -->
    <UModal
      v-model:open="approveModalOpen"
      :title="$t('loan.approveLoan')"
      :description="$t('loan.confirmApprovalOfThisLoan')"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            {{ $t("loan.confirmApprovalOfThisLoanDescription") }}
          </p>
          <div
            v-if="loan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ loan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(loan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ loan.tenor }}
              {{ $t("common.months") }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.monthlyPayment") }}:
              {{ formatCurrency(loan.monthlyPayment) }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="approveModalOpen = false"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="success"
            @click="confirmApprove"
            :loading="isProcessing"
          >
            {{ $t("loan.approveLoan") }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Reject Modal -->
    <UModal
      v-model:open="rejectModalOpen"
      :title="$t('loan.rejectLoan')"
      :description="$t('loan.confirmRejectionOfThisLoan')"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            {{ $t("loan.confirmRejectionOfThisLoanDescription") }}
          </p>
          <div
            v-if="loan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ loan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(loan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ loan.tenor }}
              {{ $t("common.months") }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              for="reject-reason"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("loan.reasonForRejection") }}
              <span class="text-red-500">*</span>
            </label>
            <UTextarea
              id="reject-reason"
              v-model="rejectReason"
              :placeholder="$t('loan.reasonForRejectionPlaceholder')"
              :rows="4"
              class="w-full"
              required
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="
              () => {
                rejectModalOpen = false;
                rejectReason = '';
              }
            "
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="error"
            @click="confirmReject"
            :loading="isProcessing"
            :disabled="!rejectReason || rejectReason.trim() === ''"
          >
            {{ $t("loan.rejectLoan") }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Disburse Modal -->
    <UModal
      v-model:open="disburseModalOpen"
      :title="$t('loan.disburseLoan')"
      :description="$t('loan.disburseLoanDescription')"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            {{ $t("loan.confirmDisbursementOfFundsToTheBorrower") }}
          </p>
          <div
            v-if="loan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ loan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(loan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.disbursedAmount") }}:
              {{ formatCurrency(loan.disbursedAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ loan.tenor }}
              {{ $t("common.months") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ $t("loan.totalPayableAmount") }}:
              {{ formatCurrency(loan.totalPayableAmount) }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="disburseModalOpen = false"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="primary"
            @click="confirmDisburse"
            :loading="isProcessing"
          >
            {{ $t("loan.disburseLoan") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type {
  LoanListItem,
  Installment,
  InstallmentStatus,
  LoanStatus,
  LoanStatusUpdateResponse,
} from "~~/types/loan";
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const route = useRoute();
const id = route.params.id as string;

const {
  data: loan,
  pending: pendingLoan,
  error: loanError,
  refresh: refreshLoan,
} = await useFetch<LoanListItem>(`/api/loans/${id}`);
const {
  data: installments,
  pending: pendingInstallments,
  error: installmentsError,
  refresh: refreshInstallments,
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

// Admin loan actions
const approveModalOpen = ref(false);
const rejectModalOpen = ref(false);
const disburseModalOpen = ref(false);
const rejectReason = ref("");
const isProcessing = ref(false);

const openApproveModal = () => {
  if (!loan.value) return;
  approveModalOpen.value = true;
};

const openRejectModal = () => {
  if (!loan.value) return;
  rejectReason.value = "";
  rejectModalOpen.value = true;
};

const openDisburseModal = () => {
  if (!loan.value) return;
  disburseModalOpen.value = true;
};

const handleLoanAction = async (
  action: "approve" | "reject" | "disburse",
  modalRef: Ref<boolean>,
  body?: Record<string, any>,
) => {
  if (!loan.value) return;

  isProcessing.value = true;
  try {
    const response = await $fetch<LoanStatusUpdateResponse>(
      `/api/loans/${loan.value.id}/${action}`,
      {
        method: "POST",
        body,
      },
    );

    const toast = useToast();
    const actionConfig = {
      approve: {
        title: $t("loan.loanApproved"),
        defaultMessage: $t("loan.loanApprovedDescription"),
        color: "success" as const,
      },
      reject: {
        title: $t("loan.loanRejected"),
        defaultMessage: $t("loan.loanRejectedDescription"),
        color: "error" as const,
      },
      disburse: {
        title: $t("loan.loanDisbursed"),
        defaultMessage: $t("loan.loanDisbursedDescription"),
        color: "success" as const,
      },
    };

    const config = actionConfig[action];
    toast.add({
      title: config.title,
      description: response.message || config.defaultMessage,
      color: config.color,
    });

    modalRef.value = false;
    if (action === "reject") {
      rejectReason.value = "";
    }

    await refreshLoan();
    if (action === "disburse") {
      await refreshInstallments();
    }
  } catch (err: any) {
    console.error(`Error ${action}ing loan:`, err);
    const toast = useToast();
    const errorMessages = {
      approve: $t("loan.failedToApproveLoan"),
      reject: $t("loan.failedToRejectLoan"),
      disburse: $t("loan.failedToDisburseLoan"),
    };

    toast.add({
      title: "Error",
      description: err.data?.message || errorMessages[action],
      color: "error",
    });
  } finally {
    isProcessing.value = false;
  }
};

const confirmApprove = async () => {
  await handleLoanAction("approve", approveModalOpen);
};

const confirmReject = async () => {
  if (!rejectReason.value?.trim()) return;

  await handleLoanAction("reject", rejectModalOpen, {
    reason: rejectReason.value.trim(),
  });
};

const confirmDisburse = async () => {
  await handleLoanAction("disburse", disburseModalOpen);
};

// Installment mark-as-paid UI only (no backend integration yet)
const handleMarkInstallmentPaid = (installment: Installment) => {
  const toast = useToast();
  toast.add({
    title: $t("installments.markAsPaid"),
    description: $t("installments.markAsPaidNotImplemented"),
    color: "neutral",
  });
};
</script>
