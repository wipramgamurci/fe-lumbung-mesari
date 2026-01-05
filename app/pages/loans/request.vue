<template>
  <div class="container mx-auto p-4">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Loan Request
        </h1>
      </template>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-12">
        <!-- Loan Application Form -->
        <div class="w-full lg:w-1/2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Loan Application
          </h2>

          <UForm :state="form" @submit="handleSubmit" class="space-y-4">
            <UFormField
              label="Loan Amount"
              name="amount"
              :error="errors.amount"
              required
            >
              <UInputNumber
                v-model="form.amount"
                orientation="vertical"
                :step="100000"
                :min="0"
                placeholder="Enter loan amount"
                :disabled="isLoadingPeriods || isSubmitting"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Loan Period"
              name="loanPeriodId"
              :error="errors.loanPeriodId"
              required
            >
              <USelect
                v-model="form.loanPeriodId"
                :items="loanPeriodOptions"
                placeholder="Select loan period"
                :disabled="isLoadingPeriods || isSubmitting"
                :loading="isLoadingPeriods"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Notes (Optional)" name="notes">
              <UTextarea
                v-model="form.notes"
                placeholder="Add any additional notes..."
                :disabled="isSubmitting"
                :rows="3"
                class="w-full"
              />
            </UFormField>

            <UButton
              :type="calculationResult ? 'submit' : 'button'"
              :color="calculationResult ? 'primary' : 'neutral'"
              :variant="calculationResult ? 'solid' : 'outline'"
              :disabled="isSubmitting || isCalculating || !canCalculate"
              :loading="isCalculating || isSubmitting"
              @click="handleButtonClick"
              block
            >
              {{ calculationResult ? "Submit Application" : "Calculate" }}
            </UButton>
          </UForm>
        </div>

        <!-- Loan Calculation Results -->
        <div class="w-full lg:w-1/2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Loan Calculation
          </h2>

          <div
            v-if="calculationResult"
            class="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300"
                >Principal Amount:</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{
                  currencyFormatter.format(calculationResult.principalAmount)
                }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Admin Fee:</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ currencyFormatter.format(calculationResult.adminFee) }}
              </span>
            </div>

            <div class="flex justify-between border-t pt-2">
              <span class="text-gray-600 dark:text-gray-300"
                >Disbursed Amount:</span
              >
              <span
                class="font-semibold text-primary-600 dark:text-primary-400"
              >
                {{
                  currencyFormatter.format(calculationResult.disbursedAmount)
                }}
              </span>
            </div>

            <div class="flex justify-between pt-2">
              <span class="text-gray-600 dark:text-gray-300">Tenor:</span>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ calculationResult.tenor }} months
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300"
                >Interest Rate:</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ formatPercentage(calculationResult.interestRate) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300"
                >Monthly Interest:</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{
                  currencyFormatter.format(calculationResult.monthlyInterest)
                }}
              </span>
            </div>

            <div class="flex justify-between border-t pt-2">
              <span class="text-gray-600 dark:text-gray-300"
                >Monthly Payment:</span
              >
              <span
                class="font-semibold text-primary-600 dark:text-primary-400"
              >
                {{ currencyFormatter.format(calculationResult.monthlyPayment) }}
              </span>
            </div>

            <div
              v-if="calculationResult.lastMonthPayment !== undefined"
              class="flex justify-between"
            >
              <span class="text-gray-600 dark:text-gray-300"
                >Last Month Payment:</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{
                  currencyFormatter.format(calculationResult.lastMonthPayment)
                }}
              </span>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Enter loan amount and select period, then click Calculate</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type {
  LoanPeriod,
  LoanCalculateResponse,
  LoanCreateRequest,
  Loan,
} from "../../../types/loan";
import { formatPercentage, formatCurrency } from "../../../utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

// Form state
const form = ref<LoanCreateRequest>({
  amount: 0,
  loanPeriodId: "",
  notes: "",
});

const errors = ref<Record<string, string>>({});

// Loan periods
const loanPeriods = ref<LoanPeriod[]>([]);
const isLoadingPeriods = ref(false);

// Calculation
const calculationResult = ref<LoanCalculateResponse | null>(null);
const isCalculating = ref(false);

