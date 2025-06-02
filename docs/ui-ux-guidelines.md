# 🎨 UI/UX Guidelines - Lumbung Mesari (Simplified for Developer without Design Background)

This document defines simple and practical UI/UX rules to help developers build a consistent and clean interface for the Lumbung Mesari frontend, even without design expertise.

These rules are compatible with **Tailwind CSS** and **Volt UI**.

---

## 1. Design Philosophy

- Focus on clarity, simplicity, and function.
    
- All pages should be readable, responsive, and easy to use.
    
- Avoid clutter: only show what’s needed per page.
    

---

## 2. Layout Basics

- Use `grid` or `flex` for all layouts.
    
- Section wrapper: use `BaseCard.vue` with padding.
    
- Page spacing: `p-6` for outer layout.
    
- Between elements: use `gap-4` or `gap-6`
    

### Example layout grid:

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <BaseCard title="Total Balance" />
  <BaseCard title="Active Loans" />
</div>
```

---

## 3. Typography & Text Style

- Section titles: `text-lg font-semibold`
    
- Sub-labels or hints: `text-sm text-gray-500`
    
- Paragraphs: default `text-base`
    

---

## 4. Colors

Use the Tailwind + Volt UI default palette:

- **Primary (buttons):** `bg-blue-600` / `text-white`
    
- **Success (badge):** `bg-green-100 text-green-700`
    
- **Error (badge):** `bg-red-100 text-red-700`
    
- **Neutral/Info:** `bg-gray-100 text-gray-700`
    

No need to define a custom color config at this stage.

---

## 5. Components

- Use Volt UI components as much as possible.
    
- Reuse the following custom components:
    
    - `BaseCard.vue`: for wrapping each section or summary box
        
    - `FormField.vue`: for label + input + validation error
        
    - `StatusBadge.vue`: for showing status (e.g. loan status, member status)
        
    - `ToastNotification.vue`: for alerts
        

---

## 6. Form Design

- All forms use `FormField.vue`
    
- Field spacing: `gap-4`
    
- Button placement: always right-aligned if inside a card or form
    
- Required fields: add `*` in label
    

---

## 7. Table Design

- Use Volt UI or Tailwind table with clear headers
    
- Table headers: `uppercase text-xs text-gray-500`
    
- Row hover: `hover:bg-gray-50`
    
- Actions: right-aligned with buttons or links
    

---

## 8. Mobile Responsiveness

- Use `grid-cols-1` on small, `grid-cols-2` on `md` and up
    
- Texts must wrap (`break-words`) in small screens
    
- Avoid fixed widths. Use `w-full max-w-*` pattern
    

---

## 9. Feedback and Status

- Show `ToastNotification` after form success/failure
    
- Use `StatusBadge` to show loan/member statuses
    
- Show loading states using `loading` boolean
    

---

## 10. Accessibility (Basic)

- All inputs have `label`
    
- All buttons use `aria-label` if icon-only
    
- Color contrast must be readable (use default Volt/Tailwind colors)
    

---

These guidelines are designed to make your UI development fast, consistent, and AI-assistable — even if you’re not a designer.