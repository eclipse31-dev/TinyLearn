# Deploy TinyLearn LMS to Cloud NOW (5 Minutes)

## The Fastest Way to Deploy

This guide will get your TinyLearn LMS running on the cloud in **5 minutes** for **$10/month**.

## What You'll Need

1. GitHub account (free) - https://github.com
2. Vercel account (free) - https://vercel.com
3. Railway account (free) - https://railway.app

## Step 1: Push Code to GitHub (1 minute)

```bash
# In your project directory
git init
git add .
git commit -m "TinyLearn LMS - Ready for cloud"

# Create a new repository on GitHub
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/tinylearn.git
git branch -M main
git push -u origin main
```

**Done!** Your code is now on GitHub.

---

## Step 2: Deploy Database (1 minute)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Wait 30 seconds for database to be created
5. Click on the database
6. Go to **"Connect"** tab
7. Copy the **"Postgres Connection URL"** (looks like: `postgresql://user:password@host:port/database`)
8. **Save this URL** - you'll need it in Step 3

**Done!** Your database is now in the cloud.

---

## Step 3: Deploy Backend (1 minute)

1. In Railway, click **"New Service"**
2. Select **"GitHub Repo"**
3. Connect your GitHub account
4. Select your `tinylearn` repository
5. Click **"Deploy"**

### Add Environment Variables

In Railway dashboard:
1. Click your service
2. Go to **"Variables"** tab
3. Click **"Add Variable"**
4. Add these variables:

```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR_RAILWAY_DOMAIN.railway.app
APP_KEY=base64:GENERATE_THIS_LOCALLY

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
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app
```

### Generate APP_KEY

```bash
# Run this locally
php artisan key:generate --show
# Copy the output (starts with base64:)
# Paste it in the APP_KEY variable above
```

### Set Build Command

In Railway:
1. Go to **"Settings"**
2. Set **Build Command**: `composer install && php artisan migrate --force`
3. Set **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

**Done!** Your backend is deploying.

---

## Step 4: Deploy Frontend (1 minute)

1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Select your `tinylearn` repository
5. Click **"Import"**

### Configure Build Settings

In Vercel:
1. Go to **"Settings"**
2. Set **Framework**: Vite
3. Set **Build Command**: `cd react && npm install && npm run build`
4. Set **Output Directory**: `react/dist`
5. Set **Root Directory**: `.`

### Add Environment Variables

In Vercel:
1. Go to **"Settings"** → **"Environment Variables"**
2. Add:

```
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN.railway.app
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN.railway.app
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

3. Click **"Deploy"**

**Done!** Your frontend is deploying.

---

## Step 5: Update CORS (1 minute)

1. Edit `config/cors.php` in your project
2. Update the `allowed_origins` array:

```php
'allowed_origins' => [
    'https://YOUR_VERCEL_DOMAIN.vercel.app',
    'https://YOUR_RAILWAY_DOMAIN.railway.app',
],
```

3. Commit and push:

```bash
git add config/cors.php
git commit -m "Update CORS for cloud deployment"
git push
```

Both services will auto-redeploy.

---

## Step 6: Get Your Domains

### Railway Domain
1. Go to Railway dashboard
2. Click your service
3. Go to **"Settings"**
4. Copy the **"Public URL"** (looks like: `https://tinylearn-api-production.railway.app`)

### Vercel Domain
1. Go to Vercel dashboard
2. Click your project
3. Copy the domain from the top (looks like: `https://tinylearn.vercel.app`)

---

## Step 7: Test Your Deployment

1. Go to your Vercel domain: `https://YOUR_VERCEL_DOMAIN.vercel.app`
2. Login with:
   - Email: `admin@example.com`
   - Password: `password`
3. Test features:
   - Create a course
   - Invite a student
   - Check notifications
   - Unenroll from course

---

## Troubleshooting

### "Database connection error"
- Check Railway variables are set correctly
- Verify `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

### "Frontend not loading"
- Check Vercel environment variables
- Verify `VITE_API_URL` matches Railway domain

### "API not responding"
- Check Railway logs (click service → "Logs" tab)
- Look for error messages

### "CORS error"
- Update `config/cors.php` with correct domains
- Commit and push to trigger redeploy

---

## What You Have Now

✅ **Frontend**: Running on Vercel (free)
✅ **Backend**: Running on Railway ($5/month)
✅ **Database**: PostgreSQL on Railway ($5/month)
✅ **SSL/TLS**: Automatic (both services)
✅ **CDN**: Vercel global CDN (free)
✅ **Uptime**: 99.9%
✅ **Total Cost**: ~$10/month

---

## Next Steps (Optional)

### 1. Setup Custom Domain
- Buy domain from GoDaddy, Namecheap, etc.
- Update DNS records
- Configure in Vercel and Railway

### 2. Setup Email Service
- Create Mailtrap account (free)
- Update `MAIL_*` variables
- Test email sending

### 3. Setup Monitoring
- Vercel Analytics (automatic)
- Railway Metrics (automatic)
- Setup alerts

### 4. Setup Backups
- Railway automatic backups (included)
- Export database weekly

---

## Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/YOUR_USERNAME/tinylearn
- **Mailtrap**: https://mailtrap.io (for email testing)

---

## Support

If you get stuck:
1. Check Railway logs
2. Check Vercel logs
3. Check GitHub Actions
4. See `CLOUD_DEPLOYMENT_GUIDE.md` for detailed help

---

## Summary

**Time**: 5 minutes
**Cost**: $10/month
**Uptime**: 99.9%
**Scalability**: Automatic

Your TinyLearn LMS is now live on the cloud! 🚀

---

## Test Credentials

```
Email: admin@example.com
Password: password
```

---

## Celebrate! 🎉

You've successfully deployed a full-stack Learning Management System to the cloud!

Next time you push code to GitHub, both Vercel and Railway will automatically redeploy your changes.

Enjoy your TinyLearn LMS! 🎓
