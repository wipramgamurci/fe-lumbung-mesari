<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Member Management
    </h1>
    <UCard>
      <!-- <template #header> -->
      <!-- showing x - y of z members -->
      <!-- </template> -->
      <UTable
        :data="members"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
      >
        <template #expanded="{ row }">
          <!-- <pre>{{ row.original }}</pre> -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Username: {{ row.original.username }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Phone Number: {{ row.original.phone_number }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Address: {{ row.original.address }}
              </p>
            </div>
          </div>
        </template>
      </UTable>
      <template #footer>
        <UPagination
          v-model:page="page"
          :items-per-page="limit"
          :total="total"
        />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: "default",
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

type Member = {
  id: string;
  email: string;
  fullname: string;
  username: string;
  phone_number: string;
  address: string;
  status: string;
};

const page = ref(1);
const limit = ref(10);

const { data, pending, refresh } = await useAsyncData(
  "members",
  () =>
    $fetch("/api/users", {
      query: { role: "member", page: page.value, limit: limit.value },
    }),
  {
    watch: [page],
  }
);

const members = computed(() => data.value?.data || []);
const total = computed(() => data.value?.total || 0);

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
    id: "expand",
    meta: {
      class: {
        th: "w-8",
        td: "w-8",
      },
    },
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-heroicons-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
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
    cell: ({ row }) => {
      const color = {
        pending: "warning" as const,
        approved: "success" as const,
        rejected: "error" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        row.getValue("status")
      );
    },
  },
];
</script>
