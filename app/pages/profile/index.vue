<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t("common.profile") }}
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-gray-600 dark:text-gray-400">
        {{ $t("profile.loadingProfile") }}
      </div>
    </div>

    <!-- Error State -->
    <UCard v-else-if="error" class="mb-6">
      <div class="text-center text-red-600 dark:text-red-400">
        <p class="font-semibold mb-2">
          {{ $t("profile.failedToLoadProfile") }}
        </p>
        <p class="text-sm">{{ error }}</p>
        <UButton
          color="primary"
          variant="outline"
          class="mt-4"
          @click="loadUser"
        >
          {{ $t("profile.retry") }}
        </UButton>
      </div>
    </UCard>

    <!-- Profile Content -->
    <div v-else-if="user" class="space-y-6">
      <!-- Profile Header Card -->
      <UCard>
        <div class="space-y-4">
          <!-- User Name with Avatar -->
          <div class="flex items-center gap-4">
            <UAvatar :alt="user.fullname" size="3xl" />
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ user.fullname }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                {{ user.username }}
              </p>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex items-center gap-3 flex-wrap">
            <UBadge
              :color="getStatusInfo(user.status).color"
              variant="subtle"
              size="lg"
            >
              {{ getStatusInfo(user.status).label }}
            </UBadge>
            <UBadge
              :color="user.roleId === 'administrator' ? 'secondary' : 'primary'"
              variant="subtle"
              size="lg"
            >
              {{
                user.roleId === "administrator"
                  ? $t("profile.role.administrator")
                  : $t("profile.role.member")
              }}
            </UBadge>
            <UBadge
              v-if="user.otpVerified"
              color="success"
              variant="subtle"
              size="lg"
            >
              {{ $t("profile.verified") }}
            </UBadge>
            <UBadge v-else color="warning" variant="subtle" size="lg">
              {{ $t("profile.notVerified") }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <UCard>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("profile.personalInformation") }}
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("register.label.fullname") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.fullname }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("register.label.username") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.username }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("register.label.email") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.email }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("register.label.phoneNumber") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.phoneNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("register.label.address") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.address }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Account Information -->
        <UCard>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("profile.accountInformation") }}
          </h3>
          <div class="space-y-4">
            <!-- <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  User ID
                </p>
                <p
                  class="text-base font-medium text-gray-900 dark:text-white font-mono"
                >
                  {{ user.id }}
                </p>
              </div> -->
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("profile.status") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ getStatusInfo(user.status).label }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Role</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{
                  user.roleId === "administrator"
                    ? $t("profile.role.administrator")
                    : $t("profile.role.member")
                }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("profile.emailVerified") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.otpVerified ? $t("common.yes") : $t("common.no") }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("profile.memberSince") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ $t("profile.lastUpdated") }}
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ formatDate(user.updatedAt) }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~~/utils/formatters";

definePageMeta({
  layout: "default",
});

const userStore = useUserStore();
const isLoading = ref(true);
const error = ref<string | null>(null);
const user = computed(() => userStore.user);

// Load user data on mount
onMounted(async () => {
  await loadUser();
});

const loadUser = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // If user is already loaded, no need to fetch
    if (!userStore.user) {
      await userStore.fetchUser();
    }
  } catch (err: any) {
    console.error("Failed to load user:", err);
    error.value = err.data?.message || "Failed to load profile information";
  } finally {
    isLoading.value = false;
  }
};

type BadgeColor =
  | "error"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "neutral";

const statusConfig: Record<string, { label: string; color: BadgeColor }> = {
  pending: { label: $t("adminMembers.status.pending"), color: "warning" },
  active: { label: $t("adminMembers.status.active"), color: "success" },
  rejected: { label: $t("adminMembers.status.rejected"), color: "error" },
  waiting_deposit: {
    label: $t("adminMembers.status.waiting_deposit"),
    color: "info",
  },
  inactive: { label: $t("adminMembers.status.inactive"), color: "neutral" },
};

const getStatusInfo = (status: string) => {
  return statusConfig[status] || { label: status, color: "neutral" };
};
</script>
