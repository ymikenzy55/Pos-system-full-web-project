# POS Backend API

Backend API for the Point of Sale System built with Node.js, Express, TypeScript, Prisma, and PostgreSQL/Supabase.

## Features

- JWT Authentication with bcrypt password hashing (10 salt rounds)
- Role-Based Access Control (Admin, Manager, Cashier)
- Multi-shop support
- Inventory management with stock tracking
- Sales and refund processing
- Idempotency for critical operations
- Dashboard analytics and reporting
- Security: Helmet, CORS, rate limiting, input validation
- Comprehensive logging with Winston
- PostgreSQL (local) / Supabase (production)

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local PostgreSQL)
- PostgreSQL 14+ (if not using Docker)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `JWT_EXPIRY` - Token expiration time (e.g., "24h")
- `BCRYPT_SALT_ROUNDS` - Password hashing rounds (10 recommended)
- `NODE_ENV` - "development" or "production"
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Your frontend URL for CORS

### 3. Start Local PostgreSQL (Docker - Optional)

```bash
docker-compose up -d
```

Or use your own PostgreSQL instance or Supabase.

### 4. Run Database Migrations

```bash
npm run migrate
```

### 5. Seed Initial Data

```bash
npm run seed
```

This creates a super admin account and sample data for development.

### 6. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Shops
- `POST /api/shops` - Create shop
- `GET /api/shops/myshops` - Get user's shops
- `GET /api/shops/:shopId` - Get shop details
- `PATCH /api/shops/:shopId` - Update shop

### Staff Management
- `POST /api/shops/:shopId/staff` - Add staff member
- `GET /api/shops/:shopId/staff` - List staff
- `GET /api/shops/:shopId/staff/:staffId` - Get staff details
- `PATCH /api/shops/:shopId/staff/:staffId/role` - Update role
- `PATCH /api/shops/:shopId/staff/:staffId/status` - Update status
- `DELETE /api/shops/:shopId/staff/:staffId` - Remove staff

### Products & Categories
- `POST /api/shops/:shopId/categories` - Create category
- `POST /api/shops/:shopId/products` - Create product
- `GET /api/shops/:shopId/products` - List products
- `GET /api/shops/:shopId/products/:productId` - Get product

### Inventory
- `POST /api/shops/:shopId/inventory/restock` - Restock product
- `POST /api/shops/:shopId/inventory/adjust` - Adjust inventory

### Sales & Refunds
- `POST /api/shops/:shopId/sales` - Create sale
- `GET /api/shops/:shopId/sales/:saleId` - Get sale details
- `POST /api/shops/:shopId/refunds` - Process refund

### Stock Movements
- `GET /api/shops/:shopId/stock-movements` - List movements
- `GET /api/shops/:shopId/stock-movements/:productId` - Product movements

### Dashboard
- `GET /api/shops/:shopId/dashboard/today-sales` - Today's metrics
- `GET /api/shops/:shopId/dashboard/top-products` - Best sellers
- `GET /api/shops/:shopId/dashboard/sales-summary` - Date range analytics
- `GET /api/shops/:shopId/dashboard/low-stock` - Low stock alerts

### Customers
- `POST /api/shops/:shopId/customers` - Create customer
- `GET /api/shops/:shopId/customers/:customerId` - Get customer

### Health
- `GET /health` - Health check
- `GET /ready` - Readiness check

## Environment Variables

The `.env.example` file shows all required environment variables. Copy it to `.env` and configure with your own values:

```env
# Database - Use your PostgreSQL or Supabase connection string
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Configuration
JWT_SECRET="your-secure-random-secret-key"
JWT_EXPIRY="24h"

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Server Configuration
NODE_ENV="development"
PORT=3000

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=5
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Never commit your `.env` file to version control. Only `.env.example` should be in the repository.

## Production Deployment with Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings → Database

### 2. Configure Environment

Update `.env.production` with your Supabase connection string:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-production-secret"
NODE_ENV="production"
FRONTEND_URL="https://your-app.vercel.app"
```

### 3. Run Migrations

```bash
npm run migrate:prod
```

### 4. Deploy to Render/Railway/Heroku

#### Render
1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run build && npm run migrate:prod`
4. Set start command: `npm start`
5. Add environment variables from `.env.production`

#### Railway
1. Create new project
2. Add PostgreSQL service (or use Supabase)
3. Add environment variables
4. Deploy

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations (dev)
- `npm run migrate:prod` - Run migrations (production)
- `npm run seed` - Seed development data
- `npm run studio` - Open Prisma Studio
- `npm run generate` - Generate Prisma Client

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   └── env.ts       # Environment variables
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   ├── rbac.ts      # Role-based access control
│   │   ├── security.ts  # Helmet & CORS
│   │   ├── rateLimiter.ts
│   │   ├── validator.ts
│   │   └── errorHandler.ts
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.ts        # Express app
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Migration files
│   └── seed.ts          # Seed data
├── .env.development     # Dev environment
├── .env.production      # Prod environment
├── docker-compose.yml   # Local PostgreSQL
└── package.json
```

## Security Features

- JWT token authentication (24-hour expiry)
- Bcrypt password hashing (10 salt rounds)
- Role-based access control
- Helmet security headers
- CORS protection
- Rate limiting (5 req/15min for auth, 100 req/15min for API)
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- Idempotency keys for critical operations
- Request ID tracking
- Comprehensive error handling and logging

## License

MIT
