# i18n Organizing Notes

How we structure and maintain translation files in this project.

---

## Current setup

- **Module:** `@nuxtjs/i18n`
- **Default locale:** `id`
- **Locales:** `id`, `en`
- **Base path:** `i18n/locales/` (resolved from project root via `restructureDir: 'i18n'`, `langDir: 'locales'`)

Files are loaded per locale via `files` in `nuxt.config.ts`. Each locale loads: `common.json`, `auth.json`, `loan.json`, `installments.json`, `savings.json`, `profile.json`, `navigation.json`, `members.json`, `dashboard.json`, `expenses.json`.

All listed files are **deep-merged**; keys stay the same in components (e.g. `$t('loan.principalAmount')`).

---

## Strategy: organize by domain/feature

- **Do not** organize by page. Organize by **domain/feature** so the same keys can be reused (e.g. loan detail + admin loans both use `loan.*`).
- Put **shared, generic UI** in `common` (buttons, labels, status words used in multiple places).

### File layout (per locale)

| File                | Top-level keys                                                            | Use for                                 |
| ------------------- | ------------------------------------------------------------------------- | --------------------------------------- |
| `common.json`       | `common`, `app`                                                           | Buttons, labels, months, errors         |
| `auth.json`         | `auth`, `register`, `verifyOtp`, `waitingDeposit`, `rejected`, `error403` | Auth flows                              |
| `loan.json`         | `loan`, `loanRequest`                                                     | Loan list, detail, request, admin loans |
| `installments.json` | `installments`                                                            | Installment schedule                    |
| `savings.json`      | `savings`                                                                 | Savings management                      |
| `expenses.json`     | `expenses`                                                                | Expense CRUD                            |
| `profile.json`      | `profile`                                                                 | Profile page                            |
| `navigation.json`   | `navigation`                                                              | Nav items, sidebar                      |
| `members.json`      | `adminMembers`                                                            | Member management                       |
| `dashboard.json`    | `dashboard`                                                               | Dashboard totals (capital, SHU)         |

When you add a new domain file (e.g. `loan.json`), add it to the `files` array for both `id` and `en` in `nuxt.config.ts`.

---

## Naming conventions

1. **Top-level key = domain:** `loan`, `installments`, `savings`, `common`, etc.
2. **Nested keys describe role:**
   - **Labels:** `loan.principalAmount`, `loan.tenor`
   - **Status options:** `loan.statusOptions.pending`, `installments.status.due`
   - **Messages (sentences):** `loan.loanApprovedDescription`, `installments.noInstallments`
   - **Placeholders:** `register.placeholder.email`
3. **Generic UI → `common`:** `common.approve`, `common.cancel`, `common.months`, `common.error.required`.

### Where to put a new string

- **Domain-specific** (loan, installment, savings, expense, profile) → that domain’s file.
- **Used on multiple domains** (e.g. “Status”, “Amount”, “Notes”) → `common`.
- **Interpolation:** use `{name}` in the JSON and pass in the template: `$t('installments.dueDate', { date: formatDate(...) })`.

---

## Migration checklist (from big `id.json` / `en.json`) — done

1. [x] Create new domain files under `id/` and `en/`.
2. [x] Move the corresponding key blocks **without changing key names**.
3. [x] Add each new file to `i18n.locales[].files` in `nuxt.config.ts`.
4. [x] Remove `id.json`/`en.json` (no longer used).
5. When touching a page, replace hardcoded text with `$t('...')` and use `useI18n().t()` in script for dynamic keys (e.g. status).
6. Keep `id` and `en` in sync: add the same key to both locales when you add a new string.

---

## Status / color helpers

- **Labels** (e.g. “Belum Bayar”, “Lunas”) → i18n: `$t('installments.status.due')` or `t(\`installments.status.${status}\`)`.
- **Badge colors** (e.g. success, error, warning) → keep in JS as a simple map (no i18n); same for all locales.

---

## Reference

- [@nuxtjs/i18n Options](https://i18n.nuxtjs.org/docs/api/options) — `locales`, `files`, `langDir`, `restructureDir`
- Usage in components: `$t('key')` in template, `const { t } = useI18n(); t('key')` in script
