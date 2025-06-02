# 🌐 API Endpoints (Assumed) - Lumbung Mesari Frontend

This document outlines the assumed REST API endpoints for the Lumbung Mesari frontend. These assumptions are based on the backend requirements document. All endpoints will be validated and updated once backend confirms the final structure.

---

## 🔐 Authentication

|Endpoint|Method|Auth|Description|Response Example|
|---|---|---|---|---|
|`/auth/login`|POST|❌|Login with email + 2FA|`{ token: string }`|
|`/register`|POST|❌|Register new user|`201 Created`|
|`/me`|GET|✅|Get current user profile|`{ id, name, email, role }`|

---

## 👤 Member Management

|Endpoint|Method|Auth|Description|Response Example|
|---|---|---|---|---|
|`/members`|GET|✅|Get all members (admin only)|`Member[]`|
|`/members/:id`|GET|✅|Get specific member (admin only)|`Member`|
|`/members/:id/status`|POST|✅|Approve or reject member (admin)|`{ status: 'approved' }`|

---

## 💰 Savings

|Endpoint|Method|Auth|Description|Response Example|
|---|---|---|---|---|
|`/savings`|GET|✅|Get all savings for current user|`Saving[]`|
|`/savings`|POST|✅|Create a deposit/withdrawal|`{ id, amount, type }`|

---

## 🏦 Loans

|Endpoint|Method|Auth|Description|Response Example|
|---|---|---|---|---|
|`/loans`|GET|✅|Get all loans for current user|`Loan[]`|
|`/loans`|POST|✅|Submit a new loan application|`{ id, status }`|
|`/admin/loans`|GET|✅|Get all loan applications (admin)|`Loan[]`|
|`/admin/loans/:id/approve`|POST|✅|Approve/reject loan (admin)|`{ status: 'approved' }`|

---

## 📄 Reports (Optional)

|Endpoint|Method|Auth|Description|Response Example|
|---|---|---|---|---|
|`/reports/statements`|GET|✅|Get monthly savings/loan summary|PDF or JSON format|

---

## Notes

- All requests use `Authorization: Bearer <token>` header if authenticated
    
- Assumptions are based on the backend `requirement.md` file and may change
    
- `2FA` token is assumed to be sent manually via email
    
- Pagination/query filtering will be added later as needed
    

---

Next: Confirm this structure with backend team and begin implementing mock composables accordingly.