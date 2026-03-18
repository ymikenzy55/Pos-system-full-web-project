# API Integration Guide

## Overview
This frontend is configured to work with the backend API routes provided. Currently using mock data for development.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `VITE_API_URL` in `.env` when backend is ready:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

## API Service

All API calls are centralized in `src/app/services/api.ts` using axios.

### Authentication

The API service automatically:
- Adds `Authorization: Bearer <TOKEN>` header to all requests
- Stores token in localStorage
- Redirects to login on 401 errors

### Available API Methods

#### Auth
- `authAPI.register(data)` - Register new user
- `authAPI.login(data)` - Login user

#### Shop
- `shopAPI.create(data)` - Create shop
- `shopAPI.getMyShops()` - Get user's shops
- `shopAPI.getById(shopId)` - Get shop details
- `shopAPI.update(shopId, data)` - Update shop

#### Staff
- `staffAPI.add(shopId, data)` - Add staff member
- `staffAPI.getAll(shopId)` - Get all staff
- `staffAPI.updateRole(shopId, staffId, role)` - Update staff role
- `staffAPI.updateStatus(shopId, staffId, isActive)` - Update staff status
- `staffAPI.delete(shopId, staffId)` - Delete staff

#### Products
- `productAPI.create(shopId, data)` - Create product
- `productAPI.getAll(shopId)` - Get all products
- `productAPI.getById(shopId, productId)` - Get product details

#### Inventory
- `inventoryAPI.restock(shopId, data, idempotencyKey)` - Restock inventory
- `inventoryAPI.adjust(shopId, data, idempotencyKey)` - Adjust inventory

#### Sales
- `salesAPI.create(shopId, data, idempotencyKey)` - Create sale
- `salesAPI.getById(shopId, saleId)` - Get sale details

#### Dashboard
- `dashboardAPI.getTodaySales(shopId)` - Get today's sales
- `dashboardAPI.getTopProducts(shopId, limit)` - Get top products
- `dashboardAPI.getSalesSummary(shopId, startDate, endDate)` - Get sales summary
- `dashboardAPI.getLowStock(shopId)` - Get low stock products

## Demo Credentials

Use these credentials to test the application:

**Admin Account:**
- Email: `admin@store.com`
- Password: `admin123`
- Access: Full system access including user management

**Manager Account:**
- Email: `alice@store.com`
- Password: `manager123`
- Access: Dashboard, POS, Inventory, Reports

**Cashier Account:**
- Email: `bob@store.com`
- Password: `cashier123`
- Access: POS, Customers, Transaction History

## Integration Steps

When backend is ready:

1. Update `.env` with backend URL
2. Test login endpoint first
3. Update `StoreContext.tsx` to use API calls instead of mock data
4. Replace mock data operations with actual API calls

## Example Usage

```typescript
import { authAPI, productAPI } from './services/api';

// Login
const response = await authAPI.login({
  email: 'admin@store.com',
  password: 'admin123'
});
localStorage.setItem('authToken', response.data.token);

// Get products
const products = await productAPI.getAll(shopId);
```

## Notes

- All idempotent operations (sales, refunds, inventory) require `idempotency-key` header
- Token is automatically added to all requests after login
- API base URL can be changed in `.env` file
