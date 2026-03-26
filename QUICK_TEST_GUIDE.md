# Quick Test Guide

## What Was Fixed

1. **Dashboard Stats** - Added logging to track data flow
2. **History Page** - Now loads ALL transactions (not just today's)
3. **Customer Deletion** - Enhanced error logging and validation
4. **All Pages** - Verified functionality (Reports, Settings already working)

## Quick Test Steps

### 1. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Login
- Email: `admin@store.com`
- Password: `admin123`

### 3. Test Dashboard (2 minutes)
1. Open browser console (F12)
2. Navigate to Dashboard
3. Look for: `=== LOADING DASHBOARD STATS ===`
4. Check if Today's Revenue and Orders Today show numbers (not 0)
5. Verify Total Products and Customers show correct counts

### 4. Make a Test Sale (3 minutes)
1. Go to POS page
2. Add a product to cart
3. Click "Checkout"
4. Fill in customer details:
   - Name: Test Customer
   - Phone: 0241234567 (10 digits)
5. Select payment method (Cash or MoMo)
6. Complete transaction
7. Check console for: `=== CREATE SALE REQUEST ===`

### 5. Verify Dashboard Updated (1 minute)
1. Go back to Dashboard
2. Verify Today's Revenue increased
3. Verify Orders Today increased
4. Check Recent Transactions shows the sale

### 6. Test History Page (2 minutes)
1. Navigate to History page
2. Look for: `=== LOADING TRANSACTIONS ===`
3. Verify your test sale appears with:
   - Date and time
   - Customer name
   - Items count
   - Total amount
4. Test date filter
5. Test search by customer name

### 7. Test Customer Deletion (2 minutes)
1. Navigate to Customers page
2. Find "Test Customer" (the one you just created)
3. Try to delete - button should be DISABLED (has purchase history)
4. Create a new customer without making a sale:
   - Click "Add Customer"
   - Name: Delete Me
   - Phone: 0249999999
5. Try to delete "Delete Me" - should work
6. Check console for: `=== DELETE CUSTOMER ===`

### 8. Test Reports Page (1 minute)
1. Navigate to Reports
2. Verify charts show data
3. Change date range
4. Verify data updates

### 9. Test Settings Page (1 minute)
1. Navigate to Settings
2. Verify shop info displays
3. Verify Staff Management section shows
4. Try creating a new staff member (optional)

## Expected Console Logs

### Dashboard Loading:
```
=== LOADING DASHBOARD STATS ===
Shop ID: [shop-id]
Dashboard API Response: {...}
Total Revenue: [number]
Transaction Count: [number]
Items Sold: [number]
Dashboard stats updated successfully
```

### Transaction Loading:
```
=== LOADING TRANSACTIONS ===
Shop ID: [shop-id]
Sales Summary Response: {...}
Found sales: [number]
Transactions loaded: [number]
```

### Customer Deletion:
```
=== DELETE CUSTOMER ===
Shop ID: [shop-id]
Customer ID: [customer-id]
User Role: ADMIN
```

## Common Issues & Solutions

### Dashboard shows 0 for revenue/orders:
- Check console logs for API response
- Verify backend is running
- Check if there are any sales in the database
- Make a test sale and verify it updates

### History page is empty:
- Check console: `=== LOADING TRANSACTIONS ===`
- Verify `Found sales: X` shows a number > 0
- Make a test sale if no sales exist

### Cannot delete customer:
- Check if customer has purchase history (totalSpent > 0)
- Delete button should be disabled for customers with purchases
- Check console for error details
- Verify you're logged in as ADMIN

### Reports page shows "Loading...":
- Wait a few seconds for data to load
- Check browser console for errors
- Verify date range is valid
- Try changing date range

## Success Criteria

✅ Dashboard shows correct Today's Revenue and Orders Today
✅ History page displays all transactions with dates
✅ Customer deletion works for customers without purchases
✅ Customer deletion is blocked for customers with purchases
✅ Reports page shows charts with data
✅ Settings page displays shop info and staff management
✅ All console logs appear as expected

## If Something Doesn't Work

1. Check browser console for error messages
2. Check backend terminal for error logs
3. Verify you're logged in as ADMIN
4. Try refreshing the page
5. Check the detailed logs in console (=== markers)
6. Share the console logs for debugging

## Time Required
- Total test time: ~15 minutes
- Critical tests only: ~5 minutes (Dashboard, History, Customer deletion)
