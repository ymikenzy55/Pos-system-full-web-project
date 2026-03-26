# Supabase Setup Guide (Cloud PostgreSQL)

## Why Supabase?
- No local PostgreSQL setup needed
- Free tier available
- Production-ready
- Same PostgreSQL database

## Steps

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub or email
3. Create a new project

### 2. Get Connection String
1. In your Supabase project dashboard
2. Go to Settings → Database
3. Find "Connection string" section
4. Copy the "URI" connection string
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

### 3. Update Backend Environment
Edit `backend/.env.development`:
```env
DATABASE_URL="your-supabase-connection-string-here"
```

### 4. Run Migrations
```bash
cd backend
npm run migrate
```

### 5. Seed Database
```bash
npm run seed
```

### 6. Start Server
```bash
npm run dev
```

## Connection String Format
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace:
- `[PASSWORD]` - Your project password (from Supabase dashboard)
- `[PROJECT-REF]` - Your project reference (from connection string)
