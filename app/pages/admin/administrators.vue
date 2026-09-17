<template>
  <div class="flex flex-col gap-4">
    <PageHeader
      icon="i-heroicons-briefcase"
      :title="$t('navigation.administratorManagement')"
      :description="$t('navigation.administratorManagementDesc')"
      :breadcrumb="[
        { label: $t('navigation.usersManagement'), icon: 'i-heroicons-user-group' },
        { label: $t('navigation.administratorManagement') },
      ]"
    />
    <UCard>
      <div class="flex items-center justify-between gap-3">
        <UDropdownMenu :items="dropdownItems">
          <UButton icon="i-heroicons-funnel" label="Filter" />
        </UDropdownMenu>
        <UButton
          v-if="userStore.isSuperadministrator"
          icon="i-heroicons-user-plus"
          label="Tambah Administrator"
          @click="createModalOpen = true"
        />
      </div>
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

    <UModal
      v-if="userStore.isSuperadministrator"
      v-model:open="createModalOpen"
      title="Tambah Administrator"
      description="Administrator baru akan langsung aktif. Hanya superadministrator yang dapat membuat akun ini."
    >
      <template #body>
        <UForm id="create-administrator-form" :state="formState" @submit="createAdministrator">
          <div class="space-y-4">
            <UFormField label="Nama lengkap" name="fullname" required>
              <UInput v-model="formState.fullname" class="w-full" required />
            </UFormField>
            <UFormField label="Username" name="username" required>
              <UInput v-model="formState.username" class="w-full" required />
            </UFormField>
            <UFormField label="Email" name="email" required>
              <UInput v-model="formState.email" type="email" class="w-full" required />
            </UFormField>
            <UFormField label="Nomor telepon" name="phoneNumber" required>
              <UInput v-model="formState.phoneNumber" type="tel" class="w-full" required />
            </UFormField>
            <UFormField label="Alamat" name="address" required>
              <UInput v-model="formState.address" class="w-full" required />
            </UFormField>
            <UFormField label="Kata sandi" name="password" required>
              <UInput
                v-model="formState.password"
                type="password"
                autocomplete="new-password"
                class="w-full"
                required
              />
            </UFormField>
            <UFormField label="Konfirmasi kata sandi" name="passwordConfirmation" required>
              <UInput
                v-model="formState.passwordConfirmation"
                type="password"
                autocomplete="new-password"
                class="w-full"
                required
              />
            </UFormField>
          </div>
        </UForm>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="closeCreateModal">
            Batal
          </UButton>
          <UButton
            type="submit"
            form="create-administrator-form"
            :loading="isCreating"
          >
            Tambah Administrator
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { CreateAdministratorRequest } from "~~/types/managed-administrator";
import type { User } from "~~/types/user";

definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator", "superadministrator"], // Only administrators can access this page
});

const selectedFilter = ref("administrator");
const userStore = useUserStore();
const toast = useToast();
const createModalOpen = ref(false);
const isCreating = ref(false);
const emptyForm = (): CreateAdministratorRequest & { passwordConfirmation: string } => ({
  fullname: "",
  username: "",
  email: "",
  phoneNumber: "",
  address: "",
  password: "",
  passwordConfirmation: "",
});
const formState = ref(emptyForm());

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

const closeCreateModal = () => {
  createModalOpen.value = false;
  formState.value = emptyForm();
};

const createAdministrator = async () => {
  if (!userStore.isSuperadministrator) {
    return;
  }

  if (formState.value.password !== formState.value.passwordConfirmation) {
    toast.add({
      title: "Gagal membuat administrator",
      description: "Konfirmasi kata sandi tidak cocok.",
      color: "error",
    });
    return;
  }

  isCreating.value = true;
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: {
        fullname: formState.value.fullname,
        username: formState.value.username,
        email: formState.value.email,
        phoneNumber: formState.value.phoneNumber,
        address: formState.value.address,
        password: formState.value.password,
      },
    });
    toast.add({
      title: "Administrator berhasil dibuat",
      description: "Akun administrator baru sudah aktif.",
      color: "success",
    });
    closeCreateModal();
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Gagal membuat administrator",
      description: error.data?.message ?? "Silakan periksa data dan coba lagi.",
      color: "error",
    });
  } finally {
    isCreating.value = false;
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
        active: "success" as const,
        rejected: "error" as const,
        inactive: "neutral" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "solid", color }, () =>
        $t(`adminMembers.status.${row.getValue("status")}`)
      );
    },
  },
];
</script>
