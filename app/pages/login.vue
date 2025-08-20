<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Lumbung Mesari</h2>
      <p class="text-gray-600">Sign in to your account</p>
    </div>

    <!-- Login Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleLogin">
        <div class="space-y-6">
          <UFormField label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="isLoading"
          >
            Sign In
          </UButton>
        </div>
      </UForm>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            Register here
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { UCard, UForm, UFormField, UInput, UButton } from '#components'

definePageMeta({
  layout: 'auth'
})

const formState = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // TODO: Connect to /auth/login API
    console.log('Login attempt:', formState.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Handle successful login
    // navigateTo('/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
