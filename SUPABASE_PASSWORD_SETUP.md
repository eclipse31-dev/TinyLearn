# Supabase Password Setup - CRITICAL

## Current Issue
Your `.env` file has:
```
DB_PASSWORD=YOUR-PASSWORD
```

This is a **placeholder** and needs to be replaced with your **actual Supabase password**.

## Where to Find Your Supabase Password

### Method 1: From Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your project: `wlcguodooyitrecgcauu`
4. Go to **Settings** → **Database**
5. Look for **Connection String** or **Password**
6. Copy the password (it's the part after `postgres.wlcguodooyitrecgcauu:`)

### Method 2: From Connection String
If you have the connection string:
```
postgresql://postgres.wlcguodooyitrecgcauu:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

The password is the part between `:` and `@`

## How to Update

### Local Development

1. **Edit `.env` file:**
   ```
   DB_PASSWORD=your-actual-password-here
   ```

2. **Test connection locally:**
   ```bash
   php artisan tinker
   DB::connection()->getPdo();
   ```
   Should return a PDO object without errors

3. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

### Railway Deployment

1. **Go to Railway Dashboard:**
   - https://railway.app
   - Select TinyLearn project
   - Click backend service

2. **Go to Variables tab**

3. **Update `DB_PASSWORD`:**
   - Find the `DB_PASSWORD` variable
   - Replace `YOUR-PASSWORD` with your actual password
   - Click Save

4. **Redeploy:**
   - Click "Redeploy" button
   - Wait for deployment to complete

5. **Test:**
   - Try logging in as student
   - Should work without 505 error

## Important Notes

⚠️ **Security:**
- Never commit the actual password to GitHub
- The `.env` file is in `.gitignore` (not tracked)
- Only the placeholder `YOUR-PASSWORD` is in the repo

⚠️ **Special Characters:**
- If your password has special characters like `@`, `#`, `%`, etc.
- You may need to URL-encode them
- Example: `@` becomes `%40`

⚠️ **Password Reset:**
- If you forget your password, you can reset it in Supabase dashboard
- Settings → Database → Reset Password

## Verification Checklist

- [ ] Found your Supabase password
- [ ] Updated `.env` locally with actual password
- [ ] Tested connection with `php artisan tinker`
- [ ] Updated Railway environment variables
- [ ] Redeployed on Railway
- [ ] Tested student login on deployed version

## If Connection Still Fails

1. **Check password is correct:**
   - Copy-paste from Supabase dashboard again
   - Verify no extra spaces

2. **Check host is correct:**
   - Should be: `aws-1-ap-south-1.pooler.supabase.com`
   - NOT the direct host

3. **Check username is correct:**
   - Should be: `postgres.wlcguodooyitrecgcauu`

4. **Check database name:**
   - Should be: `postgres`

5. **Check port:**
   - Should be: `5432`

## Example `.env` (with actual password)

```
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.wlcguodooyitrecgcauu
DB_PASSWORD=your-actual-supabase-password-here
```

---

**Status**: Awaiting password update  
**Action Required**: Update DB_PASSWORD in `.env` and Railway
