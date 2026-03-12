# Quick Deploy: Vercel + Railway (5 Minutes)

## What You'll Get
- ✅ Frontend on Vercel (free)
- ✅ Backend on Railway ($5/month)
- ✅ PostgreSQL Database on Railway ($5/month)
- ✅ Total: ~$10/month

## Prerequisites (2 minutes)
1. GitHub account (free)
2. Vercel account (free) - https://vercel.com
3. Railway account (free) - https://railway.app

## Step 1: Push Code to GitHub (1 minute)

```bash
# Initialize git
git init
git add .
git commit -m "TinyLearn LMS - Ready for deployment"

# Create repository on GitHub
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/tinylearn.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Database (1 minute)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Wait for database to be created
5. Click on the database
6. Go to **"Connect"** tab
7. Copy the **"Postgres Connection URL"**
8. Save it somewhere safe

## Step 3: Deploy Backend (1 minute)

1. In Railway, click **"New Service"**
2. Select **"GitHub Repo"**
3. Connect your GitHub account
4. Select your `tinylearn` repository
5. Click **"Deploy"**

### Configure Environment Variables

In Railway dashboard, go to your service and click **"Variables"**

Add these variables:

```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_THIS_LOCALLY
APP_URL=https://YOUR_RAILWAY_DOMAIN.railway.app

DB_CONNECTION=pgsql
DB_HOST=${{ Postgres.PGHOST }}
DB_PORT=${{ Postgres.PGPORT }}
DB_DATABASE=${{ Postgres.PGDATABASE }}
DB_USERNAME=${{ Postgres.PGUSER }}
DB_PASSWORD=${{ Postgres.PGPASSWORD }}

BROADCAST_CONNECTION=reverb
REVERB_HOST=YOUR_RAILWAY_DOMAIN.railway.app
REVERB_PORT=443
REVERB_SCHEME=https

SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_DOMAIN.vercel.app
SESSION_DOMAIN=.railway.app

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=YOUR_MAILTRAP_USERNAME
MAIL_PASSWORD=YOUR_MAILTRAP_PASSWORD
MAIL_FROM_ADDRESS=noreply@tinylearn.app

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

### Generate APP_KEY

```bash
# Run locally
php artisan key:generate --show
# Copy the output (starts with base64:)
```

### Add Build Command

In Railway, go to **"Settings"** → **"Build"**

Set:
- **Build Command**: `composer install && php artisan migrate --force`
- **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

## Step 4: Deploy Frontend (1 minute)

1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Select your `tinylearn` repository
5. Click **"Import"**

### Configure Build Settings

In Vercel project settings:

- **Framework**: Vite
- **Build Command**: `cd react && npm install && npm run build`
- **Output Directory**: `react/dist`
- **Root Directory**: `.`

### Add Environment Variables

In Vercel, go to **"Settings"** → **"Environment Variables"**

Add:
```
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN.railway.app
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN.railway.app
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

Click **"Deploy"**

## Step 5: Update CORS (1 minute)

Edit `config/cors.php`:

```php
'allowed_origins' => [
    'https://YOUR_VERCEL_DOMAIN.vercel.app',
    'https://YOUR_RAILWAY_DOMAIN.railway.app',
],
```

Commit and push:
```bash
git add config/cors.php
git commit -m "Update CORS for cloud deployment"
git push
```

Both services will auto-redeploy.

## Step 6: Test Your Deployment

1. Go to your Vercel domain: `https://YOUR_VERCEL_DOMAIN.vercel.app`
2. Login with test credentials:
   - Email: `admin@example.com`
   - Password: `password`
3. Test all features

## Getting Your Domains

### Railway Domain
- Go to Railway dashboard
- Click your service
- Go to **"Settings"**
- Copy the **"Public URL"**

### Vercel Domain
- Go to Vercel dashboard
- Click your project
- Copy the domain from the top

## Troubleshooting

### Database Connection Error
```
Check Railway variables are set correctly:
- DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

### Frontend Not Loading
```
Check Vercel environment variables:
- VITE_API_URL should match Railway domain
```

### API Not Responding
```
Check Railway logs:
1. Go to Railway dashboard
2. Click your service
3. Go to "Logs" tab
4. Look for errors
```

### CORS Error
```
Update config/cors.php with correct domains
Commit and push to trigger redeploy
```

## Next Steps

1. ✅ Setup custom domain (optional)
2. ✅ Setup SSL certificate (automatic on Vercel/Railway)
3. ✅ Configure email service
4. ✅ Setup backups
5. ✅ Monitor performance

## Custom Domain (Optional)

### On Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records

### On Railway
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

## Monitoring

### Railway
- Go to dashboard
- Click your service
- View "Metrics" tab

### Vercel
- Go to project
- Click "Analytics"
- View performance metrics

## Costs

- **Vercel**: Free for frontend
- **Railway**: $5/month for backend + $5/month for database
- **Total**: ~$10/month

## Support

- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support
- Documentation: See CLOUD_DEPLOYMENT_GUIDE.md

---

## Summary

You now have:
- ✅ TinyLearn LMS running on Vercel (frontend)
- ✅ Laravel API running on Railway (backend)
- ✅ PostgreSQL database on Railway
- ✅ SSL/TLS certificates (automatic)
- ✅ Global CDN (Vercel)
- ✅ Auto-scaling (Railway)

**Total time**: ~5 minutes
**Total cost**: ~$10/month
**Uptime**: 99.9%

Enjoy your cloud-deployed TinyLearn LMS! 🚀
