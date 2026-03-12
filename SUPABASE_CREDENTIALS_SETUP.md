# Supabase Credentials Setup Guide

**Status**: Ready to Configure  
**Project URL**: https://wlcguodooyitrecgcauu.supabase.co  
**Date**: March 12, 2026

---

## Your Supabase Credentials

### Project Information
```
Project URL: https://wlcguodooyitrecgcauu.supabase.co
Project Ref: wlcguodooyitrecgcauu
```

### API Keys
```
Publishable Key: bb_publishable_TT6Y5PoM077MRAOQmoXLjg_gO04_xpk
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY2d1b2Rvb3lpdHJlY2djYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzE3ODQsImV4cCI6MjA4ODg0Nzc4NH0.c1UyD2kjnaU6QpyokQWQzDs9w7VmdcXRqQhuGawtGG4
```

### Database Connection
```
Host: wlcguodooyitrecgcauu.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [Your Supabase password]
```

---

## Step 1: Get Your Database Password

1. Go to: https://app.supabase.com
2. Select project: `tinylearn`
3. Click **"Settings"** (bottom left)
4. Click **"Database"**
5. Scroll down to **"Connection string"**
6. Copy the password from the connection string
7. Format: `postgresql://postgres:PASSWORD@host:5432/postgres`

**Save the password!**

---

## Step 2: Update Backend .env

### Option A: Copy from Template

1. Open `.env.supabase` (I created this for you)
2. Copy all content
3. Paste into `.env`
4. Replace placeholders:
   - `YOUR_SUPABASE_PASSWORD_HERE` → Your actual password
   - `your-railway-domain.railway.app` → Your Railway domain (after deployment)
   - `your-vercel-domain.vercel.app` → Your Vercel domain (after deployment)

### Option B: Manual Setup

Edit `.env` and add:

```env
# Database
DB_CONNECTION=pgsql
DB_HOST=wlcguodooyitrecgcauu.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE

# Supabase
SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY2d1b2Rvb3lpdHJlY2djYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzE3ODQsImV4cCI6MjA4ODg0Nzc4NH0.c1UyD2kjnaU6QpyokQWQzDs9w7VmdcXRqQhuGawtGG4

# Application
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-domain.railway.app

# Broadcasting
BROADCAST_CONNECTION=reverb
REVERB_HOST=your-railway-domain.railway.app
REVERB_PORT=443
REVERB_SCHEME=https

# CORS
SANCTUM_STATEFUL_DOMAINS=your-vercel-domain.vercel.app
SESSION_DOMAIN=.railway.app
```

---

## Step 3: Update Frontend .env

### Option A: Copy from Template

1. Open `react/.env.supabase` (I created this for you)
2. Copy all content
3. Paste into `react/.env.local`
4. Replace placeholders:
   - `your-railway-domain.railway.app` → Your Railway domain

### Option B: Manual Setup

Create or edit `react/.env.local`:

```env
VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY2d1b2Rvb3lpdHJlY2djYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzE3ODQsImV4cCI6MjA4ODg0Nzc4NH0.c1UyD2kjnaU6QpyokQWQzDs9w7VmdcXRqQhuGawtGG4
VITE_API_URL=https://your-railway-domain.railway.app
VITE_REVERB_HOST=your-railway-domain.railway.app
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
```

---

## Step 4: Import Database

1. Go to Supabase SQL Editor
2. Create new query
3. Copy all SQL from `create_database_postgresql.sql`
4. Paste into editor
5. Click "Run"
6. Wait for success

---

## Step 5: Deploy Backend to Railway

### Create Railway Project

1. Go to: https://railway.app
2. Click **"New Project"**
3. Select **"GitHub Repo"**
4. Connect GitHub
5. Select `tinylearn` repository

### Add Environment Variables

In Railway dashboard:
1. Click your service
2. Go to **"Variables"** tab
3. Add all variables from `.env`:
   - DB_CONNECTION=pgsql
   - DB_HOST=wlcguodooyitrecgcauu.supabase.co
   - DB_PORT=5432
   - DB_DATABASE=postgres
   - DB_USERNAME=postgres
   - DB_PASSWORD=YOUR_PASSWORD
   - SUPABASE_PROJECT_URL=...
   - SUPABASE_ANON_KEY=...
   - APP_URL=https://YOUR_RAILWAY_DOMAIN
   - BROADCAST_CONNECTION=reverb
   - REVERB_HOST=YOUR_RAILWAY_DOMAIN
   - REVERB_PORT=443
   - REVERB_SCHEME=https
   - SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_DOMAIN
   - SESSION_DOMAIN=.railway.app

### Set Build Command

1. Go to **"Settings"**
2. Set **Build Command**: `composer install && php artisan migrate --force`
3. Set **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

### Deploy

1. Click **"Deploy"**
2. Wait for deployment
3. Copy your Railway domain (e.g., `tinylearn-api.railway.app`)

---

## Step 6: Deploy Frontend to Vercel

### Create Vercel Project

1. Go to: https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Select `tinylearn` repository

### Configure Build

1. Go to **"Settings"**
2. Set **Framework**: Vite
3. Set **Build Command**: `cd react && npm install && npm run build`
4. Set **Output Directory**: `react/dist`
5. Set **Root Directory**: `.`

### Add Environment Variables

1. Go to **"Settings"** → **"Environment Variables"**
2. Add:
   - VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
   - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
   - VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN
   - VITE_REVERB_PORT=443
   - VITE_REVERB_SCHEME=https
   - VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp

### Deploy

1. Click **"Deploy"**
2. Wait for deployment
3. Copy your Vercel domain (e.g., `tinylearn.vercel.app`)

---

## Step 7: Update CORS

After getting your domains:

1. Edit `config/cors.php`
2. Update `allowed_origins`:

```php
'allowed_origins' => [
    'https://YOUR_VERCEL_DOMAIN.vercel.app',
    'https://YOUR_RAILWAY_DOMAIN.railway.app',
],
```

3. Commit and push
4. Both services auto-redeploy

---

## Step 8: Test Your System

1. Go to your Vercel domain
2. Login with: `admin@example.com` / `password`
3. Test features:
   - ✅ Create course
   - ✅ Invite student
   - ✅ Accept invitation
   - ✅ Unenroll

---

## Environment Variables Summary

### Backend (.env)
```
DB_CONNECTION=pgsql
DB_HOST=wlcguodooyitrecgcauu.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD

SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

APP_URL=https://YOUR_RAILWAY_DOMAIN
BROADCAST_CONNECTION=reverb
REVERB_HOST=YOUR_RAILWAY_DOMAIN
REVERB_PORT=443
REVERB_SCHEME=https

SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_DOMAIN
SESSION_DOMAIN=.railway.app
```

### Frontend (react/.env.local)
```
VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
```

---

## Files Created

- `.env.supabase` - Backend template
- `react/.env.supabase` - Frontend template
- `SUPABASE_CREDENTIALS_SETUP.md` - This guide

---

## Quick Checklist

- [ ] Get Supabase password from Settings → Database
- [ ] Update `.env` with database credentials
- [ ] Update `react/.env.local` with Supabase keys
- [ ] Import database using `create_database_postgresql.sql`
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Update CORS with your domains
- [ ] Test system

---

## Next Steps

1. ✅ Get Supabase password
2. ✅ Update environment files
3. ✅ Import database
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Test system

---

**Ready to deploy?** Follow the steps above! 🚀
