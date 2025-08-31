# 🗺️ Lumbung Mesari Project Blueprint

This document is the primary guide and single source of truth for the "Lumbung Mesari" Cooperative Savings and Loans front-end project.

---

## 1. Primary Goal (MVP)

To build a functional cooperative savings and loans application within 3 months, where **members can register and apply for loans**, and **an admin can approve those registrations and loan applications**. All other features (advanced reports, 2FA, automatic payment integrations) will be addressed if time permits.

## 2. Technical Stack

This section outlines the core technologies we will use for this project.

### Core Stack (Confirmed)

These are the foundational technologies we have committed to using.

| Category    | Technology    | Notes                                                         |
| :---------- | :------------ | :------------------------------------------------------------ |
| Framework   | Nuxt          | The core of our application, using Vue 3 and Composition API. |
| UI Library  | Nuxt UI       | Our primary component library for speed and consistency.      |
| Styling     | Tailwind CSS  | Used for all custom styling and layout adjustments.           |
| HTTP Client | Nuxt `$fetch` | Built-in solution for all API communications.                 |

### Supporting Stack (As Needed - Just-In-Time)

These technologies will be implemented only when a feature requires them.

| Category         | Technology               | Notes                                                                  |
| :--------------- | :----------------------- | :--------------------------------------------------------------------- |
| State Management | Pinia                    | To be used if `useState` is no longer sufficient for cross-page state. |
| Form Validation  | Zod                      | A potential candidate for complex form validation if needed.           |
| Testing          | Vitest / Nuxt Test Utils | To be implemented for critical features once they are stable.          |

## 3. Page & Component Map (Nuxt UI Version)

This is the list of pages to be built, along with the primary Nuxt UI components that will be used.

| Page             | Simple Description                            | Primary Nuxt UI Components to Use                                          | Priority   |
| :--------------- | :-------------------------------------------- | :------------------------------------------------------------------------- | :--------- |
| `/login`         | A form to sign in.                            | `UCard`, `UForm`, `UInput`, `UButton`                                      | **Week 1** |
| `/register`      | A registration form with ID card upload.      | `UCard`, `UForm`, `UInput`, `UButton`, `UInput` (type file)                | **Week 1** |
| `/dashboard`     | The main page after login.                    | `UCard`, `UStat` (for balance summary), `UTable` (for transaction history) | **Week 2** |
| `/loans`         | A form to apply for a loan.                   | `UCard`, `UForm`, `UInput`, `USelect` (for tenor), `UButton`               | **Week 3** |
| `/admin/members` | A table for admins to view new members.       | `UTable`, `UBadge` (for status), `UDropdown` (for Action button)           | **Week 2** |
| `/admin/loans`   | A table for admins to view loan applications. | `UTable`, `UBadge`, `UDropdown`, `UModal` (for details)                    | **Week 3** |

## 4. Simple Work Plan (First 4 Weeks)

A week-by-week development focus to achieve our MVP target.

- **Week 1: Foundation & Authentication**

  - [x] Basic Nuxt + Nuxt UI project setup.
  - [x] Create **Login Page** (UI only).
  - [x] Create **Register Page** (UI only, including file upload section).
  - [x] Create an `auth` layout (an empty layout for login/register pages).
  - [x] Connect the login page to the `/auth/login` API.

- **Week 2: Admin & Initial Dashboard**

  - [x] Create the `default` layout (with a navigation sidebar).
  - [x] Create the **Admin Page for Member Approval** (`/admin/members`).
  - [x] Create the **Member Dashboard Page** (`/dashboard`), displaying dummy data initially.

- **Week 3: Core Loan Features**

  - [x] Create the **Loan Application Page** for members (`/loans`).
  - [ ] Create the **Admin Page for Loan Approval** (`/admin/loans`).

- **Week 4: Savings & Finalization**
  - [ ] Create the page to view savings history.
  - [ ] Start connecting all pages with a state management solution (Pinia), if necessary.

## 5. Supporting Documents

Links to the supporting documents we use.

- [API Contract](./api-endpoints.md)
- [Data Dictionary](./types-and-models.md)
- [Git Strategy](./git-strats.md)
- [AI Guidelines](./ai-guidelines.md)

## 6. UI/UX Principles

- **Responsiveness**: The application must be functional and usable on desktop, tablet, and mobile screens. We will aim for a simple, fluid layout that adapts naturally to screen size, not a complex design with major changes for each breakpoint.
- **Simplicity**: We prioritize clarity and ease of use over complex visual aesthetics. Functionality comes first.
- **Consistency**: We will use Nuxt UI components as much as possible to maintain a consistent look and feel throughout the application.
