# Backend Setup Guide

## Current Status
✅ Dependencies installed
✅ TypeScript compiled successfully
✅ Prisma Client generated
⚠️ PostgreSQL service needs to be started

## Next Steps

### 1. Start PostgreSQL Service (Run as Administrator)

Open PowerShell as Administrator and run:
```powershell
net start postgresql-x64-17
```

Or start it from Services (services.msc):
- Find "postgresql-x64-17"
- Right-click → Start

### 2. Create Database

```bash
psql -U postgres -c "CREATE DATABASE pos_dev;"
```

Default password is usually empty or "postgres"

### 3. Run Migrations

```bash
cd backend
npm run migrate
```

### 4. Seed Database

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server will run on http://localhost:3000

## Test Endpoints

Once running, test:
- http://localhost:3000/health
- http://localhost:3000/ready

## Demo Credentials

After seeding:
- Admin: admin@store.com / admin123
- Manager: alice@store.com / manager123
- Cashier: bob@store.com / cashier123
