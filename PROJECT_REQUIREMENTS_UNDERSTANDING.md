# POS System - Project Requirements Understanding

**PLEASE EDIT THIS DOCUMENT TO CORRECT ANY MISUNDERSTANDINGS**

---

## 1. REGISTRATION & INITIAL SETUP

### Current Understanding:
- [ ] First user who registers becomes the SUPER ADMIN automatically
- [ ] During registration, user provides:
  - First Name
  - Last Name
  - Email
  - Password
  - Shop Name
  - Shop Address (optional)
  - Shop Phone (optional)
- [ ] System creates:
  - User account
  - Shop record
  - StaffMember record linking user to shop with ADMIN role
- [ ] This user is saved to the database (NOT mock data)
- [ ] No pre-seeded admin accounts exist

**CORRECTIONS NEEDED:**
[Edit here if this is wrong]

---

## 2. DATABASE TABLES

### Current Understanding:
The following tables ALREADY EXIST in the database:
- [ ] User - Stores user accounts
- [ ] Shop - Stores shop information
- [ ] StaffMember - Links users to shops with roles
- [ ] Category - Product categories
- [ ] Product - Product inventory
- [ ] Customer - Customer information
- [ ] Sale - Sales transactions
- [ ] SaleItem - Individual items in a sale
- [ ] Refund - Refund transactions
- [ ] RefundItem - Individual items in a refund
- [ ] StockMovement - Inventory movement history
- [ ] IdempotencyKey - Prevents duplicate transactions

**CORRECTIONS NEEDED:**
[Edit here if tables are missing or wrong]

---

## 3. ADMIN CAPABILITIES

### Current Understanding:
After the super admin logs in, they can:
- [ ] View Dashboard (sales stats, top products, low stock)
- [ ] Access POS (Point of Sale) to make sales
- [ ] Manage Inventory (add/edit/delete products)
- [ ] Manage Customers (add/view customers)
- [ ] View Transaction History
- [ ] Access Settings to:
  - [ ] Add staff members (Cashiers, Managers, other Admins)
  - [ ] Assign roles to staff
  - [ ] Manage shop settings

**CORRECTIONS NEEDED:**
ok so for all admin page, he should have a sidebar, that helps him navigate to various sections of the page and not only in the dashboard page

---

## 4. SIDEBAR NAVIGATION

### Current Understanding:
Admin sees these tabs in the sidebar:
- [ ] Dashboard
- [ ] Point of Sale (POS)
- [ ] Inventory
- [ ] Customers
- [ ] History (Transactions)
- [ ] Settings

**CORRECTIONS NEEDED:**
[Edit here if tabs are missing or wrong]

---

## 5. DATA FLOW

### Current Understanding:

**Registration Flow:**
1. User fills registration form
2. Backend creates User, Shop, and StaffMember records
3. User is logged in automatically
4. User sees empty dashboard (no mock data)

**Login Flow:**
1. User enters email/password
2. Backend verifies credentials
3. Backend returns user data with role and shop
4. Frontend shows sidebar with appropriate tabs
5. User can navigate to any page

**Adding Data Flow:**
1. Admin navigates to Inventory
2. Admin clicks "Add Product"
3. Admin fills product form (name, SKU, price, cost, category, stock)
4. Product is saved to database
5. Product appears in inventory list

**CORRECTIONS NEEDED:**
There shouldn't be any registeration page to fill, the super admin will be created from the database and then he'll add or remove admins from his settings page, so all users simply have to login 

Also when admin wants to add a product, he should have the option as to whether he wants to add images to the product inventory or not

---

## 6. MOCK DATA REMOVAL

### Current Understanding:
- [ ] NO pre-seeded products
- [ ] NO pre-seeded customers
- [ ] NO pre-seeded sales
- [ ] NO pre-seeded categories
- [ ] NO pre-seeded staff members (except the one created during registration)
- [ ] Database starts completely empty except for the admin user who registers

**CORRECTIONS NEEDED:**
[inventory has some mock products, as well as users and some other pages remove all of them]

---

## 7. ROLE SYSTEM

### Current Understanding:
Three roles exist:
- [ ] ADMIN - Full access to everything
- [ ] MANAGER - Access to Dashboard, POS, Inventory, Customers, History (NO Settings)
- [ ] CASHIER - Access to POS, Customers, History only

Only ADMIN can:
- [ ] Add new staff members
- [ ] Assign roles
- [ ] Access Settings page

**CORRECTIONS NEEDED:**
[Edit here if roles are different]

---

## 8. CURRENT ISSUES TO FIX

### Current Understanding:
Problems that need fixing:
- [ ] Sidebar navigation not showing all tabs after login
- [ ] Mock data still exists in database (needs to be removed)
- [ ] Registration flow doesn't exist (needs to be created)
- [ ] Login doesn't return user role properly

**CORRECTIONS NEEDED:**
[For the registration, it should be done in the database not as a form in the frontend (i.e for the super admin), for other users, the super admin will create them from his settings page]

---

## 9. WHAT SHOULD WORK

### Current Understanding:
After fixes, the system should:
- [ ] Allow first user to register and become admin
- [ ] Show all sidebar tabs based on user role
- [ ] Start with completely empty database (no products, customers, sales)
- [ ] Allow admin to add categories
- [ ] Allow admin to add products
- [ ] Allow admin to add customers
- [ ] Allow admin to make sales
- [ ] Allow admin to add staff members from Settings
- [ ] All data saved to real database (Supabase PostgreSQL)

**CORRECTIONS NEEDED:**
[Edit here if expectations are different]

---

## 10. TECHNICAL STACK

### Current Understanding:
- [ ] Frontend: React + TypeScript + Vite
- [ ] Backend: Node.js + Express + TypeScript
- [ ] Database: PostgreSQL (Supabase)
- [ ] ORM: Prisma
- [ ] Auth: JWT + bcrypt (salt rounds: 12)
- [ ] Security: Helmet, CORS, rate limiting

**CORRECTIONS NEEDED:**
[Edit here if stack is different]

---

## INSTRUCTIONS FOR YOU:

Please review each section above and:
1. Check the boxes [ ] that are CORRECT
2. Add corrections in the "CORRECTIONS NEEDED" sections
3. Add any missing requirements I didn't mention
4. Send this document back to me

Once I receive your corrections, I will implement the fixes exactly as you specify.
