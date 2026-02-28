<template>
  <div>
    <h1>Loan Detail</h1>

    <div v-if="pendingLoan">Loading loan...</div>
    <div v-else-if="loanError">Error: {{ loanError.message }}</div>
    <div v-else-if="loan">
      <pre>{{ loan }}</pre>
    </div>

    <h2>Installments</h2>

    <div v-if="pendingInstallments">Loading installments...</div>
    <div v-else-if="installmentsError">
      Error: {{ installmentsError.message }}
    </div>
    <div v-else-if="installments">
      <pre>{{ installments }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoanListItem, Installment } from "~~/types/loan";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["member"],
});

const route = useRoute();
const id = route.params.id as string;

const {
  data: loan,
  pending: pendingLoan,
  error: loanError,
} = await useFetch<LoanListItem>(`/api/loans/${id}`);
const {
  data: installments,
  pending: pendingInstallments,
  error: installmentsError,
} = await useFetch<Installment[]>(`/api/loans/${id}/installments`);
</script>
