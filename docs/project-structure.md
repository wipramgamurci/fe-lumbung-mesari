# 🗂️ Project Structure - Lumbung Mesari Frontend

This document describes the folder and file structure of the Nuxt 3 frontend project using Tailwind CSS and Volt UI. All organization choices are intended to support modularity, readability, and AI assistant compatibility.

---

## 📁 Root Structure

```
/ (root)
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
├── assets/
│   └── css/
│       └── main.css        # Imports Volt UI and Tailwind base styles
├── components/
│   ├── BaseCard.vue
│   ├── FormField.vue
│   ├── StatusBadge.vue
│   ├── ToastNotification.vue
│   └── LoanCalculator.vue
├── composables/
│   ├── useAuth.ts
│   ├── useSavings.ts
│   ├── useLoans.ts
├── layouts/
│   ├── default.vue
│   └── auth.vue
├── middleware/
│   └── auth.ts
├── pages/
│   ├── index.vue           # redirects to /dashboard based on role
│   ├── login.vue
│   ├── register.vue
│   ├── dashboard.vue
│   ├── savings.vue
│   ├── loans.vue
│   └── admin/
│       ├── members.vue
│       └── loans.vue
├── stores/
│   ├── auth.ts
│   └── user.ts
├── types/
│   └── index.ts            # exports shared types like User, Loan, etc
├── utils/
│   └── formatters.ts       # number/date formatting utils
├── docs/
│   ├── frontend-requirements.md
│   ├── project-structure.md
│   ├── component-sketches.md
│   ├── ui-ux-guidelines.md
│   ├── api-endpoints.md
│   ├── types-and-models.md
│   ├── git-strats.md
│   └── development-roadmap.md
```

---

## 📦 Conventions

- Use `Base*` prefix for abstract layout components
- Group feature-specific logic in `composables/`
- Use `stores/` for global state via Pinia
- Tailwind utility classes preferred over scoped CSS
- Use `$fetch` (Nuxt 3) for all API calls instead of axios
- Follow Volt UI style tokens in all custom components

---

> 📘 This structure may evolve but should prioritize clarity and collaboration.
