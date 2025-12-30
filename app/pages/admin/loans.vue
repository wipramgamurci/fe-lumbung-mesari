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
                  {{ row.original.interestRate }}%
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
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { LoanListItem, LoansResponse } from "~~/types/loan";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator"], // Only administrators can access this page
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

// State
const loading = ref(false);
const error = ref<string | null>(null);
const loansData = ref<LoansResponse | null>(null);
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const selectedStatus = ref<string | null>(null);

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

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date and time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

// Fetch loans on mount
onMounted(() => {
  fetchLoans();
});
</script>
