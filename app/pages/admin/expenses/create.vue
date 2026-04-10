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
            :step-snapping="false"
            :min="0"
            :placeholder="$t('expenses.amountPlaceholder')"
            class="w-full"
          />
        </UFormField>

        <!-- Date -->
        <UFormField
          :label="$t('expenses.transactionDate')"
          :description="t('common.dateFormatDescription')"
          name="transactionDate"
          required
          :error="errors.transactionDate"
        >
          <UInputDate
            ref="transactionDateInput"
            v-model="transactionDate"
            class="w-full"
          >
            <template #trailing>
              <UPopover>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-calendar"
                  aria-label="Select a date"
                  class="px-0"
                />

                <template #content>
                  <UCalendar v-model="transactionDate" class="p-2" />
                </template>
              </UPopover>
            </template>
          </UInputDate>
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
import { CalendarDate } from "@internationalized/date";
import type { CreateExpenseRequest } from "~~/types/expenses";
import { useExpensesStore } from "~~/app/stores/useExpenses";
import { formatCalendarDateToQuery } from "~~/utils/formatters";

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
  source: "auto",
  notes: "",
});

const today = new Date();
const transactionDateInput = useTemplateRef("transactionDateInput");
const transactionDate = shallowRef<CalendarDate | null>(
  new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
);

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
    errors.value.amount = t("expenses.amountError");
    isValid = false;
  }
  if (!transactionDate.value) {
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
    const formattedDate = transactionDate.value
      ? formatCalendarDateToQuery(transactionDate.value)
      : undefined;

    await $fetch("/api/expenses", {
      method: "POST",
      body: {
        ...form.value,
        transactionDate: formattedDate
          ? new Date(formattedDate).toISOString()
          : undefined,
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
      description: t("expenses.failedCreate", {
        message: error.data?.message || error.message,
      }),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
