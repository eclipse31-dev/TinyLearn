# TinyLearn - XAMPP Quick Start

## 🚀 Quick Setup (5 minutes)

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Click **Start** for Apache and MySQL
3. Wait for both to show "Running"

### Step 2: Create Database
Run this in command prompt:
```bash
setup-xampp.bat
```

This will:
- ✅ Create `tinylearn` database
- ✅ Run all migrations
- ✅ Seed test data

### Step 3: Start Application
Run this in command prompt:
```bash
start-dev.bat
```

This will start:
- Laravel API: http://localhost:8000
- React App: http://localhost:3000
- WebSocket: ws://localhost:8080

### Step 4: Login
Open http://localhost:3000 and use:
- **Email:** admin@example.com
- **Password:** password

## 📊 Database Info

**Connection Details:**
- Host: `127.0.0.1`
- Port: `3306`
- Database: `tinylearn`
- Username: `root`
- Password: (empty)

**Access phpMyAdmin:**
- URL: http://localhost/phpmyadmin
- Username: `root`
- Password: (empty)

## 📋 Database Tables (35 total)

### Users & Roles
- users
- roles
- user_roles
- permissions
- role_permissions

### Courses
- courses
- enrollments
- modules
- schedules

### Content
- announcements
- assessments
- materials
- resources
- attachments

### Submissions
- submissions
- submission_files
- grades

### Communication
- discussions
- discussion_replies
- messages
- conversations
- notifications

### Tracking
- activity_logs
- attendance
- progress
- user_sessions

### System
- cache
- jobs
- sessions
- personal_access_tokens

## 🔧 Common Commands

### Reset Database
```bash
php artisan migrate:fresh --seed
```

### View Migrations Status
```bash
php artisan migrate:status
```

### Access Database CLI
```bash
mysql -u root tinylearn
```

### Backup Database
```bash
mysqldump -u root tinylearn > backup.sql
```

### Restore Database
```bash
mysql -u root tinylearn < backup.sql
```

## ❌ Troubleshooting

### MySQL Won't Start
- Check if port 3306 is in use
- Restart XAMPP
- Check XAMPP logs

### Database Connection Error
- Verify MySQL is running
- Check `.env` has correct settings
- Try: `mysql -u root -e "SELECT 1"`

### Migration Failed
- Clear cache: `php artisan cache:clear`
- Try again: `php artisan migrate:fresh --seed`

### Port Already in Use
- Laravel: `php artisan serve --port=8001`
- React: `cd react && npm run dev -- --port=3001`

## 📚 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student@example.com | password |

## 🎯 Next Steps

1. ✅ Database setup complete
2. ✅ Application running
3. Create a course
4. Enroll students
5. Post announcements
6. Create assignments
7. Test real-time features

## 📖 Full Documentation

- See `XAMPP_SETUP.md` for detailed setup
- See `GETTING_STARTED.md` for project overview
- See `REALTIME_SETUP.md` for real-time features

---

**Your TinyLearn LMS is ready!** 🎓
