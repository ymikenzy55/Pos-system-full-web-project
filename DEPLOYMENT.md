# Deployment Guide

This guide covers deploying the POS system with:
- Frontend on Vercel
- Backend on Render
- Database on Supabase

## Prerequisites

- GitHub account with your repository
- Vercel account (free)
- Render account (free)
- Supabase account (free)

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: pos-system-db
   - Database Password: (generate a strong password and save it)
   - Region: Choose closest to your users
4. Wait for project to be created (2-3 minutes)
5. Go to Settings > Database
6. Copy the "Connection string" under "Connection pooling"
7. Replace `[YOUR-PASSWORD]` with your database password
8. Save this connection string - you'll need it for Render

Example connection string:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: pos-backend
   - Region: Choose closest to your users
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

5. Add Environment Variables (click "Advanced" > "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-random-string-min-32-chars>
   JWT_EXPIRY=24h
   BCRYPT_SALT_ROUNDS=10
   FRONTEND_URL=<will-add-after-vercel-deployment>
   AUTH_RATE_LIMIT_WINDOW_MS=900000
   AUTH_RATE_LIMIT_MAX_REQUESTS=5
   API_RATE_LIMIT_WINDOW_MS=900000
   API_RATE_LIMIT_MAX_REQUESTS=100
   ```

   To generate JWT_SECRET, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Once deployed, copy your backend URL (e.g., `https://pos-backend.onrender.com`)
9. Test health endpoint: `https://pos-backend.onrender.com/health`

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: dist

5. Add Environment Variable:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://pos-backend.onrender.com/api`
   - (Replace with your actual Render backend URL)

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Once deployed, copy your frontend URL (e.g., `https://pos-system.vercel.app`)

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Click "Save Changes"
6. Service will automatically redeploy

## Step 5: Update Frontend API URL

If you need to update the API URL later:

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Update `VITE_API_URL`
5. Go to Deployments tab
6. Click "..." on latest deployment > "Redeploy"

## Step 6: Seed Database (First Time Only)

After backend is deployed, seed the database:

1. Go to Render dashboard
2. Open your backend service
3. Click "Shell" tab
4. Run: `npm run seed`
5. This creates the super admin account

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Login with super admin credentials (from seed output)
3. Create your shop
4. Add products and test the POS

## Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=<your-random-32-char-string>
JWT_EXPIRY=24h
BCRYPT_SALT_ROUNDS=10
FRONTEND_URL=https://your-app.vercel.app
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=5
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure all environment variables are set
- Check if migrations ran successfully

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS settings (FRONTEND_URL in backend)
- Test backend health endpoint directly
- Check browser console for errors

### Database connection issues
- Verify Supabase connection string
- Check if using connection pooling URL (port 6543)
- Ensure database password is correct
- Check Supabase project is active

### Render free tier limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for 1 service)
- Consider upgrading for production use

## Automatic Deployments

Both Vercel and Render are configured for automatic deployments:
- Push to `main` branch triggers automatic deployment
- Vercel: Deploys frontend automatically
- Render: Deploys backend automatically

## Custom Domains (Optional)

### Vercel (Frontend)
1. Go to project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render (Backend)
1. Go to service Settings > Custom Domain
2. Add your custom domain
3. Update DNS records as instructed
4. Update FRONTEND_URL CORS settings

## Monitoring

### Render
- View logs in real-time from dashboard
- Set up email alerts for service issues
- Monitor resource usage

### Vercel
- View deployment logs
- Analytics available on Pro plan
- Real-time error tracking

## Backup Strategy

### Database (Supabase)
- Automatic daily backups on free tier
- Point-in-time recovery on paid plans
- Export database manually: Settings > Database > Export

### Code
- GitHub repository serves as code backup
- Tag releases for version tracking

## Cost Estimate

Free tier limits:
- Supabase: 500MB database, 2GB bandwidth
- Render: 750 hours/month, 512MB RAM
- Vercel: 100GB bandwidth, unlimited deployments

For production with moderate traffic, expect:
- Supabase Pro: $25/month (8GB database)
- Render Starter: $7/month (no sleep, more resources)
- Vercel Pro: $20/month (better analytics)

Total: ~$52/month for production-ready setup

## Security Checklist

- [ ] Strong JWT_SECRET generated
- [ ] DATABASE_URL kept secret
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Vercel/Render)
- [ ] Environment variables not in code
- [ ] Super admin password changed after first login
- [ ] Regular database backups verified

## Next Steps

1. Change super admin password after first login
2. Set up monitoring and alerts
3. Configure custom domains (optional)
4. Set up staging environment (optional)
5. Enable database backups
6. Document your specific configuration
