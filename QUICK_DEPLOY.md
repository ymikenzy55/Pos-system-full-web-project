# Quick Deployment Guide

Since you already have Supabase set up, follow these steps to deploy on Render and Vercel.

## Prerequisites
- ✅ Supabase database already set up
- ✅ Code pushed to GitHub
- GitHub repository: https://github.com/ymikenzy55/Pos-system-full-web-project

---

## STEP 1: Get Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) → **Database**
3. Scroll to **Connection string** section
4. Select **Connection pooling** (this is important!)
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. Keep this handy - you'll need it for Render

**Important:** Use the connection pooling URL (port 6543), not the direct connection (port 5432)

---

## STEP 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up or log in (use GitHub for easy connection)

### 2.2 Create Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to connect your GitHub
4. Find and select your repository: `Pos-system-full-web-project`
5. Click **"Connect"**

### 2.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name:** `pos-backend` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** 
  ```
  npm install && npm run build && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command:** 
  ```
  npm start
  ```

**Instance Type:**
- Select **"Free"** (or upgrade if needed)

### 2.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Your Supabase connection string from Step 1 |
| `JWT_SECRET` | Generate below ⬇️ |
| `JWT_EXPIRY` | `24h` |
| `BCRYPT_SALT_ROUNDS` | `10` |
| `FRONTEND_URL` | `https://temp.com` (we'll update this after Vercel) |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | `5` |
| `API_RATE_LIMIT_WINDOW_MS` | `900000` |
| `API_RATE_LIMIT_MAX_REQUESTS` | `100` |

**To generate JWT_SECRET:**
Open your terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as JWT_SECRET value.

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the logs - you'll see:
   - Installing dependencies
   - Building TypeScript
   - Running Prisma migrations
   - Starting server

### 2.6 Verify Backend
1. Once deployed, you'll see your backend URL (e.g., `https://pos-backend-xxxx.onrender.com`)
2. **Copy this URL** - you'll need it for Vercel
3. Test it by visiting: `https://your-backend-url.onrender.com/health`
4. You should see: `{"status":"ok","timestamp":"..."}`

**✅ Backend is now live!**

---

## STEP 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up or log in (use GitHub for easy connection)

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: `Pos-system-full-web-project`
4. Click **"Import"**

### 3.3 Configure Project
Vercel will auto-detect Vite. Verify these settings:

**Build Settings:**
- **Framework Preset:** `Vite`
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3.4 Add Environment Variable
1. Click **"Environment Variables"** section
2. Add this variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

**Important:** Replace `your-backend-url` with your actual Render URL from Step 2.6

Example: `https://pos-backend-xxxx.onrender.com/api`

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Watch the build logs

### 3.6 Get Frontend URL
1. Once deployed, you'll see your frontend URL (e.g., `https://pos-system-xxxx.vercel.app`)
2. **Copy this URL** - you need it for the next step
3. Click **"Visit"** to open your app

**✅ Frontend is now live!**

---

## STEP 4: Update CORS Settings (2 minutes)

Now we need to tell the backend to accept requests from your frontend.

### 4.1 Update Backend Environment
1. Go back to **Render Dashboard**
2. Click on your **pos-backend** service
3. Click **"Environment"** in the left sidebar
4. Find the `FRONTEND_URL` variable
5. Click **"Edit"** (pencil icon)
6. Replace `https://temp.com` with your actual Vercel URL from Step 3.6
   - Example: `https://pos-system-xxxx.vercel.app`
7. Click **"Save Changes"**

### 4.2 Wait for Redeploy
- Render will automatically redeploy (1-2 minutes)
- Watch the logs to confirm it's done

**✅ CORS is now configured!**

---

## STEP 5: Seed Database (3 minutes)

Create your super admin account and initial data.

### 5.1 Open Render Shell
1. In Render dashboard, open your **pos-backend** service
2. Click **"Shell"** tab (top right)
3. Wait for shell to connect

### 5.2 Run Seed Command
In the shell, type:
```bash
npm run seed
```

Press Enter and wait (30 seconds).

### 5.3 Save Credentials
You'll see output like:
```
✅ Super Admin created:
Email: admin@example.com
Password: Admin123!
```

**IMPORTANT:** Save these credentials securely! You'll need them to login.

**✅ Database is seeded!**

---

## STEP 6: Test Your App (5 minutes)

### 6.1 Open Your App
1. Go to your Vercel URL: `https://pos-system-xxxx.vercel.app`
2. You should see the login page

### 6.2 Login
1. Use the super admin credentials from Step 5.3
2. Click **"Login"**

### 6.3 Complete Setup
1. **Create your shop:**
   - Fill in shop name, address, phone
   - Click "Create Shop"

2. **Add a category:**
   - Go to Inventory page
   - Click "Add Category"
   - Name: "Test Category"
   - Save

3. **Add a product:**
   - Click "Add Product"
   - Fill in details (name, SKU, price, etc.)
   - Select the category you created
   - Save

4. **Make a test sale:**
   - Go to POS page
   - Add product to cart
   - Click "Checkout"
   - Complete payment
   - View invoice

5. **Check dashboard:**
   - Go to Dashboard
   - Verify sales data appears
   - Check inventory updated

### 6.4 Test on Mobile
1. Open your Vercel URL on your phone
2. Test the responsive design
3. Try making a sale

**✅ Everything is working!**

---

## STEP 7: Post-Deployment Tasks

### 7.1 Change Super Admin Password
1. Go to Settings page
2. Click on your profile
3. Change password to something secure
4. Save

### 7.2 Add Your Data
1. Add your actual shop details
2. Add staff members (Settings → Staff Management)
3. Add your product categories
4. Add your products with correct prices
5. Set up inventory levels

### 7.3 Bookmark Your URLs
- **Frontend:** https://pos-system-xxxx.vercel.app
- **Backend:** https://pos-backend-xxxx.onrender.com
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month (enough for 1 service running 24/7)

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- No sleep time

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth
- Automatic daily backups

### Automatic Deployments

Both services are now connected to your GitHub:
- Push to `main` branch → Automatic deployment
- Vercel: Deploys frontend automatically
- Render: Deploys backend automatically

### Updating Your App

**To update code:**
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Automatic deployment happens
5. Check deployment logs

**To update environment variables:**
- Render: Dashboard → Environment → Edit → Save (auto-redeploys)
- Vercel: Dashboard → Settings → Environment Variables → Save → Redeploy

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is correct (use connection pooling URL)
- Ensure all environment variables are set
- Check if Prisma migrations ran successfully

### Frontend can't connect to backend
- Verify VITE_API_URL is correct (must end with `/api`)
- Check FRONTEND_URL in backend matches your Vercel URL exactly
- Test backend health endpoint directly
- Check browser console for CORS errors

### Database connection errors
- Use connection pooling URL (port 6543), not direct connection
- Verify password in connection string is correct
- Check Supabase project is active
- Ensure IP restrictions are not blocking Render

### Slow first request (Render free tier)
- This is normal - service sleeps after 15 minutes
- First request wakes it up (30-60 seconds)
- Subsequent requests are fast
- Upgrade to paid plan ($7/month) to prevent sleep

---

## Need Help?

1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Deployments → Click deployment → View logs
3. Check browser console: F12 → Console tab
4. Check Supabase logs: Dashboard → Logs

---

## Summary

✅ Backend deployed on Render
✅ Frontend deployed on Vercel  
✅ Database on Supabase
✅ CORS configured
✅ Database seeded
✅ App tested and working

**Total time:** ~20 minutes
**Total cost:** $0/month (free tier)

Your POS system is now live and accessible from anywhere! 🎉
