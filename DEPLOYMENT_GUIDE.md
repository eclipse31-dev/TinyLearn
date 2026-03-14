# TinyLearn LMS - Deployment Guide

## Production Deployment with Supabase & Railway

### Prerequisites
- Supabase account (https://supabase.com)
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Git repository

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `tinylearn`
   - Database Password: Create a strong password
   - Region: Choose closest to your users
4. Wait for project to initialize (5-10 minutes)

### 1.2 Get Supabase Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://[project-id].supabase.co`
   - **Anon Key**: Public key for client-side
   - **Service Role Key**: Secret key for server-side

### 1.3 Get Database Connection Details
1. Go to Project Settings → Database
2. Copy:
   - **Host**: `db.[project-id].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password

---

## Step 2: Railway Deployment (Backend)

### 2.1 Connect Repository
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your TinyLearn repository
4. Authorize Railway to access your GitHub

### 2.2 Configure Environment Variables
In Railway dashboard, add these environment variables:

```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-domain.railway.app
FRONTEND_URL=https://your-vercel-domain.vercel.app

# Database (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=db.wlcguodooyitrecgcauu.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

# Cache & Session
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Supabase
SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-railway-domain.railway.app/auth/google/callback

# Reverb (WebSockets)
REVERB_SCHEME=https
REVERB_HOST=your-railway-domain.railway.app
REVERB_PORT=443
REVERB_APP_ID=12345
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_APP_SECRET=your-app-secret

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app
MAIL_FROM_NAME=TinyLearn

# Sanctum
SANCTUM_STATEFUL_DOMAINS=your-vercel-domain.vercel.app
SESSION_DOMAIN=.railway.app
```

### 2.3 Add Build & Start Commands
In Railway, set:
- **Build Command**: `composer install && php artisan migrate --force`
- **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Get your Railway domain from the dashboard

---

## Step 3: Vercel Deployment (Frontend)

### 3.1 Connect Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the `react` folder as root directory

### 3.2 Configure Environment Variables
Add these in Vercel project settings:

```
VITE_API_URL=https://your-railway-domain.railway.app
VITE_APP_NAME=TinyLearn
```

### 3.3 Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Get your Vercel domain

---

## Step 4: Database Migration

### 4.1 Run Migrations on Supabase
After Railway deployment, migrations run automatically via build command.

To manually run migrations:
```bash
# Via Railway CLI
railway run php artisan migrate --force
```

### 4.2 Seed Database (Optional)
```bash
railway run php artisan db:seed
```

---

## Step 5: Update Configuration

### 5.1 Update Google OAuth
1. Go to Google Cloud Console
2. Update authorized URIs:
   - **JavaScript Origins**: 
     - `https://your-vercel-domain.vercel.app`
     - `https://your-railway-domain.railway.app`
   - **Redirect URIs**:
     - `https://your-railway-domain.railway.app/auth/google/callback`

### 5.2 Update CORS
In `config/cors.php`, update allowed origins:
```php
'allowed_origins' => [
    'https://your-vercel-domain.vercel.app',
    'https://your-railway-domain.railway.app',
],
```

### 5.3 Update Sanctum
In `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1,127.0.0.1:3000,127.0.0.1:8000')),
```

---

## Step 6: SSL & Security

### 6.1 Enable HTTPS
- Railway: Automatic (included)
- Vercel: Automatic (included)

### 6.2 Update URLs
- Update `APP_URL` in Railway environment
- Update `FRONTEND_URL` in Railway environment
- Update `VITE_API_URL` in Vercel environment

### 6.3 Security Headers
Add to `config/app.php`:
```php
'secure_headers' => [
    'X-Content-Type-Options' => 'nosniff',
    'X-Frame-Options' => 'DENY',
    'X-XSS-Protection' => '1; mode=block',
    'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
],
```

---

## Step 7: Monitoring & Maintenance

### 7.1 Logs
- **Railway**: View logs in dashboard
- **Vercel**: View logs in dashboard

### 7.2 Database Backups
Supabase automatically backs up your database daily.

To manually backup:
```bash
railway run php artisan supabase:backup
```

### 7.3 Performance Monitoring
- Use Railway's built-in monitoring
- Use Vercel's analytics
- Monitor Supabase database performance

---

## Troubleshooting

### Issue: Database Connection Failed
**Solution**: 
1. Verify Supabase credentials in Railway environment
2. Check if Supabase project is active
3. Verify PostgreSQL driver is installed: `php -m | grep pdo_pgsql`

### Issue: CORS Errors
**Solution**:
1. Update `config/cors.php` with correct domains
2. Clear cache: `php artisan config:cache`
3. Restart Railway deployment

### Issue: Google OAuth Not Working
**Solution**:
1. Verify Google OAuth credentials
2. Update authorized URIs in Google Cloud Console
3. Check `GOOGLE_REDIRECT_URI` matches exactly

### Issue: WebSocket Connection Failed
**Solution**:
1. Verify Reverb configuration
2. Check `REVERB_HOST` and `REVERB_PORT`
3. Ensure WebSocket port is open on Railway

---

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Admin account created
- [ ] Google OAuth working
- [ ] Email notifications configured
- [ ] SSL certificate active
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Backups enabled
- [ ] Monitoring configured
- [ ] Domain DNS updated

---

## Rollback Procedure

If deployment fails:

1. **Railway**: Click "Rollback" in deployment history
2. **Vercel**: Click "Rollback" in deployments
3. **Database**: Restore from Supabase backup

---

## Performance Optimization

### 1. Enable Caching
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Database Optimization
- Add indexes to frequently queried columns
- Use eager loading with `with()`
- Implement query caching

### 3. Frontend Optimization
- Enable gzip compression
- Minify CSS/JS
- Optimize images
- Use CDN for static assets

### 4. API Rate Limiting
Configure in `config/api.php`:
```php
'rate_limit' => '60,1', // 60 requests per minute
```

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev

---

**Last Updated**: March 14, 2026
**Status**: Ready for Production Deployment
