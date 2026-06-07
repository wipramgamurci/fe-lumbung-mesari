<template>
  <UModal v-model:open="open" :title="$t('profile.updateProfileTitle')">
    <template #body>
      <UForm id="update-profile-form" :state="formState" @submit="handleSubmit">
        <div class="space-y-4">
          <UFormField :label="$t('register.label.username')" name="username">
            <UInput
              v-model="formState.username"
              :placeholder="$t('register.placeholder.username')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.fullname')" name="fullname">
            <UInput
              v-model="formState.fullname"
              :placeholder="$t('register.placeholder.fullname')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="$t('register.label.phoneNumber')"
            name="phoneNumber"
          >
            <UInput
              v-model="formState.phoneNumber"
              type="tel"
              :placeholder="$t('register.placeholder.phoneNumber')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('register.label.address')" name="address">
            <UInput
              v-model="formState.address"
              :placeholder="$t('register.placeholder.address')"
              required
              class="w-full"
            />
          </UFormField>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="open = false">
          {{ $t("common.cancel") }}
        </UButton>
        <UButton
          type="submit"
          form="update-profile-form"
          color="primary"
          :loading="isSubmitting"
        >
          {{ $t("common.update") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { UpdateUserRequest, User } from "~~/types/user";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  user: User | null;
}>();

const formState = ref<UpdateUserRequest>({
  username: "",
  fullname: "",
  phoneNumber: "",
  address: "",
});

watch(
  () => open.value,
  (isOpen) => {
    if (!isOpen || !props.user) return;

    formState.value = {
      username: props.user.username,
      fullname: props.user.fullname,
      phoneNumber: props.user.phoneNumber,
      address: props.user.address,
    };
  },
);

const userStore = useUserStore();
const toast = useToast();
const isSubmitting = ref(false);

const handleSubmit = async () => {
  const { username, fullname, phoneNumber, address } = formState.value;

  if (
    !username?.trim() ||
    !fullname?.trim() ||
    !phoneNumber?.trim() ||
    !address?.trim()
  ) {
    toast.add({
      title: $t("common.error.title"),
      description: $t("common.error.required"),
      color: "error",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    await userStore.updateUser({
      username: username.trim(),
      fullname: fullname.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    });

    toast.add({
      title: $t("profile.updateProfileSuccessTitle"),
      description: $t("profile.updateProfileSuccess"),
      color: "success",
    });
    open.value = false;
  } catch (error: any) {
    toast.add({
      title: $t("common.error.title"),
      description: error.data?.message || $t("profile.updateProfileFailed"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
