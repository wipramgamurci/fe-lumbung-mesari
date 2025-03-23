# Lumbung Mesari - Frontend Requirements

## 1. System Overview

The frontend system will be a responsive web application built using **Nuxt.js (Vue 3)** and **shadcn/ui** for UI components. It will interact with the Lumbung Mesari REST API backend to provide interfaces for administrators and members to manage savings, loans, profiles, and transactions.

---

## 2. User Interface Requirements

### 2.1 User Roles & Dashboards

- **Administrator Dashboard**:
  - Member approval/rejection interface.
  - Financial reports (transactions, loans, savings).
  - Audit trail monitoring.
  - System health/metrics display.

- **Member Dashboard**:
  - Savings and loan overview.
  - Transaction history.
  - Profile management.
  - Loan application interface.

### 2.2 Authentication & Security

- **Login/Logout**:
  - JWT-based authentication.
  - 2FA via email (shadcn/ui `Dialog` for code input).
- **Session Management**:
  - Auto-logout after 15 minutes of inactivity.
  - Redirect to login on token expiration (401 errors).
- **Password Reset**:
  - Form with validation (minimum 8 characters, numbers, special characters).

### 2.3 Responsive Design

- Mobile-first approach.
- Cross-browser compatibility (Chrome, Firefox, Safari).
- Breakpoints for mobile (<768px), tablet (768px–1024px), desktop (>1024px).

---

## 3. Core Modules

### 3.1 Member Management

- **Registration**:
  - Form with fields for username, email, ID/selfie upload (shadcn/ui `Input`).
  - Status tracking (Pending/Approved/Rejected) with email notifications.
- **Profile Management**:
  - Edit personal details.
  - View account status and balance.
  - Upload/update KYC documents.

### 3.2 Savings Management

- **Deposit/Withdrawal**:
  - Integration with Midtrans payment gateway (bank/e-wallet selection).
  - Transaction status tracking (Pending/Success/Failed).
- **Balance Overview**:
  - Real-time balance display.
  - Interest calculation preview.

### 3.3 Loan Management

- **Loan Application**:
  - Form for amount, duration, and terms.
  - Installment calculator with interest/penalties.
- **Loan Tracking**:
  - Payment schedules with due dates (shadcn/ui `Calendar`).
  - Late payment alerts (in-app + email).
  - Payment history.

### 3.4 Reporting

- **Member Reports**:
  - Monthly statements (PDF/downloadable).
  - Loan repayment progress charts.
- **Admin Reports**:
  - Financial summaries (charts/tables).
  - Export to CSV/PDF.

---

## 4. Technical Requirements

### 4.1 Tech Stack

- **Framework**: Nuxt.js (Vue 3 + TypeScript).
- **UI Library**: shadcn/ui + Tailwind CSS.
- **State Management**: Pinia.
- **API Client**: Axios with TypeScript interfaces.
- **Additional Libraries**:
  - `date-fns` for date formatting.
  - `vue-query` for API caching.
  - `vue-chartjs` for financial charts.

### 4.2 API Integration

- **Strict Typing**: Generate TypeScript types from backend Swagger/OpenAPI specs.
- **Error Handling**:
  - Global error boundary component.
  - Retry logic for failed API calls.
- **Pagination/Sorting**: Implement for tables (e.g., loan applications, transactions).

### 4.3 Security

- **Token Storage**: HTTP-only cookies (via `nuxt-auth-utils`).
- **Input Sanitization**: Zod schema validation for forms.
- **CORS**: Align with backend configurations.

### 4.4 Performance

- **Code Splitting**: Auto-imports via Nuxt 3.
- **Image Optimization**: `@nuxt/image` for lazy loading.
- **Caching**: `vue-query` for API response caching.

---

## 5. Non-Functional Requirements

### 5.1 Accessibility

- WCAG 2.1 compliance (contrast ratios, ARIA labels).
- Keyboard navigation support.

### 5.2 Testing

- **Unit Tests**: Vitest + Testing Library for components.
- **E2E Tests**: Playwright for critical flows (login, loan application).
- **Accessibility**: Axe DevTools + Lighthouse audits.

### 5.3 Documentation

- **Component Docs**: Storybook for shadcn/ui customizations.
- **API Interaction Guide**: Markdown file with example requests/responses.

### 5.4 Deployment

- **Hosting**: Vercel/Netlify with CI/CD.
- **Monitoring**: Sentry for error tracking.

---

## 6. Development Roadmap

### Phase 1: Project Setup & Foundations

- Initialize Nuxt 3 project with TypeScript.
- Configure shadcn/ui + Tailwind CSS.
- Implement authentication flow (login/2FA).

### Phase 2: Core Modules Implementation

- Build member dashboard (savings/loan overview).
- Create admin approval tables.
- Integrate Midtrans payment flow.

### Phase 3: Polish & Testing

- Add charts for financial reports.
- Optimize mobile responsiveness.
- Write E2E tests for critical paths.

### Phase 4: Deployment

- Set up CI/CD pipeline.
- Document maintenance procedures.

---

## 7. Collaboration Points

1. **API Contract Finalization**: Use Swagger/Postman to align request/response formats.
2. **Webhook Testing**: Coordinate with backend for Midtrans payment status updates.
3. **Error Codes**: Agree on standardized error messages for frontend handling.

---

## 8. Design Guidelines

- **UI Kit**: shadcn/ui for consistent component design.
- **Theming**: Customize default shadcn theme colors (primary: `#2A9D8F` for branding).
- **Microcopy**: User-friendly error messages and tooltips.

---

This document outlines the frontend requirements for the Lumbung Mesari project, ensuring alignment with the backend specifications and leveraging **Nuxt.js** and **shadcn/ui** for efficient development.