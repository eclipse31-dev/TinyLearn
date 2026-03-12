# Railway Deployment Fix - PostgreSQL PHP Extension Issue

## Problem
The deployed version on Railway shows a **505 Server Error** when students try to login. The error is:
```
PDOException: could not find driver
```

This means the Railway PHP environment is missing the PostgreSQL PHP extension (`pdo_pgsql`).

## Root Cause
- The backend is configured to use Supabase PostgreSQL (via `.env` with `DB_CONNECTION=pgsql`)
- Railway's default PHP buildpack may not include the PostgreSQL extension
- Without `pdo_pgsql`, Laravel cannot connect to the PostgreSQL database

## Solution

### Step 1: Verify Files Are in Place
The following files have been created to ensure Railway uses the correct PHP buildpack:

1. **Procfile** - Tells Railway how to run the app
2. **runtime.txt** - Specifies PHP version (8.2.0)
3. **.buildpacks** - Specifies the PHP buildpack to use
4. **.user.ini** - Enables PostgreSQL extension

### Step 2: Redeploy to Railway

1. **Push changes to GitHub:**
   ```bash
   git add Procfile runtime.txt .buildpacks .user.ini
   git commit -m "Fix: Add Railway deployment configuration for PostgreSQL support"
   git push origin main
   ```

2. **Trigger Railway redeploy:**
   - Go to your Railway dashboard: https://railway.app
   - Select your TinyLearn project
   - Go to the backend service
   - Click "Redeploy" or wait for automatic deployment from GitHub

3. **Wait for deployment to complete** (usually 2-5 minutes)

### Step 3: Verify Environment Variables
Make sure these are set in Railway dashboard under your backend service:

```
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.wlcguodooyitrecgcauu
DB_PASSWORD=[YOUR-ACTUAL-PASSWORD]
```

**CRITICAL**: Replace `[YOUR-ACTUAL-PASSWORD]` with your actual Supabase password.

### Step 4: Test the Fix

1. **Check Railway logs:**
   - Go to Railway dashboard
   - Select backend service
   - Click "Logs" tab
   - Look for any PHP or database connection errors

2. **Test login:**
   - Go to your deployed frontend URL
   - Try logging in as a student
   - Should no longer see 505 error

3. **If still getting errors:**
   - Check the logs for specific error messages
   - Verify the Supabase password is correct
   - Ensure database migrations have been run

### Step 5: Run Database Migrations (if needed)

If the database hasn't been set up yet:

1. **Via Railway CLI:**
   ```bash
   railway run php artisan migrate --force
   ```

2. **Or via Railway dashboard:**
   - Go to backend service
   - Click "Shell" tab
   - Run: `php artisan migrate --force`

## Alternative: Use Railway's Native PHP Support

If the above doesn't work, Railway also supports native PHP without Heroku buildpack:

1. **Delete these files:**
   - `.buildpacks`
   - `runtime.txt`

2. **Update Procfile to:**
   ```
   web: php -S 0.0.0.0:${PORT:-8000} -t public
   ```

3. **Redeploy**

## Troubleshooting

### Still getting "could not find driver"?
- The buildpack may not have installed the extension
- Try using Railway's native PHP support (see Alternative above)
- Or use a different hosting provider like Vercel + Railway combo

### Getting database connection errors?
- Verify Supabase credentials in Railway environment variables
- Check that the pooler host is correct: `aws-1-ap-south-1.pooler.supabase.com`
- Ensure the password doesn't have special characters that need escaping

### Getting 502/503 errors?
- Check Railway logs for PHP errors
- Verify all environment variables are set
- Make sure the app can connect to Supabase

## Files Modified
- `Procfile` - Created/updated
- `runtime.txt` - Created
- `.buildpacks` - Created
- `.user.ini` - Created

## Next Steps
1. Push changes to GitHub
2. Redeploy on Railway
3. Test student login
4. Monitor logs for any errors
