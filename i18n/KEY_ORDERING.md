# Locale key ordering

How to order keys **inside** each locale JSON file. This keeps files scannable and makes it easy to keep `id` and `en` in sync.

---

## Rule: alphabetical by key

Within each **object**, sort keys **alphabetically** (a–z, case-sensitive).

- Applies to every level: top-level namespaces, nested objects like `statusOptions`, `error`, etc.
- Same order in **all locales** for the same file (e.g. `id/loan.json` and `en/loan.json` should have identical key order).

---

## Nested objects

- **Nested objects** (e.g. `statusOptions`, `error`) are treated as single units: they appear in alphabetical order among sibling keys.
- **Inside** a nested object, keys are again sorted alphabetically.

Example:

```json
{
  "loan": {
    "adminFeeAmount": "...",
    "appliedAt": "...",
    "borrower": "...",
    "statusOptions": {
      "allStatuses": "...",
      "approved": "...",
      "completed": "...",
      "pending": "...",
      "rejected": "..."
    },
    "disburseDate": "..."
  }
}
```

`statusOptions` sits between `borrower` and `disburseDate` (alphabetically); inside `statusOptions`, keys are a–z.

---

## Same file, all locales

When you add or rename a key in one locale file, add or rename it in the **same position** in the other locale file so that:

- Key order stays identical across `id` and `en` (and any other locales).
- Diffs stay minimal and readable.

---

## Quick checklist

1. Open the object (e.g. `loan`, or `installments`, or `common`).
2. Sort all direct keys of that object A–Z.
3. For each key that is an object, sort its keys A–Z as well.
4. Repeat for deeper nesting.
5. Apply the same structure and order in every locale file for that namespace (e.g. same order in `id/loan.json` and `en/loan.json`).

No special ordering for “important” keys; alphabetical only. That keeps the rule simple and consistent.
