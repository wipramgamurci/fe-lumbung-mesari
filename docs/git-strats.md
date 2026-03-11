# 🚀 Git Strategy - Lumbung Mesari Frontend

This document defines the Git workflow, branching rules, and commit message conventions for the Lumbung Mesari frontend project. The goal is to maintain a clean, consistent codebase and facilitate smooth collaboration.

---

## 1. Branching Strategy

- **`main`**: Stable, production-ready code. Only stable `dev` branches or hotfixes should be merged here.
- **`dev`**: The main integration branch. All new features are merged into `dev` first for joint testing.
- **`feature/<feature-name>`**: Short-lived branches for developing specific features or pages.

### ✅ Naming Examples:

- `feature/login-page`
- `feature/admin-approval-table`
- `feature/loan-application-form`

---

## 2. Commit Message Convention

Use the *Conventional Commits* format. This helps in generating automatic changelogs and maintaining a clean history.

`<type>`: `<short description>`

### Allowed Types:

- **`feat`**: A new feature.
- **`fix`**: A bug fix.
- **`chore`**: Maintenance tasks (e.g., updating dependencies, config files).
- **`docs`**: Changes to documentation only.
- **`refactor`**: Code restructuring with no change in functionality.
- **`style`**: Code formatting changes (spaces, semicolons, etc.).
- **`test`**: Adding or fixing tests.

### ✅ Commit Message Examples:

```
feat: add loan application form component
fix: prevent negative amount in savings deposit
chore: install nuxt ui module
```

---

## 3. Workflow Rules

1.  Always create a new branch from the latest `dev`.
    ```bash
    git checkout dev
    git pull origin dev
    git checkout -b feature/login-page
    ```

2.  Commit regularly with clear messages.

3.  Before submitting a Pull Request (PR), sync your branch with the latest `dev` to prevent conflicts.
    ```bash
    git pull origin dev --rebase
    ```

4.  Open a **Pull Request (PR)** from your `feature/*` branch into `dev` with a clear description of your work.

5.  Only the Project Maintainer should merge from `dev` into `main` when releasing a new version.