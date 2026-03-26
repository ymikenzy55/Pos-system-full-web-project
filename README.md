# Point of Sale System

A modern, full-stack POS system built with React, TypeScript, Node.js, and PostgreSQL for retail businesses.

## Features

- Secure authentication with role-based access control (Admin, Manager, Cashier)
- Real-time dashboard with sales analytics
- Comprehensive inventory management
- Fast payment processing (<1.5s)
- Sales tracking with unique transaction IDs
- Fully responsive mobile design
- Optimized performance with batch operations

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Axios for API calls

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- Bcrypt password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ or Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ymikenzy55/Pos-system-full-web-project.git
cd Pos-system-full-web-project
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Configure environment variables**
```bash
# Copy example files and update with your credentials
cp backend/.env.example backend/.env
```

5. **Set up database**
```bash
cd backend
npm run migrate
npm run seed
```

6. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## First Time Setup

After running the seed command, a super admin account will be created. You can then:
1. Login with the super admin account
2. Create your shop
3. Add staff members with different roles
4. Start adding products and making sales

## Project Structure

```
├── src/                    # Frontend source
│   ├── app/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── backend/               # Backend source
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration
│   │   └── utils/        # Helper functions
│   └── prisma/           # Database schema & migrations
└── README.md
```

## Deployment

This project is configured for deployment on:
- Frontend: Vercel
- Backend: Render
- Database: Supabase

See `DEPLOYMENT.md` for complete step-by-step deployment instructions.

Quick deployment:
1. Set up Supabase database
2. Deploy backend to Render with environment variables
3. Deploy frontend to Vercel with `VITE_API_URL`
4. Update CORS settings in backend

## Security

- JWT token authentication
- Bcrypt password hashing (10 rounds)
- Role-based access control
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection

## License

MIT