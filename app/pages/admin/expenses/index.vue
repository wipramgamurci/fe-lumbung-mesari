<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
    >
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t("navigation.expenseList") }}
      </h1>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        to="/admin/expenses/create"
      >
        {{ $t("expenses.createExpense") }}
      </UButton>
    </div>

    <!-- Filters Card -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <UInputDate ref="inputDate" v-model="dateRange" range class="w-72">
          <template #trailing>
            <UPopover :reference="inputDate?.inputsRef[0]?.$el">
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-calendar"
                aria-label="Select a date range"
                class="px-0"
              />

              <template #content>
                <UCalendar
                  v-model="dateRange"
                  class="p-2"
                  :number-of-months="1"
                  range
                />
              </template>
            </UPopover>
          </template>
        </UInputDate>
        <UInput
          v-model="minAmount"
          type="number"
          :placeholder="$t('expenses.minAmount')"
          class="w-32"
        />
        <UInput
          v-model="maxAmount"
          type="number"
          :placeholder="$t('expenses.maxAmount')"
          class="w-32"
        />

        <USelectMenu
          v-model="selectedCategoryOption"
          :items="categoryOptions"
          option-attribute="label"
          :placeholder="$t('expenses.expenseCategoryPlaceholder')"
          class="w-64"
        />

        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-funnel"
          @click="handleFilter"
        >
          {{ $t("common.filter") }}
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-x-mark"
          @click="handleClearFilter"
        >
          {{ $t("common.clearFilter") }}
        </UButton>

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
        v-if="expensesData"
        :data="expensesData.data"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
        :loading="loading"
      >
        <template #expanded="{ row }">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- Expense Details -->
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("expenses.transactionDate") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <!-- Fallback to createdAt if transactionDate is missing from type/response -->
                  {{
                    formatDate(row.original.txnDate || row.original.createdAt)
                  }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("expenses.source") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {{ row.original.source }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("expenses.amount") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(row.original.totalAmount) }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("expenses.createdBy") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.createdBy.fullname }}
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

              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("profile.lastUpdated") }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(row.original.updatedAt) }}
                </p>
              </div>

              <!-- Notes -->
              <div
                v-if="row.original.notes"
                class="flex flex-col gap-2 col-span-2"
              >
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t("expenses.notes") }}
                </p>
                <p
                  class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
                >
                  {{ row.original.notes }}
                </p>
              </div>

              <!-- Update Button -->
              <div
                v-if="
                  row.original.category?.code !== 'loan_disbursement' &&
                  (userStore.isSuperadministrator || userStore.isAdmin)
                "
                class="col-span-2 flex justify-end"
              >
                <div class="flex items-center gap-2">
                  <UButton
                    color="primary"
                    variant="soft"
                    icon="i-heroicons-pencil-square"
                    :to="`/admin/expenses/${row.original.id}`"
                  >
                    {{ $t("common.update") }}
                  </UButton>
                  <UButton
                    v-if="userStore.isSuperadministrator"
                    color="error"
                    variant="soft"
                    icon="i-heroicons-trash"
                    :loading="deletingExpenseId === row.original.id"
                    :disabled="deletingExpenseId !== null"
                    @click="openDeleteModal(row.original)"
                  >
                    {{ $t("common.delete") }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTable>

      <div v-if="!expensesData && !loading" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t("loan.noDataAvailable") }}
        </p>
      </div>

      <template #footer>
        <UPagination
          v-if="expensesData"
          v-model:page="page"
          :items-per-page="limit"
          :total="expensesData.totalData"
        />
      </template>
    </UCard>

    <UModal
      v-model:open="deleteModalOpen"
      :title="$t('expenses.deleteExpense')"
      :description="$t('expenses.deleteExpenseDescription')"
    >
      <template #body>
        <div class="space-y-4">
          <div
            v-if="selectedExpenseForDelete"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedExpenseForDelete.name }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatCurrency(selectedExpenseForDelete.totalAmount) }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isDeletingSelectedExpense"
            @click="deleteModalOpen = false"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="error"
            :loading="isDeletingSelectedExpense"
            :disabled="isDeletingSelectedExpense || !selectedExpenseForDelete"
            @click="confirmDeleteExpense"
          >
            {{ $t("common.delete") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ExpensesResponse, Expense } from "~~/types/expenses";
import type { CalendarDate } from "@internationalized/date";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatCalendarDateToQuery,
} from "~~/utils/formatters";
import { useUserStore } from "~~/app/stores/useUser";
import { useExpensesStore } from "~~/app/stores/useExpenses";
import { useCashbookStore } from "~/stores/useCashbook";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const { t } = useI18n();
const toast = useToast();
const UButton = resolveComponent("UButton");
const userStore = useUserStore();
const expensesStore = useExpensesStore();
const cashbookStore = useCashbookStore();

const inputDate = useTemplateRef("inputDate");

