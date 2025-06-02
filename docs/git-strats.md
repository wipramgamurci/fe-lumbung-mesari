# 🚀 Git Strategy - Lumbung Mesari Frontend

This document defines the Git workflow, branching rules, and commit conventions for the Lumbung Mesari frontend project. The goal is to maintain a clean, consistent codebase and smooth collaboration between team members and AI tools.

---

## 1. Branching Strategy

- **`main`**: Stable, production-ready code. Only release branches or hotfixes should be merged here.
    
- **`dev`**: Main integration branch. All new features are merged into `dev` first for testing.
    
- **`feature/<feature-name>`**: Short-lived branches for specific features or pages.
    

### ✅ Naming Example:

- `feature/login-page`
    
- `feature/dashboard-summary`
    

---

## 2. Commit Message Convention

Use the following format:

```
<type>: <short description>
```

### Allowed `<type>` values:

- `feat`: A new feature
    
- `fix`: A bug fix
    
- `chore`: Maintenance, config, or refactor without functional change
    
- `docs`: Documentation changes only
    
- `refactor`: Code restructuring (no behavior change)
    
- `style`: Code formatting, missing semicolons, etc (no logic changes)
    
- `test`: Adding or updating tests
    

### Example:

```
feat: add loan application form
fix: validate empty email on register
refactor: extract savings logic to composable
```

---

## 3. Workflow Rules

1. Always branch off from `dev` when creating a new feature:
    
    ```
    git checkout dev
    git pull origin dev
    git checkout -b feature/login-page
    ```
    
2. Push regularly and keep your branch synced with `dev`:
    
    ```
    git pull origin dev --rebase
    git push origin feature/login-page
    ```
    
3. Open a **Pull Request (PR)** from `feature/*` into `dev` with clear description and screenshots (if UI).
    
4. Optional: Use **Squash and Merge** for clean commit history.
    
5. Merge `dev` into `main` only when releasing stable MVP or versioned milestones.
    

---

## 4. Tags & Releases (Optional)

When pushing to `main`, use tags for versioning:

```
git tag v1.0.0
```

Use [Semantic Versioning](https://semver.org/):

- `v1.0.0`: First stable release
    
- `v1.1.0`: New features (backward compatible)
    
- `v1.1.1`: Bug fixes
    

---

## 5. Notes for AI Agent

- When asked for commit message, follow the format above
    
- Suggest branch name using `feature/<short-description>`
    
- Always recommend rebase over merge unless on `main`
    
- All code should be pulled from `dev` before starting work
    

---

This strategy helps ensure clear collaboration, easy review, and clean history during project development.