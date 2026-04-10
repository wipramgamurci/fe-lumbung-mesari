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
            :step-snapping="false"
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
          <UInput v-model="form.transactionDate" type="date" class="w-full" />
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
import type { UpdateExpenseRequest, Expense } from "~~/types/expenses";
import { useExpensesStore } from "~~/app/stores/useExpenses";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["superadministrator", "administrator"],
});

const toast = useToast();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const expensesStore = useExpensesStore();

// State
// categories removed, use store
const loadingCategories = ref(false);
const loadingExpense = ref(true);
const isSubmitting = ref(false);

const form = ref<Partial<UpdateExpenseRequest> & { transactionDate?: string }>({
  expenseCategoryId: undefined,
  name: "",
  amount: 0,
  transactionDate: new Date().toISOString().split("T")[0],
  source: "auto",
  notes: "",
});

const errors = ref<Record<string, string>>({});

// Options
const categoryOptions = computed(() =>
  expensesStore.categories
    .filter((c) => c.code !== "loan_disbursement")
    .map((c) => ({
      label: `${c.name}`,
      value: c.id,
    })),
);

const sourceOptions = [
  { label: t("expenses.sourceOptions.auto"), value: "auto" },
  { label: t("expenses.sourceOptions.shu"), value: "shu" },
  { label: t("expenses.sourceOptions.capital"), value: "capital" },
];

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
      transactionDate: response.txnDate.split("T")[0],
      source: response.source as "auto" | "shu" | "capital",
      notes: response.notes || "",
    };
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
  loadingCategories.value = true;
  try {
    await expensesStore.fetchCategories();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to fetch expense categories",
      color: "error",
    });
  } finally {
    loadingCategories.value = false;
  }

  await fetchExpense();
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
    errors.value.amount = t("expenses.amountError");
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
    // Ensure transactionDate is in ISO format if needed by backend, or just properly formatted string
    // The backend receives UpdateExpenseRequest which has transactionDate: string.
    // In create.vue: transactionDate: new Date(form.value.transactionDate!).toISOString()
    // Let's match that behavior.

    // Create payload from form.value
    const payload = { ...form.value };

    if (payload.transactionDate) {
      // Ensure it's a full ISO string if that's what backend expects (usually is for dates)
      // The input type="date" gives YYYY-MM-DD.
      payload.transactionDate = new Date(payload.transactionDate).toISOString();
    }

    await $fetch(url, {
      method: "PUT",
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
