<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Profile
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-gray-600 dark:text-gray-400">Loading profile...</div>
    </div>

    <!-- Error State -->
    <UCard v-else-if="error" class="mb-6">
      <div class="text-center text-red-600 dark:text-red-400">
        <p class="font-semibold mb-2">Failed to load profile</p>
        <p class="text-sm">{{ error }}</p>
        <UButton
          color="primary"
          variant="outline"
          class="mt-4"
          @click="loadUser"
        >
          Retry
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
                @{{ user.username }}
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
              {{ user.roleId === "administrator" ? "Administrator" : "Member" }}
            </UBadge>
            <UBadge
              v-if="user.otpVerified"
              color="success"
              variant="subtle"
              size="lg"
            >
              Verified
            </UBadge>
            <UBadge v-else color="warning" variant="subtle" size="lg">
              Not Verified
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Profile Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <UCard>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Full Name
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.fullname }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Username
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.username }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.email }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Phone Number
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.phoneNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Address
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
            Account Information
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                User ID
              </p>
              <p
                class="text-base font-medium text-gray-900 dark:text-white font-mono"
              >
                {{ user.id }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Status
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ getStatusInfo(user.status).label }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Role</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{
                  user.roleId === "administrator" ? "Administrator" : "Member"
                }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Email Verified
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ user.otpVerified ? "Yes" : "No" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Member Since
              </p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Last Updated
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
  pending: { label: "Pending", color: "warning" },
  active: { label: "Active", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  waiting_deposit: { label: "Waiting Deposit", color: "info" },
  inactive: { label: "Inactive", color: "neutral" },
};

const getStatusInfo = (status: string) => {
  return statusConfig[status] || { label: status, color: "neutral" };
};
</script>
