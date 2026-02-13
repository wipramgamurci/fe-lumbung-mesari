<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t("expenses.createExpense") }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        {{ $t("navigation.createExpenseDescription") }}
      </p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-4" @submit="handleSubmit">
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
          <!-- Using UInput with type date for simplicity, typical in HTML5 -->
          <UInput
            v-model="form.transactionDate"
            type="date"
            class="w-full"
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
        <UFormField
          :label="$t('expenses.notes')"
          name="notes"
        >
          <UTextarea
            v-model="form.notes"
            :placeholder="$t('expenses.notesPlaceholder')"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isSubmitting"
            @click="navigateTo('/admin/expenses')"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="isSubmitting"
          >
            {{ $t("common.submit") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CreateExpenseRequest } from "~~/types/expenses";
import { useExpensesStore } from "~~/app/stores/useExpenses";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"],
});

const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const expensesStore = useExpensesStore();

// State
// categories removed, use store
const loadingCategories = ref(false);
const isSubmitting = ref(false);

const form = ref<Partial<CreateExpenseRequest>>({
  expenseCategoryId: undefined,
  name: "",
  amount: 0,
  transactionDate: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
  source: "auto",
  notes: "",
});

const errors = ref<Record<string, string>>({});

// Options
const categoryOptions = computed(() => 
  expensesStore.categories
    .filter(c => c.code !== 'loan_disbursement')
    .map(c => ({
      label: `${c.name}`,
      value: c.id
    }))
);

const sourceOptions = [
  { label: t("expenses.sourceOptions.auto"), value: "auto" },
  { label: t("expenses.sourceOptions.shu"), value: "shu" },
  { label: t("expenses.sourceOptions.capital"), value: "capital" },
];

onMounted(async () => {
  loadingCategories.value = true;
  try {
    await expensesStore.fetchCategories();
  } catch (err) {
      toast.add({
      title: "Error",
      description: "Failed to fetch expense categories",
      color: "error",
    });
  } finally {
    loadingCategories.value = false;
  }
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
    await $fetch("/api/expenses", {
      method: "POST",
      body: {
        ...form.value,
        transactionDate: new Date(form.value.transactionDate!).toISOString(), // Ensure ISO format
      } as CreateExpenseRequest,
    });

    toast.add({
      title: "Success",
      description: t("expenses.successCreate"),
      color: "success",
    });

    // Navigate back to list
    navigateTo("/admin/expenses");
  } catch (error: any) {
    console.error("Error creating expense:", error);
    toast.add({
      title: "Error",
      description: t("expenses.failedCreate", { message: error.data?.message || error.message }),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>