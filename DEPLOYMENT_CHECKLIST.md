# Deployment Checklist

Use this checklist to deploy your POS system step by step.

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] All tests passing locally
- [ ] Environment variables documented

## 1. Supabase Setup (5 minutes)

- [ ] Create Supabase account at supabase.com
- [ ] Create new project
- [ ] Set strong database password
- [ ] Copy connection pooling string (port 6543)
- [ ] Save connection string securely

## 2. Render Backend Deployment (10 minutes)

- [ ] Create Render account at render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
- [ ] Configure start command: `npm start`
- [ ] Add all environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] DATABASE_URL (from Supabase)
  - [ ] JWT_SECRET (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - [ ] JWT_EXPIRY=24h
  - [ ] BCRYPT_SALT_ROUNDS=10
  - [ ] FRONTEND_URL (will add after Vercel)
  - [ ] AUTH_RATE_LIMIT_WINDOW_MS=900000
  - [ ] AUTH_RATE_LIMIT_MAX_REQUESTS=5
  - [ ] API_RATE_LIMIT_WINDOW_MS=900000
  - [ ] API_RATE_LIMIT_MAX_REQUESTS=100
- [ ] Deploy service
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., https://pos-backend.onrender.com)
- [ ] Test health endpoint: https://your-backend.onrender.com/health

## 3. Vercel Frontend Deployment (5 minutes)

- [ ] Create Vercel account at vercel.com
- [ ] Import GitHub repository
- [ ] Framework preset: Vite
- [ ] Root directory: ./
- [ ] Build command: `npm run build`
- [ ] Output directory: dist
- [ ] Add environment variable:
  - [ ] VITE_API_URL=https://your-backend.onrender.com/api
- [ ] Deploy
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL (e.g., https://pos-system.vercel.app)

## 4. Update CORS Settings (2 minutes)

- [ ] Go to Render dashboard
- [ ] Open backend service
- [ ] Go to Environment tab
- [ ] Update FRONTEND_URL with Vercel URL
- [ ] Save changes (auto-redeploys)

## 5. Seed Database (3 minutes)

- [ ] Go to Render dashboard
- [ ] Open backend service
- [ ] Click "Shell" tab
- [ ] Run: `npm run seed`
- [ ] Save super admin credentials from output

## 6. Test Deployment (5 minutes)

- [ ] Visit Vercel URL
- [ ] Login with super admin credentials
- [ ] Create shop
- [ ] Add a category
- [ ] Add a product
- [ ] Make a test sale
- [ ] Check dashboard updates
- [ ] Test on mobile device

## 7. Post-Deployment

- [ ] Change super admin password
- [ ] Add your staff members
- [ ] Configure shop details
- [ ] Add your products and categories
- [ ] Test all features
- [ ] Set up monitoring alerts (optional)
- [ ] Configure custom domain (optional)

## Troubleshooting

If something goes wrong:

1. Check Render logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Verify all environment variables are set correctly
4. Test backend health endpoint directly
5. Check browser console for frontend errors
6. Verify CORS settings match exactly

## URLs to Save

- GitHub: https://github.com/ymikenzy55/Pos-system-full-web-project
- Supabase Dashboard: https://supabase.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Frontend URL: _________________
- Backend URL: _________________

## Credentials to Save Securely

- Supabase Database Password: _________________
- JWT Secret: _________________
- Super Admin Email: _________________
- Super Admin Password: _________________

## Estimated Total Time: 30 minutes

## Cost: $0/month (Free tier)

Upgrade when needed:
- Supabase Pro: $25/month (8GB database)
- Render Starter: $7/month (no sleep)
- Vercel Pro: $20/month (analytics)
