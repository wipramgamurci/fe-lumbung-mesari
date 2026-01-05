<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Administrator Management
    </h1>
    <UCard>
      <UDropdownMenu :items="dropdownItems">
        <UButton icon="i-heroicons-funnel" label="Filter" />
      </UDropdownMenu>
    </UCard>
    <UCard>
      <UTable
        :data="administrators"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
      >
        <template #expanded="{ row }">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Username: {{ row.original.username }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Phone Number: {{ row.original.phoneNumber }}
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
import type { User } from "~~/types/user";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"], // Only administrators can access this page
});

const selectedFilter = ref("administrator");

const onDropdownSelect = (value: string) => {
  selectedFilter.value = value;
  page.value = 1; // Reset to first page when changing filter
};

const dropdownItems = ref([
  {
    label: "Administrators",
    icon: "i-heroicons-briefcase",
    value: "administrator",
    onSelect: () => onDropdownSelect("administrator"),
  },
  {
    label: "Super Administrators",
    icon: "i-heroicons-shield-check",
    value: "superadministrator",
    onSelect: () => onDropdownSelect("superadministrator"),
  },
]);

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

const page = ref(1);
const limit = ref(10);

const {
  users: administrators,
  total,
  pending,
  refresh,
} = await useUsers({
  role: selectedFilter,
  page,
  limit,
});

const columns: TableColumn<User>[] = [
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
        active: "success" as const,
        rejected: "error" as const,
        inactive: "neutral" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        row.getValue("status")
      );
    },
  },
];
</script>
