# `NuxtUIColor` adoption notes

Reference type: `types/nuxt-ui.ts` → `NuxtUIColor`.

**Already using `NuxtUIColor`**

- `app/pages/dashboard.vue` — `getSavingStatusColor()` return type + `Record<..., NuxtUIColor>`

---

## Tier 1 — Uses `Record<..., any>` for badge/UI colors (highest value)

These are the clearest replacements: swap `any` for `NuxtUIColor` and type the helper return.

| File | What to update |
|------|----------------|
| `app/pages/loans/index.vue` | `getStatusColor` — `colorMap: Record<string, any>` → `Record<LoanStatus, NuxtUIColor>` (or a narrower key type if you prefer) |
| `app/pages/loans/[id].vue` | `getStatusColor` — `Record<string, any>`; `getInstallmentStatusColor` — `Record<InstallmentStatus, any>` |
| `app/pages/loans/index copy.vue` | Same pattern as `loans/index.vue` (looks like a duplicate/backup page — consider deleting or aligning) |

---

## Tier 2 — Typed with a manual union instead of shared `NuxtUIColor`

| File | What to update |
|------|----------------|
| `app/pages/savings.vue` | `getSavingStatusColor` return type is `"success" \| "warning" \| "error" \| "neutral"` and inner `Record<..., "success" \| ...>` — replace with `NuxtUIColor` + `Record<..., NuxtUIColor>` for one source of truth |

---

## Tier 3 — Local duplicate of the same union as `NuxtUIColor`

| File | What to update |
|------|----------------|
| `app/pages/profile/index.vue` | Local `type BadgeColor = ...` matches `NuxtUIColor` — remove duplicate and `import type { NuxtUIColor } from "~~/types/nuxt-ui"`, use it in `statusConfig` and `getStatusInfo` |

---

## Tier 4 — Admin tables: `h(UBadge, { color, ... })`

`color` is usually a string literal from a map; typing those maps as `NuxtUIColor` (or `Record<Status, NuxtUIColor>`) documents intent and catches typos.

| File | Notes |
|------|--------|
| `app/pages/admin/savings.vue` | Badge cell renderer + action buttons — several `color: "success" \| "error" \| ...` |
| `app/pages/admin/loans.vue` | Uses `as const` in places; still worth aligning maps to `NuxtUIColor` where a variable is passed into `h(UBadge, { color })` |
| `app/pages/admin/members.vue` | Same pattern |
| `app/pages/admin/administrators.vue` | Same pattern |
| `app/pages/admin/expenses/index.vue` | `color: "neutral"` in column config (line ~361 in grep) |

---

## Tier 5 — Toasts / other APIs with a `color` field

These may be `useToast()` or similar. Confirm the prop accepts the same union as `UBadge`; if yes, type the object as `NuxtUIColor` where you build `{ color: "success" }`.

| File |
|------|
| `app/pages/verify-otp.vue` |
| `app/pages/register.vue` |
| `app/pages/loans/request.vue` |
| `app/pages/admin/expenses/create.vue` |
| `app/pages/admin/expenses/[id].vue` |

---

## Tier 6 — Template-only literals (optional)

`UButton` / `UBadge` with inline `color="primary"` etc. are already valid string literals; **optional** to extract or annotate. Examples: `login.vue`, `forgot-password.vue`, `index.vue`, `loans/request.vue` (some branches), `error/403.vue`, etc.

---

## Not `NuxtUIColor` (informational)

| File | Reason |
|------|--------|
| `app/pages/admin/loans.vue` ~603 | `body?: Record<string, any>` is unrelated to UI color — leave as-is or type separately |

---

## Suggested order when you adopt

1. `loans/index.vue` + `loans/[id].vue` (removes `any` on color maps)  
2. `savings.vue` (align with `dashboard.vue`)  
3. `profile/index.vue` (dedupe `BadgeColor`)  
4. Admin `h(UBadge)` pages  
5. Toasts if the API matches  

Delete or merge `loans/index copy.vue` if it is obsolete to avoid double maintenance.
