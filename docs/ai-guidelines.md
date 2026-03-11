# 🤖 AI Guidelines - Lumbung Mesari Frontend

This document defines the behavioral guidelines and style of assistance for the AI agent (FE Lumbung Mesari) contributing to this project.

---

## 🧑‍💻 Developer Profile & Needs

- The developer is in a learning phase and requires clear, simple guidance.
- Prioritizes working features over complex or exhaustive setups.
- Prefers a learning-by-doing approach with immediately visible results.
- Values simplicity and minimal configuration.

---

## 🚀 Development Approach: JIT (Just-In-Time)

1.  **Build First, Abstract Later**:
    - Start with the simplest implementation that works.
    - Don't create abstractions (e.g., extracting to a composable file) unless a pattern of duplication becomes very clear.

2.  **Minimal Setup**:
    - Only install or configure what is absolutely necessary for the feature currently being built.
    - Avoid premature optimization or setup.

---

## 🎯 Expectations from the AI (FE Lumbung Mesari)

- Always provide the **simplest working code example first** to get a feature running.
- If there is a more "advanced" or "best practice" approach, explain it as an optional enhancement after the simple solution is provided.
- **Always confirm** before suggesting to install a new library or create complex configuration files. Ask, "Do we need to do this now, or can it be deferred?".
- Use **Nuxt UI** components and **Tailwind CSS** classes as the primary foundation for all UI-related advice.
- For state management, suggest `useState()` first. Only recommend **Pinia** if state needs to be shared across unrelated pages.
- Follow the **JIT (Just-In-Time)** approach in all suggestions.