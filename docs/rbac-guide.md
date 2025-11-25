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

Role-Based Access Control (RBAC) is a security mechanism that restricts access to resources based on user roles. In this application, we currently support three roles:

- **Member** (`member`) - Regular users who can access member-specific features
- **Administrator** (`administrator`) - Admin users who manage members, admins, and loans
- **Superadministrator** (`superadministrator`) - Elevated admins with the same UI privileges as administrators (reserved for future server-side expansion)

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
│   Middleware │  │  Layout/Nav  │  │   Pages      │
│   (role.ts)  │  │  (default)   │  │   (meta)     │
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

4. **Navigation Constants** (`app/constants/navigation.ts`)
   - Defines role-scoped nav sections
   - Imported by `default.vue` to render the final menu
   - Prevents admins from seeing member-only links (and vice versa)

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
   - Components read roles directly from the user store
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
│ Component imports userStore  │
│ Creates computed role flags  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Template renders             │
│ v-if="isAdmin" → Show/Hide   │
│ v-if="userRole === 'admin'"  │
└──────────────────────────────┘
```

**Example flow:**

```vue
<template>
  <!-- Component renders -->
  <div>
    <!-- This checks isAdmin.value reactively -->
    <UButton v-if="isAdmin">Admin Action</UButton>

    <!-- This checks the specific role -->
    <div v-if="userRole === 'administrator'">Admin Content</div>
  </div>
</template>

<script setup>
// Composable reads from userStore
const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);
// Computed refs update when the store changes
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
│ Layout reads userStore       │
│ and imports nav constants    │
└──────────┬───────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Computed navItems            │
│ - Base available to everyone │
│ - Append member/admin sets   │
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
type UserRole = "member" | "administrator" | "superadministrator";
```

### Role Definitions

| Role                 | Description            | Access Level                                                                 |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| `member`             | Regular user           | Dashboard, profile, member-only flows such as `/loans`                       |
| `administrator`      | Admin user             | Dashboard plus `/admin/*` management pages                                   |
| `superadministrator` | Elevated administrator | Same UI reach as administrator; reserved for future server-side-only actions |

### User Data Structure

The user object contains a `roleId` field:

```typescript
interface User {
  id: string;
  email: string;
  fullname: string;
  // ... other fields
  roleId: "member" | "administrator" | "superadministrator";
}
```

---

## Implementation Components

### 1. User Store (`app/stores/useUser.ts`)

The user store is the single source of truth for the authenticated user and exposes convenience getters for each role. It also ensures SSR requests forward cookies when fetching `/api/me`, which keeps middleware decisions consistent on full page loads.

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
    isSuperadministrator: (state) =>
      state.user?.roleId === "superadministrator",
    userRole: (state) => state.user?.roleId || null,
  },

  actions: {
    async fetchUser() {
      const headers = import.meta.server
        ? useRequestHeaders(["cookie"])
        : undefined;
      const user = await $fetch<User>("/api/me", { headers });
      this.user = user;
      this.isInitialized = true;
    },
    clearUser() {
      this.user = null;
      this.isInitialized = true;
    },
  },
});
```

**Key points:**

- `isInitialized` prevents duplicate fetches and guards from running before data is loaded.
- `fetchUser()` now forwards the incoming request cookies on SSR so the `/api/me` call succeeds on the server.

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

### 4. Navigation Constants & Layout (`app/constants/navigation.ts`, `app/layouts/default.vue`)

- `app/constants/navigation.ts` now exports `BASE_NAV_ITEMS`, `MEMBER_NAV_ITEMS`, and `ADMIN_NAV_ITEMS`. Each list maps to the routes a role can see.
- `app/layouts/default.vue` imports those constants, computes `navItems` based on `userStore` getters, and renders skeleton placeholders until the store reports `isUserReady`.
- Admin users no longer see the member-only `/loans` link, eliminating accidental 403 routes from the sidebar dropdown.

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

Use the user store getters directly (all getters are reactive):

```vue
<template>
  <div>
    <UButton v-if="isAdmin" @click="adminAction">Admin Only Button</UButton>

    <div v-if="userRole === 'administrator'">Administrator Content</div>

    <div v-if="isMember || isAdmin">Visible to members and admins</div>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);
const isMember = computed(() => userStore.isMember);
const userRole = computed(() => userStore.userRole);
</script>
```

### 3. Programmatic Role Checks

Check roles in script logic:

```typescript
<script setup>
const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);
const isMember = computed(() => userStore.isMember);

const handleAction = () => {
  if (isAdmin.value) {
    // Admin-specific logic
    performAdminAction();
  } else {
    // Member-specific logic
    performMemberAction();
  }
};

// Inline check without computed helper
if (userStore.isAdmin || userStore.isSuperadministrator) {
  // Admin logic
}
</script>
```

### 4. Navigation Menu Filtering

Filter navigation items by importing the shared constants:

```vue
<script setup>
import {
  BASE_NAV_ITEMS,
  MEMBER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
} from "~/constants/navigation";

const userStore = useUserStore();

const navItems = computed(() => {
  if (userStore.isAdmin || userStore.isSuperadministrator) {
    return [...BASE_NAV_ITEMS, ...ADMIN_NAV_ITEMS];
  }
  if (userStore.isMember) {
    return [...BASE_NAV_ITEMS, ...MEMBER_NAV_ITEMS];
  }
  return BASE_NAV_ITEMS;
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
const userStore = useUserStore();
const isAdmin = computed(
  () => userStore.isAdmin || userStore.isSuperadministrator
);

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
const userStore = useUserStore();
const isAdmin = computed(
  () => userStore.isAdmin || userStore.isSuperadministrator
);
const isMember = computed(() => userStore.isMember);
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

2. **Use user store getters for reactive checks**

   ```vue
   <div v-if="isAdmin">Admin Content</div>
   ```

3. **Filter navigation items by role**

   - Don't show admin links to members
   - Improves UX and security

4. **Combine with server-side validation**

   - Client-side RBAC is for UX
   - Always validate on the server for security

5. **Prefer store getters over inline string comparisons**

   ```typescript
   // Good: Uses getter
   if (userStore.isAdmin || userStore.isSuperadministrator) {
   }

   // Less ideal: Hard-coded comparison
   if (userStore.userRole === "administrator") {
   }
   ```

### ❌ Don'ts

1. **Don't rely solely on client-side protection**

   - Always validate on the server
   - Client-side is for UX, not security

2. **Don't hardcode role strings everywhere**

   ```typescript
   // Bad
   if (user.roleId === "administrator") {
   }

   // Better
   if (userStore.isAdmin) {
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
- `app/constants/navigation.ts` - Shared navigation metadata
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
