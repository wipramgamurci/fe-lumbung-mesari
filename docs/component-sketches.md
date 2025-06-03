# 🧩 Component Sketches - Lumbung Mesari (Volt UI-Based)

This document provides layout and component sketches using Volt UI components and Tailwind CSS utilities. Update this as new pages and components are added.

---

## `/dashboard` (Member)

- **Header**: Dashboard
- **Summary Section**:
  - `Card` components:
    - Total Balance
    - Active Loans
    - Total Savings
- **Recent Transactions**:
  - `DataTable`: Date | Type | Amount | StatusBadge

---

## `/dashboard` (Admin)

- **Header**: Admin Dashboard
- **Overview Section**:
  - `Card`: Total Members
  - `Card`: Pending Loans
- **Quick Actions**:
  - `Button`: Manage Members
  - `Button`: Review Loans

---

## `/savings`

- **Header**: My Savings
- **Balance Info**: `Card` with current balance
- **Form Section**:
  - `FormField`: Amount
  - `Dropdown`: Transaction Type (Deposit / Withdraw)
  - `Button`: Submit
- **Transaction History**:
  - `DataTable`: Date | Amount | Type | Status

---

## `/loans`

- **Header**: Loan Center
- **Loan Application Form**:
  - `FormField`: Amount
  - `Dropdown`: Tenor
  - `LoanCalculator.vue`: Show monthly estimate
  - `Button`: Submit
- **Loan List**:
  - `DataTable`: Amount | Tenor | StatusBadge | CreatedAt

---

## `/admin/members`

- **Header**: Manage Members
- **Member Table**:
  - `DataTable`: Name | Email | StatusBadge | Actions (Approve / Reject / View)

---

## `/admin/loans`

- **Header**: Loan Applications
- **Application Review Table**:
  - `DataTable`: Member | Amount | Tenor | StatusBadge | Actions

---

## 🔧 Custom Components (Volt UI themed)

### `BaseCard.vue`

- Wrapper around Volt UI `Card`
- Uses `p-6` padding and consistent border radius

### `FormField.vue`

- Label, input, and error message
- Optional `icon-left` slot

### `StatusBadge.vue`

- Uses Volt `Tag` with color props
- Green = approved, Yellow = pending, Red = rejected

### `ToastNotification.vue`

- Wrapper around Volt `Toast`
- Can be reused for success/error messages

### `LoanCalculator.vue`

- Accepts amount & tenor
- Displays monthly payment and total interest

---

> ✍️ Update this document as the system evolves or more screens are designed.
