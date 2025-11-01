<template>
  <UApp>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const { initAuth } = useAuth();

// Initialize auth when app starts
onMounted(async () => {
  await initAuth();
});
</script>
