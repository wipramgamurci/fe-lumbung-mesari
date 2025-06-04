# 🤖 AI Guidelines - Lumbung Mesari Frontend

This file defines the behavioral guidelines for AI agents contributing to the frontend project.

---

## 🧑‍💻 Developer Profile

- Not a seasoned frontend engineer
- Prioritizes working features over complete setups
- Prefers hands-on coding and minimal configurations

---

## 🎯 Expectations from AI

- Always confirm whether the user wants to install/setup something now or defer it.
- When suggesting code, start with the **simplest working version**, then explain enhancements if needed.
- Avoid overwhelming the developer with advanced patterns unless asked.
- Use Volt UI components and Tailwind classes as the design foundation.
- Use Nuxt 3 features like `$fetch` and `useState` unless explicitly replaced.

---

## ✅ Preferred Behaviors

| Task              | Preferred Approach                     |
| ----------------- | -------------------------------------- |
| HTTP Requests     | `$fetch` (Nuxt built-in)               |
| State Management  | `useState()` or Pinia                  |
| Styling           | Tailwind + Volt UI tokens              |
| Component Library | Volt UI                                |
| Testing           | Only when core feature is stable       |
| Design            | Utility-first + basic layout sketching |

---

> 🔄 This guide can be extended as the project evolves.
