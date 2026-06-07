<template>
  <UModal
    v-model:open="open"
    :title="$t('profile.resetPasswordConfirmTitle')"
    :description="
      email ? $t('profile.resetPasswordConfirmDescription', { email }) : ''
    "
  >
    <template #body>
      <div v-if="!isSuccess">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("profile.resetPasswordConfirmBody") }}
        </p>
      </div>
      <div v-if="isSuccess" class="space-y-2">
        <UAlert
          color="success"
          variant="soft"
          :title="$t('profile.resetPasswordCheckEmail')"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          v-if="!isSuccess"
          color="neutral"
          variant="outline"
          @click="open = false"
        >
          {{ $t("common.cancel") }}
        </UButton>
        <UButton
          v-if="!isSuccess"
          color="primary"
          :loading="isSubmitting"
          @click="sendResetPasswordEmail"
        >
          {{ $t("profile.resetPasswordConfirmSend") }}
        </UButton>
        <UButton v-else color="primary" @click="close">
          {{ $t("common.close") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  email: string | undefined;
}>();

const toast = useToast();
const isSubmitting = ref(false);
const isSuccess = ref(false);

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      isSuccess.value = false;
    }
  },
);

const sendResetPasswordEmail = async () => {
  if (!props.email) return;

  isSubmitting.value = true;
  isSuccess.value = false;

  try {
    await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: { email: props.email },
    });
    isSuccess.value = true;
  } catch (err: any) {
    toast.add({
      title: $t("common.error.title"),
      description: err?.data?.message || err?.message || "Unknown error",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  open.value = false;
  isSuccess.value = false;
};
</script>
