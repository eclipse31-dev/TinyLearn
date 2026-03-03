# 🔄 How to Keep Servers Running

## Current Status
✅ All 4 servers are currently running in the background!

## What's Running Now

1. **Laravel API** (Terminal 1)
   - URL: http://localhost:8000
   - Handles all API requests

2. **Queue Worker** (Terminal 2)
   - Processes background jobs
   - Broadcasts real-time events

3. **Reverb WebSocket** (Terminal 3)
   - URL: ws://localhost:8080
   - Real-time communication

4. **React Frontend** (Terminal 4)
   - URL: http://localhost:3000
   - User interface

## ⚠️ Important Notes

### Servers Will Stop If:
- You close this IDE/editor
- You restart your computer
- You manually stop the processes
- Your computer goes to sleep (sometimes)

### To Check If Servers Are Running

Run this command:
```bash
php test_login_api.php
```

If you see "SUCCESS" - servers are running ✅
If you see "Connection refused" - servers stopped ❌

## 🔄 How to Restart Servers

If servers stop, run these commands in 4 separate terminals:

### Terminal 1: Laravel
```bash
php artisan serve
```
Keep this terminal open!

### Terminal 2: Reverb
```bash
php artisan reverb:start
```
Keep this terminal open!

### Terminal 3: Queue Worker
```bash
php artisan queue:work
```
Keep this terminal open!

### Terminal 4: React
```bash
cd react
npm run dev
```
Keep this terminal open!

## 🪟 Windows Batch Files

For easier startup, use these files:

1. Double-click `start-laravel.bat`
2. Double-click `start-reverb.bat`
3. Double-click `start-queue.bat`
4. Open terminal and run: `cd react && npm run dev`

## 🛑 How to Stop All Servers

If you need to stop everything:

```bash
# Stop all PHP processes
taskkill /F /IM php.exe

# Stop Node/React
taskkill /F /IM node.exe
```

Or just close the terminal windows.

## 💡 Pro Tips

### Keep Terminals Organized
- Name each terminal window (Laravel, Reverb, Queue, React)
- Use different terminal colors if possible
- Minimize them but don't close

### Check Server Health
```bash
# Quick health check
php test_login_api.php

# Check what's running on ports
netstat -ano | findstr "8000 8080 3000"
```

### Automatic Restart (Advanced)
You could create a script that checks and restarts servers automatically, but for development, manual restart is fine.

## 🚨 Common Issues

### Port Already in Use
```bash
# Find what's using port 8000
netstat -ano | findstr ":8000"

# Kill that process
taskkill /F /PID <process_id>
```

### Laravel Won't Start
- Check if another PHP process is running
- Make sure you're in the project directory
- Verify .env file exists

### React Won't Start
- Make sure you're in the `react` folder
- Run `npm install` if needed
- Check if port 3000 is available

### Real-Time Not Working
- Ensure Reverb is running (Terminal 2)
- Ensure Queue Worker is running (Terminal 3)
- Check browser console for WebSocket errors

## 📋 Daily Workflow

### Starting Your Day
1. Open project in IDE
2. Run the 4 startup commands
3. Wait for all servers to start
4. Open http://localhost:3000
5. Login and start working

### During Development
- Keep all 4 terminals open
- Watch for errors in terminals
- Restart individual servers if needed

### Ending Your Day
- You can close terminals (servers will stop)
- Or leave them running if you'll continue later
- No need to stop servers between sessions

## 🎯 Quick Reference

| Server | Port | Command | Check |
|--------|------|---------|-------|
| Laravel | 8000 | `php artisan serve` | http://localhost:8000 |
| Reverb | 8080 | `php artisan reverb:start` | Check terminal output |
| Queue | - | `php artisan queue:work` | Check terminal output |
| React | 3000 | `npm run dev` | http://localhost:3000 |

## ✅ Verification Checklist

Before starting work, verify:
- [ ] Laravel responds at http://localhost:8000
- [ ] React loads at http://localhost:3000
- [ ] Can login successfully
- [ ] No errors in browser console
- [ ] All 4 terminal windows are open

---

**Remember:** All 4 servers must be running for the app to work properly!

If you see "Invalid credentials" → Laravel is not running
If real-time features don't work → Reverb or Queue Worker is not running
If page doesn't load → React is not running
