# 🧩 Component Sketches - Lumbung Mesari

This document provides markdown-based layout sketches for key pages and components of the Lumbung Mesari frontend. It is a living document and should be updated as new pages and components are added.

---

## `/dashboard` (Member)

- **Header**: "Dashboard"
    
- **Section: Account Summary**
    
    - BaseCard: "Total Balance"
        
    - BaseCard: "Total Savings"
        
    - BaseCard: "Active Loans"
        
- **Section: Recent Transactions**
    
    - Table:
        
        - Columns: Date | Type | Amount | StatusBadge
            
        - Action: None
            

---

## `/dashboard` (Admin)

- **Header**: "Admin Dashboard"
    
- **Section: Overview Cards**
    
    - BaseCard: "Total Members"
        
    - BaseCard: "Pending Loans"
        
- **Section: Quick Actions**
    
    - Button: "Manage Members"
        
    - Button: "Review Loans"
        

---

## `/savings`

- **Header**: "My Savings"
    
- **Section: Current Balance**
    
    - BaseCard: with current balance info
        
- **Section: Savings Form**
    
    - FormField: `amount`
        
    - Select: `type` (deposit / withdrawal)
        
    - Submit Button
        
- **Section: Savings History**
    
    - Table: Date | Amount | Type | StatusBadge
        

---

## `/loans`

- **Header**: "Loan Center"
    
- **Section: Loan Application Form**
    
    - FormField: `amount`
        
    - Select: `tenor` (6 / 12 / 18 months)
        
    - Component: LoanCalculator (preview installment)
        
    - Submit Button
        
- **Section: My Loans**
    
    - Table: Amount | Tenor | StatusBadge | CreatedAt
        

---

## `/admin/members`

- **Header**: "Manage Members"
    
- **Section: Member List**
    
    - Table: Name | Email | StatusBadge | Actions (Approve, Reject, View)
        

---

## `/admin/loans`

- **Header**: "Loan Applications"
    
- **Section: Loan Application List**
    
    - Table: Member Name | Amount | Tenor | StatusBadge | Actions (Approve, Reject, View Schedule)
        

---

## Components

### `BaseCard.vue`

- Wrapper with title slot
    
- Padding `p-6`
    
- Rounded and shadow
    

### `FormField.vue`

- Label + Input + Error Message slot
    
- Stacked vertically
    

### `StatusBadge.vue`

- Green for approved, Yellow for pending, Red for rejected
    
- Small rounded badge with text
    

### `ToastNotification.vue`

- Appears top-right on form submission
    
- Variants: success, error
    

### `LoanCalculator.vue`

- Input: amount & tenor
    
- Output: Monthly installment preview
    

---

> ✅ Update this document as new screens and UI ideas are added during development.