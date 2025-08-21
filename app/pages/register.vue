<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Lumbung Mesari</h2>
      <p class="text-gray-600">Create your account</p>
    </div>

    <!-- Registration Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleRegister">
        <div class="space-y-6">
          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="First Name" name="firstName">
              <UInput
                v-model="formState.firstName"
                placeholder="Enter first name"
                required
                class="w-full"
              />
            </UFormField>

            <UFormField label="Last Name" name="lastName">
              <UInput
                v-model="formState.lastName"
                placeholder="Enter last name"
                required
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Phone Number" name="phone">
            <UInput
              v-model="formState.phone"
              type="tel"
              placeholder="Enter phone number"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="ID Card Number" name="idNumber">
            <UInput
              v-model="formState.idNumber"
              placeholder="Enter ID card number"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Create a password"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="formState.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="isLoading"
          >
            Create Account
          </UButton>
        </div>
      </UForm>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { UCard, UForm, UFormField, UInput, UButton, UIcon } from '#components'

definePageMeta({
  layout: 'auth'
})

const formState = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  idNumber: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

const handleRegister = async () => {
  if (formState.value.password !== formState.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: formState.value.firstName,
        lastName: formState.value.lastName,
        email: formState.value.email,
        phone: formState.value.phone,
        idNumber: formState.value.idNumber,
        password: formState.value.password
      }
    })
    
    // Navigate on success
    navigateTo('/login')
  } catch (error) {
    console.error('Registration error:', error)
    alert('Registration failed: ' + (error.data?.message || 'Please try again'))
  } finally {
    isLoading.value = false
  }
}
</script>
