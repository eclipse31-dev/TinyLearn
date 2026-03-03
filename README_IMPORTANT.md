# ⚠️ IMPORTANT: How to Fix "Invalid Credentials" Error

## The Problem

You're seeing "Invalid credentials" because the **Laravel backend server is NOT running**.

The React frontend (http://localhost:5173) is trying to connect to the Laravel API (http://localhost:8000), but Laravel isn't started yet.

## The Solution

You MUST start the Laravel backend server first!

### Step-by-Step Instructions

1. **Open a NEW terminal/command prompt**

2. **Navigate to your project folder:**
   ```bash
   cd C:\Users\Ken\Documents\laravel-react-bladerz
   ```

3. **Start Laravel:**
   ```bash
   php artisan serve
   ```

4. **You should see:**
   ```
   INFO  Server running on [http://127.0.0.1:8000]
   ```

5. **Keep this terminal open!** Don't close it.

6. **Now try logging in again** with:
   - Email: `admin@example.com`
   - Password: `password`

## Quick Test

Before trying to login, verify Laravel is running:

```bash
php test_login_api.php
```

If you see "SUCCESS (token received)" - Laravel is working!

## All Test Accounts

Once Laravel is running, you can login with any of these:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Admin |
| teacher@example.com | password | Teacher |
| student@example.com | password | Student |

## For Full Real-Time Features

You need 4 servers running (in 4 separate terminals):

1. **Laravel Backend:**
   ```bash
   php artisan serve
   ```

2. **Reverb WebSocket:**
   ```bash
   php artisan reverb:start
   ```

3. **Queue Worker:**
   ```bash
   php artisan queue:work
   ```

4. **React Frontend:**
   ```bash
   cd react
   npm run dev
   ```

## Windows Users: Easy Start

Just double-click these files:
- `start-laravel.bat` - Starts Laravel
- `start-reverb.bat` - Starts WebSocket server
- `start-queue.bat` - Starts queue worker

Then manually start React:
```bash
cd react
npm run dev
```

## Still Having Issues?

Run these diagnostic tests:

```bash
# Check if users exist
php test_users.php

# Check if Laravel API works
php test_login_api.php

# Check real-time configuration
php test_realtime.php
```

## Common Mistakes

❌ **Starting only React** - Won't work, needs Laravel too
❌ **Closing the Laravel terminal** - Stops the server
❌ **Wrong port** - Laravel must be on port 8000
❌ **Not in project folder** - Must run commands from project root

✅ **Keep Laravel terminal open while using the app**
✅ **Start Laravel BEFORE trying to login**
✅ **Use the correct test credentials**

---

**TL;DR:** Run `php artisan serve` in a terminal and keep it open!
