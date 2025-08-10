# 🌐 API Endpoints (Assumed) - Lumbung Mesari Frontend

This document outlines the assumed REST API endpoints for the Lumbung Mesari frontend. All endpoints will be validated and updated once the backend team confirms the final structure.

---

## 🔐 Authentication

| Endpoint | Method | Auth | Description | Response Example |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | ❌ | Login with email + password | `{ token: string }` |
| `/auth/register` | `POST` | ❌ | Register new user with data and files | `201 Created` |
| `/auth/me` | `GET` | ✅ | Get current user profile | `{ id, name, email, role, status }` |

---

## 👤 Member Management (Admin)

| Endpoint | Method | Auth | Description | Response Example |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/members` | `GET` | ✅ | Get all members | `Member[]` |
| `/admin/members/:id/approve` | `POST` | ✅ | Approve a member's registration | `{ status: 'approved' }` |
| `/admin/members/:id/reject` | `POST` | ✅ | Reject a member's registration | `{ status: 'rejected' }` |

---

## 💰 Savings

| Endpoint | Method | Auth | Description | Response Example |
| :--- | :--- | :--- | :--- | :--- |
| `/savings` | `GET` | ✅ | Get all savings transactions for the current user | `Saving[]` |
| `/savings/deposit` | `POST` | ✅ | Create a new deposit transaction | `Saving` |
| `/savings/withdrawal` | `POST` | ✅ | Create a new withdrawal transaction | `Saving` |


---

## 🏦 Loans

| Endpoint | Method | Auth | Description | Response Example |
| :--- | :--- | :--- | :--- | :--- |
| `/loans` | `GET` | ✅ | Get all loans for the current user | `Loan[]` |
| `/loans` | `POST` | ✅ | Submit a new loan application | `Loan` |
| `/admin/loans` | `GET` | ✅ | Get all loan applications (for admin) | `Loan[]` |
| `/admin/loans/:id/approve` | `POST` | ✅ | Approve a loan application | `{ status: 'approved' }` |
| `/admin/loans/:id/reject`| `POST` | ✅ | Reject a loan application | `{ status: 'rejected' }` |

---

## Notes

- All authenticated requests (✅) must include the `Authorization: Bearer <token>` header.
- These assumptions are based on the initial `requirement.md` document and may change.
- Pagination and filters will be added as needed.