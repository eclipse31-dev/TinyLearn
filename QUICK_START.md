# TinyLearn LMS - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- PHP 8.1+
- Node.js 18+
- MySQL (XAMPP or standalone)
- Composer

### Step 1: Verify Setup (1 min)
```bash
php health-check.php
```

### Step 2: Install Dependencies (2 min)
```bash
# Backend
composer install

# Frontend
cd react
npm install
cd ..
```

### Step 3: Setup Database (1 min)
```bash
# Create database (if using XAMPP, use phpMyAdmin)
# Or run: mysql -u root -p < create_database.sql

# Run migrations
php artisan migrate:fresh --seed
```

### Step 4: Start Services (1 min)
Open 4 terminals:

**Terminal 1 - Backend**
```bash
php artisan serve
```

**Terminal 2 - Real-time (Reverb)**
```bash
php artisan reverb:start
```

**Terminal 3 - Frontend**
```bash
cd react
npm run dev
```

**Terminal 4 - Queue (optional)**
```bash
php artisan queue:work
```

### Step 5: Login
Open http://localhost:5173

**Test Credentials:**
- Admin: `admin@example.com` / `password`
- Teacher: `teacher@example.com` / `password`
- Student: `student@example.com` / `password`

---

## 📋 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:8000 | 8000 |
| Real-time (Reverb) | http://localhost:8080 | 8080 |
| phpMyAdmin | http://localhost/phpmyadmin | 80 |

---

## 🔧 Common Commands

### Database
```bash
# Fresh migration with seed
php artisan migrate:fresh --seed

# Rollback migrations
php artisan migrate:rollback

# Reset everything
php artisan migrate:reset
```

### Cache
```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear

# Optimize
php artisan optimize
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
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
- Verify CORS config in `config/cors.php`

### "Database connection error"
- Ensure MySQL is running
- Check `.env` database credentials
- Verify `tinylearn` database exists
- Run: `php artisan migrate:fresh --seed`

### "Real-time not working"
- Ensure Reverb is running on port 8080
- Check WebSocket in browser DevTools (Network tab)
- Verify `REVERB_*` variables in `.env`

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r react/node_modules
cd react && npm install
```

---

## 📁 Project Structure

```
TinyLearn/
├── app/                    # Laravel backend
│   ├── Http/Controllers/   # API endpoints (24 controllers)
│   ├── Models/             # Database models (25 models)
│   ├── Services/           # Business logic
│   └── Events/             # Real-time events
├── react/                  # React frontend
│   ├── src/
│   │   ├── views/          # Pages (admin, teacher, student)
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom hooks (useRealtime, etc)
│   │   ├── services/       # API & real-time services
│   │   └── context/        # Auth context
│   └── package.json
├── database/
│   ├── migrations/         # 35 database migrations
│   ├── seeders/            # Test data
│   └── factories/          # Model factories
├── routes/
│   ├── api.php             # 60+ API endpoints
│   └── channels.php        # WebSocket channels
└── config/                 # Configuration files
```

---

## 🎯 Key Features

✅ **Real-time Updates** - WebSocket-based instant notifications  
✅ **Course Management** - Create, edit, manage courses  
✅ **Assignments** - Submit and grade assignments  
✅ **Discussions** - Real-time discussion forums  
✅ **Announcements** - Broadcast to students  
✅ **Schedules** - Class scheduling  
✅ **User Roles** - Admin, Teacher, Student  
✅ **Activity Logging** - Track user actions  
✅ **Notifications** - Real-time notifications  

---

## 📚 API Endpoints

All endpoints prefixed with `/api/`

### Auth
- `POST /login` - Login
- `POST /register` - Register
- `POST /logout` - Logout

### Courses
- `GET /courses` - List courses
- `POST /courses` - Create course
- `GET /courses/{id}` - Get course
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course

### Assignments
- `GET /assignments` - List assignments
- `POST /assignments` - Create assignment
- `POST /submissions` - Submit assignment
- `POST /submissions/{id}/grade` - Grade submission

### Announcements
- `GET /announcements` - List announcements
- `POST /announcements` - Create announcement
- `DELETE /announcements/{id}` - Delete announcement

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/{id}/read` - Mark as read
- `DELETE /notifications/{id}` - Delete notification

---

## 🔐 Environment Variables

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_CONNECTION=reverb
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### Frontend (react/.env)
```
VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

---

## 📖 Documentation

- `COMPLETE_SETUP.md` - Detailed setup guide
- `REALTIME_SETUP.md` - Real-time features guide
- `XAMPP_SETUP.md` - XAMPP configuration
- `PROJECT_SUMMARY.md` - Project overview

---

## ✨ Next Steps

1. ✅ Run `php health-check.php` to verify setup
2. ✅ Install dependencies: `composer install` & `npm install`
3. ✅ Setup database: `php artisan migrate:fresh --seed`
4. ✅ Start all services
5. ✅ Login with test credentials
6. ✅ Explore features and customize

---

## 💡 Tips

- Use `start-all.bat` to start all services at once (Windows)
- Check `storage/logs/laravel.log` for backend errors
- Use browser DevTools to debug frontend issues
- Real-time features require Reverb to be running
- Database seeder creates test users automatically

---

## 🆘 Need Help?

1. Check troubleshooting section above
2. Review error logs in `storage/logs/`
3. Check browser console for frontend errors
4. Verify all services are running
5. Run `php health-check.php` to diagnose issues

---

**Happy Learning! 🎓**
