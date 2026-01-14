<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("navigation.loanManagement") }}
    </h1>

    <!-- Filters Card -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search by user name or loan ID..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1 min-w-64"
          @keyup.enter="handleSearch"
        />

        <USelectMenu
          v-model="selectedStatus"
          :items="statusOptions"
          value-key="value"
          placeholder="Filter by Status"
          class="w-48"
          @update:model-value="handleStatusChange"
        />

        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          @click="refreshData"
          :loading="loading"
        >
          Refresh
        </UButton>
      </div>
    </UCard>

    <!-- Table Card -->
    <UCard>
      <div
        v-if="error"
        class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
      >
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <UTable
        v-if="loansData"
        :data="loansData.data"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
        :loading="loading"
      >
        <template #expanded="{ row }">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- Loan Terms -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.principalAmount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.principalAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.interestRate") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatPercentage(row.original.interestRate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.tenor") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.tenor }} months
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.monthlyPayment") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.monthlyPayment) }}
                </p>
              </div>
              <div
                v-if="row.original.lastMonthPayment"
                class="flex flex-col gap-2"
              >
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.lastMonthPayment") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.lastMonthPayment) }}
                </p>
              </div>

              <!-- Financial Breakdown -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.adminFeeAmount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.adminFeeAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.interestAmount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.interestAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.disbursedAmount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.disbursedAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.totalPayableAmount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.totalPayableAmount) }}
                </p>
              </div>

              <!-- Timeline -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.startDate") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(row.original.startDate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.endDate") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(row.original.endDate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.createdAt") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(row.original.createdAt) }}
                </p>
              </div>

              <!-- Additional Info -->
              <div
                v-if="row.original.notes"
                class="flex flex-col gap-2 col-span-2"
              >
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("loan.notes") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.notes }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              v-if="
                row.original.status === 'pending' ||
                row.original.status === 'approved'
              "
              class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <UButton
                v-if="row.original.status === 'pending'"
                color="success"
                size="sm"
                icon="i-heroicons-check-circle"
                :disabled="isProcessing"
                @click="handleApprove(row.original.id)"
              >
                {{ $t("common.approve") }}
              </UButton>

              <UButton
                v-if="row.original.status === 'pending'"
                color="error"
                size="sm"
                icon="i-heroicons-x-circle"
                :disabled="isProcessing"
                @click="handleReject(row.original.id)"
              >
                {{ $t("common.reject") }}
              </UButton>

              <UButton
                v-if="row.original.status === 'approved'"
                color="primary"
                size="sm"
                icon="i-heroicons-banknotes"
                :disabled="isProcessing"
                @click="handleDisburse(row.original.id)"
              >
                {{ $t("loan.disburse") }}
              </UButton>
            </div>
          </div>
        </template>
      </UTable>

      <div v-if="!loansData && !loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t("loan.noDataAvailable") }}
        </p>
      </div>

      <template #footer>
        <UPagination
          v-if="loansData"
          v-model:page="page"
          :items-per-page="limit"
          :total="loansData.totalData"
        />
      </template>
    </UCard>

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
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ selectedLoan.tenor }}
              {{ $t("common.months") }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.monthlyPayment") }}:
              {{ formatCurrency(selectedLoan.monthlyPayment) }}
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
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ selectedLoan.tenor }}
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
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.principalAmount") }}:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.disbursedAmount") }}:
              {{ formatCurrency(selectedLoan.disbursedAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("loan.tenor") }}: {{ selectedLoan.tenor }}
              {{ $t("common.months") }}
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ $t("loan.totalPayableAmount") }}:
              {{ formatCurrency(selectedLoan.totalPayableAmount) }}
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
import { h, resolveComponent, type Ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type {
  LoanListItem,
  LoansResponse,
  LoanStatusUpdateResponse,
} from "~~/types/loan";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
} from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"], // Only administrators can access this page
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UModal = resolveComponent("UModal");

// State
const loading = ref(false);
const error = ref<string | null>(null);
const loansData = ref<LoansResponse | null>(null);
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const selectedStatus = ref<string | null>(null);

// Modal state
const approveModalOpen = ref(false);
const rejectModalOpen = ref(false);
const disburseModalOpen = ref(false);
const selectedLoan = ref<LoanListItem | null>(null);
const isProcessing = ref(false);
const rejectReason = ref("");

