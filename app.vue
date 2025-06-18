<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app setup can go here
useHead({
  title: 'Lumbung Mesari',
  meta: [
    { name: 'description', content: 'Lumbung Mesari - Cooperative Savings and Loans' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
});
</script>
