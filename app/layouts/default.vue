<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Topbar -->
    <div
      class="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-4 py-3 h-14"
    >
      <!-- App Title/Logo and Mobile Toggle -->
      <div class="flex items-center space-x-2">
        <template v-if="isUserReady">
          <UDropdownMenu
            :items="navItems"
            :ui="{
              content: 'w-48',
            }"
          >
            <UButton
              class="lg:hidden"
              icon="i-heroicons-bars-3"
              color="neutral"
              variant="ghost"
            />
          </UDropdownMenu>
        </template>
        <template v-else>
          <USkeleton class="h-10 w-10 rounded-md lg:hidden" />
        </template>
        <span class="font-bold text-lg text-gray-900 dark:text-white"
          >Lumbung Mesari</span
        >
      </div>

      <!-- User Menu -->
      <UPopover>
        <button
          class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <template v-if="isUserReady">
            <UAvatar :alt="userDisplayName" size="sm" />
            <span
              class="hidden sm:block font-medium text-gray-900 dark:text-white"
            >
              {{ userDisplayName }}
            </span>
          </template>
          <template v-else>
            <USkeleton class="h-8 w-8 rounded-full" />
            <USkeleton class="hidden sm:block h-4 w-24 rounded" />
          </template>
        </button>

        <template #content>
          <div class="p-4 space-y-2">
            <UButton
              label="Profile"
              variant="ghost"
              color="neutral"
              block
              to="/profile"
            />
            <UButton
              label="Logout"
              variant="ghost"
              color="neutral"
              block
              @click="logout"
            />
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Sidebar (visible only on desktop, fixed) -->
    <div
      class="hidden lg:block fixed left-0 top-14 w-48 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto z-10"
    >
      <UNavigationMenu
        v-if="isUserReady"
        :items="navItems"
        orientation="vertical"
        class="h-full"
      />
      <div v-else class="space-y-3">
        <USkeleton v-for="n in 5" :key="n" class="h-10 w-full rounded-md" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 pt-14 lg:pl-48 relative z-0">
      <div class="p-8 min-w-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ADMIN_NAV_ITEMS, BASE_NAV_ITEMS } from "~/constants/navigation";

const { logout } = useAuth();
const userStore = useUserStore();
const currentUser = computed(() => userStore.user);
const hasMounted = ref(false);
onMounted(() => {
  hasMounted.value = true;
});
const isUserReady = computed(() => hasMounted.value && userStore.isInitialized);
const userDisplayName = computed(() => currentUser.value?.fullname || "User");

const navItems = computed(() => {
  if (userStore.isAdmin) {
    return [...BASE_NAV_ITEMS, ...ADMIN_NAV_ITEMS];
  }
  return BASE_NAV_ITEMS;
});
</script>
