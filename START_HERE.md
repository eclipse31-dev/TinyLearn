# 🎓 TinyLearn LMS - START HERE

**Welcome to TinyLearn!** This is your complete Learning Management System.

---

## ⚡ 5-Minute Quick Start

### Step 1: Verify Your System (1 min)
```bash
php health-check.php
```
Should show: ✓ All checks passed!

### Step 2: Install Dependencies (2 min)
```bash
composer install
cd react && npm install && cd ..
```

### Step 3: Setup Database (1 min)
```bash
php artisan migrate:fresh --seed
```

### Step 4: Start Services (1 min)
Open 4 terminals and run:

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
cd react && npm run dev
```

**Terminal 4 (optional):**
```bash
php artisan queue:work
```

### Step 5: Login
Open http://localhost:5173

**Test Credentials:**
- Email: `admin@example.com`
- Password: `password`

---

## 📚 Documentation

### Quick References
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup (you are here!)
- **[INDEX.md](INDEX.md)** - Documentation index
- **[SYSTEM_STATUS.md](SYSTEM_STATUS.md)** - Current status

### Detailed Guides
- **[COMPLETE_SETUP.md](COMPLETE_SETUP.md)** - Full setup instructions
- **[XAMPP_SETUP.md](XAMPP_SETUP.md)** - XAMPP configuration
- **[REALTIME_SETUP.md](REALTIME_SETUP.md)** - Real-time features

### Verification
- **[FINAL_CHECKLIST.md](FINAL_CHECKLIST.md)** - Verification checklist
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - All fixes applied

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student@example.com | password |

---

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Real-time | http://localhost:8080 |
| phpMyAdmin | http://localhost/phpmyadmin |

---

## 🎯 What You Can Do

✅ Create and manage courses  
✅ Assign assignments to students  
✅ Grade student submissions  
✅ Send announcements  
✅ Real-time notifications  
✅ Discussion forums  
✅ Schedule classes  
✅ Track student progress  
✅ Manage user roles  
✅ View activity logs  

---

## 🔧 Common Commands

```bash
# Database
php artisan migrate:fresh --seed    # Reset database
php artisan migrate:rollback        # Undo migrations

# Cache
php artisan cache:clear             # Clear cache
php artisan config:clear            # Clear config

# Frontend
npm run dev                          # Development
npm run build                        # Production build

# Diagnostics
php health-check.php                # System health
php artisan tinker                  # Interactive shell
```

---

## 🐛 Troubleshooting

### "Connection refused" on port 8000
```bash
# Check if port is in use
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
php artisan serve --port=8001
```

### "CORS error" in frontend
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `react/.env`
- Clear browser cache

### "Database connection error"
- Ensure MySQL is running
- Check `.env` database credentials
- Verify `tinylearn` database exists

### "Real-time not working"
- Ensure Reverb is running on port 8080
- Check WebSocket in browser DevTools
- Verify `REVERB_*` variables in `.env`

---

## 📁 Project Structure

```
TinyLearn/
├── app/                    # Laravel backend
├── react/                  # React frontend
├── database/               # Migrations & seeders
├── routes/                 # API routes
├── config/                 # Configuration
├── storage/                # Logs & cache
└── Documentation files     # Setup guides
```

---

## ✨ Features

- **Real-time Updates** - Instant notifications via WebSocket
- **Course Management** - Create and manage courses
- **Assignments** - Submit and grade assignments
- **Discussions** - Real-time discussion forums
- **Announcements** - Broadcast to students
- **Schedules** - Class scheduling
- **User Roles** - Admin, Teacher, Student
- **Activity Logging** - Track all actions

---

## 🚀 Next Steps

1. ✅ Run `php health-check.php`
2. ✅ Install dependencies
3. ✅ Setup database
4. ✅ Start all services
5. ✅ Login and explore
6. ✅ Read [COMPLETE_SETUP.md](COMPLETE_SETUP.md) for details
7. ✅ Customize for your needs

---

## 📞 Need Help?

1. Check [QUICK_START.md](QUICK_START.md) troubleshooting
2. Run `php health-check.php` for diagnostics
3. Check `storage/logs/laravel.log` for errors
4. Review [COMPLETE_SETUP.md](COMPLETE_SETUP.md)
5. Check browser console (F12) for frontend errors

---

## 🎓 Learning Path

1. **5 min** - Read this file
2. **5 min** - Run health check
3. **10 min** - Install dependencies
4. **5 min** - Setup database
5. **5 min** - Start services
6. **10 min** - Login and explore
7. **15 min** - Read [COMPLETE_SETUP.md](COMPLETE_SETUP.md)
8. **20 min** - Test features
9. **30 min** - Customize

---

## ✅ System Status

- ✅ Backend API (60+ endpoints)
- ✅ Frontend (React with routing)
- ✅ Real-time (WebSocket/Reverb)
- ✅ Database (MySQL with 35 migrations)
- ✅ Authentication (Sanctum)
- ✅ Documentation (Complete)

**Everything is ready to use!**

---

## 🎉 You're All Set!

Your TinyLearn LMS is fully configured and ready to use.

**Start with Step 1 above and you'll be up and running in 5 minutes!**

---

**Questions?** Check [INDEX.md](INDEX.md) for all documentation.

**Ready?** Let's go! 🚀
