# 📜 Development Roadmap - Lumbung Mesari Frontend

This document outlines the development roadmap for the Lumbung Mesari frontend project, organized into weekly sprints with clear deliverables and acceptance criteria.

---

## 🚀 Phase 1: Project Setup (Week 1)

### Infrastructure & Tooling
- [x] Initialize Nuxt 3 project with TypeScript
- [x] Set up ESLint + Prettier configuration
- [x] Configure Tailwind CSS and Volt UI theme
- [ ] Set up Pinia store structure
- [ ] Set up composable API wrappers using `$fetch`
- [ ] Set up basic error handling and logging

### Documentation
- [x] Create project documentation structure in `/docs`
- [x] Document project requirements and architecture
- [ ] Finalize API contract with backend team
- [ ] Document component library guidelines

---

## 🔐 Phase 2: Authentication & Core UI (Week 2)

### Authentication Flow
- [ ] Implement JWT authentication
  - [ ] Login with 2FA
  - [ ] Registration with file uploads
  - [ ] Password reset flow
  - [ ] Session management

### Core Components
- [ ] Build reusable UI components:
  - [ ] `BaseCard` - Standard container component
  - [ ] `FormField` - Reusable form inputs with validation
  - [ ] `StatusBadge` - For loan/application status
  - [ ] `DataTable` - For member/loan listings
  - [ ] `ToastNotification` - For system feedback

### Layouts & Routing
- [ ] Create auth layout (`/layouts/auth.vue`)
- [ ] Create main app layout (`/layouts/default.vue`)
- [ ] Set up route middleware for auth guards
- [ ] Implement role-based route protection

---

## 💰 Phase 3: Member Features (Week 3)

### Savings Module
- [ ] Savings dashboard
  - [ ] Current balance display
  - [ ] Transaction history with filters
  - [ ] Deposit/Withdrawal forms
  - [ ] Transaction receipt view

### Loans Module
- [ ] Loan application flow
  - [ ] Loan calculator component
  - [ ] Application form with validation
  - [ ] Document upload integration
  - [ ] Application status tracking

### Profile Management
- [ ] User profile editor
- [ ] Document management
- [ ] Password change form

---

## 👑 Phase 4: Admin Features (Week 4)

### Member Management
- [ ] Member listing with filters
- [ ] Member detail view
- [ ] Document verification interface
- [ ] Member approval workflow

### Loan Management
- [ ] Loan application review
- [ ] Approval/Rejection workflow
- [ ] Payment tracking
- [ ] Late payment notifications

### Reporting
- [ ] Basic financial reports
- [ ] Export functionality (CSV/PDF)
- [ ] Dashboard analytics

---

## 🎯 Phase 5: Polish & Launch (Week 5)

### Testing
- [ ] Unit tests for critical components
- [ ] E2E test flows for core features
- [ ] Cross-browser testing
- [ ] Performance optimization

### Documentation
- [ ] API integration guide
- [ ] Deployment documentation
- [ ] User manual
- [ ] Admin guide

### Final Steps
- [ ] Accessibility audit
- [ ] Security review
- [ ] Load testing
- [ ] Production deployment checklist

---

## 🌟 MVP Scope (Phase 1)

- [ ] Authentication (Login, Register, 2FA)
- [ ] Member Dashboard (summary, transactions)
- [ ] Savings (balance, deposit/withdraw, history)
- [ ] Loans (application, status)
- [ ] Admin pages (member & loan approval)

---

## ⏳ Optional Features (Phase 2)

- [ ] Midtrans integration (simulated or real)
- [ ] Export monthly statements to PDF
- [ ] Downloadable transaction history
- [ ] Email notification visuals

---

## 🧐 Notes / TODO / Blockers

- [ ] Confirm `/loans` and `/members/:id/status` API design with backend
- [ ] Sync 2FA flow with backend token
- [ ] Decide on status badge color conventions

---

> ✅ This roadmap is dynamic and should be updated weekly.
