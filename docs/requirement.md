# 📄 Frontend Requirements - Lumbung Mesari

This document defines the functional and technical requirements of the **Lumbung Mesari frontend system**, focusing on building a responsive, modular, and maintainable Nuxt 3-based application for cooperative savings and loans.

---

## 🔧 Technical Stack

| Category              | Technology                     |
|-----------------------|---------------------------------|
| Framework            | Nuxt 3 (Vue 3 + Composition API) |
| Styling              | Tailwind CSS + Volt UI          |
| State Management     | Pinia (global store)            |
| HTTP Client          | Nuxt `$fetch`                   |
| Form Validation      | Zod or composable-based         |
| Authentication       | JWT + 2FA                       |
| Testing              | Nuxt Test Utils                 |

---

## 🔐 Authentication & Session

- Supports member and admin roles
- Login uses username/password and optional 2FA
- Registration allows uploading member ID photo
- Session persisted using cookies/localStorage
- Route protection via Nuxt middleware (`auth.ts`)
- Token refresh handled via `useAuth` composable

---

## 🗺️ Page Requirements

### `/login`
- Username, password input
- 2FA code if required
- Error and toast handling

### `/register`
- Form: name, phone, email, password
- File upload: KTP or member card
- Agreement checkbox
- Redirects to `/login` upon success

### `/dashboard`
**Member:**
- Summary cards: Total Balance, Active Loans, Savings
- Recent transaction table

**Admin:**
- Member count, Pending loan count
- Shortcuts to manage members/loans

### `/savings`
- Balance display
- Deposit / Withdraw form
- Transaction history table (filterable)

### `/loans`
- Loan application form
- Loan calculator preview
- Loan status history

### `/admin/members`
- Table of pending/active members
- Approve / reject flow
- View KTP/documents in modal

### `/admin/loans`
- List of loan applications
- Approve/reject
- Filter by status

---

## 🔁 Component Expectations

- **FormField.vue**: label, input, error message
- **StatusBadge.vue**: Volt `Tag` component with color states
- **BaseCard.vue**: unified layout for card sections
- **ToastNotification.vue**: handles `$toast.add()` on success/error
- **LoanCalculator.vue**: shows estimate based on amount and tenor

---

## 📡 API Integration

- All HTTP requests use Nuxt `$fetch`
- Each major module has composables: `useAuth.ts`, `useSavings.ts`, `useLoans.ts`
- Handle errors via composable or Nuxt error boundary

---

## 📋 Role Access Summary

| Page                | Member | Admin |
|---------------------|--------|--------|
| `/login`, `/register` | ✅      | ✅      |
| `/dashboard`        | ✅      | ✅      |
| `/savings`, `/loans`| ✅      | ❌      |
| `/admin/*`          | ❌      | ✅      |

---

## 🧪 Testing Notes

- Use `Nuxt Test Utils` for unit test & E2E skeletons
- Cover key flows: login, apply loan, approve member

---

> ✅ This file should evolve with feature additions and backend alignment.
