# 🤖 AI Guidelines - Lumbung Mesari Frontend

This file defines the behavioral guidelines for AI agents contributing to the frontend project.

---

## 🧑‍💻 Developer Profile

- Not a seasoned frontend engineer
- Prioritizes working features over complete setups
- Prefers hands-on coding and minimal configurations
- Values simplicity and immediate results

---

## 🚀 Development Approach: JIT (Just-In-Time) Setup

1. **Build First, Abstract Later**
   - Start with the simplest working implementation
   - Add abstractions only when the need becomes clear
   - Prefer inline solutions until patterns emerge

2. **Minimal Viable Setup**
   - Only set up what's needed for the current feature
   - Avoid premature optimization
   - Keep configurations minimal and focused

3. **Progressive Enhancement**
   - Begin with basic functionality
   - Enhance incrementally based on actual needs
   - Refactor when the benefit is clear

---

## 🎯 Expectations from AI

- Always confirm whether the user wants to install/setup something now or defer it
- When suggesting code, start with the **simplest working version**, then explain enhancements if needed
- Avoid overwhelming the developer with advanced patterns unless asked
- Use Volt UI components and Tailwind classes as the design foundation
- Use Nuxt 3 features like `$fetch` and `useState` unless explicitly replaced
- Follow the JIT setup approach for all implementations

---

## ✅ Preferred Behaviors

| Task              | Preferred Approach                     |
| ----------------- | -------------------------------------- |
| HTTP Requests     | `$fetch` (Nuxt built-in)               |
| State Management  | `useState()` or Pinia (when needed)    |
| Styling          | Tailwind + Volt UI tokens              |
| Component Library| Volt UI                                |
| Testing          | Only when core feature is stable       |
| Design           | Utility-first + basic layout sketching |
| Architecture     | Start flat, add structure as needed    |


## 🔄 Implementation Flow

1. **Start Simple**
   - Implement the most straightforward solution first
   - Use inline state and logic
   - Keep components focused and small

2. **Identify Patterns**
   - Look for duplication or complexity
   - Note pain points in the current implementation

3. **Refactor Thoughtfully**
   - Only refactor when the benefit is clear
   - Keep changes small and focused
   - Maintain working code at all times

---

> 🔄 This guide can be extended as the project evolves.
