# Point of Sale System

A modern, full-stack POS system built with React, TypeScript, Node.js, and PostgreSQL for retail businesses.

## Features

### Authentication & Security
- Secure JWT-based authentication
- Role-based access control (Super Admin, Admin, Manager, Cashier)
- Bcrypt password hashing
- Rate limiting and input validation
- Only super admin can register new users

### Dashboard & Analytics
- Real-time sales dashboard
- Today's revenue, orders, and items sold
- Revenue trends with date filtering
- Sales by category and payment method
- Performance metrics and charts

### Inventory Management
- Product catalog with categories
- Stock level tracking
- Low stock alerts
- Bulk product import/export
- Product search and filtering
- SKU management

### Point of Sale
- Fast checkout process (<1.5s)
- Multiple payment methods (Cash, Card, Split)
- Real-time cart management
- Product discounts (percentage or fixed)
- Receipt generation and printing
- Transaction history

### Sales Tracking
- Unique transaction IDs for each sale
- Detailed sales history
- Date-based filtering
- Expandable transaction details
- Revenue summaries
- Payment method tracking

### Staff Management
- User role assignment (Super Admin only)
- Staff member creation and management
- Activity tracking
- Access control per role

### Reports
- Revenue reports with date ranges
- Sales trends visualization
- Category performance analysis
- Payment method breakdown
- Transaction listings

## System Flow

### 1. Initial Setup
```
Super Admin Registration → Shop Creation → Database Seeding
```
- Super admin creates account with shop details
- System initializes database with default categories
- Super admin credentials are stored securely

### 2. User Management Flow
```
Super Admin Login → Staff Management → Add Users → Assign Roles
```
- Only super admin can add new staff members
- Roles: Admin, Manager, Cashier
- Each role has specific permissions

### 3. Inventory Setup Flow
```
Admin/Manager Login → Inventory Page → Add Categories → Add Products
```
- Create product categories
- Add products with SKU, price, stock
- Set low stock thresholds
- Upload product images

### 4. Sales Flow
```
Cashier Login → POS Page → Scan/Select Products → Add to Cart → Apply Discounts → Process Payment → Generate Receipt
```
- Products added to cart with quantities
- Optional discounts per item
- Multiple payment methods supported
- Automatic stock deduction
- Receipt with transaction ID

### 5. Reporting Flow
```
Admin/Manager Login → Reports/Sales Page → Select Date Range → View Analytics
```
- Filter by date range
- View revenue trends
- Analyze category performance
- Export transaction data

### 6. Daily Operations Flow
```
Morning: Check Dashboard → Review Stock Levels → Process Orders
Afternoon: Monitor Sales → Handle Transactions → Update Inventory
Evening: Review Reports → Close Register → Generate Daily Summary
```

## Role Permissions

### Super Admin
- Full system access
- Create/manage all users
- Change user roles
- Access all reports
- Manage shop settings

### Admin
- Manage inventory
- View all reports
- Manage staff (cannot change roles)
- Process sales
- Access dashboard

### Manager
- Manage inventory
- View reports
- Process sales
- Access dashboard

### Cashier
- Process sales only
- View POS interface
- Generate receipts

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Recharts for analytics
- Axios for API calls

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- Bcrypt password hashing
- Winston logger

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ or Supabase account
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ymikenzy55/Pos-system-full-web-project.git
cd Pos-system-full-web-project
```

2. Install dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. Configure environment variables
```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit backend/.env and configure:
# - DATABASE_URL: Your PostgreSQL connection string
# - JWT_SECRET: Generate a secure random string (use: openssl rand -base64 32)
# - FRONTEND_URL: Your frontend URL
# - PORT: Backend port (default: 3000)
```

4. Set up database
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

5. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## License

MIT
