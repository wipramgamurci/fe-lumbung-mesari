<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Dashboard
    </h1>

    <!-- Balance Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">Total Savings</p>
          <p class="text-2xl font-bold text-green-600">Rp 2,500,000</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">Active Loans</p>
          <p class="text-2xl font-bold text-blue-600">Rp 1,000,000</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Monthly Interest
          </p>
          <p class="text-2xl font-bold text-purple-600">Rp 25,000</p>
        </div>
      </UCard>
    </div>

    <!-- Recent Transactions -->
    <UCard>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Savings Deposit
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Today</p>
          </div>
          <span class="text-green-600 font-semibold">+Rp 500,000</span>
        </div>

        <div
          class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Loan Payment
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Yesterday</p>
          </div>
          <span class="text-red-600 font-semibold">-Rp 100,000</span>
        </div>

        <div class="flex items-center justify-between py-2">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              Interest Earned
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">2 days ago</p>
          </div>
          <span class="text-green-600 font-semibold">+Rp 25,000</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { UCard } from "#components";

definePageMeta({
  layout: "default",
});
</script>
