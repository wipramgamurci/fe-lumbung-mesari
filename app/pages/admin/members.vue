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

    <!-- Approve Modal -->
    <UModal v-model:open="approveModalOpen" title="Approve Member">
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to approve this member?
          </p>
          <div
            v-if="selectedMember"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <p class="font-medium">{{ selectedMember.fullname }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedMember.email }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="approveModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="success"
            @click="confirmApprove"
            :loading="isProcessing"
          >
            Approve Member
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Reject Modal -->
    <UModal v-model:open="rejectModalOpen" title="Reject Member">
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to reject this member?
          </p>
          <div
            v-if="selectedMember"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <p class="font-medium">{{ selectedMember.fullname }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedMember.email }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="rejectModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton color="error" @click="confirmReject" :loading="isProcessing">
            Reject Member
          </UButton>
        </div>
      </template>
    </UModal>
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
const UModal = resolveComponent("UModal");

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

// Modal state
const approveModalOpen = ref(false);
const rejectModalOpen = ref(false);
const selectedMember = ref<Member | null>(null);
const isProcessing = ref(false);

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
  const member = members.value.find((m) => m.id === id);
  if (member) {
    selectedMember.value = member;
    approveModalOpen.value = true;
  }
};

const handleReject = (id: string) => {
  const member = members.value.find((m) => m.id === id);
  if (member) {
    selectedMember.value = member;
    rejectModalOpen.value = true;
  }
};

const confirmApprove = async () => {
  if (!selectedMember.value) return;

  isProcessing.value = true;
  try {
    // TODO: Connect to /admin/members/:id/approve API
    console.log("Approve member:", selectedMember.value.id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    const toast = useToast();
    toast.add({
      title: "Member Approved",
      description: `${selectedMember.value.fullname} has been approved successfully.`,
      color: "success",
    });

    // Close modal and refresh data
    approveModalOpen.value = false;
    selectedMember.value = null;
    await refresh();
  } catch (error) {
    console.error("Error approving member:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Failed to approve member. Please try again.",
      color: "error",
    });
  } finally {
    isProcessing.value = false;
  }
};

const confirmReject = async () => {
  if (!selectedMember.value) return;

  isProcessing.value = true;
  try {
    // TODO: Connect to /admin/members/:id/reject API
    console.log("Reject member:", selectedMember.value.id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    const toast = useToast();
    toast.add({
      title: "Member Rejected",
      description: `${selectedMember.value.fullname} has been rejected.`,
      color: "error",
    });

    // Close modal and refresh data
    rejectModalOpen.value = false;
    selectedMember.value = null;
    await refresh();
  } catch (error) {
    console.error("Error rejecting member:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Failed to reject member. Please try again.",
      color: "error",
    });
  } finally {
    isProcessing.value = false;
  }
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
  {
    id: "actions",
    header: "Actions",
    // meta: {
    //   class: {
    //     th: "text-center",
    //     td: "text-center",
    //   },
    // },
    cell: ({ row }) =>
      row.getValue("status") === "pending"
        ? h("div", { class: "flex gap-2" }, [
            h(
              UButton,
              {
                size: "sm",
                color: "success",
                onClick: () => handleApprove(row.original.id),
              },
              () => "Approve"
            ),
            h(
              UButton,
              {
                size: "sm",
                color: "error",
                onClick: () => handleReject(row.original.id),
              },
              () => "Reject"
            ),
          ])
        : null,
  },
];
</script>
