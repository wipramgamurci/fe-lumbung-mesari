# Dark Mode Color Mapping Reference

## Quick Memory Rules

### 🎨 **Background Colors**

```
Light Mode    →  Dark Mode
─────────────    ───────────
bg-gray-50    →  dark:bg-gray-900  (Main background)
bg-white      →  dark:bg-gray-800  (Cards, panels)
bg-gray-100   →  dark:bg-gray-800  (Secondary background)
```

### 📝 **Text Colors**

```
Light Mode    →  Dark Mode
─────────────    ───────────
text-gray-900 →  dark:text-white   (Primary text - headings)
text-gray-600 →  dark:text-gray-300 (Secondary text - descriptions)
text-gray-500 →  dark:text-gray-400 (Tertiary text - metadata)
text-gray-400 →  dark:text-gray-500 (Muted text)
```

### 🔲 **Border Colors**

```
Light Mode    →  Dark Mode
─────────────    ───────────
border-gray-200 →  dark:border-gray-700 (Light borders)
border-gray-300 →  dark:text-gray-600   (Stronger borders)
```

## 🧠 **Memory Tricks**

### **Background Rule: "50 → 900, White → 800"**

- `gray-50` (lightest) becomes `gray-900` (darkest)
- `white` becomes `gray-800` (dark but not darkest)

### **Text Rule: "Subtract 300"**

- `gray-900` → `white` (900 becomes white)
- `gray-600` → `gray-300` (600 - 300 = 300)
- `gray-500` → `gray-400` (500 - 100 = 400)
- `gray-400` → `gray-500` (400 + 100 = 500)

### **Border Rule: "Add 500"**

- `gray-200` → `gray-700` (200 + 500 = 700)
- `gray-300` → `gray-600` (300 + 300 = 600)

## 📋 **Common Patterns**

### **Card/Container Pattern**

```vue
<div
  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
>
  <h2 class="text-gray-900 dark:text-white">Title</h2>
  <p class="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

### **Page Background Pattern**

```vue
<div class="bg-gray-50 dark:bg-gray-900">
  <!-- Page content -->
</div>
```

### **Text Hierarchy Pattern**

```vue
<h1 class="text-gray-900 dark:text-white">Main Title</h1>
<h2 class="text-gray-900 dark:text-white">Section Title</h2>
<p class="text-gray-600 dark:text-gray-300">Body text</p>
<span class="text-gray-500 dark:text-gray-400">Small text</span>
```

## 🎯 **Quick Reference Table**

| Light Mode        | Dark Mode              | Usage                    |
| ----------------- | ---------------------- | ------------------------ |
| `bg-gray-50`      | `dark:bg-gray-900`     | Page background          |
| `bg-white`        | `dark:bg-gray-800`     | Cards, modals            |
| `text-gray-900`   | `dark:text-white`      | Headings, important text |
| `text-gray-600`   | `dark:text-gray-300`   | Body text, descriptions  |
| `text-gray-500`   | `dark:text-gray-400`   | Metadata, timestamps     |
| `border-gray-200` | `dark:border-gray-700` | Light borders            |
| `border-gray-300` | `dark:border-gray-600` | Strong borders           |

## 💡 **Pro Tips**

1. **Start with backgrounds** - they have the biggest visual impact
2. **Use the "subtract 300" rule** for text colors
3. **Remember: 50→900, white→800** for backgrounds
4. **Test both modes** - always check how it looks in both light and dark
5. **Be consistent** - use the same mapping throughout your app

## 🔧 **VS Code Snippet** (Optional)

You can create a VS Code snippet to speed up typing:

```json
{
  "Dark Mode Classes": {
    "prefix": "dark",
    "body": [
      "bg-gray-50 dark:bg-gray-900",
      "bg-white dark:bg-gray-800",
      "text-gray-900 dark:text-white",
      "text-gray-600 dark:text-gray-300",
      "text-gray-500 dark:text-gray-400",
      "border-gray-200 dark:border-gray-700"
    ]
  }
}
```
