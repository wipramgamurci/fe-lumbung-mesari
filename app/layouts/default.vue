<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">Lumbung Mesari</h1>
      </div>
      
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <NuxtLink 
            to="/dashboard" 
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary-100 text-primary-700"
          >
            <UIcon name="i-heroicons-home" class="w-5 h-5 mr-3" />
            Dashboard
          </NuxtLink>
          
          <NuxtLink 
            to="/admin/members" 
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary-100 text-primary-700"
          >
            <UIcon name="i-heroicons-users" class="w-5 h-5 mr-3" />
            Admin Members
          </NuxtLink>
        </div>
        
        <div class="mt-8 pt-8 border-t border-gray-200">
          <button 
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="ml-64">
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { UIcon } from '#components'

const handleLogout = () => {
  useState('authToken', () => null)
  navigateTo('/login')
}
</script>
