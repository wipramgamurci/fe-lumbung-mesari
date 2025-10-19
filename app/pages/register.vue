<template>
  <div>
    <!-- Logo/Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Lumbung Mesari
      </h2>
      <p class="text-gray-600 dark:text-gray-300">Create your account</p>
    </div>

    <!-- Registration Form -->
    <UCard class="mt-8">
      <UForm :state="formState" @submit="handleRegister">
        <div class="space-y-6">
          <!-- Personal Information -->
          <UFormField label="Username" name="username">
            <UInput
              v-model="formState.username"
              placeholder="Enter username"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Full Name" name="fullname">
            <UInput
              v-model="formState.fullname"
              placeholder="Enter full name"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Phone Number" name="phone_number">
            <UInput
              v-model="formState.phone_number"
              type="tel"
              placeholder="Enter phone number"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Address" name="address">
            <UInput
              v-model="formState.address"
              placeholder="Enter address"
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

          <UFormField label="Confirm Password" name="passwordConfirmation">
            <UInput
              v-model="formState.passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              required
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" color="primary" block :loading="isLoading">
            Create Account
          </UButton>
        </div>
      </UForm>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const formState = ref({
  username: "",
  fullname: "",
  email: "",
  phone_number: "",
  address: "",
  password: "",
  passwordConfirmation: "",
});

const isLoading = ref(false);

const handleRegister = async () => {
  // Validate password confirmation
  if (formState.value.password !== formState.value.passwordConfirmation) {
    alert("Passwords do not match");
    return;
  }

  // Basic validation
  if (
    !formState.value.email ||
    !formState.value.password ||
    !formState.value.fullname ||
    !formState.value.username
  ) {
    alert("Please fill in all required fields");
    return;
  }

  isLoading.value = true;

  try {
    // Call the external API through our server proxy
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: formState.value.email,
        password: formState.value.password,
        passwordConfirmation: formState.value.passwordConfirmation,
        fullname: formState.value.fullname,
        username: formState.value.username,
        phone_number: formState.value.phone_number,
        address: formState.value.address,
      },
    });

    // Handle successful registration
    console.log("Registration successful:", response);

    // Store tokens if available
    if (response.token) {
      // Store access token in localStorage
      localStorage.setItem("accessToken", response.token.access_token);
      localStorage.setItem("refreshToken", response.token.refresh_token);
    }

    // Show success message
    alert(response.message || "Registration successful!");

    // Navigate to OTP verification page
    navigateTo("/verify-otp");
  } catch (error) {
    console.error("Registration error:", error.data);
    alert(error.data.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
