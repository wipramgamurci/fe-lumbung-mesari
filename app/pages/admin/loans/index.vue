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
          :placeholder="$t('loan.searchPlaceholder')"
          icon="i-heroicons-magnifying-glass"
          class="flex-1 min-w-64"
          @keyup.enter="handleSearch"
        />

        <USelectMenu
          v-model="selectedStatus"
          :items="statusOptions"
          value-key="value"
          :placeholder="$t('loan.filterByStatus')"
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

        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-arrow-down-tray"
          @click="isReportModalOpen = true"
          :loading="isDownloadingReport"
        >
          {{ $t("common.downloadReport") }}
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

    <UModal
      v-model:open="isReportModalOpen"
      :title="$t('loan.monthlyReportModalTitle')"
      :description="$t('loan.monthlyReportModalDescription')"
    >
      <template #body>
        <div class="flex gap-2">
          <USelect
            v-model="selectedReportMonth"
            :items="monthOptions"
            value-key="value"
            :placeholder="$t('loan.selectMonth')"
            class="w-32"
          />
          <USelect
            v-model="selectedReportYear"
            :items="yearOptions"
            value-key="value"
            :placeholder="$t('loan.selectYear')"
            class="w-24"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isDownloadingReport"
            @click="isReportModalOpen = false"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="primary"
            :loading="isDownloadingReport"
            :disabled="!selectedReportMonth || !selectedReportYear"
            @click="downloadMonthlyLoansReport"
          >
            {{ $t("common.downloadReport") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { LoanListItem, LoansResponse } from "~~/types/loan";
import { formatCurrency, formatDate } from "~~/utils/formatters";
import { downloadBlobReport } from "~~/utils/downloadBlob";

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
const isReportModalOpen = ref(false);
const isDownloadingReport = ref(false);

const monthOptions = [
  { label: $t("common.monthNames.january"), value: 1 },
  { label: $t("common.monthNames.february"), value: 2 },
  { label: $t("common.monthNames.march"), value: 3 },
  { label: $t("common.monthNames.april"), value: 4 },
  { label: $t("common.monthNames.may"), value: 5 },
  { label: $t("common.monthNames.june"), value: 6 },
  { label: $t("common.monthNames.july"), value: 7 },
  { label: $t("common.monthNames.august"), value: 8 },
  { label: $t("common.monthNames.september"), value: 9 },
  { label: $t("common.monthNames.october"), value: 10 },
  { label: $t("common.monthNames.november"), value: 11 },
  { label: $t("common.monthNames.december"), value: 12 },
];

const config = useRuntimeConfig();
const currentYear = new Date().getFullYear();
const startYear = config.public.startYear as number;
const yearsCount = Math.max(1, currentYear - startYear + 1);
const yearOptions = Array.from({ length: yearsCount }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

const selectedReportMonth = ref<number>(new Date().getMonth() + 1);
const selectedReportYear = ref<number>(currentYear);

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
  page.value === 1 ? fetchLoans() : (page.value = 1);
};

const handleStatusChange = () => {
  page.value === 1 ? fetchLoans() : (page.value = 1);
};

const refreshData = () => {
  page.value === 1 ? fetchLoans() : (page.value = 1);
};

const downloadMonthlyLoansReport = async () => {
  if (!selectedReportMonth.value || !selectedReportYear.value) return;

  isDownloadingReport.value = true;
  try {
    await downloadBlobReport("/api/reports/monthly-loans", {
      query: {
        month: selectedReportMonth.value,
        year: selectedReportYear.value,
      },
      fileName: `pinjaman-bulanan-${selectedReportYear.value}-${String(
        selectedReportMonth.value,
      ).padStart(2, "0")}.xlsx`,
      fallbackErrorMessage: $t("common.downloadReportError"),
      onSuccess: () => {
        isReportModalOpen.value = false;
      },
    });
  } catch (err: unknown) {
    console.error("Error downloading monthly loans report:", err);
    const toast = useToast();
    toast.add({
      title: $t("common.error.title"),
      description:
        err instanceof Error ? err.message : $t("common.downloadReportError"),
      color: "error",
    });
  } finally {
    isDownloadingReport.value = false;
  }
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
      err.data?.message || err.message || $t("loan.failedToFetchLoans");
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
    cell: ({ row }) => `${row.getValue("tenor")} ${$t("common.months")}`,
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