// Track the values that were used for the last calculation
const lastCalculatedAmount = ref<number | null>(null);
const lastCalculatedPeriodId = ref<string | null>(null);

// Submission
const isSubmitting = ref(false);

// Computed
const loanPeriodOptions = computed(() => {
  return loanPeriods.value.map((period) => {
    return {
      label: `${period.tenor} months`,
      value: period.id,
    };
  });
});

const canCalculate = computed(() => {
  return form.value.amount > 0 && form.value.loanPeriodId !== "";
});

const canSubmit = computed(() => {
  return canCalculate.value && calculationResult.value !== null;
});

// Watch for form changes and clear calculation if values change
watch(
  () => [form.value.amount, form.value.loanPeriodId],
  ([newAmount, newPeriodId]) => {
    // Only clear if we have a calculation result
    if (calculationResult.value !== null) {
      // Check if the values have changed from what was last calculated
      if (
        newAmount !== lastCalculatedAmount.value ||
        newPeriodId !== lastCalculatedPeriodId.value
      ) {
        calculationResult.value = null;
        lastCalculatedAmount.value = null;
        lastCalculatedPeriodId.value = null;
      }
    }
  }
);

// Validate form fields
const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.amount || form.value.amount <= 0) {
    errors.value.amount = "Loan amount must be greater than 0";
    return false;
  }

  if (!form.value.loanPeriodId) {
    errors.value.loanPeriodId = "Please select a loan period";
    return false;
  }

  return true;
};

// Handle button click - calculate or submit based on state
const handleButtonClick = async (event: Event) => {
  if (calculationResult.value) {
    // If we have a calculation result, let the form submit handle it
    return;
  } else {
    // Otherwise, prevent form submission and calculate
    event.preventDefault();
    await handleCalculate();
  }
};

// Fetch loan periods on mount
onMounted(async () => {
  await fetchLoanPeriods();
});

// Fetch loan periods
const fetchLoanPeriods = async () => {
  isLoadingPeriods.value = true;
  try {
    const response = await $fetch<LoanPeriod[]>("/api/loans/periods");
    loanPeriods.value = response;
  } catch (error: any) {
    console.error("Error fetching loan periods:", error);
    alert(
      "Failed to load loan periods: " +
        (error.message || error.data?.message || "Unknown error")
    );
  } finally {
    isLoadingPeriods.value = false;
  }
};

// Calculate loan
const handleCalculate = async () => {
  if (!canCalculate.value) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  isCalculating.value = true;

  try {
    const response = await $fetch<LoanCalculateResponse>(
      "/api/loans/calculate",
      {
        method: "POST",
        body: {
          amount: form.value.amount,
          loanPeriodId: form.value.loanPeriodId,
        },
      }
    );

    calculationResult.value = response;
    // Store the values that were used for this calculation
    lastCalculatedAmount.value = form.value.amount;
    lastCalculatedPeriodId.value = form.value.loanPeriodId;
  } catch (error: any) {
    console.error("Error calculating loan:", error);
    alert(
      "Calculation failed: " +
        (error.message || error.data?.message || "Unknown error")
    );
    calculationResult.value = null;
    lastCalculatedAmount.value = null;
    lastCalculatedPeriodId.value = null;
  } finally {
    isCalculating.value = false;
  }
};

// Submit loan application
const handleSubmit = async () => {
  if (!canSubmit.value) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  if (!calculationResult.value) {
    alert("Please calculate the loan first");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<Loan>("/api/loans", {
      method: "POST",
      body: {
        loanPeriodId: form.value.loanPeriodId,
        amount: form.value.amount,
        notes: form.value.notes || undefined,
      },
    });

    alert("Loan application submitted successfully!");
    console.log("Loan submitted:", response);

    // Reset form
    form.value = {
      amount: 0,
      loanPeriodId: "",
      notes: "",
    };
    calculationResult.value = null;
    // Clear tracking values to ensure clean state
    lastCalculatedAmount.value = null;
    lastCalculatedPeriodId.value = null;

    // Optionally redirect to loans list or dashboard
    // navigateTo("/loans");
  } catch (error: any) {
    console.error("Error submitting loan:", error);
    alert(
      "Submission failed: " +
        (error.message || error.data?.message || "Unknown error")
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
