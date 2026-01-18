<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("savings.savingsManagement") }}
    </h1>

    <!-- Filters Card -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <USelectMenu
          v-model="selectedPeriod"
          :items="monthOptions"
          value-key="value"
          :placeholder="$t('savings.selectPeriod')"
          class="w-48"
          @update:model-value="handlePeriodChange"
        />

        <USelectMenu
          v-model="selectedYear"
          :items="yearOptions"
          value-key="value"
          :placeholder="$t('savings.selectYear')"
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
                  {{ $t("savings.username") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.user.username }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("savings.createdAt") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(row.original.createdAt) }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("savings.updatedAt") }}
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
          {{ $t("savings.noDataAvailable") }}
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
      :title="$t('savings.markAsPaid')"
      :description="$t('savings.markAsPaidDescription')"
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
                {{ $t("savings.period") }}:
                {{ formatPeriod(selectedSavings.periodDate) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("savings.amount") }}:
                {{ formatCurrency(selectedSavings.amount) }}
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
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="success"
            @click="confirmMarkAsPaid"
            :loading="isSettling"
            :disabled="isSettling"
          >
            {{ $t("savings.markAsPaid") }}
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
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPeriod,
} from "~~/utils/formatters";

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
  { label: $t("common.january"), value: "january" },
  { label: $t("common.february"), value: "february" },
  { label: $t("common.march"), value: "march" },
  { label: $t("common.april"), value: "april" },
  { label: $t("common.may"), value: "may" },
  { label: $t("common.june"), value: "june" },
  { label: $t("common.july"), value: "july" },
  { label: $t("common.august"), value: "august" },
  { label: $t("common.september"), value: "september" },
  { label: $t("common.october"), value: "october" },
  { label: $t("common.november"), value: "november" },
  { label: $t("common.december"), value: "december" },
];

// Year options (current year and 5 years back)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

// Set default to current month and year
const now = new Date();
const selectedPeriod = ref<string | undefined>(
  monthOptions[now.getMonth()]?.value
);
const selectedYear = ref<number | undefined>(now.getFullYear());

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
    header: $t("savings.memberName"),
    cell: ({ row }) => row.original.user.fullname,
  },
  {
    accessorKey: "periodDate",
    header: $t("savings.period"),
    cell: ({ row }) => formatPeriod(row.original.periodDate),
  },
  {
    accessorKey: "amount",
    header: $t("savings.amount"),
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "status",
    header: $t("savings.status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        {
          due: "warning" as const,
          paid: "success" as const,
          overdue: "error" as const,
        }[status] || "neutral";

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        $t(`savings.statusOptions.${status}`)
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: $t("savings.paidDate"),
    cell: ({ row }) => formatDate(row.original.paidAt),
  },
  {
    accessorKey: "processedByUser",
    header: $t("savings.processedBy"),
    cell: ({ row }) => row.original.processedByUser?.fullname || "—",
  },
  {
    id: "actions",
    header: $t("common.actions"),
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
          () => $t("savings.markAsPaid")
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
      description: $t("savings.savingsRecordMarkedAsPaidSuccessfully"),
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
      description: err.data?.message || $t("savings.errorMarkingAsPaid"),
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
