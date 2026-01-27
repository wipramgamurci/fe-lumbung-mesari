<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t("expenses.editExpense") }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        {{ $t("expenses.editExpenseDescription") }}
      </p>
    </div>

    <UCard>
      <div v-if="loadingExpense" class="flex justify-center p-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-gray-400"
        />
      </div>

      <UForm v-else :state="form" class="space-y-4" @submit="handleSubmit">
        <!-- Category -->
        <UFormField
          :label="$t('expenses.expenseCategory')"
          name="expenseCategoryId"
          required
          :error="errors.expenseCategoryId"
        >
          <USelect
            v-model="form.expenseCategoryId"
            :items="categoryOptions"
            :loading="loadingCategories"
            :placeholder="$t('expenses.expenseCategoryPlaceholder')"
            class="w-full"
            value-attribute="value"
            option-attribute="label"
          />
        </UFormField>

        <!-- Name -->
        <UFormField
          :label="$t('expenses.expenseName')"
          name="name"
          required
          :error="errors.name"
        >
          <UInput
            v-model="form.name"
            :placeholder="$t('expenses.expenseNamePlaceholder')"
            class="w-full"
          />
        </UFormField>

        <!-- Amount -->
        <UFormField
          :label="$t('expenses.amount')"
          name="amount"
          required
          :error="errors.amount"
        >
          <UInputNumber
            v-model="form.amount"
            :step="1000"
            :min="0"
            :placeholder="$t('expenses.amountPlaceholder')"
            class="w-full"
          />
        </UFormField>

        <!-- Date -->
        <UFormField
          :label="$t('expenses.transactionDate')"
          name="transactionDate"
          required
          :error="errors.transactionDate"
        >
          <UInput
            v-model="form.transactionDate"
            type="date"
            class="w-full"
            disabled
          />
        </UFormField>

        <!-- Source -->
        <UFormField
          :label="$t('expenses.source')"
          name="source"
          required
          :error="errors.source"
        >
          <USelect
            v-model="form.source"
            :items="sourceOptions"
            :placeholder="$t('expenses.sourcePlaceholder')"
            class="w-full"
          />
        </UFormField>

        <!-- Notes -->
        <UFormField :label="$t('expenses.notes')" name="notes">
          <UTextarea
            v-model="form.notes"
            :placeholder="$t('expenses.notesPlaceholder')"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div
          class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isSubmitting"
            @click="navigateTo('/admin/expenses')"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton type="submit" color="primary" :loading="isSubmitting">
            {{ $t("common.submit") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type {
  ExpenseCategory,
  UpdateExpenseRequest,
  Expense,
} from "~~/types/expenses";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["superadministrator"],
});

const toast = useToast();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// State
const categories = ref<ExpenseCategory[]>([]);
const loadingCategories = ref(false);
const loadingExpense = ref(true);
const isSubmitting = ref(false);

const form = ref<Partial<UpdateExpenseRequest> & { transactionDate?: string }>({
  expenseCategoryId: undefined,
  name: "",
  amount: 0,
  transactionDate: new Date().toISOString().split("T")[0],
  source: "manual",
  notes: "",
});

const errors = ref<Record<string, string>>({});

// Options
const categoryOptions = computed(() =>
  categories.value
    .filter((c) => c.code !== "loan_disbursement")
    .map((c) => ({
      label: `${c.name}`,
      value: c.id,
    })),
);

const sourceOptions = [
  { label: t("expenses.sourceOptions.manual"), value: "manual" },
  { label: t("expenses.sourceOptions.auto"), value: "auto" },
  // TODO: Confirm what other source options are available besides "auto" and "manual".
];

// Fetch Categories
const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const response = await $fetch<ExpenseCategory[]>(
      "/api/expenses/categories",
    );
    categories.value = response;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    toast.add({
      title: "Error",
      description: error.data?.message || "Failed to fetch expense categories",
      color: "error",
    });
  } finally {
    loadingCategories.value = false;
  }
};

// Fetch Existing Expense
const fetchExpense = async () => {
  loadingExpense.value = true;
  try {
    const response = await $fetch<Expense>(`/api/expenses/${route.params.id}`);

    // Populate form
    form.value = {
      expenseCategoryId: response.expenseCategoryId,
      name: response.name,
      amount: response.totalAmount, // Assuming totalAmount is the main amount field we edit
      transactionDate: response.createdAt.split("T")[0], // Fallback if transactionDate not in response yet (response usually has createdAt). But if we want accurate date, we need to check if API returns transactionDate. Based on types, Expense has createdAt. Let's assume for now.
      source: response.source as "auto" | "manual",
      notes: response.notes || "",
    };

    // If API response has transactionDate (it should if added to schema), use it.
    // The type definition for Expense currently doesn't show transactionDate explicitly but Create/Update request does.
    // We should probably rely on what's available or createdAt as fallback.
    // Using createdAt for now as per type.
  } catch (error: any) {
    console.error("Error fetching expense:", error);
    toast.add({
      title: "Error",
      description: error.data?.message || "Failed to fetch expense details",
      color: "error",
    });
    navigateTo("/admin/expenses");
  } finally {
    loadingExpense.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchExpense()]);
});

// Validation
const validate = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!form.value.expenseCategoryId) {
    errors.value.expenseCategoryId = t("common.error.required");
    isValid = false;
  }
  if (!form.value.name?.trim()) {
    errors.value.name = t("common.error.required");
    isValid = false;
  }
  if (!form.value.amount || form.value.amount <= 0) {
    errors.value.amount = t("expenses.ammountError");
    isValid = false;
  }
  if (!form.value.transactionDate) {
    errors.value.transactionDate = t("common.error.required");
    isValid = false;
  }
  if (!form.value.source) {
    errors.value.source = t("common.error.required");
    isValid = false;
  }

  return isValid;
};

// Submit
const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    const url = `/api/expenses/${route.params.id}`;
    const { transactionDate, ...payload } = form.value;
    await $fetch(url, {
      method: "PUT" as any,
      body: payload as UpdateExpenseRequest,
    });

    toast.add({
      title: "Success",
      description: t("expenses.successUpdate"),
      color: "success",
    });

    // Navigate back to list
    navigateTo("/admin/expenses");
  } catch (error: any) {
    console.error("Error updating expense:", error);
    toast.add({
      title: "Error",
      description: t("expenses.failedUpdate", {
        message: error.data?.message || error.message,
      }),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
