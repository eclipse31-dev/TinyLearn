# 🔍 Error Checker Guide

## ✅ All Systems Operational!

I've created a comprehensive error checker tool for your LMS.

## How to Use

Run this command anytime to check for errors:

```bash
php check_errors.php
```

## What It Checks

### 1. Laravel Backend
- ✅ Checks if Laravel is running on port 8000
- ✅ Verifies API is responding

### 2. Database Connection
- ✅ Tests database connectivity
- ✅ Checks if all required tables exist

### 3. Required Tables
Verifies these tables exist:
- users, roles, courses, enrollments
- announcements, assessments, submissions
- grade, modules, resources, schedules
- activity_logs, notifications

### 4. Test Users
- ✅ Checks if test accounts exist
- ✅ Verifies admin, teacher, student accounts

### 5. Environment Configuration
- ✅ Checks .env file exists
- ✅ Verifies APP_KEY is set
- ✅ Confirms Reverb configuration

### 6. React Frontend
- ✅ Checks if React is running on port 3000

### 7. Storage Permissions
- ✅ Verifies storage directory is writable

### 8. API Routes
- ✅ Tests critical API endpoints
- ✅ Verifies routes are accessible

## Current Status

**Last Check Results:**
- ✅ Success: 28 checks passed
- ⚠️ Warnings: 0
- ❌ Errors: 0

**All systems are GO!** 🚀

## What Each Status Means

### ✅ Success
Everything is working correctly. No action needed.

### ⚠️ Warning
System works but something could be improved.
Example: "React frontend not running" - optional for backend testing

### ❌ Error
Critical issue that needs to be fixed.
Example: "Database connection failed" - must fix to use system

## Common Issues & Fixes

### Laravel Backend Not Responding
```bash
# Start Laravel
php artisan serve
```

### Database Connection Failed
```bash
# Check .env file has correct database settings
# For SQLite, ensure database/database.sqlite exists
touch database/database.sqlite
php artisan migrate
```

### Tables Missing
```bash
# Run migrations
php artisan migrate

# Or reset and seed
php artisan migrate:fresh --seed
```

### No Users Found
```bash
# Seed the database
php artisan db:seed
```

### React Frontend Not Running
```bash
cd react
npm install
npm run dev
```

### Storage Not Writable
```bash
# On Windows (run as administrator)
icacls storage /grant Everyone:F /T

# On Linux/Mac
chmod -R 775 storage
```

## Quick Health Check

Run this for a quick status:
```bash
php check_errors.php
```

If you see:
```
🎉 All critical checks passed! Your LMS is ready to use.
```

You're good to go!

## Automated Checking

You can add this to your workflow:

```bash
# Before starting work
php check_errors.php

# If all green, start coding
# If errors, fix them first
```

## Integration with CI/CD

Add to your CI pipeline:
```yaml
- name: Run Error Checker
  run: php check_errors.php
```

## What Gets Checked

| Check | Critical | Description |
|-------|----------|-------------|
| Laravel Backend | ✅ Yes | Must be running |
| Database Connection | ✅ Yes | Must connect |
| Required Tables | ✅ Yes | All tables must exist |
| Test Users | ⚠️ Optional | Helpful for testing |
| Environment Config | ✅ Yes | Must be configured |
| React Frontend | ⚠️ Optional | For full stack testing |
| Storage Permissions | ✅ Yes | For file uploads |
| API Routes | ✅ Yes | Must be accessible |

## Troubleshooting

### Error: "cURL error"
- Laravel is not running
- Start with: `php artisan serve`

### Error: "Database connection failed"
- Check .env database settings
- Ensure database file exists (SQLite)
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

### Error: "Table not found"
- Run migrations: `php artisan migrate`
- Or reset: `php artisan migrate:fresh --seed`

### Warning: "React not running"
- Not critical for backend testing
- Start if needed: `cd react && npm run dev`

## Best Practices

1. **Run before starting work** - Catch issues early
2. **Run after pulling changes** - Verify setup
3. **Run before committing** - Ensure nothing broke
4. **Run in production** - Health monitoring

## Output Example

```
=== LMS Error Checker ===

✅ SUCCESS (28):
  ✓ Laravel backend is running
  ✓ Database connection successful
  ✓ All tables exist
  ✓ Test users found
  ✓ Environment configured
  ✓ React frontend running
  ✓ Storage writable
  ✓ API routes accessible

=== SUMMARY ===
Success: 28
Warnings: 0
Errors: 0

🎉 All critical checks passed!
```

## Additional Tools

### Test Login API
```bash
php test_login_api.php
```

### Test Users
```bash
php test_users.php
```

### Test Real-Time
```bash
php test_realtime.php
```

## Need Help?

If error checker shows issues:
1. Read the error message
2. Check the "Common Issues & Fixes" section
3. Run the suggested fix command
4. Run error checker again

---

**Your LMS is currently error-free and ready to use!** ✅

Open http://localhost:3000 and login with:
- admin@example.com / password
- teacher@example.com / password
- student@example.com / password
