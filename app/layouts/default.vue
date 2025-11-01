<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Topbar -->
    <div
      class="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-4 py-3 h-14"
    >
      <!-- App Title/Logo and Mobile Toggle -->
      <div class="flex items-center space-x-2">
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
        <span class="font-bold text-lg text-gray-900 dark:text-white"
          >Lumbung Mesari</span
        >
      </div>

      <!-- User Menu -->
      <UPopover>
        <button
          class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <UAvatar v-if="currentUser" :alt="currentUser.fullname" size="sm" />
          <UIcon
            v-else
            name="i-heroicons-user-circle"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
          />
          <span
            v-if="currentUser"
            class="hidden sm:block font-medium text-gray-900 dark:text-white"
          >
            {{ currentUser.fullname }}
          </span>
          <span
            v-else
            class="hidden sm:block font-medium text-gray-900 dark:text-white"
          >
            User
          </span>
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
    <UNavigationMenu
      :items="navItems"
      orientation="vertical"
      class="hidden lg:block fixed left-0 top-14 w-48 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto z-10"
    />

    <!-- Main Content Area -->
    <div class="flex-1 pt-14 lg:pl-48 relative z-0">
      <div class="p-8 min-w-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const { logout, currentUser } = useAuth();

const navItems = ref([
  {
    icon: "i-heroicons-home",
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: "i-heroicons-users",
    label: "Admin Members",
    to: "/admin/members",
  },
  {
    icon: "i-heroicons-banknotes",
    label: "My Loans",
    to: "/loans",
  },
  {
    icon: "i-heroicons-clipboard-document-list",
    label: "Loan Management",
    to: "/admin/loans",
  },
  // Add more items like 'Loans' here as needed
]);
</script>
