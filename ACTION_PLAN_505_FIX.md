# Action Plan: Fix 505 Server Error

## Current Situation
✅ Code is ready  
✅ Deployment files created  
✅ GitHub updated  
⚠️ **WAITING**: Your action to complete the fix

## What Happened
When you tried to login as a student on Railway, you got a 505 error because the PHP environment didn't have PostgreSQL support.

## What We Fixed
We added 4 files to ensure Railway uses the correct PHP buildpack with PostgreSQL:
- `Procfile`
- `runtime.txt`
- `.buildpacks`
- `.user.ini`

All files are now in GitHub.

## Your Action Items (In Order)

### ✅ DONE - We Already Did This
- [x] Created deployment configuration files
- [x] Pushed to GitHub
- [x] Created comprehensive guides

### 🔴 ACTION REQUIRED - You Need to Do This

#### Step 1: Find Your Supabase Password (5 minutes)
1. Go to https://supabase.com
2. Sign in
3. Select project: `wlcguodooyitrecgcauu`
4. Go to Settings → Database
5. Find your password
6. **Copy it** (you'll need it in next steps)

**Why**: Your `.env` has `DB_PASSWORD=YOUR-PASSWORD` which is a placeholder

#### Step 2: Update Local Environment (2 minutes)
1. Open `.env` file in your editor
2. Find this line:
   ```
   DB_PASSWORD=YOUR-PASSWORD
   ```
3. Replace with your actual password:
   ```
   DB_PASSWORD=your-actual-password-here
   ```
4. Save the file

**Why**: You need the actual password to connect to Supabase

#### Step 3: Test Locally (3 minutes)
1. Open terminal/PowerShell
2. Run:
   ```bash
   php artisan tinker
   ```
3. Type:
   ```php
   DB::connection()->getPdo();
   ```
4. Should return a PDO object (no errors)
5. Type `exit` to quit

**Why**: Verify the password works before deploying

#### Step 4: Update Railway Environment (3 minutes)
1. Go to https://railway.app
2. Sign in
3. Select TinyLearn project
4. Click backend service
5. Go to "Variables" tab
6. Find `DB_PASSWORD`
7. Replace `YOUR-PASSWORD` with your actual password
8. Click "Save"

**Why**: Railway needs the password to connect to Supabase

#### Step 5: Trigger Redeploy (1 minute)
1. Still in Railway dashboard
2. Click "Redeploy" button
3. Watch the logs (should take 2-5 minutes)

**Why**: Railway needs to rebuild with the new password

#### Step 6: Wait for Deployment (5 minutes)
- Watch the Railway logs
- Look for: `Procfile detected` ✅
- Look for: `Installing PHP extensions` ✅
- Look for: `pdo_pgsql` ✅
- When you see "Deployment successful", move to next step

**Why**: Deployment takes time, don't test too early

#### Step 7: Test Student Login (2 minutes)
1. Go to your deployed frontend URL
2. Click "Login as Student"
3. Enter:
   - Email: `student@example.com`
   - Password: `password`
4. Should login successfully (no 505 error)

**Why**: Verify the fix works

## Total Time Required
**~20 minutes** to complete all steps

## If Something Goes Wrong

### Issue: Still getting 505 error
1. Check Railway logs for error messages
2. Verify password is correct
3. Try the alternative approach (see `RAILWAY_SETUP_COMPLETE.md`)

### Issue: Can't find Supabase password
1. Go to Supabase dashboard
2. Click "Reset Password" if needed
3. Set a new password
4. Use the new password

### Issue: Connection refused
1. Verify host: `aws-1-ap-south-1.pooler.supabase.com`
2. Verify username: `postgres.wlcguodooyitrecgcauu`
3. Verify database: `postgres`
4. Verify port: `5432`

## Documentation to Read

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `FIX_505_ERROR_SUMMARY.md` | Quick overview | 2 min |
| `SUPABASE_PASSWORD_SETUP.md` | Password setup details | 3 min |
| `RAILWAY_SETUP_COMPLETE.md` | Complete Railway guide | 5 min |
| `RAILWAY_DEPLOYMENT_FIX.md` | Technical details | 5 min |
| `DEPLOYMENT_ARCHITECTURE.md` | System overview | 10 min |

## Quick Reference

### Supabase Credentials
```
Project URL: https://wlcguodooyitrecgcauu.supabase.co
Database Host: aws-1-ap-south-1.pooler.supabase.com
Database Port: 5432
Database Name: postgres
Username: postgres.wlcguodooyitrecgcauu
Password: [YOUR-PASSWORD] ← YOU NEED TO FIND THIS
```

### Railway Backend URL
```
https://your-railway-backend-url.railway.app
```
(You'll see this in Railway dashboard)

### Frontend URL
```
https://your-frontend-url.vercel.app
(or wherever you deployed it)
```

## Success Criteria

After completing all steps, you should have:
- ✅ Student can login without 505 error
- ✅ Dashboard loads with courses
- ✅ Can view course details
- ✅ Can submit assignments
- ✅ Can see notifications
- ✅ All features work

## Next Steps After Fix

Once the 505 error is fixed:
1. Test all user roles (admin, teacher, student)
2. Test all features (courses, assignments, discussions)
3. Monitor logs for any issues
4. Set up monitoring/alerts
5. Plan for production scaling

## Support

If you get stuck:
1. Check the relevant documentation file
2. Look at Railway logs for error messages
3. Verify all credentials are correct
4. Try the troubleshooting section in `RAILWAY_SETUP_COMPLETE.md`

---

**Status**: Awaiting your action  
**Estimated Time**: 20 minutes  
**Difficulty**: Easy  
**Next Step**: Find your Supabase password
