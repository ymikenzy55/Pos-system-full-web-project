# Frontend-Backend Integration Plan

## Current Status
✅ Backend API running on http://localhost:3000
✅ Database connected (Supabase)
✅ Auth endpoints working (register, login)
✅ Shop management working
✅ Frontend API service updated

## Remaining Backend Implementation (Critical)

### 1. Staff Management Controller & Routes
**File**: `backend/src/controllers/staffController.ts`
**Routes**: `backend/src/routes/staffRoutes.ts`
**Functions needed**:
- addStaff() - Add new staff member
- getAllStaff() - List all staff
- updateStaffRole() - Change role (ADMIN, MANAGER, CASHIER)
- updateStaffStatus() - Activate/deactivate
- deleteStaff() - Remove staff

### 2. Product & Category Controllers
**Files**: 
- `backend/src/controllers/productController.ts`
- `backend/src/controllers/categoryController.ts`
- `backend/src/routes/productRoutes.ts`
- `backend/src/routes/categoryRoutes.ts`

### 3. Sales & Inventory Controllers
**Files**:
- `backend/src/controllers/salesController.ts`
- `backend/src/controllers/inventoryController.ts`
- `backend/src/routes/salesRoutes.ts`
- `backend/src/routes/inventoryRoutes.ts`

### 4. Customer Controller
**Files**:
- `backend/src/controllers/customerController.ts`
- `backend/src/routes/customerRoutes.ts`

### 5. Dashboard Controller
**File**: `backend/src/controllers/dashboardController.ts`
**Routes**: `backend/src/routes/dashboardRoutes.ts`

### 6. Mount All Routes in server.ts
Add all route imports and mount them

## Frontend Integration Steps

### 1. Update Login Component
- Replace mock auth with `authAPI.login()`
- Store token in localStorage
- Store user data

### 2. Create New StoreContext with API Integration
Replace mock data with:
- `productAPI.getAll()` for products
- `salesAPI.create()` for transactions
- `customerAPI` for customers
- Real-time data fetching

### 3. Update Settings Page
Add staff management UI:
- List all staff members
- Add new staff (email, role)
- Change roles
- Activate/deactivate staff
- Only accessible to ADMIN role

### 4. Update Inventory Page
- Connect to `productAPI.create()`
- Connect to `inventoryAPI.adjust()`
- Real stock updates

### 5. Update POS Page
- Connect to `salesAPI.create()`
- Real-time inventory deduction

### 6. Update Dashboard
- Connect to `dashboardAPI` endpoints
- Real metrics

## Quick Implementation Commands

```bash
# Backend - Complete remaining controllers
cd backend

# Frontend - Test integration
cd ..
npm run dev

# Both running:
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

## Demo Flow After Integration

1. **Register/Login**: Use real auth
2. **Create Shop**: First user becomes ADMIN
3. **Add Staff**: Admin adds managers/cashiers
4. **Add Products**: Manager/Admin adds inventory
5. **Process Sales**: Cashier makes sales
6. **View Dashboard**: See real metrics

## Priority Order

1. ✅ Auth (Done)
2. ✅ Shop Management (Done)
3. 🔄 Staff Management (Next - Critical)
4. 🔄 Product Management
5. 🔄 Sales Processing
6. 🔄 Dashboard Analytics

## Estimated Time
- Backend controllers: 30-45 min
- Frontend integration: 45-60 min
- Testing: 15-30 min
**Total**: ~2 hours for complete integration
