<template>
  <div
    class="mb-8 flex gap-4 flex-col md:flex-row justify-between items-start md:items-center"
  >
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Pinjaman Saya
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Daftar semua permohonan dan pinjaman aktif Anda.
      </p>
    </div>
    <UButton to="/loans/request" color="primary" icon="i-heroicons-plus">
      Ajukan Pinjaman
    </UButton>
  </div>

  <!-- Loading State -->
  <div v-if="pending" class="flex justify-center py-12">
    <UIcon
      name="i-heroicons-arrow-path"
      class="animate-spin w-12 h-12 text-primary-600"
    />
  </div>

  <!-- Error State -->
  <UAlert
    v-else-if="error"
    icon="i-heroicons-exclamation-triangle"
    color="error"
    variant="soft"
    title="Terjadi kesalahan saat memuat data."
    :description="error.message || 'Silakan coba lagi nanti.'"
  />

  <!-- Empty State -->
  <UCard v-else-if="!loans?.length" class="text-center py-20 border-dashed">
    <UIcon
      name="i-heroicons-document-text"
      class="mx-auto h-12 w-12 text-gray-400"
    />
    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      Belum ada pinjaman
    </h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Mulai dengan mengajukan pinjaman pertama Anda.
    </p>
    <div class="mt-6 flex justify-center">
      <UButton to="/loans/request" color="primary" icon="i-heroicons-plus">
        Ajukan Pinjaman
      </UButton>
    </div>
  </UCard>

  <!-- Loan List -->
  <div v-else class="space-y-4">
    <UCard v-for="loan in loans" :key="loan.id">
      <p>title: ??</p>
      <p>principal amount: {{ formatCurrency(loan.principalAmount) }}</p>
      <p>tenor/duration: {{ loan.tenor }}</p>
      <p>status/badge: {{ loan.status }}</p>
      <p>monthlyPayment: {{ formatCurrency(loan.monthlyPayment) }}</p>
      <p>end date/deadline: {{ formatDate(loan.endDate) }}</p>
    </UCard>
    <!-- <UCard v-for="loan in loans" :key="loan.id">
        <div class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <p class="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                Pinjaman #{{ loan.id.slice(0, 8) }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatCurrency(loan.principalAmount) }}
              </p>
            </div>
            <div class="ml-2 flex-shrink-0 flex items-center gap-4">
              <div class="text-right">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenor</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ loan.tenor }} Bulan</p>
              </div>
              <UBadge
                class="capitalize"
                variant="solid"
                :color="getStatusColor(loan.status)"
              >
                {{ formatStatus(loan.status) }}
              </UBadge>
            </div>
          </div>
          <div class="mt-2" v-if="loan.notes">
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
              "{{ loan.notes }}"
            </p>
          </div>
        </div>
      </UCard> -->
  </div>
</template>

<script setup lang="ts">
import type { MemberLoan } from "~~/types/loan";
import { formatCurrency, formatDate } from "~~/utils/formatters";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const {
  data: loans,
  pending,
  error,
} = await useFetch<MemberLoan[]>("/api/users/me/loans");

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
    active: "Aktif",
    completed: "Selesai",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, any> = {
    pending: "warning",
    approved: "success",
    active: "info",
    completed: "success",
    rejected: "error",
  };
  return colorMap[status] || "neutral";
};
</script>
