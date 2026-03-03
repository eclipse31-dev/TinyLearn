# Quick Start Guide

## The Problem: "Invalid credentials"

This happens because the **Laravel backend is not running**. The React frontend can't communicate with the API.

## Solution: Start the Servers

### Option 1: Use Batch Files (Windows)

Open 4 separate Command Prompt or PowerShell windows and run:

1. **Double-click** `start-laravel.bat` (or run in terminal)
2. **Double-click** `start-reverb.bat` (or run in terminal)  
3. **Double-click** `start-queue.bat` (or run in terminal)
4. In the 4th terminal:
   ```bash
   cd react
   npm run dev
   ```

### Option 2: Manual Commands

Open 4 terminals and run these commands:

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
php artisan reverb:start
```

**Terminal 3:**
```bash
php artisan queue:work
```

**Terminal 4:**
```bash
cd react
npm run dev
```

## Test Login

Once all servers are running, open your browser to the React app (usually http://localhost:5173) and login with:

- **Email:** admin@example.com
- **Password:** password

Or use:
- teacher@example.com / password
- student@example.com / password

## Verify Everything Works

Run this test to check the API:
```bash
php test_login_api.php
```

You should see "SUCCESS (token received)" for all accounts.

## What Each Server Does

1. **Laravel (port 8000)** - Main API backend, handles login, data, etc.
2. **Reverb (port 8080)** - WebSocket server for real-time features
3. **Queue Worker** - Processes background jobs and broadcasts events
4. **React (port 5173)** - Frontend user interface

## Common Issues

### "Connection refused" or "Invalid credentials"
→ Laravel backend is not running. Start Terminal 1.

### Real-time features don't work
→ Start Reverb (Terminal 2) and Queue Worker (Terminal 3)

### Frontend shows blank page
→ Make sure React dev server is running (Terminal 4)

### Port already in use
→ Close other applications using ports 8000, 8080, or 5173

## Need Help?

Check these test scripts:
- `php test_users.php` - Verify users exist in database
- `php test_login_api.php` - Test API login endpoint
- `php test_realtime.php` - Check real-time configuration

See `START_SERVERS.md` for detailed troubleshooting.
