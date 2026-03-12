# Railway Deployment - Complete Setup Guide

## Current Status
✅ Backend code is ready for Railway deployment  
✅ PostgreSQL configuration files added  
✅ Supabase credentials configured in `.env`  
⚠️ **ACTION REQUIRED**: Redeploy on Railway to fix 505 error

## The 505 Error - What Happened?

When you tried to login as a student on the deployed version, you got a **505 Server Error**. This happened because:

1. Your backend is configured to use **Supabase PostgreSQL** (not SQLite)
2. Railway's PHP environment didn't have the **PostgreSQL PHP extension** (`pdo_pgsql`)
3. Without this extension, Laravel couldn't connect to the database
4. Result: 505 Server Error

## The Fix - What We Did

We added 4 files to ensure Railway uses the correct PHP buildpack with PostgreSQL support:

### 1. **Procfile** (tells Railway how to run the app)
```
web: vendor/bin/heroku-php-apache2 -i /etc/php/conf.d/pdo_pgsql.ini public/
```

### 2. **runtime.txt** (specifies PHP version)
```
php-8.2.0
```

### 3. **.buildpacks** (specifies the buildpack)
```
https://github.com/heroku/heroku-buildpack-php.git
```

### 4. **.user.ini** (enables PostgreSQL extension)
```
extension=pdo_pgsql.so
```

## How to Deploy the Fix

### Option A: Automatic Deployment (Recommended)
If Railway is connected to your GitHub repository:

1. **The fix is already pushed to GitHub** ✅
2. **Railway will automatically redeploy** when it detects the new files
3. **Wait 2-5 minutes** for the deployment to complete
4. **Test login** - should work now!

### Option B: Manual Redeploy on Railway

1. **Go to Railway Dashboard:**
   - Visit https://railway.app
   - Sign in with your account
   - Select your TinyLearn project

2. **Redeploy the Backend:**
   - Click on the backend service
   - Click the "Redeploy" button (or look for a deploy option)
   - Wait for deployment to complete (watch the logs)

3. **Check the Logs:**
   - Click "Logs" tab
   - Look for messages like:
     - `Procfile detected` ✅
     - `Installing PHP extensions` ✅
     - `pdo_pgsql` ✅
   - If you see errors, note them for troubleshooting

### Option C: Using Railway CLI

If you have Railway CLI installed:

```bash
railway up
```

## Verify Environment Variables on Railway

Before testing, make sure these are set in Railway dashboard:

1. **Go to your backend service**
2. **Click "Variables" tab**
3. **Verify these are set:**

```
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.wlcguodooyitrecgcauu
DB_PASSWORD=[YOUR-ACTUAL-PASSWORD]
```

**⚠️ IMPORTANT**: Replace `[YOUR-ACTUAL-PASSWORD]` with your actual Supabase password!

## Test the Fix

### Step 1: Check Backend Health
```
GET https://your-railway-backend-url/api/health
```
Should return 200 OK

### Step 2: Test Student Login
1. Go to your frontend URL
2. Click "Login as Student"
3. Enter credentials:
   - Email: `student@example.com`
   - Password: `password`
4. Should login successfully (no 505 error)

### Step 3: Check Logs if Issues Persist
- Go to Railway dashboard
- Backend service → Logs tab
- Look for error messages
- Common issues:
  - `SQLSTATE[HY000]: could not find driver` → Extension not loaded
  - `SQLSTATE[08006]: could not connect to server` → Wrong Supabase credentials
  - `SQLSTATE[42P01]: relation does not exist` → Database not migrated

## If Still Getting 505 Error

### Troubleshooting Steps

1. **Check if buildpack is being used:**
   - Look in Railway logs for: `Procfile detected`
   - If not present, the Procfile might not be recognized

2. **Verify PHP version:**
   - In logs, look for: `php-8.2.0`
   - If different version, update `runtime.txt`

3. **Check extension loading:**
   - In logs, look for: `pdo_pgsql`
   - If not present, the extension didn't load

4. **Try Alternative Approach:**
   - Delete `.buildpacks` and `runtime.txt`
   - Update Procfile to:
     ```
     web: php -S 0.0.0.0:${PORT:-8000} -t public
     ```
   - Redeploy

5. **Check Supabase Connection:**
   - Verify password is correct (no special characters issues)
   - Test connection locally first:
     ```bash
     php artisan tinker
     DB::connection()->getPdo();
     ```

## Database Setup (if needed)

If the database hasn't been migrated yet:

### Via Railway Shell
1. Go to Railway dashboard
2. Backend service → Shell tab
3. Run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

### Via Railway CLI
```bash
railway run php artisan migrate --force
railway run php artisan db:seed --force
```

## Files Changed
- ✅ `Procfile` - Created
- ✅ `runtime.txt` - Created
- ✅ `.buildpacks` - Created
- ✅ `.user.ini` - Created
- ✅ Pushed to GitHub

## Next Steps

1. **Wait for Railway to redeploy** (2-5 minutes)
2. **Test student login** on your deployed frontend
3. **Check logs** if any issues
4. **Report any errors** with specific error messages

## Support

If you're still getting errors:
1. Check the Railway logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase credentials are accurate
4. Try the alternative approach (native PHP support)

---

**Status**: Ready for deployment ✅  
**Last Updated**: March 12, 2026  
**GitHub Commit**: Latest with Procfile and buildpack files
