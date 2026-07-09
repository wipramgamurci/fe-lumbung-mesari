<template>
  <div class="min-h-screen bg-muted dark:bg-default flex flex-col">
    <!-- Topbar -->
    <header
      class="fixed top-0 left-0 right-0 z-20 bg-default border-b border-default"
    >
      <div class="flex items-center gap-3 px-4 lg:px-6 h-16">
        <!-- Mobile menu + Brand -->
        <div class="flex items-center gap-3 shrink-0">
          <template v-if="isUserReady">
            <UDropdownMenu
              :items="navItems"
              :ui="{ content: 'w-auto' }"
            >
              <UButton
                class="xl:hidden"
                icon="i-heroicons-bars-3"
                color="neutral"
                variant="ghost"
              />
            </UDropdownMenu>
          </template>
          <template v-else>
            <USkeleton class="h-9 w-9 rounded-md xl:hidden" />
          </template>

          <NuxtLink to="/" class="flex items-center gap-2.5">
            <span
              class="flex size-9 items-center justify-center rounded-xl bg-primary text-inverted font-bold text-lg shadow-sm"
            >
              {{ brandInitial }}
            </span>
            <span
              class="flex flex-col leading-tight font-bold text-highlighted text-sm"
            >
              <span v-for="word in brandWords" :key="word">{{ word }}</span>
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden xl:flex flex-1 justify-center min-w-0">
          <UNavigationMenu
            v-if="isUserReady"
            :items="navItems"
            color="primary"
            orientation="horizontal"
            :ui="{
              link: 'aria-[current=page]:before:bg-primary/10 data-[state=open]:before:bg-primary/10 rounded-lg',
            }"
          />
          <div v-else class="flex gap-2">
            <USkeleton v-for="n in 5" :key="n" class="h-9 w-24 rounded-lg" />
          </div>
        </div>

        <!-- Actions: theme toggle + user -->
        <div class="flex items-center gap-1.5 shrink-0 ms-auto xl:ms-0">
          <UColorModeButton />

          <div class="h-6 w-px bg-border mx-1 hidden sm:block" />

          <UPopover>
            <button
              class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-elevated/60 transition-colors"
            >
              <template v-if="isUserReady">
                <UAvatar
                  :alt="userFullname"
                  size="sm"
                  :ui="{ root: 'bg-elevated text-highlighted ring ring-default' }"
                />
                <span class="hidden sm:flex flex-col items-start leading-tight">
                  <span class="font-semibold text-sm text-highlighted truncate max-w-32">
                    {{ userUsername }}
                  </span>
                  <span class="text-xs text-muted truncate max-w-32">
                    {{ userRole }}
                  </span>
                </span>
              </template>
              <template v-else>
                <USkeleton class="h-8 w-8 rounded-full" />
                <USkeleton class="hidden sm:block h-4 w-24 rounded" />
              </template>
            </button>

            <template #content>
              <div class="p-2 w-44 space-y-1">
                <UButton
                  :label="$t('common.profile')"
                  icon="i-heroicons-user"
                  variant="ghost"
                  color="neutral"
                  block
                  class="justify-start"
                  to="/profile"
                />
                <UButton
                  :label="$t('common.signOut')"
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghost"
                  color="neutral"
                  block
                  class="justify-start"
                  @click="logout"
                />
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 pt-16 relative z-0">
      <div class="p-8 min-w-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getAdminNavItems,
  getBaseNavItems,
  getMemberNavItems,
} from "~/constants/navigation";

const { logout } = useAuth();
const { t } = useI18n(); // Call useI18n() at top level of setup
const userStore = useUserStore();
const currentUser = computed(() => userStore.user);
const hasMounted = ref(false);
onMounted(() => {
  hasMounted.value = true;
});
const isUserReady = computed(() => hasMounted.value && userStore.isInitialized);
const userFullname = computed(() => currentUser.value?.fullname || "User");
const userUsername = computed(() => currentUser.value?.username || "User");
const userRole = computed(() => {
  const roleId = currentUser.value?.roleId;
  return roleId ? roleId.charAt(0).toUpperCase() + roleId.slice(1) : "";
});

const brandWords = computed(() => t("app.title").split(" "));
const brandInitial = computed(() => t("app.title").charAt(0));

const navItems = computed(() => {
  if (userStore.isAdmin || userStore.isSuperadministrator) {
    return [...getBaseNavItems(t), ...getAdminNavItems(t)];
  }
  if (userStore.isMember) {
    return [...getBaseNavItems(t), ...getMemberNavItems(t)];
  }
  return getBaseNavItems(t);
});
</script>
