# TinyLearn Deployment Guide

## Overview
This guide will help you deploy TinyLearn (Laravel + React) to production.

## Architecture
- **Frontend**: React (Vite) → Deploy to Vercel
- **Backend**: Laravel API → Deploy to Railway/Heroku
- **Database**: MySQL → Railway/PlanetScale

---

## Part 1: Deploy Frontend to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repository: `eclipse31-dev/TinyLearn`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `react`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app` (add after backend deployment)

6. Click "Deploy"

### Option B: Via Vercel CLI

```bash
cd react
npx vercel --prod
```

Follow the prompts:
- Set up and deploy? → Yes
- Which scope? → kusa331's projects
- Link to existing project? → No
- Project name? → tinylearn
- Directory? → ./
- Override settings? → No

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `eclipse31-dev/TinyLearn`

### Step 3: Configure Laravel
1. Add MySQL database:
   - Click "+ New"
   - Select "Database" → "MySQL"

2. Add Environment Variables:
   ```
   APP_NAME=TinyLearn
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://your-app.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MYSQL.MYSQL_HOST}}
   DB_PORT=${{MYSQL.MYSQL_PORT}}
   DB_DATABASE=${{MYSQL.MYSQL_DATABASE}}
   DB_USERNAME=${{MYSQL.MYSQL_USER}}
   DB_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}
   
   BROADCAST_DRIVER=log
   CACHE_DRIVER=file
   FILESYSTEM_DISK=local
   QUEUE_CONNECTION=sync
   SESSION_DRIVER=file
   SESSION_LIFETIME=120
   
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

3. Generate APP_KEY:
   ```bash
   php artisan key:generate --show
   ```

### Step 4: Create Railway Configuration
Create `railway.json` in project root:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `Procfile` in project root:
```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Step 5: Update CORS Configuration
Edit `config/cors.php`:
```php
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),
```

---

## Part 3: Connect Frontend to Backend

### Update Vercel Environment Variable
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_BASE_URL`:
   - **Value**: `https://your-backend.railway.app`
3. Redeploy frontend

---

## Part 4: Database Setup

### Run Migrations on Railway
1. Go to Railway Dashboard → Your Project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. The migrations will run automatically on deploy

Or manually via Railway CLI:
```bash
railway run php artisan migrate --force
```

### Seed Database (Optional)
```bash
railway run php artisan db:seed
```

---

## Part 5: Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Database created and migrated
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] API_BASE_URL updated in frontend
- [ ] Test login functionality
- [ ] Test file uploads
- [ ] Test real-time features

---

## Troubleshooting

### Frontend Issues
- **Build fails**: Check Node version (should be 18+)
- **API calls fail**: Verify VITE_API_BASE_URL is correct
- **CORS errors**: Check backend CORS configuration

### Backend Issues
- **500 errors**: Check Laravel logs in Railway
- **Database connection**: Verify DB environment variables
- **File uploads**: Configure storage disk for production

### Common Commands

**Railway CLI**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run commands
railway run php artisan migrate
railway run php artisan cache:clear
```

**Vercel CLI**:
```bash
# Deploy
npx vercel --prod

# View logs
npx vercel logs
```

---

## URLs After Deployment

- **Frontend**: https://tinylearn.vercel.app
- **Backend**: https://tinylearn.railway.app
- **Database**: Managed by Railway

---

## Security Notes

1. Never commit `.env` files
2. Use strong APP_KEY
3. Enable HTTPS only
4. Configure rate limiting
5. Set APP_DEBUG=false in production
6. Use secure session cookies

---

## Maintenance

### Update Deployment
```bash
# Push to GitHub
git push origin main

# Vercel and Railway will auto-deploy
```

### View Logs
- **Vercel**: Dashboard → Deployments → View Logs
- **Railway**: Dashboard → Service → Deployments → View Logs

---

## Support

For issues, check:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Laravel Docs: https://laravel.com/docs
