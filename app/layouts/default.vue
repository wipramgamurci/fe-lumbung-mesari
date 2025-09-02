<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Topbar -->
    <div
      class="fixed top-0 left-0 right-0 z-10 bg-white shadow-md flex items-center justify-between px-4 py-3"
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
        <span class="font-bold text-lg text-gray-900">Lumbung Mesari</span>
      </div>

      <!-- User Menu -->
      <UPopover>
        <UButton
          label="User"
          icon="i-heroicons-user-circle"
          color="gray"
          variant="ghost"
        />

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
              @click="handleLogout"
            />
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-1 pt-14 md:pt-12 md:flex-row">
      <!-- Sidebar (visible only on desktop) -->
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="hidden lg:block w-48 bg-white shadow-lg p-4"
      />

      <!-- Main Content -->
      <div class="flex-1 p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { UNavigationMenu, UButton, UPopover } from "#components";

const handleLogout = () => {
  useState("authToken", () => null);
  navigateTo("/login");
};

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
