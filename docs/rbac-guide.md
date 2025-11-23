# 🔐 Role-Based Access Control (RBAC) Guide

This document explains how Role-Based Access Control (RBAC) is implemented in the Lumbung Mesari frontend application.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [System Flow](#system-flow)
- [User Roles](#user-roles)
- [Implementation Components](#implementation-components)
- [Usage Guide](#usage-guide)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Overview

Role-Based Access Control (RBAC) is a security mechanism that restricts access to resources based on user roles. In this application, we have two primary roles:

- **Member** (`member`) - Regular users who can access member-specific features
- **Administrator** (`administrator`) - Admin users who have access to administrative features

The RBAC system is implemented at multiple levels:

1. **Route Protection** - Middleware-based protection for pages
2. **Component-Level** - Conditional rendering based on roles
3. **Programmatic Checks** - Runtime role validation in code

---

## Architecture

The RBAC system consists of three main components:

```
┌─────────────────┐
│   User Store    │  ← Stores user data and role getters
└────────┬────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Middleware │  │  Composable  │  │   Pages      │
│   (role.ts)  │  │  (useRole)   │  │   (meta)     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Component Flow

1. **User Store** (`app/stores/useUser.ts`)

   - Stores the current user's data including their `roleId`
   - Provides computed getters for role checking

2. **Role Middleware** (`app/middleware/role.ts`)

   - Runs before page navigation
   - Checks if user has required roles from route meta
   - Redirects to `/error/403` page if unauthorized

3. **403 Error Page** (`app/pages/error/403.vue`)

   - Custom error page for unauthorized access
   - Shows user-friendly message with current role
   - Provides navigation options (Dashboard, Go Back)

4. **Role Composable** (`app/composables/useRole.ts`)
   - Provides reactive role checking functions
   - Used in components for conditional rendering
   - Returns computed values that update when user changes

---

## System Flow

This section explains the complete flow of how RBAC works in the application, from user login to accessing protected routes.

### 1. Authentication & User Loading Flow

```
┌─────────────┐
│ User Login   │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/auth/login│
│ Sets httpOnly cookie│
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────┐
│ Plugin: 01.userStore.ts  │
│ Fetches user from /api/me│
│ Stores user in Pinia     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ User Store Populated     │
│ - user.roleId available  │
│ - isAdmin computed       │
│ - isMember computed      │
└──────────────────────────┘
```

**Step-by-step:**

1. **User logs in** via `/login` page

   - Credentials sent to `/api/auth/login`
   - Server sets `accessToken` as httpOnly cookie
   - User redirected to dashboard

2. **User Store Plugin** (`app/plugins/01.userStore.ts`) runs

   - Automatically fetches user data from `/api/me`
   - Stores user object in Pinia store
   - Sets `isInitialized = true`

3. **User data available**
   - `userStore.user.roleId` contains user's role
   - Getters (`isAdmin`, `isMember`) are now reactive
   - Role composable can be used in components

### 2. Route Access Flow (Protected Page)

```
┌──────────────────────┐
│ User navigates to    │
│ /admin/members       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ auth.global.ts middleware    │
│ Checks: accessToken cookie?  │
└──────────┬───────────────────┘
           │
           ├─ No token → Redirect to /login
           │
           └─ Has token → Continue
                      │
                      ▼
┌──────────────────────────────┐
│ role.ts middleware           │
│ Reads: to.meta.roles         │
└──────────┬───────────────────┘
           │
           ├─ No roles required → Allow access
           │
           └─ Roles required
                      │
                      ▼
┌──────────────────────────────┐
│ Check user store             │
│ - User loaded?               │
│ - If not, fetch from /api/me│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Compare roles                │
│ userRole vs requiredRoles    │
└──────────┬───────────────────┘
           │
           ├─ Match → Allow access
           │
           └─ No match → Redirect to /error/403
```

**Detailed flow:**

1. **User clicks link** to `/admin/members`

2. **`auth.global.ts` middleware** runs first (global middleware)

   - Checks for `accessToken` cookie
   - If no token → redirects to `/login`
   - If token exists → continues to next middleware

3. **`role.ts` middleware** runs (page-specific middleware)

   - Reads `to.meta.roles` from page definition
   - If no roles required → allows access
   - If roles required:
     - Checks if user is loaded in store
     - If not loaded (server-side), fetches user from `/api/me`
     - Compares `userStore.userRole` with `requiredRoles`
     - If match → allows access
     - If no match → redirects to `/error/403` page

4. **Page renders** (if authorized)
   - Component can use `useRole()` composable
   - Conditional rendering based on role

### 3. Component Rendering Flow

```
┌──────────────────────┐
│ Component Mounts     │
│ (e.g., Dashboard.vue)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ useRole() composable called  │
│ Returns reactive getters     │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Reads from userStore         │
│ - isAdmin computed           │
│ - isMember computed          │
│ - hasRole() function         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Template renders             │
│ v-if="isAdmin" → Show/Hide   │
│ v-if="hasRole('admin')"      │
└──────────────────────────────┘
```

**Example flow:**

```vue
<template>
  <!-- Component renders -->
  <div>
    <!-- This checks isAdmin.value reactively -->
    <UButton v-if="isAdmin">Admin Action</UButton>

    <!-- This checks hasRole('administrator') -->
    <div v-if="hasRole('administrator')">Admin Content</div>
  </div>
</template>

<script setup>
// Composable reads from userStore
const { isAdmin, hasRole } = useRole();
// isAdmin is a computed ref that updates when user changes
</script>
```

### 4. Navigation Menu Flow

```
┌──────────────────────┐
│ Layout renders       │
│ (default.vue)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ useRole() composable         │
│ const { isAdmin } = useRole()│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Computed navItems            │
│ if (isAdmin.value) {         │
│   return [...base, ...admin] │
│ } else {                     │
│   return base                │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Menu renders                 │
│ - Members see: Dashboard,    │
│   My Loans                   │
│ - Admins see: Dashboard,    │
│   My Loans, Member Mgmt,     │
│   Admin Mgmt, Loan Mgmt      │
└──────────────────────────────┘
```

### 5. Complete Request Flow (Server-Side)

```
┌──────────────────────┐
│ User makes request   │
│ (e.g., GET /admin/*) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ Server receives request      │
│ - Reads accessToken cookie   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ auth.global.ts (SSR)         │
│ - Validates token            │
│ - If invalid → redirect      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Plugin: 01.userStore.ts     │
│ - Fetches user from /api/me │
│ - Populates store            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ role.ts middleware (SSR)    │
│ - Checks user.roleId        │
│ - Validates against meta.roles│
└──────────┬───────────────────┘
           │
           ├─ Authorized → Render page
           │
           └─ Unauthorized → Redirect to /error/403
```

### 6. Client-Side Navigation Flow

```
┌──────────────────────┐
│ User clicks link     │
│ (Client-side)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ Nuxt Router intercepts      │
│ Before navigation            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ role.ts middleware runs      │
│ - User already in store      │
│ - Quick role check           │
└──────────┬───────────────────┘
           │
           ├─ Authorized → Navigate
           │
           └─ Unauthorized → Block navigation
                      │
                      ▼
┌──────────────────────────────┐
│ Show error or redirect       │
└──────────────────────────────┘
```

### Flow Summary

**Initial Load (SSR):**

1. Server checks authentication cookie
2. Plugin fetches user data
3. Middleware validates role
4. Page renders with appropriate content

**Client Navigation:**

1. Router intercepts navigation
2. Middleware checks role (user already in store)
3. Allows or blocks navigation
4. Updates UI reactively

**Component Updates:**

1. Composable provides reactive getters
2. Template conditionally renders
3. Updates automatically when user changes

### Key Points

- **Server-Side First**: Authentication and role checks happen on server during SSR
- **Client-Side Enhancement**: Client-side checks provide instant feedback and prevent unnecessary navigation
- **Reactive Updates**: All role checks are reactive and update when user data changes
- **Layered Protection**: Multiple layers (middleware, composable, server) ensure security

---

## User Roles

### Role Types

```typescript
type UserRole = "member" | "administrator";
```

### Role Definitions

| Role            | Description  | Access Level                                                 |
| --------------- | ------------ | ------------------------------------------------------------ |
| `member`        | Regular user | Can access member-specific pages (dashboard, loans, profile) |
| `administrator` | Admin user   | Can access all pages including admin management pages        |

### User Data Structure

The user object contains a `roleId` field:

```typescript
interface User {
  id: string;
  email: string;
  fullname: string;
  // ... other fields
  roleId: "member" | "administrator";
}
```

---

## Implementation Components

### 1. User Store (`app/stores/useUser.ts`)

The user store provides role-related getters:

```typescript
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isInitialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.user?.roleId === "administrator",
    isMember: (state) => state.user?.roleId === "member",
    hasRole: (state) => (role: "member" | "administrator") => {
      return state.user?.roleId === role;
    },
    userRole: (state) => state.user?.roleId || null,
  },
});
```

**Available Getters:**

- `isAdmin` - Boolean: true if user is administrator
- `isMember` - Boolean: true if user is member
- `hasRole(role)` - Function: checks if user has specific role
- `userRole` - String | null: returns current user's role

### 2. Role Middleware (`app/middleware/role.ts`)

The middleware protects routes based on required roles defined in page meta:

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();

  // Get required roles from route meta
  const requiredRoles = to.meta.roles as
    | ("member" | "administrator")[]
    | undefined;

  // Check role and block if unauthorized
  // ...
});
```

**How it works:**

1. Reads `roles` from route meta
2. Fetches user data if not loaded (server-side)
3. Checks if user has one of the required roles
4. Redirects to `/error/403` page if unauthorized

### 3. 403 Error Page (`app/pages/error/403.vue`)

A custom error page displayed when users try to access routes they don't have permission for:

**Features:**

- User-friendly error message explaining the access restriction
- Displays the user's current role (if available)
- Provides navigation options:
  - "Go to Dashboard" - Navigate to the main dashboard
  - "Go Back" - Return to the previous page

**How it works:**

- Automatically shown when role middleware detects unauthorized access
- Uses no layout for a clean, focused error experience
- Reads user role from the user store to provide context

### 4. Role Composable (`app/composables/useRole.ts`)

Provides reactive role checking functions for components:

```typescript
export const useRole = () => {
  return {
    hasRole, // Check specific role
    hasAnyRole, // Check if user has any of the roles
    hasAllRoles, // Check if user has all roles (for future multi-role)
    isAdmin, // Computed: is user admin
    isMember, // Computed: is user member
    userRole, // Computed: current user role
  };
};
```

---

## Usage Guide

### 1. Protecting Routes (Page-Level)

To protect a page, add role requirements in `definePageMeta`:

```vue
<script setup>
definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator"], // Only administrators can access
});
</script>
```

**Multiple Roles:**

```typescript
definePageMeta({
  middleware: "role",
  roles: ["member", "administrator"], // Either role can access
});
```

**Single Role:**

```typescript
definePageMeta({
  middleware: "role",
  roles: ["member"], // Only members can access
});
```

### 2. Conditional Rendering in Components

Use the `useRole` composable to conditionally show/hide UI elements:

```vue
<template>
  <div>
    <!-- Show only to admins -->
    <UButton v-if="isAdmin" @click="adminAction"> Admin Only Button </UButton>

    <!-- Show to specific role -->
    <div v-if="hasRole('administrator')">Administrator Content</div>

    <!-- Show to multiple roles -->
    <div v-if="hasAnyRole(['member', 'administrator'])">
      Visible to both roles
    </div>
  </div>
</template>

<script setup>
const { isAdmin, hasRole, hasAnyRole } = useRole();
</script>
```

### 3. Programmatic Role Checks

Check roles in script logic:

```typescript
<script setup>
const { isAdmin, hasRole, userRole } = useRole();

const handleAction = () => {
  if (isAdmin.value) {
    // Admin-specific logic
    performAdminAction();
  } else {
    // Member-specific logic
    performMemberAction();
  }
};

// Or using hasRole
if (hasRole('administrator')) {
  // Admin logic
}
</script>
```

### 4. Navigation Menu Filtering

Filter navigation items based on roles:

```vue
<script setup>
const { isAdmin } = useRole();

const baseNavItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Loans", to: "/loans" },
];

const adminNavItems = [
  { label: "Member Management", to: "/admin/members" },
  { label: "Loan Management", to: "/admin/loans" },
];

const navItems = computed(() => {
  if (isAdmin.value) {
    return [...baseNavItems, ...adminNavItems];
  }
  return baseNavItems;
});
</script>
```

---

## Examples

### Example 1: Admin-Only Page

```vue
<!-- app/pages/admin/settings.vue -->
<template>
  <div>
    <h1>Admin Settings</h1>
    <p>This page is only accessible to administrators.</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
  middleware: "role",
  roles: ["administrator"],
});
</script>
```

### Example 2: Member Dashboard with Admin Features

```vue
<!-- app/pages/dashboard.vue -->
<template>
  <div>
    <h1>Dashboard</h1>

    <!-- Visible to all authenticated users -->
    <UCard>
      <h2>My Account</h2>
      <p>Balance: {{ balance }}</p>
    </UCard>

    <!-- Only visible to admins -->
    <UCard v-if="isAdmin">
      <h2>Admin Quick Actions</h2>
      <UButton @click="manageMembers">Manage Members</UButton>
      <UButton @click="manageLoans">Manage Loans</UButton>
    </UCard>
  </div>
</template>

<script setup>
const { isAdmin } = useRole();

definePageMeta({
  layout: "default",
  // No role restriction - accessible to all authenticated users
});
</script>
```

### Example 3: Conditional Action Buttons

```vue
<template>
  <div>
    <UCard>
      <h2>Loan Application</h2>

      <!-- Show approve/reject only to admins -->
      <div v-if="isAdmin" class="flex gap-2">
        <UButton
          color="success"
          @click="approveLoan"
          :disabled="loan.status !== 'pending'"
        >
          Approve
        </UButton>
        <UButton
          color="error"
          @click="rejectLoan"
          :disabled="loan.status !== 'pending'"
        >
          Reject
        </UButton>
      </div>

      <!-- Show apply button only to members -->
      <UButton v-if="isMember && !loan" @click="applyForLoan">
        Apply for Loan
      </UButton>
    </UCard>
  </div>
</template>

<script setup>
const { isAdmin, isMember } = useRole();
const loan = ref(null);

const approveLoan = () => {
  // Admin action
};

const rejectLoan = () => {
  // Admin action
};

const applyForLoan = () => {
  // Member action
};
</script>
```

### Example 4: API Route Protection (Server-Side)

```typescript
// server/api/admin/users.get.ts
export default defineEventHandler(async (event) => {
  // Get user from store (populated by plugin)
  const userStore = useUserStore();

  // Check if user is admin
  if (!userStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden: Admin access required",
    });
  }

  // Proceed with admin logic
  // ...
});
```

---

## Best Practices

### ✅ Do's

1. **Always protect admin routes with middleware**

   ```typescript
   definePageMeta({
     middleware: "role",
     roles: ["administrator"],
   });
   ```

2. **Use composable for reactive checks**

   ```vue
   <div v-if="isAdmin">Admin Content</div>
   ```

3. **Filter navigation items by role**

   - Don't show admin links to members
   - Improves UX and security

4. **Combine with server-side validation**

   - Client-side RBAC is for UX
   - Always validate on the server for security

5. **Use specific role checks when possible**

   ```typescript
   // Good: Specific
   if (hasRole("administrator")) {
   }

   // Less ideal: Generic
   if (userRole === "administrator") {
   }
   ```

### ❌ Don'ts

1. **Don't rely solely on client-side protection**

   - Always validate on the server
   - Client-side is for UX, not security

2. **Don't hardcode role strings**

   ```typescript
   // Bad
   if (user.roleId === "administrator") {
   }

   // Good
   if (hasRole("administrator")) {
   }
   ```

3. **Don't forget to handle loading states**

   ```vue
   <div v-if="userStore.isInitialized">
     <div v-if="isAdmin">Admin Content</div>
   </div>
   ```

4. **Don't expose sensitive data in API responses**
   - Filter data based on user role
   - Members shouldn't see admin-only data

---

## Troubleshooting

### Issue: Middleware not blocking unauthorized access

**Solution:**

- Ensure `middleware: "role"` is in `definePageMeta`
- Check that `roles` array is defined
- Verify user store is initialized before middleware runs

### Issue: Role checks return false when user is logged in

**Solution:**

- Check if user store is initialized: `userStore.isInitialized`
- Verify user data is loaded: `userStore.user`
- Ensure `roleId` field exists in user object

### Issue: Navigation shows admin items to members

**Solution:**

- Use computed property with role check
- Ensure `isAdmin` is reactive (use composable)
- Check that user store is initialized before rendering

---

## Security Considerations

⚠️ **Important:** Client-side RBAC is for **user experience**, not security!

1. **Server-Side Validation Required**

   - Always validate roles on the server
   - Never trust client-side role checks for sensitive operations

2. **API Endpoint Protection**

   - Protect admin API endpoints server-side
   - Check user role before processing requests

3. **Data Filtering**

   - Filter sensitive data in API responses
   - Don't expose admin data to members

4. **Token Security**
   - Use httpOnly cookies for tokens
   - Validate tokens on every request

---

## Related Files

- `app/stores/useUser.ts` - User store with role getters
- `app/middleware/role.ts` - Route protection middleware
- `app/composables/useRole.ts` - Role checking composable
- `app/pages/error/403.vue` - Custom 403 forbidden error page
- `app/middleware/auth.global.ts` - Authentication middleware
- `types/user.ts` - User type definitions

---

## Summary

The RBAC system provides:

✅ **Route Protection** - Middleware-based page access control  
✅ **Component-Level Control** - Conditional rendering based on roles  
✅ **Reactive Checks** - Composable with computed values  
✅ **Type Safety** - TypeScript types for roles  
✅ **Easy Integration** - Simple API for common use cases

Remember: Always validate roles on the server for true security!
