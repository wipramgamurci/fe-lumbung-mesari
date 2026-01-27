<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between mb-8">
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
        <UInput
          v-model="searchQuery"
          :placeholder="$t('common.searchPlaceholder') || 'Search...'"
          icon="i-heroicons-magnifying-glass"
          class="flex-1 min-w-64"
          @keyup.enter="handleSearch"
        />

        <USelectMenu
          v-model="selectedCategoryOption"
          :items="categoryOptions"
          option-attribute="label"
          :placeholder="$t('expenses.expenseCategoryPlaceholder')"
          class="w-64"
          @update:model-value="handleCategoryChange"
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
                   {{ formatDate((row.original as any).transactionDate || row.original.createdAt) }}
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
                  Created By
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ row.original.createdBy }}
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
                <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {{ row.original.notes }}
                </p>
              </div>

              <!-- Update Button -->
              <div v-if="userStore.isSuperadministrator" class="col-span-2 flex justify-end">
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-pencil-square"
                  :to="`/admin/expenses/${row.original.id}`"
                >
                  {{ $t("common.update") }}
                </UButton>
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
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ExpensesResponse, Expense, ExpenseCategory } from "~~/types/expenses";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "~~/utils/formatters";
import { useUserStore } from "~~/app/stores/useUser";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const { t } = useI18n();
const UButton = resolveComponent("UButton");
const userStore = useUserStore();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const expensesData = ref<ExpensesResponse | null>(null);
const categories = ref<ExpenseCategory[]>([]);
const page = ref(1);
const limit = ref(10);
const searchQuery = ref("");
const selectedCategoryOption = ref<{ label: string; value: string | null } | undefined>(undefined);

// Options
const categoryOptions = computed(() => [
  { label: t("expenses.allCategories"), value: null },
  ...categories.value.map(c => ({
    label: c.name,
    value: c.id
  }))
]);

// Handlers
const handleSearch = () => {
  page.value = 1;
  fetchExpenses();
};

const handleCategoryChange = () => {
  page.value = 1;
  fetchExpenses();
};

const refreshData = () => {
  page.value = 1;
  fetchExpenses();
  fetchCategories();
};

// Fetch Categories
const fetchCategories = async () => {
  try {
    const response = await $fetch<ExpenseCategory[]>("/api/expenses/categories");
    categories.value = response;
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// Fetch Expenses
const fetchExpenses = async () => {
  loading.value = true;
  error.value = null;

  try {
    const queryParams: Record<string, string | number> = {
      page: page.value,
      limit: limit.value,
      sortBy: 'created_at',
      sortOrder: 'desc'
    };

    if (selectedCategoryOption.value?.value) {
      queryParams.category = selectedCategoryOption.value.value;
    }

    if (searchQuery.value?.trim()) {
      queryParams.search = searchQuery.value.trim();
    }

    const queryString = new URLSearchParams(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await $fetch<ExpensesResponse>(`/api/expenses?${queryString}`);
    expensesData.value = response;
  } catch (err: any) {
    console.error("Error fetching expenses:", err);
    error.value = err.data?.message || err.message || "Failed to fetch expenses";
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
    accessorKey: "createdAt",
    header: t("loan.createdAt"), // Using standard Created At for main view
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
];

onMounted(() => {
  fetchCategories();
  fetchExpenses();
});
</script>
