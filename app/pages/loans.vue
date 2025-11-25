<template>
  <div class="container mx-auto p-4">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Loan Application
        </h1>
      </template>
      <div class="flex flex-col md:flex-row gap-6 md:gap-12">
        <div class="w-full">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Loan Application
          </h2>
          <UForm :state="form" @submit="submitLoan" class="mt-2">
            <UFormField label="Base Loan Amount" name="value">
              <UInputNumber
                v-model="form.amount"
                orientation="vertical"
                :step="100_000"
                :min="0"
              />
            </UFormField>

            <UFormField class="mt-2" label="Tenor (months)" name="tenor">
              <USelect v-model="form.tenor" :items="tenorOptions" />
            </UFormField>

            <UButton type="submit" class="mt-4">Submit Application</UButton>
          </UForm>
        </div>
        <div class="w-full">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Loan Calculation
          </h2>
          <div class="mt-2">
            <p class="text-gray-900 dark:text-white">
              Loan Amount: {{ currencyFormatter.format(form.amount) }}
            </p>
            <p class="text-gray-900 dark:text-white">
              Tenor: {{ form.tenor }} months
            </p>
            <p class="text-gray-900 dark:text-white">
              Amount Received: {{ receivedAmount }}
            </p>
            <p class="text-gray-900 dark:text-white">
              Monthly Payment: {{ monthlyPayment }}
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"], // Only members can access this page
});

const tenorOptions = ref([3, 6, 9, 12, 15, 18, 21, 24]);

const form = ref({
  amount: 0,
  tenor: 3,
});

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const monthlyPayment = computed(() => {
  const amount = form.value.amount;
  const tenor = form.value.tenor;
  if (!amount || !tenor) return "Rp 0";

  const principal = amount / tenor;
  const interest = amount * 0.01;
  const total = principal + interest;
  return currencyFormatter.format(total);
});

const receivedAmount = computed(() => {
  const amount = form.value.amount;
  if (!amount) return "Rp 0";
  const fees = amount * 0.02;
  const total = amount - fees;
  return currencyFormatter.format(total);
});

const submitLoan = async () => {
  try {
    const response = await $fetch("/api/loans", {
      method: "POST",
      body: form.value,
    });
    console.log("Loan submitted:", response);
    // TODO: Handle success (e.g., show notification, redirect)
  } catch (error) {
    console.error("Error submitting loan:", error);
    // TODO: Handle error
  }
};
</script>