// Status options
const statusOptions = [
  { label: $t("loan.statusOptions.allStatuses"), value: null },
  { label: $t("loan.statusOptions.pending"), value: "pending" },
  { label: $t("loan.statusOptions.approved"), value: "approved" },
  { label: $t("loan.statusOptions.rejected"), value: "rejected" },
  { label: $t("loan.statusOptions.active"), value: "active" },
  { label: $t("loan.statusOptions.completed"), value: "completed" },
];

// Handlers
const handleSearch = () => {
  page.value = 1;
  fetchLoans();
};

const handleStatusChange = () => {
  page.value = 1;
  fetchLoans();
};

const refreshData = () => {
  page.value = 1;
  fetchLoans();
};

// Watch page changes
watch(page, () => {
  fetchLoans();
});

// Fetch loans data
const fetchLoans = async () => {
  loading.value = true;
  error.value = null;

  try {
    const queryParams: Record<string, string | number> = {
      page: page.value,
      limit: limit.value,
    };

    if (selectedStatus.value) {
      queryParams.status = selectedStatus.value;
    }

    if (searchQuery.value?.trim()) {
      queryParams.search = searchQuery.value.trim();
    }

    const queryString = new URLSearchParams(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await $fetch<LoansResponse>(`/api/loans?${queryString}`);

    loansData.value = response;
  } catch (err: any) {
    console.error("Error fetching loans:", err);
    error.value =
      err.data?.message || err.message || "Failed to fetch loans data";
    loansData.value = null;
  } finally {
    loading.value = false;
  }
};

// Table columns
const columns: TableColumn<LoanListItem>[] = [
  {
    id: "expand",
    meta: {
      class: {
        th: "w-8",
        td: "w-8",
      },
    },
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-heroicons-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "user.fullname",
    header: $t("loan.borrower"),
    cell: ({ row }) => row.original.user.fullname,
  },
  {
    accessorKey: "principalAmount",
    header: $t("loan.principalAmount"),
    cell: ({ row }) => formatCurrency(row.getValue("principalAmount")),
  },
  {
    accessorKey: "tenor",
    header: $t("loan.tenor"),
    cell: ({ row }) => `${row.getValue("tenor")} months`,
  },
  {
    accessorKey: "status",
    header: $t("loan.status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        {
          pending: "warning" as const,
          approved: "success" as const,
          rejected: "error" as const,
          active: "info" as const,
          completed: "success" as const,
        }[status] || ("neutral" as const);

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        $t(`loan.statusOptions.${status}`)
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: $t("loan.createdAt"),
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
];

// Helper function to handle loan actions
const handleLoanAction = async (
  action: "approve" | "reject" | "disburse",
  modalRef: Ref<boolean>,
  body?: Record<string, any>
) => {
  if (!selectedLoan.value) return;

  isProcessing.value = true;
  try {
    const response = await $fetch<LoanStatusUpdateResponse>(
      `/api/loans/${selectedLoan.value.id}/${action}`,
      {
        method: "POST",
        body: body,
      }
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

    // Close modal and refresh data
    modalRef.value = false;
    selectedLoan.value = null;
    if (action === "reject") {
      rejectReason.value = "";
    }
    await fetchLoans();
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

// Handle approve - open modal
const handleApprove = (loanId: string) => {
  const loan = loansData.value?.data.find((l) => l.id === loanId);
  if (loan) {
    selectedLoan.value = loan;
    approveModalOpen.value = true;
  }
};

// Confirm approve
const confirmApprove = async () => {
  await handleLoanAction("approve", approveModalOpen);
};

// Handle reject - open modal
const handleReject = (loanId: string) => {
  const loan = loansData.value?.data.find((l) => l.id === loanId);
  if (loan) {
    selectedLoan.value = loan;
    rejectReason.value = "";
    rejectModalOpen.value = true;
  }
};

// Confirm reject
const confirmReject = async () => {
  if (!rejectReason.value?.trim()) return;

  await handleLoanAction("reject", rejectModalOpen, {
    reason: rejectReason.value.trim(),
  });
};

// Handle disburse - open modal
const handleDisburse = (loanId: string) => {
  const loan = loansData.value?.data.find((l) => l.id === loanId);
  if (loan) {
    selectedLoan.value = loan;
    disburseModalOpen.value = true;
  }
};

// Confirm disburse
const confirmDisburse = async () => {
  await handleLoanAction("disburse", disburseModalOpen);
};

// Fetch loans on mount
onMounted(() => {
  fetchLoans();
});
</script>
