# 🗂️ Project Structure - Lumbung Mesari Frontend

This document outlines the directory structure, file naming conventions, and organizational patterns for the Lumbung Mesari frontend application built with Nuxt 3.

---

## 1. Directory Structure

```
/ (project root)
├── /assets            # Static assets like images, fonts
├── /components        # Reusable Vue components
│   ├── BaseCard.vue
│   ├── FormField.vue
│   ├── StatusBadge.vue
│   └── ToastNotification.vue
├── /composables       # Shared logic using the Composition API
│   ├── useAuth.ts
│   ├── useSavings.ts
│   └── useLoans.ts
├── /layouts           # Page layouts
│   ├── default.vue     # Main layout
│   └── auth.vue        # Layout for login/register pages
├── /middleware        # Navigation guards (e.g., auth checks)
│   └── auth.ts
├── /pages             # Page components mapped to routes
│   ├── index.vue       # Redirect or landing
│   ├── login.vue
│   ├── register.vue
│   ├── dashboard.vue
│   ├── profile.vue
│   ├── savings.vue
│   ├── loans.vue
│   └── /admin
│       ├── members.vue
│       └── loans.vue
├── /public            # Static files (robots.txt, favicon, etc.)
├── /stores            # Pinia stores (if any needed)
│   └── auth.ts
├── /types             # TypeScript interfaces and models
│   ├── user.ts
│   ├── loan.ts
│   └── savings.ts
├── nuxt.config.ts     # Nuxt configuration
└── tsconfig.json      # TypeScript configuration
```

---

## 2. Naming Conventions

- Use `PascalCase` for Vue component filenames (e.g., `BaseCard.vue`)
    
- Use `camelCase` for composables and stores (e.g., `useAuth.ts`, `auth.ts`)
    
- Use `kebab-case` for route-based Vue files (e.g., `dashboard.vue`)
    
- Group admin pages under `/pages/admin/`
    

---

## 3. File Standards

- All Vue components are in `<script setup lang="ts">` format
    
- Use `<template>` and `<style scoped>` for styling
    
- All styles use Tailwind CSS utility classes
    
- Ensure composables are stateless and reusable
    
- Layouts should include slots and minimal logic
    

---

## 4. Store and State Management

- Use Pinia for global state (authentication, user info, etc.)
    
- Auth state managed in `stores/auth.ts`
    
- Other stores to be added only as needed
    

---

## 5. Middleware

- Auth protection via `/middleware/auth.ts`
    
- Automatically redirects to `/login` if JWT token is not valid
    

---

## 6. API Client

- Axios instance configured globally with JWT in headers
    
- Use composables for all API interactions
    
- No direct API calls inside Vue components
    

---

## 7. Testing (Optional)

- Unit tests placed in `__tests__` folder next to the components
    
- End-to-end tests (if any) placed in `/e2e/`
    

---

This structure ensures consistency, scalability, and makes collaboration with AI agents and teammates more efficient.