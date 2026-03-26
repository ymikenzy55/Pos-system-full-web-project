# Remove Customers & Implement Sales Page - Implementation Plan

## Overview
Remove all customer-related functionality and create a Sales page to track transactions by unique sale ID.

## Changes Required

### 1. Database Schema Changes
- Keep `customerId` as optional in Sale model (already done)
- Remove Customer model entirely (optional - can keep for future use)
- Sales will be created without customer reference

### 2. Backend Changes

#### Remove from salesController.ts:
- Remove `customerId` parameter from createSale
- Remove customer totalSpent update logic
- Keep sale creation with unique ID

#### Remove from dashboardController.ts:
- Remove customer-related queries

#### Remove/Update Routes:
- Keep customer routes but mark as deprecated
- Sales routes remain unchanged

### 3. Frontend Changes

#### Remove PaymentModal customer fields:
- Remove customer name input
- Remove customer phone input
- Remove customer creation logic
- Direct transaction without customer

#### Update StoreContext:
- Remove `customers` state
- Remove `loadCustomers`, `addCustomer`, `deleteCustomer`
- Remove customer-related API calls from `processTransaction`
- Keep transactions loading

#### Create New Sales Page:
- List all sales with unique IDs
- Show date and total amount
- Click to expand and see items
- Date filter
- Search by sale ID
- Replace Customers page in navigation

#### Update InvoiceModal:
- Remove customer information
- Show only sale ID, date, items, total

#### Update Sidebar:
- Replace "Customers" with "Sales"
- Update navigation

### 4. Remove Console Logs
- Clean up all console.log statements except critical errors

## Implementation Order

1. Update PaymentModal (remove customer fields)
2. Update StoreContext (remove customer logic)
3. Update salesController (remove customer updates)
4. Create Sales page component
5. Update Sidebar navigation
6. Update InvoiceModal
7. Clean up console logs
8. Test complete flow

## Files to Modify

### Frontend:
- `src/app/components/pos/PaymentModal.tsx`
- `src/app/StoreContext.tsx`
- `src/app/pages/Sales.tsx` (NEW)
- `src/app/components/Sidebar.tsx`
- `src/app/components/pos/InvoiceModal.tsx`
- `src/app/App.tsx` (add Sales route)
- `src/app/services/api.ts` (clean up)

### Backend:
- `backend/src/controllers/salesController.ts`
- `backend/src/controllers/dashboardController.ts`

## Testing Checklist
- [ ] Can complete sale without customer info
- [ ] Receipt shows sale ID and items
- [ ] Sales page lists all transactions
- [ ] Can filter sales by date
- [ ] Can search sales by ID
- [ ] Can view sale details
- [ ] Dashboard stats work correctly
- [ ] No console logs in production
