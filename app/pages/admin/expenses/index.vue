<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Expenses
    </h1>

    <UCard>
      <div class="flex flex-col gap-4">
        <UButton
          color="primary"
          @click="fetchCategories"
          :loading="loading"
        >
          Get Categories
        </UButton>

        <UButton
          color="primary"
          @click="fetchExpenses"
          :loading="loading"
        >
          Get Expenses (List)
        </UButton>

        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div v-if="categories" class="flex flex-col gap-2">
            <h3 class="font-bold">Categories:</h3>
            <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
{{ JSON.stringify(categories, null, 2) }}
            </pre>
        </div>

        <div v-if="expenses" class="flex flex-col gap-2">
            <h3 class="font-bold">Expenses:</h3>
             <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
{{ JSON.stringify(expenses, null, 2) }}
            </pre>
        </div>

        <UButton
          color="primary"
          @click="fetchExpenseDetail"
          :loading="loading"
        >
          Get Expense Detail (019bd00a-1773-71a8-a759-783abcdafc1b)
        </UButton>

        <div v-if="expenseDetail" class="flex flex-col gap-2">
            <h3 class="font-bold">Expense Detail:</h3>
             <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
{{ JSON.stringify(expenseDetail, null, 2) }}
            </pre>
        </div>

        <UButton
          color="primary"
          @click="createTestExpense"
          :loading="loading"
        >
          Create Test Expense
        </UButton>

        <div v-if="createdExpense" class="flex flex-col gap-2">
            <h3 class="font-bold">Created Expense:</h3>
             <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
{{ JSON.stringify(createdExpense, null, 2) }}
            </pre>
        </div>
      </div>
    </UCard>
  </div>
</template>



<script setup lang="ts">
import type { ExpenseCategory, ExpensesResponse, Expense } from '../../../../types/expenses'

definePageMeta({
  layout: 'default',
  middleware: 'role',
  roles: ['administrator', 'superadministrator'],
})

const loading = ref(false)
const categories = ref<ExpenseCategory[] | null>(null)
const expenses = ref<ExpensesResponse | null>(null)
const expenseDetail = ref<Expense | null>(null)
const error = ref<string | null>(null)

const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await $fetch<ExpenseCategory[]>('/api/expenses/categories')
        categories.value = response
    }
    catch (err: any) {
        error.value = err.message || 'Failed to fetch categories'
    }
    finally {
        loading.value = false
    }
}

const fetchExpenses = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await $fetch<ExpensesResponse>('/api/expenses')
        expenses.value = response
    }
    catch (err: any) {
        error.value = err.message || 'Failed to fetch expenses'
    }
    finally {
        loading.value = false
    }
}

const fetchExpenseDetail = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await $fetch<Expense>('/api/expenses/019bd00a-1773-71a8-a759-783abcdafc1b')
        expenseDetail.value = response
    }
    catch (err: any) {
        error.value = err.message || 'Failed to fetch expense detail'
    }
    finally {
        loading.value = false
    }
}

const createdExpense = ref<Expense | null>(null)

const createTestExpense = async () => {
    loading.value = true
    error.value = null
    createdExpense.value = null
    try {
        const payload = {
            expenseCategoryId: "019bb22c-f0c8-70a2-9ee1-79a44b5c85af", // Using 'operational' category ID from previous example for better chance of success
            name: "Office Supplies Purchase",
            amount: 150000,
            notes: "Office supplies purchase for monthly operations",
            source: "auto",
            transactionDate: new Date().toISOString()
        }
        console.log('Sending payload:', payload)
        const response = await $fetch<Expense>('/api/expenses', {
            method: 'POST',
            body: payload
        })
        createdExpense.value = response
    }
    catch (err: any) {
        error.value = err.message || 'Failed to create expense'
    }
    finally {
        loading.value = false
    }
}
</script>
