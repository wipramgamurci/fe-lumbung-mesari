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

    <!-- Mark as Paid Confirmation Modal -->
    <UModal
      v-model:open="settleModalOpen"
      title="Mark as Paid"
      description="Are you sure you want to mark this savings record as paid?"
    >
      <template #body>
        <div class="space-y-4">
          <div
            v-if="selectedSavings"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div class="flex flex-col gap-2">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedSavings.user.fullname }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Period: {{ formatPeriod(selectedSavings.periodDate) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Amount: {{ formatCurrency(selectedSavings.amount) }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="settleModalOpen = false"
            :disabled="isSettling"
          >
            Cancel
          </UButton>
          <UButton
            color="success"
            @click="confirmMarkAsPaid"
            :loading="isSettling"
            :disabled="isSettling"
          >
            Mark as Paid
          </UButton>
        </div>
      </template>
    </UModal>
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
const settlingIds = ref<Set<string>>(new Set());
const settleModalOpen = ref(false);
const selectedSavings = ref<SavingsRecord | null>(null);
const isSettling = computed(() => {
  return selectedSavings.value
    ? settlingIds.value.has(selectedSavings.value.id)
    : false;
});

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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isSettling = settlingIds.value.has(row.original.id);

      if (status === "paid") {
        return null;
      }

      return h("div", { class: "flex gap-2" }, [
        h(
          UButton,
          {
            size: "sm",
            color: "success",
            loading: isSettling,
            disabled: isSettling,
            onClick: () => openSettleModal(row.original),
          },
          () => "Mark as Paid"
        ),
      ]);
    },
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
      `/api/savings?${queryString}`
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

// Open settle modal
const openSettleModal = (savings: SavingsRecord) => {
  selectedSavings.value = savings;
  settleModalOpen.value = true;
};

// Confirm mark as paid
const confirmMarkAsPaid = async () => {
  if (!selectedSavings.value) return;

  const savingsId = selectedSavings.value.id;
  settlingIds.value.add(savingsId);

  try {
    await $fetch(`/api/savings/${savingsId}/settle`, {
      method: "POST",
    });

    // Show success message
    const toast = useToast();
    toast.add({
      title: "Success",
      description: "Savings record marked as paid successfully.",
      color: "success",
    });

    // Close modal and refresh data
    settleModalOpen.value = false;
    selectedSavings.value = null;
    await fetchSavings();
  } catch (err: any) {
    console.error("Error settling savings:", err);
    const toast = useToast();
    toast.add({
      title: "Error",
      description:
        err.data?.message ||
        err.message ||
        "Failed to mark as paid. Please try again.",
      color: "error",
    });
  } finally {
    settlingIds.value.delete(savingsId);
  }
};

// Fetch on mount
onMounted(() => {
  fetchSavings();
});
</script>
