   # 🚀 How to Run Your LMS

## ✅ All Servers Are Currently Running!

I've already started all the servers for you. Here's what's running:

### 1. React Frontend
- **URL:** http://localhost:3000
- **Status:** ✅ Running
- **Purpose:** User interface

### 2. Laravel Backend API
- **URL:** http://localhost:8000
- **Status:** ✅ Running
- **Purpose:** API server, handles all data

### 3. Queue Worker
- **Status:** ✅ Running
- **Purpose:** Processes background jobs and events

### 4. Reverb WebSocket
- **URL:** ws://localhost:8080
- **Status:** ✅ Running
- **Purpose:** Real-time features (notifications, online users)

## 🌐 Access Your Application

**Open your browser and go to:**
```
http://localhost:3000
```

## 🔐 Login Credentials

Use any of these test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Admin |
| teacher@example.com | password | Teacher |
| student@example.com | password | Student |

## 🛑 If You Need to Stop the Servers

The servers are running in the background. To stop them:

```bash
# Stop all PHP processes (Laravel, Queue, Reverb)
taskkill /F /IM php.exe

# Stop Node/React
taskkill /F /IM node.exe
```

Or just close the IDE/editor.

## 🔄 If Servers Stop (Manual Restart)

If you restart your computer or the servers stop, open 4 separate terminals:

### Terminal 1: Laravel Backend
```bash
php artisan serve
```

### Terminal 2: Reverb WebSocket
```bash
php artisan reverb:start
```

### Terminal 3: Queue Worker
```bash
php artisan queue:work
```

### Terminal 4: React Frontend
```bash
cd react
npm run dev
```

## 🪟 Windows Quick Start (Batch Files)

For easier startup, use these batch files:

1. Double-click `start-laravel.bat`
2. Double-click `start-reverb.bat`
3. Double-click `start-queue.bat`
4. Then run: `cd react && npm run dev`

## ✅ Verify Everything is Working

### Quick Test:
```bash
php test_login_api.php
```

You should see "SUCCESS (token received)" for all accounts.

### Check What's Running:
```bash
# Check Laravel (should return JSON)
curl http://localhost:8000/api/health

# Check React (should load in browser)
# Open: http://localhost:3000
```

## 🐛 Troubleshooting

### "Invalid credentials" error
→ Laravel is not running. Start it with: `php artisan serve`

### Page doesn't load
→ React is not running. Start it with: `cd react && npm run dev`

### Real-time features don't work
→ Start Reverb: `php artisan reverb:start`
→ Start Queue: `php artisan queue:work`

### Port already in use
```bash
# Find what's using the port
netstat -ano | findstr ":8000"
netstat -ano | findstr ":3000"

# Kill the process
taskkill /F /PID <process_id>
```

## 📊 What Each Server Does

### Laravel (Port 8000)
- Handles login/authentication
- Manages courses, assignments, grades
- Processes API requests
- Stores data in database

### Reverb (Port 8080)
- WebSocket server
- Real-time notifications
- Online user tracking
- Live updates

### Queue Worker
- Processes background jobs
- Sends notifications
- Broadcasts events
- Handles async tasks

### React (Port 3000)
- User interface
- Dashboard
- Course management
- Student/Teacher views

## 🎯 What You Can Do Now

1. **Open http://localhost:3000**
2. **Login** with any test account
3. **Explore the features:**
   - Dashboard with statistics
   - Course management
   - Assignments
   - Resources
   - Schedule
   - Settings (with 5 tabs!)
   - Real-time notifications
   - Online users

## 📝 Important Notes

- Keep all 4 servers running while using the app
- Don't close the terminal windows
- If you see errors, check the terminal output
- All data is stored in SQLite database

## 🎓 Features Available

### Admin:
- View all system statistics
- Manage users
- Create/edit/delete courses
- View all activity logs

### Teacher:
- Create courses
- Post announcements
- Create assignments
- Grade submissions
- Upload resources

### Student:
- View enrolled courses
- Submit assignments
- Check grades
- Access resources
- View schedule

## 🔥 Real-Time Features

With all servers running, you get:
- Instant notifications for announcements
- Live assignment updates
- Real-time grade notifications
- Online user presence
- Activity feed updates

## 💡 Pro Tips

1. **Keep terminals organized** - Name them (Laravel, Reverb, Queue, React)
2. **Check for errors** - Watch terminal output for issues
3. **Test with multiple accounts** - Open different browsers for different roles
4. **Use the test scripts** - Run `php test_login_api.php` to verify

## 📚 Need Help?

Check these files:
- `README_IMPORTANT.md` - Troubleshooting guide
- `QUICK_START.md` - Detailed startup guide
- `SERVER_STATUS.md` - Server information
- `PRODUCTION_READY_SUMMARY.md` - Architecture overview

---

## ✅ Current Status

**All systems are GO! 🚀**

- ✅ Laravel Backend: http://localhost:8000
- ✅ Reverb WebSocket: ws://localhost:8080
- ✅ Queue Worker: Processing
- ✅ React Frontend: http://localhost:3000

**Just open http://localhost:3000 and start using your LMS!**

