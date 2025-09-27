<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Member Management
    </h1>
    <UCard>
      <UTable :data="members" :columns="columns" class="flex-1" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

type Member = {
  id: string;
  email: string;
  fullname: string;
  username: string;
  phone_number: string;
  address: string;
  status: string;
};

definePageMeta({
  layout: "default",
  // layout: false,
});

const { data } = await useAsyncData("members", () =>
  $fetch("/api/users", {
    query: { role: "member", page: 1, limit: 10 },
  })
);

const members = computed(() => data.value?.data || []);

const handleApprove = (id: string) => {
  // TODO: Connect to /admin/members/:id/approve API
  console.log("Approve member:", id);
  alert("Member approved!");
};

const handleReject = (id: string) => {
  // TODO: Connect to /admin/members/:id/reject API
  console.log("Reject member:", id);
  alert("Member rejected!");
};

const columns: TableColumn<Member>[] = [
  {
    accessorKey: "fullname",
    header: "Full Name",
    cell: ({ row }) => `${row.getValue("fullname")}`,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => `${row.getValue("email")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => `${row.getValue("status")}`,
  },
];
</script>
