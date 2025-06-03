# 🎨 UI/UX Guidelines - Lumbung Mesari Frontend (Volt UI)

This guide defines the design principles and interface rules for building a clean, consistent, and accessible frontend using Volt UI and Tailwind CSS.

---

## ✏️ Design Philosophy

- Prioritize clarity, readability, and action-based layouts
- Use visual hierarchy to guide user focus (cards, badges, icons)
- Favor native form behavior with minimal distraction
- Build for responsiveness and accessibility from the start

---

## 🎨 Color and Theme Guidelines

Volt UI uses CSS variables for consistent theme styling:

### Primary

- `--p-primary-color` → main accent color
- `--p-primary-hover-color` → hover state
- `--p-primary-active-color` → active/clicked

### Surface

- `--p-surface-0` to `--p-surface-950` → used for background layers
- `--p-content-border-color` → card and section outlines

### Text

- `--p-text-color` → default readable text
- `--p-text-muted-color` → for secondary or label text

These variables are styled through Tailwind via class bindings or direct CSS (e.g. `bg-[var(--p-surface-100)]`).

---

## 🧱 Layout and Spacing

- Page width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card layout: use Volt `Card` component or `BaseCard.vue`
- Grid system: `grid grid-cols-1 md:grid-cols-2` with `gap-4`
- Section spacing: `py-6` or `mb-8`

---

## 🧩 Component Usage Guidelines

### Buttons

- Use Volt `Button` component
- Default: primary variant
- Add icons with `icon-left` or `icon-right` if needed

### Form Inputs

- Wrap all inputs with `FormField.vue`
- Label, input, error message included
- Use Tailwind spacing: `space-y-2` per field

### Badges/Tags

- Use `StatusBadge.vue` that wraps Volt `Tag`
- Status colors:
  - Green = Approved
  - Yellow = Pending
  - Red = Rejected

### Tables

- Use Volt `DataTable`
- Add action buttons per row if needed (View, Approve, Reject)
- Use `Paginator` component for more than 10 rows

### Notifications

- Use `ToastNotification.vue` (wrapping Volt `Toast`)
- For success/error/status messaging only

---

## 🌙 Dark Mode

- Dark mode auto-applies via `prefers-color-scheme`
- You can override styles with:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --p-primary-color: var(--p-primary-300);
    --p-text-color: var(--p-surface-0);
  }
}
```

---

## 📱 Responsive Guidelines

- All layouts should support mobile first
- Use `flex-col md:flex-row`, `w-full`, `overflow-auto`
- Avoid fixed widths where possible

---

> 📌 This guide should evolve with design feedback and usability insights.