// State
const loading = ref(false);
const error = ref<string | null>(null);
const expensesData = ref<ExpensesResponse | null>(null);
// categories removed, use store
const page = ref(1);
const limit = ref(10);
const selectedCategoryOption = ref<
  { label: string; value: string | null } | undefined
>(undefined);
const dateRange = shallowRef<{ start: CalendarDate; end: CalendarDate } | null>(
  null,
);
const minAmount = ref<number | null>(null);
const maxAmount = ref<number | null>(null);
const deletingExpenseId = ref<string | null>(null);
const deleteModalOpen = ref(false);
const selectedExpenseForDelete = ref<Expense | null>(null);
const isDeletingSelectedExpense = computed(
  () =>
    !!selectedExpenseForDelete.value &&
    deletingExpenseId.value === selectedExpenseForDelete.value.id,
);

// Options
const categoryOptions = computed(() => [
  { label: t("expenses.allCategories"), value: null },
  ...expensesStore.categories.map((c) => ({
    label: c.name,
    value: c.code,
  })),
]);

// Handlers
const handleFilter = () => {
  page.value === 1 ? fetchExpenses() : (page.value = 1);
};

const handleClearFilter = () => {
  dateRange.value = null;
  minAmount.value = null;
  maxAmount.value = null;
  selectedCategoryOption.value = undefined;
  page.value === 1 ? fetchExpenses() : (page.value = 1);
};

const refreshData = () => {
  page.value === 1 ? fetchExpenses() : (page.value = 1);
  expensesStore.fetchCategories(true); // Force refresh
};

const openDeleteModal = (expense: Expense) => {
  if (!userStore.isSuperadministrator || deletingExpenseId.value) {
    return;
  }
  selectedExpenseForDelete.value = expense;
  deleteModalOpen.value = true;
};

const confirmDeleteExpense = async () => {
  if (
    !userStore.isSuperadministrator ||
    deletingExpenseId.value ||
    !selectedExpenseForDelete.value
  ) {
    return;
  }

  const id = selectedExpenseForDelete.value.id;
  deletingExpenseId.value = id;
  try {
    await $fetch<void>(`/api/expenses/${id}`, { method: "DELETE" });
    cashbookStore.invalidateDashboardCache();
    toast.add({
      title: "Success",
      description: t("expenses.successDelete"),
      color: "success",
    });
    deleteModalOpen.value = false;
    selectedExpenseForDelete.value = null;
    await fetchExpenses();
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: t("expenses.failedDelete", {
        message: err.data?.message || err.message,
      }),
      color: "error",
    });
  } finally {
    deletingExpenseId.value = null;
  }
};

// Fetch Categories removed, handled by store

// Fetch Expenses
const fetchExpenses = async () => {
  loading.value = true;
  error.value = null;

  try {
    const queryParams: Record<string, string | number> = {
      page: page.value,
      limit: limit.value,
      sortBy: "created_at",
      sortOrder: "desc",
    };

    if (selectedCategoryOption.value?.value) {
      queryParams.category = selectedCategoryOption.value.value;
    }

    if (dateRange.value?.start) {
      const startDate = formatCalendarDateToQuery(dateRange.value.start);
      if (startDate) queryParams.startDate = startDate;
    }

    if (dateRange.value?.end) {
      const endDate = formatCalendarDateToQuery(dateRange.value.end);
      if (endDate) queryParams.endDate = endDate;
    }
    if (minAmount.value) queryParams.minAmount = minAmount.value;
    if (maxAmount.value) queryParams.maxAmount = maxAmount.value;

    const queryString = new URLSearchParams(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)]),
    ).toString();

    const response = await $fetch<ExpensesResponse>(
      `/api/expenses?${queryString}`,
    );
    expensesData.value = response;
  } catch (err: any) {
    console.error("Error fetching expenses:", err);
    error.value =
      err.data?.message || err.message || "Failed to fetch expenses";
    expensesData.value = null;
  } finally {
    loading.value = false;
  }
};

// Watch page changes
watch(page, () => {
  fetchExpenses();
});

// Table columns
const columns: TableColumn<Expense>[] = [
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
    accessorKey: "name",
    header: t("expenses.expenseName"),
  },
  {
    accessorKey: "category.name",
    header: t("expenses.expenseCategory"),
  },
  {
    accessorKey: "totalAmount",
    header: t("expenses.amount"),
    cell: ({ row }) => formatCurrency(row.getValue("totalAmount")),
  },
  {
    accessorKey: "txnDate",
    header: t("expenses.transactionDate"),
    cell: ({ row }) => formatDate(row.getValue("txnDate")),
  },
  {
    accessorKey: "createdAt",
    header: t("loan.createdAt"), // Using standard Created At for main view
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
];

onMounted(() => {
  expensesStore.fetchCategories();
  fetchExpenses();
});
</script>
