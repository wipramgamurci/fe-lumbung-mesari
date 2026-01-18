<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("navigation.memberManagement") }}
    </h1>
    <UCard>
      <UDropdownMenu :items="dropdownItems">
        <UButton icon="i-heroicons-funnel" label="Filter" />
      </UDropdownMenu>
    </UCard>
    <UCard>
      <UTable
        :data="members"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="flex-1"
      >
        <template #expanded="{ row }">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t("register.label.username") }}: {{ row.original.username }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t("register.label.phoneNumber") }}:
                {{ row.original.phoneNumber }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t("register.label.address") }}: {{ row.original.address }}
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
    <UModal
      v-model:open="approveModalOpen"
      :title="$t('adminMembers.approveMember')"
      :description="$t('adminMembers.confirmApprovalOfThisMember')"
    >
      <template #body>
        <div class="space-y-4">
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
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="success"
            @click="confirmApprove"
            :loading="isProcessing"
          >
            {{ $t("adminMembers.approveMember") }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Reject Modal -->
    <UModal
      v-model:open="rejectModalOpen"
      :title="$t('adminMembers.rejectMember')"
      :description="$t('adminMembers.confirmRejectionOfThisMember')"
    >
      <template #body>
        <div class="space-y-4">
          <div
            v-if="selectedMember"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <p class="font-medium">{{ selectedMember.fullname }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedMember.email }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              for="reject-reason"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("adminMembers.reasonForRejection") }}
              <span class="text-red-500">*</span>
            </label>
            <UTextarea
              id="reject-reason"
              v-model="rejectReason"
              :placeholder="$t('adminMembers.reasonForRejectionPlaceholder')"
              :rows="4"
              class="w-full"
              required
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="
              () => {
                rejectModalOpen = false;
                rejectReason = '';
              }
            "
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="error"
            @click="confirmReject"
            :loading="isProcessing"
            :disabled="!rejectReason || rejectReason.trim() === ''"
          >
            {{ $t("adminMembers.rejectMember") }}
          </UButton>
        </div>
      </template>
    </UModal>
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

const selectedFilter = ref("allMembers");

const onDropdownSelect = (value: string) => {
  selectedFilter.value = value;
  page.value = 1; // Reset to first page when changing filter
};

const dropdownItems = ref([
  {
    label: "All Members",
    icon: "i-heroicons-users",
    value: "allMembers",
    onSelect: () => onDropdownSelect("allMembers"),
  },
  {
    label: "Active Members",
    icon: "i-heroicons-user-group",
    value: "activeMembers",
    onSelect: () => onDropdownSelect("activeMembers"),
  },
  {
    label: "Pending Members",
    icon: "i-heroicons-clock",
    value: "pendingMembers",
    onSelect: () => onDropdownSelect("pendingMembers"),
  },
  {
    label: "Waiting Approval Members",
    icon: "i-heroicons-clipboard-document-list",
    value: "waitingApprovalMembers",
    onSelect: () => onDropdownSelect("waitingApprovalMembers"),
  },
]);

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UModal = resolveComponent("UModal");

const page = ref(1);
const limit = ref(10);

// Modal state
const approveModalOpen = ref(false);
const rejectModalOpen = ref(false);
const selectedMember = ref<User | null>(null);
const isProcessing = ref(false);
const rejectReason = ref("");

const statusFilter = computed(() => {
  switch (selectedFilter.value) {
    case "activeMembers":
      return "active";
    case "pendingMembers":
      return "pending";
    case "waitingApprovalMembers":
      return "waiting_deposit";
    default:
      return undefined;
  }
});

const {
  users: members,
  total,
  pending,
  refresh,
} = await useUsers({
  role: "member",
  status: statusFilter,
  page,
  limit,
});

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
    rejectReason.value = "";
    rejectModalOpen.value = true;
  }
};

const confirmApprove = async () => {
  if (!selectedMember.value) return;

  isProcessing.value = true;
  try {
    await $fetch(`/api/users/${selectedMember.value.id}/approve`, {
      method: "POST",
    });

    // Show success message
    const toast = useToast();
    toast.add({
      title: $t("adminMembers.memberApproved"),
      description: $t("adminMembers.memberApprovedDescription", {
        fullname: selectedMember.value.fullname,
      }),
      color: "success",
    });

    // Close modal and refresh data
    approveModalOpen.value = false;
    selectedMember.value = null;
    await refresh();
  } catch (error: any) {
    console.error("Error approving member:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: $t("adminMembers.errorApprovingMember", {
        message:
          error.data?.message || $t("adminMembers.failedToApproveMember"),
      }),
      color: "error",
    });
  } finally {
    isProcessing.value = false;
  }
};

const confirmReject = async () => {
  if (!selectedMember.value || !rejectReason.value?.trim()) return;

  isProcessing.value = true;
  try {
    await $fetch(`/api/users/${selectedMember.value.id}/reject`, {
      method: "POST",
      body: {
        reason: rejectReason.value.trim(),
      },
    });

    // Show success message
    const toast = useToast();
    toast.add({
      title: $t("adminMembers.memberRejected"),
      description: $t("adminMembers.memberRejectedDescription", {
        fullname: selectedMember.value.fullname,
      }),
      color: "error",
    });

    // Close modal and refresh data
    rejectModalOpen.value = false;
    selectedMember.value = null;
    rejectReason.value = "";
    await refresh();
  } catch (error: any) {
    console.error("Error rejecting member:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: $t("adminMembers.errorRejectingMember", {
        message: error.data?.message || $t("adminMembers.failedToRejectMember"),
      }),
      color: "error",
    });
  } finally {
    isProcessing.value = false;
  }
};

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
    header: $t("adminMembers.label.fullName"),
    cell: ({ row }) => `${row.getValue("fullname")}`,
  },
  {
    accessorKey: "email",
    header: $t("adminMembers.label.email"),
    cell: ({ row }) => `${row.getValue("email")}`,
  },
  {
    accessorKey: "status",
    header: $t("adminMembers.label.status"),
    cell: ({ row }) => {
      const color = {
        pending: "warning" as const,
        waiting_deposit: "warning" as const,
        active: "success" as const,
        rejected: "error" as const,
        inactive: "neutral" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        $t(`adminMembers.status.${row.getValue("status")}`)
      );
    },
  },
  {
    id: "actions",
    header: $t("common.actions"),
    cell: ({ row }) =>
      row.getValue("status") === "waiting_deposit"
        ? h("div", { class: "flex gap-2" }, [
            h(
              UButton,
              {
                size: "sm",
                color: "success",
                onClick: () => handleApprove(row.original.id),
              },
              () => $t("common.approve")
            ),
            h(
              UButton,
              {
                size: "sm",
                color: "error",
                onClick: () => handleReject(row.original.id),
              },
              () => $t("common.reject")
            ),
          ])
        : null,
  },
];
</script>
