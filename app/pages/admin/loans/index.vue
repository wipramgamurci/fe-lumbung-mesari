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
          {{ $t("common.refresh") }}
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
        class="flex-1"
        :loading="loading"
      />

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
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { LoanListItem, LoansResponse } from "~~/types/loan";
import { formatCurrency, formatDate } from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

const loading = ref(false);
const error = ref<string | null>(null);
const loansData = ref<LoansResponse | null>(null);
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const selectedStatus = ref<string | null>(null);

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
      Object.entries(queryParams).map(([k, v]) => [k, String(v)]),
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

// Table columns (no expandable rows, simple list with navigation to detail)
const columns: TableColumn<LoanListItem>[] = [
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
        $t(`loan.statusOptions.${status}`),
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: $t("loan.createdAt"),
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
{
    id: "actions",
    header: "",
    meta: {
      class: {
        th: "w-32",
        td: "w-32",
      },
    },
    cell: ({ row }) =>
      h(
        UButton,
        {
          color: "primary",
          variant: "outline",
          size: "xs",
          icon: "i-heroicons-arrow-right",
          trailing: true,
          to: `/admin/loans/${row.original.id}`,
        },
        () => $t("common.viewDetail"),
      ),
  },
];

// Fetch loans on mount
onMounted(() => {
  fetchLoans();
});
</script>

