# 🧩 Front-end Requirements - Lumbung Mesari

## 1. Overview

This document outlines the front-end requirements for the **Lumbung Mesari** savings and loans cooperative system. The front-end is built using **Nuxt 3**, **Tailwind CSS**, and **Volt UI**, and interacts with a RESTful API backend developed using NestJS. The goal is to deliver an MVP that focuses on core features such as user authentication, member management, savings tracking, and loan processing.

---

## 2. Technology Stack

- **Framework**: Nuxt 3 (Vue 3 + Composition API)
    
- **Styling**: Tailwind CSS
    
- **UI Kit**: Volt UI
    
- **State Management**: Pinia
    
- **HTTP Client**: Axios
    
- **Auth Strategy**: JWT-based authentication via API
    
- **Routing**: File-based routing with middleware support
    
- **Testing (optional)**: Vitest / Cypress
    

---

## 3. User Roles

### Member

- Register and manage their account
    
- View balance and transaction history
    
- Apply for loans
    

### Administrator

- Approve member registrations
    
- Approve or reject loan applications
    
- View and manage member data and reports
    

---

## 4. Application Pages and Routes

### Page List

- `/login`
    
- `/register`
    
- `/dashboard`
    
- `/profile`
    
- `/savings`
    
- `/loans`
    
- `/admin/members`
    
- `/admin/loans`
    

### Page Details

#### `/login`

- Login form
    
- 2FA code input
    
- Redirect to dashboard on success
    
- Error handling for invalid credentials or 2FA
    

#### `/register`

- Registration form:
    
    - Username, Full Name, Email, Password
        
    - Upload ID card photo and selfie
        
- Status message after submission
    
- Form validation feedback
    

#### `/dashboard`

- Member:
    
    - Display savings summary, active loans, recent transactions
        
- Admin:
    
    - Overview of member stats and loan approvals
        
    - Shortcuts to member/loan management
        

#### `/profile`

- View and edit profile data
    
- Account status (pending/approved/rejected)
    
- Transaction history
    
- Optional: PDF download of monthly statements
    

#### `/savings`

- Deposit and withdrawal form
    
- Current balance display
    
- Transaction history list
    
- Optional: Simulated Midtrans payment status
    

#### `/loans`

- Loan application form:
    
    - Tenor options: 6, 12, 18 months
        
    - Auto-calculate installments
        
- Loan list with status indicators
    
- Late payment notifications
    

#### `/admin/members`

- Table of all members
    
- Filter by status
    
- Actions: approve, reject, view details
    

#### `/admin/loans`

- List of loan applications
    
- Actions: approve, reject
    
- View loan details and installment schedules
    

---

## 5. Component Guidelines

- Use Volt UI components where available
    
- Style with Tailwind CSS for consistency
    
- Recommended reusable components:
    
    - `BaseCard.vue`
        
    - `FormField.vue`
        
    - `StatusBadge.vue`
        
    - `ToastNotification.vue`
        
    - `LoanCalculator.vue`
        

---

## 6. API Integration

- Use Axios instance with JWT header
    
- Implement route protection via auth middleware
    
- Suggested API composables:
    
    ```
    /composables/useAuth.ts
    /composables/useSavings.ts
    /composables/useLoans.ts
    ```
    

### Example Endpoints (assumed from backend spec)

- `POST /auth/login`
    
- `GET /me`
    
- `POST /register`
    
- `GET /savings`
    
- `POST /loans`
    
- `GET /admin/members`
    
- `POST /admin/approve-loan`
    

---

## 7. Authentication & Session Flow

- Login generates JWT token (stored in cookie/localStorage)
    
- Manual 2FA verification via email
    
- Protected routes use middleware (`auth.ts`)
    
- Logout clears session and redirects to login
    

---

## 8. Feature Prioritization

### ✅ Phase 1 - MVP

- Authentication (login, register, 2FA)
    
- Member dashboard
    
- Savings (without Midtrans integration)
    
- Loan application form
    
- Admin member and loan approval
    

### ⏳ Phase 2 - Optional

- Midtrans integration
    
- Monthly PDF reports
    
- Transaction history download
    
- Email notification visuals
    

---

## 9. AI Agent Notes

- Preferred file formats: `.vue`, `.ts`, `.md`
    
- Pages use `default.vue` layout, except auth uses `auth.vue`
    
- Use responsive and modular components
    
- Prefer Volt UI and Tailwind for design consistency
    
- Use mock data only if API is not ready