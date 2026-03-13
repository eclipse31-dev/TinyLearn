# Server Error Fix

## Problem
"Server Error" when accessing the app

## Root Cause
`DB_PASSWORD=YOUR-PASSWORD` is a placeholder in .env

## Solution

### Step 1: Update .env
Replace `YOUR-PASSWORD` with your actual Supabase password:

```
DB_PASSWORD=your-actual-supabase-password
```

### Step 2: Restart Servers
```bash
# Stop current servers (Ctrl+C)
# Then restart:
php artisan serve
npm run dev
```

### Step 3: Access App
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Test Credentials
- Email: student@example.com
- Password: password

## If Still Getting Error
1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify Supabase password is correct
3. Check database connection: `php artisan tinker` → `DB::connection()->getPdo();`
