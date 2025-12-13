<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Savings Management
    </h1>

    <!-- Filters Card -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <USelectMenu
          v-model="selectedPeriod"
          :items="monthOptions"
          value-key="value"
          placeholder="Select Period"
          class="w-48"
          @update:model-value="handlePeriodChange"
        />

        <USelectMenu
          v-model="selectedYear"
          :items="yearOptions"
          value-key="value"
          placeholder="Select Year"
          class="w-32"
          @update:model-value="handleYearChange"
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

    <!-- Summary Stats -->
    <div v-if="savingsData" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-300">Total Records</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ savingsData.totalData }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-300">Due</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ stats.due }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-300">Paid</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ stats.paid }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-300">Overdue</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ stats.overdue }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Table Card -->
    <UCard>
      <div
        v-if="error"
        class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
      >
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <UTable
        v-if="savingsData"
        :data="savingsData.data"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
        :loading="loading"
      >
        <template #expanded="{ row }">
          <div class="flex flex-col gap-4 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Record ID
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.id }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.user.username }}
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
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Updated At
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(row.original.updatedAt) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </UTable>

      <div v-if="!savingsData && !loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No data available. Click refresh to load savings records.
        </p>
      </div>

      <template #footer>
        <UPagination
          v-if="savingsData"
          v-model:page="page"
          :items-per-page="limit"
          :total="savingsData.totalData"
          :page-count="savingsData.totalPage"
        />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, computed } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { SavingsResponse, SavingsRecord } from "~~/types/savings";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

// State
const loading = ref(false);
const savingsData = ref<SavingsResponse | null>(null);
const error = ref<string | null>(null);
const page = ref(1);
const limit = ref(10);
const selectedPeriod = ref<string | undefined>(undefined);
const selectedYear = ref<number | undefined>(undefined);

// Month options
const monthOptions = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
];

// Year options (current year and 5 years back)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

// Statistics
const stats = computed(() => {
  if (!savingsData.value) {
    return { due: 0, paid: 0, overdue: 0 };
  }
  return {
    due: savingsData.value.data.filter((r) => r.status === "due").length,
    paid: savingsData.value.data.filter((r) => r.status === "paid").length,
    overdue: savingsData.value.data.filter((r) => r.status === "overdue")
      .length,
  };
});

// Format functions
const formatCurrency = (amount: string): string => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatPeriod = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Table columns
const columns: TableColumn<SavingsRecord>[] = [
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
    header: "Member Name",
    cell: ({ row }) => row.original.user.fullname,
  },
  {
    accessorKey: "periodDate",
    header: "Period",
    cell: ({ row }) => formatPeriod(row.original.periodDate),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        {
          due: "warning" as const,
          paid: "success" as const,
          overdue: "error" as const,
        }[status] || "neutral";

      return h(
        UBadge,
        { class: "capitalize", variant: "solid", color },
        () => status
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid Date",
    cell: ({ row }) => formatDate(row.original.paidAt),
  },
  {
    accessorKey: "processedByUser",
    header: "Processed By",
    cell: ({ row }) => row.original.processedByUser?.fullname || "—",
  },
];

// Handlers
const handlePeriodChange = () => {
  page.value = 1;
  fetchSavings();
};

const handleYearChange = () => {
  page.value = 1;
  fetchSavings();
};

const refreshData = () => {
  page.value = 1;
  fetchSavings();
};

// Watch page changes
watch(page, () => {
  fetchSavings();
});

// Fetch savings data
const fetchSavings = async () => {
  loading.value = true;
  error.value = null;

  try {
    const queryParams: Record<string, string | number> = {
      page: page.value,
      limit: limit.value,
    };

    if (selectedPeriod.value) {
      queryParams.period = selectedPeriod.value;
    }

    if (selectedYear.value) {
      queryParams.year = selectedYear.value;
    }

    const queryString = new URLSearchParams(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await $fetch<SavingsResponse>(
      `/api/admin/savings?${queryString}`
    );

    savingsData.value = response;
  } catch (err: any) {
    error.value =
      err.data?.message || err.message || "Failed to fetch savings data";
    console.error("Error fetching savings:", err);
    savingsData.value = null;
  } finally {
    loading.value = false;
  }
};

// Fetch on mount
onMounted(() => {
  fetchSavings();
});
</script>
