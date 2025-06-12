# 🎨 UI/UX Guidelines - Lumbung Mesari Frontend (Volt UI)

This guide defines the design principles and interface rules for building a clean, consistent, and accessible frontend using Volt UI and Tailwind CSS.

---

## ✏️ Design Philosophy

- Prioritize clarity, readability, and action-based layouts
- Use Volt UI components as the foundation for consistent styling
- Create wrapper components for common patterns and customizations
- Build for responsiveness and accessibility from the start

---

## 🎨 Color and Theme Guidelines

### Volt UI Theme
We use Volt UI's built-in theming system. The main theme colors are:

- **Primary**: `--p-primary-500` (main brand color)
- **Success**: `--p-success-500` (green)
- **Warning**: `--p-warning-500` (yellow)
- **Danger**: `--p-danger-500` (red)
- **Text**: `--p-text-color`
- **Background**: `--p-surface-0` to `--p-surface-1000`

### Status Colors
- Success: `--p-success-500` (approved, completed)
- Warning: `--p-warning-500` (pending, in-progress)
- Danger: `--p-danger-500` (rejected, error)
- Info: `--p-primary-500` (information)

### Usage in Components
```vue
<template>
  <div class="bg-surface-50 text-text">
    <!-- Your component -->
  </div>
</template>
```

---

## 🧱 Layout and Spacing

- Page width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card layout: use Volt `Card` component or `BaseCard.vue`
- Grid system: `grid grid-cols-1 md:grid-cols-2` with `gap-4`
- Section spacing: `py-6` or `mb-8`

---

## 🧩 Component Usage Guidelines

### Component Wrapping Strategy
We create wrapper components around Volt UI to:
1. Enforce consistent styling
2. Reduce code duplication
3. Make future theming easier

### Buttons (`BaseButton`)
- Wraps Volt's `Button`
- Default: primary variant
- Sizes: `sm`, `md` (default), `lg`
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Icons: Use `icon` prop with icon name

### Form Inputs (`BaseInput`, `BaseSelect`, etc.)
- Wraps Volt's form components
- Always include labels and error handling
- Use `FormField` for layout and validation messages
- Standard spacing: `space-y-2` per field

### Status Indicators (`StatusBadge`)
- Wraps Volt's `Badge` component
- Status types:
  - `success`: Approved, Completed
  - `warning`: Pending, In Progress
  - `danger`: Rejected, Error
  - `info`: Information

### Data Display (`DataTable`)
- Use Volt's `DataTable` directly
- Add pagination for > 10 rows
- Include loading states
- Make rows clickable for details

### Feedback (`ToastNotification`)
- Wraps Volt's `Toast`
- Auto-dismiss after 5s
- Stack multiple toasts
- Types: `success`, `error`, `warning`, `info`

### Layout Components
- `BaseCard`: Consistent card styling
- `PageHeader`: Standard page headers with optional actions
- `Section`: Content sections with consistent spacing

### Form Patterns
- Use `FormField` wrapper for all form controls
- Group related fields with `fieldset`
- Show validation messages below fields
- Disable submit buttons during submission

---

## 🌙 Dark Mode

Volt UI handles dark mode automatically via `prefers-color-scheme`. No additional setup is needed.

### Custom Dark Mode Overrides
If you need to adjust dark mode styles, use:

```css
@media (prefers-color-scheme: dark) {
  .custom-element {
    background-color: var(--p-surface-900);
    color: var(--p-text-color);
  }
}
```

### Component-Specific Adjustments
Some components might need specific dark mode overrides. Add these to your component's style section:

```vue
<style scoped>
/* Dark mode overrides */
:global(.dark) .my-component {
  /* Dark mode styles */
}
</style>
```

---

## 📱 Responsive Guidelines

- All layouts should support mobile first
- Use `flex-col md:flex-row`, `w-full`, `overflow-auto`
- Avoid fixed widths where possible

---

> 📌 This guide should evolve with design feedback and usability insights.
