# 🗂️ Project Structure - Lumbung Mesari Frontend

This document describes the folder and file structure of the Nuxt 3 frontend project using Volt UI components and Tailwind CSS.

---

## 📁 Root Structure

```
/ (root)
├── app.vue                  # Root Vue component
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
├── public/                  # Static files
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── main.css    # Global styles and overrides
│   │
│   ├── components/        # Application components
│   │   ├── ui/              # Custom UI components
│   │   │   ├── FormField.vue   # Wrapper for form fields with label/error
│   │   │   └── StatusBadge.vue # Status indicators
│   │   └── shared/          # Shared feature-agnostic components
│   │
│   ├── composables/       # Composable functions
│   │   ├── useAuth.ts      # Authentication logic
│   │   ├── useApi.ts       # API client wrapper
│   │   └── useForm.ts      # Form handling utilities
│   │
│   ├── layouts/           # Layout components
│   │   ├── default.vue     # Main app layout
│   │   └── auth.vue        # Auth pages layout
│   │
│   ├── middleware/        # Route middleware
│   │   ├── auth.ts         # Authentication guard
│   │   └── guest.ts        # Guest route guard
│   │
│   ├── pages/             # Auto-imported routes
│   │   ├── index.vue       # Redirects to /dashboard
│   │   ├── login.vue       # Login page
│   │   ├── register.vue    # Registration page
│   │   ├── dashboard.vue   # Member dashboard
│   │   └── admin/          # Admin section
│   │
│   ├── stores/            # Pinia stores
│   │   ├── auth.ts         # Auth store
│   │   └── user.ts         # User data store
│   │
│   └── utils/             # Utility functions
│       ├── formatters.ts    # Formatting utilities
│       └── validators.ts    # Validation helpers
│
├── volt/                  # Volt UI components (auto-imported)
│   ├── Button.vue          # Primary button
│   ├── SecondaryButton.vue # Secondary button
│   ├── ContrastButton.vue  # Contrast button
│   ├── DangerButton.vue    # Danger button
│   ├── Card.vue            # Card component
│   ├── InputText.vue       # Text input
│   ├── Textarea.vue        # Textarea input
│   ├── Select.vue          # Dropdown select
│   ├── Checkbox.vue        # Checkbox input
│   ├── RadioButton.vue     # Radio button
│   ├── Toast.vue           # Toast notifications
│   └── Badge.vue           # Status badges
│
└── docs/                 # Project documentation
    ├── development-roadmap.md
    ├── ui-ux-guidelines.md
    ├── component-sketches.md
    └── ...
```

---

## 📦 Component Usage Guidelines

### Volt UI Components
- Import components directly from `@/src/volt/`
- Each variant (like different button types) is a separate component
- Components are pre-styled with Tailwind CSS
- Support dark mode out of the box

### Custom Components
- Place in `src/components/ui/` for UI components
- Use `FormField` wrapper for consistent form field styling
- Follow Volt UI's theming approach for custom components

### State Management
- Use Pinia for global state
- Use composables for reusable logic
- Keep component state local when possible

### Styling
- Use Tailwind utility classes directly in templates
- Follow Volt UI's design system for consistency
- Use CSS variables for theming when needed

---

> 📘 This structure follows Nuxt 3 conventions while leveraging Volt UI components for consistent UI development.
