<template>
  <div>
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">Loan Management</h1>
    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-neutral-900">
          Loan Applications
        </h2>
        <span class="text-sm text-neutral-600">{{ loans.length }} loans</span>
      </div>

      <div class="space-y-4">
        <UCard v-for="loan in loans" :key="loan.id">
          <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p class="font-medium text-neutral-900">Loan #{{ loan.id }}</p>
              <p class="text-sm text-neutral-600">
                Amount: {{ loan.amount.toLocaleString() }} IDR
              </p>
              <p class="text-sm text-neutral-600">
                Tenor: {{ loan.tenor }} months
              </p>
              <p class="text-sm text-neutral-500">
                Created: {{ new Date(loan.createdAt).toLocaleDateString() }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UBadge
                :color="
                  loan.status === 'pending'
                    ? 'warning'
                    : loan.status === 'approved'
                    ? 'success'
                    : loan.status === 'rejected'
                    ? 'error'
                    : 'info'
                "
                variant="solid"
              >
                {{ loan.status }}
              </UBadge>

              <template v-if="loan.status === 'pending'">
                <UButton
                  color="success"
                  size="sm"
                  icon="i-heroicons-check-circle"
                  @click="handleApprove(loan.id)"
                >
                  Approve
                </UButton>

                <UButton
                  color="error"
                  size="sm"
                  icon="i-heroicons-x-circle"
                  @click="handleReject(loan.id)"
                >
                  Reject
                </UButton>
              </template>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { UCard, UBadge, UButton } from "#components";

definePageMeta({
  layout: "default",
});

const loans = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("/api/admin/loans");
    if (!response.ok) throw new Error("Failed to fetch loans");
    loans.value = await response.json();
  } catch (error) {
    console.error("Error fetching loans:", error);
  }
});

const handleApprove = async (id) => {
  // TODO: Implement POST to /api/admin/loans/${id}/approve
  console.log("Approve loan:", id);
  alert(`Loan ${id} approved!`);
  // Refresh list
  // You can add logic to refetch or update the status locally
};

const handleReject = async (id) => {
  // TODO: Implement POST to /api/admin/loans/${id}/reject
  console.log("Reject loan:", id);
  alert(`Loan ${id} rejected!`);
  // Refresh list
  // You can add logic to refetch or update the status locally
};
</script>
