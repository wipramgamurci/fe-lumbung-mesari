<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Loan Management
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
                  Principal Amount
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.principalAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Rate
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatPercentage(row.original.interestRate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tenor
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.tenor }} months
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Payment
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.monthlyPayment) }}
                </p>
              </div>

              <!-- Financial Breakdown -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Fee
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.adminFeeAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Amount
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.interestAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Disbursed Amount
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.disbursedAmount) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Payable
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.totalPayableAmount) }}
                </p>
              </div>

              <!-- Timeline -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(row.original.startDate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(row.original.endDate) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Created At
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
                  Notes
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
                Approve
              </UButton>

              <UButton
                v-if="row.original.status === 'pending'"
                color="error"
                size="sm"
                icon="i-heroicons-x-circle"
                :disabled="isProcessing"
                @click="handleReject(row.original.id)"
              >
                Reject
              </UButton>

              <UButton
                v-if="row.original.status === 'approved'"
                color="primary"
                size="sm"
                icon="i-heroicons-banknotes"
                :disabled="isProcessing"
                @click="handleDisburse(row.original.id)"
              >
                Disburse
              </UButton>
            </div>
          </div>
        </template>
      </UTable>

      <div v-if="!loansData && !loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No data available. Click refresh to load loans.
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
      title="Approve Loan"
      description="Confirm approval of this loan application"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to approve this loan?
          </p>
          <div
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Principal Amount:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tenor: {{ selectedLoan.tenor }} months
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Monthly Payment: {{ formatCurrency(selectedLoan.monthlyPayment) }}
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
            Cancel
          </UButton>
          <UButton
            color="success"
            @click="confirmApprove"
            :loading="isProcessing"
          >
            Approve Loan
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Reject Modal -->
    <UModal
      v-model:open="rejectModalOpen"
      title="Reject Loan"
      description="Confirm rejection of this loan application"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to reject this loan?
          </p>
          <div
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Principal Amount:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tenor: {{ selectedLoan.tenor }} months
            </p>
          </div>
          <div class="space-y-2">
            <label
              for="reject-reason"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason for rejection <span class="text-red-500">*</span>
            </label>
            <UTextarea
              id="reject-reason"
              v-model="rejectReason"
              placeholder="Please provide a reason for rejecting this loan..."
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
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="confirmReject"
            :loading="isProcessing"
            :disabled="!rejectReason || rejectReason.trim() === ''"
          >
            Reject Loan
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Disburse Modal -->
    <UModal
      v-model:open="disburseModalOpen"
      title="Disburse Loan"
      description="Confirm disbursement of funds to the borrower"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to disburse this loan? This action will
            transfer the funds to the borrower.
          </p>
          <div
            v-if="selectedLoan"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedLoan.user.fullname }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Principal Amount:
              {{ formatCurrency(selectedLoan.principalAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Disbursed Amount:
              {{ formatCurrency(selectedLoan.disbursedAmount) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tenor: {{ selectedLoan.tenor }} months
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              Total Payable:
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
            Cancel
          </UButton>
          <UButton
            color="primary"
            @click="confirmDisburse"
            :loading="isProcessing"
          >
            Disburse Loan
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
  { label: "All Statuses", value: null },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
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
    header: "Borrower",
    cell: ({ row }) => row.original.user.fullname,
  },
  {
    accessorKey: "principalAmount",
    header: "Principal Amount",
    cell: ({ row }) => formatCurrency(row.getValue("principalAmount")),
  },
  {
    accessorKey: "tenor",
    header: "Tenor",
    cell: ({ row }) => `${row.getValue("tenor")} months`,
  },
  {
    accessorKey: "status",
    header: "Status",
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

      return h(
        UBadge,
        { class: "capitalize", variant: "solid", color },
        () => status
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
        title: "Loan Approved",
        defaultMessage: "Loan has been approved successfully.",
        color: "success" as const,
      },
      reject: {
        title: "Loan Rejected",
        defaultMessage: "Loan has been rejected.",
        color: "error" as const,
      },
      disburse: {
        title: "Loan Disbursed",
        defaultMessage: "Loan has been disbursed successfully.",
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
      approve: "Failed to approve loan. Please try again.",
      reject: "Failed to reject loan. Please try again.",
      disburse: "Failed to disburse loan. Please try again.",
    };

    toast.add({
      title: "Error",
      description: err.data?.message || err.message || errorMessages[action],
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
