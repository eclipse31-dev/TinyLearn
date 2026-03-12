# TinyLearn - XAMPP Database Setup Guide

This guide will help you set up TinyLearn with MySQL in XAMPP.

## Prerequisites

- XAMPP installed ([Download](https://www.apachefriends.org/))
- PHP 8.2+ (included in XAMPP)
- MySQL (included in XAMPP)
- Composer installed
- Node.js 18+ installed

## Step 1: Start XAMPP Services

1. Open XAMPP Control Panel
2. Click **Start** for:
   - Apache
   - MySQL
3. Wait for both to show "Running" status

## Step 2: Create Database

### Option A: Using phpMyAdmin (GUI)

1. Open browser and go to: `http://localhost/phpmyadmin`
2. Click on **Databases** tab
3. Under "Create new database", enter: `tinylearn`
4. Select **utf8mb4_unicode_ci** as collation
5. Click **Create**

### Option B: Using Command Line

```bash
mysql -u root -p
```

Then paste this SQL:

```sql
CREATE DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 3: Configure Laravel

The `.env` file is already configured for XAMPP MySQL:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

## Step 4: Run Migrations

Open command prompt/terminal in your project directory and run:

```bash
php artisan migrate:fresh --seed
```

This will:
- Create all database tables
- Seed test data (admin, teacher, student users)
- Set up relationships

## Step 5: Verify Database

### Check in phpMyAdmin

1. Go to `http://localhost/phpmyadmin`
2. Click on **tinylearn** database
3. You should see 35+ tables:
   - users
   - courses
   - enrollments
   - announcements
   - assignments
   - submissions
   - grades
   - discussions
   - messages
   - notifications
   - And more...

### Check via Command Line

```bash
mysql -u root tinylearn -e "SHOW TABLES;"
```

## Step 6: Start the Application

### Terminal 1 - Laravel Server
```bash
php artisan serve
```
Runs on: `http://localhost:8000`

### Terminal 2 - Reverb WebSocket
```bash
php artisan reverb:start
```
Runs on: `ws://localhost:8080`

### Terminal 3 - Queue Worker
```bash
php artisan queue:work
```

### Terminal 4 - React Dev Server
```bash
cd react
npm run dev
```
Runs on: `http://localhost:3000`

## Step 7: Login

Visit `http://localhost:3000` and use test credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student@example.com | password |

## Database Tables Overview

### User Management
- `users` - User accounts
- `roles` - User roles (admin, teacher, student)
- `user_roles` - User-role relationships
- `permissions` - System permissions
- `role_permissions` - Role-permission relationships

### Course Management
- `courses` - Course information
- `enrollments` - Student enrollments
- `modules` - Course modules
- `schedules` - Class schedules

### Content
- `announcements` - Course announcements
- `assessments` - Assignments/quizzes
- `materials` - Course materials
- `resources` - Course resources
- `attachments` - File attachments

### Submissions & Grading
- `submissions` - Student submissions
- `submission_files` - Submitted files
- `grades` - Student grades

### Communication
- `discussions` - Discussion threads
- `discussion_replies` - Discussion replies
- `messages` - Direct messages
- `conversations` - Message conversations
- `notifications` - User notifications

### Tracking
- `activity_logs` - User activity
- `attendance` - Class attendance
- `progress` - Course progress
- `user_sessions` - User sessions

### System
- `cache` - Cache entries
- `jobs` - Queue jobs
- `sessions` - Session data
- `personal_access_tokens` - API tokens

## Troubleshooting

### MySQL Won't Start
- Check if port 3306 is in use
- Try: `netstat -ano | findstr :3306` (Windows)
- Kill the process or use different port

### Database Connection Error
```
SQLSTATE[HY000] [2002] No connection could be made
```
- Ensure MySQL is running in XAMPP
- Check DB_HOST is `127.0.0.1` (not `localhost`)
- Verify DB_DATABASE is `tinylearn`

### Migration Errors
```bash
# Clear cache and retry
php artisan cache:clear
php artisan config:clear
php artisan migrate:fresh --seed
```

### Permission Denied
```bash
# Fix database permissions
php artisan cache:clear
php artisan config:cache
```

## Backup Database

### Using phpMyAdmin
1. Go to `http://localhost/phpmyadmin`
2. Select `tinylearn` database
3. Click **Export**
4. Click **Go** to download SQL file

### Using Command Line
```bash
mysqldump -u root tinylearn > backup.sql
```

## Restore Database

### Using phpMyAdmin
1. Go to `http://localhost/phpmyadmin`
2. Click **Import**
3. Select your SQL file
4. Click **Go**

### Using Command Line
```bash
mysql -u root tinylearn < backup.sql
```

## Reset Database

To start fresh:

```bash
# Drop and recreate
php artisan migrate:fresh --seed
```

Or manually:

```bash
mysql -u root -e "DROP DATABASE tinylearn; CREATE DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate:fresh --seed
```

## Performance Tips

1. **Add Indexes** - Already included in migrations
2. **Enable Query Caching** - Edit `my.ini` in XAMPP
3. **Optimize Tables** - Run periodically:
   ```bash
   php artisan tinker
   >>> DB::statement('OPTIMIZE TABLE users');
   ```

## Next Steps

1. ✅ Database created and seeded
2. ✅ Tables verified
3. Start the application
4. Log in with test credentials
5. Create courses and content
6. Invite students
7. Test real-time features

## Support

If you encounter issues:
1. Check XAMPP MySQL is running
2. Verify `.env` database settings
3. Check `storage/logs/laravel.log` for errors
4. Run `php artisan migrate:status` to see migration status

---

**Your TinyLearn database is now ready in XAMPP!** 🚀
