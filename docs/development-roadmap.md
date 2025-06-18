# 📜 Development Roadmap - Lumbung Mesari Frontend

This document outlines the development roadmap for the Lumbung Mesari frontend project, organized into weekly sprints with clear deliverables and acceptance criteria.

---

## 🚀 Phase 1: Project Setup (Week 1)

### Infrastructure & Tooling

- [x] Initialize Nuxt 3 project with TypeScript
- [x] Set up ESLint + Prettier configuration
- [x] Configure Tailwind CSS and Volt UI theme
- [x] Set up base Volt UI components (Button, Input, Card, etc.)
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

#### Completed (2024-06-18)
- [x] Implement login page UI with Volt UI components
  - Email/password form with validation states
  - Remember me functionality
  - Google OAuth button (UI only)
  - Responsive design for all screen sizes
  - Loading states and form submission handling

#### In Progress
- [ ] Implement login API integration
- [ ] Set up authentication store (Pinia)
- [ ] Add form validation
- [ ] Implement protected routes
- [ ] Add error handling and user feedback
- [ ] Set up Google OAuth integration

### Authentication Flow

- [ ] Implement JWT authentication
  - [ ] Login with 2FA
  - [ ] Registration with file uploads
  - [ ] Password reset flow
  - [ ] Session management

### Core Components

- [ ] Create wrapper components around Volt UI:
  - [ ] `BaseButton` - Wraps Volt Button with app-specific styling
  - [ ] `BaseInput` - Wraps Volt InputText with validation
  - [ ] `BaseCard` - Wraps Volt Card with consistent styling
  - [ ] `FormField` - Combines label, input, and error handling
  - [ ] `StatusBadge` - Uses Volt Badge for status indicators
  - [ ] `ToastNotification` - Wraps Volt Toast with app presets

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

## 🌟 MVP Scope (Phase 2)

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

### Technical Decisions

- [x] Using Volt UI as the component library
- [ ] Document component wrapping strategy
- [ ] Finalize color scheme and theming approach

### API Integration

- [ ] Confirm `/loans` and `/members/:id/status` API design with backend
- [ ] Sync 2FA flow with backend token

### UI/UX

- [ ] Finalize status badge color conventions
- [ ] Document responsive breakpoints and layout rules

---

## 🧠 Developer Working Approach

This project follows a flexible and pragmatic approach to development:

- Tools, libraries, and modules will only be installed when actually needed by a feature.
- Priority is placed on functional progress and visible UI before setup or testing.
- AI agents should:
  - Suggest minimal setups when helping build a feature.
  - Avoid recommending boilerplate if not yet necessary.
  - Ask whether a setup should be done now or deferred.

This working model supports learning-by-doing and is suitable for the current developer capacity.

> ✅ This roadmap is dynamic and should be updated weekly.
