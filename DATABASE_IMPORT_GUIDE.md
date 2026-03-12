# TinyLearn Database Import Guide

## Overview

You have a complete SQL dump from your XAMPP phpMyAdmin with all tables, relationships, and test data. This guide shows how to import it.

## Database Contents

**Database Name**: `tinylearn`  
**Tables**: 25  
**Records**: Pre-populated with test data  
**Users**: 2 (Admin + Student)  
**Roles**: 3 (Admin, Teacher, Student)  

### Test Users in Dump
- **Admin**: admin@example.com / password (user_ID: 14)
- **Student**: kusa_230000002006@uic.edu.ph / password (user_ID: 16)

---

## Import Methods

### Method 1: phpMyAdmin (Easiest)

1. **Open phpMyAdmin**
   - Go to: http://localhost/phpmyadmin
   - Login with root (no password)

2. **Create Database** (if not exists)
   - Click "New" on left sidebar
   - Database name: `tinylearn`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

3. **Import SQL Dump**
   - Select `tinylearn` database
   - Click "Import" tab
   - Choose file: `create_database.sql` (from your project root)
   - Click "Go"

4. **Verify Import**
   - You should see 25 tables
   - Check "users" table for test data

### Method 2: MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS tinylearn 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

# Exit MySQL
EXIT;

# Import the SQL dump
mysql -u root -p tinylearn < create_database.sql
```

### Method 3: Laravel Migration (Recommended)

```bash
# Fresh migration with seed (creates new database)
php artisan migrate:fresh --seed

# This will:
# 1. Drop all tables
# 2. Run all migrations (35 total)
# 3. Seed test data
```

---

## Database Structure

### User Management (5 tables)
- `users` - User accounts
- `roles` - User roles (admin, teacher, student)
- `user_roles` - User-role relationships
- `permissions` - System permissions
- `role_permissions` - Role-permission relationships

### Course Management (4 tables)
- `courses` - Course information
- `enrollments` - Student enrollments
- `modules` - Course modules
- `schedules` - Class schedules

### Content (5 tables)
- `materials` - Course materials
- `assessments` - Assignments/assessments
- `resources` - Course resources
- `attachments` - File attachments
- `discussions` - Discussion forums

### Submissions & Grading (3 tables)
- `submissions` - Student submissions
- `submission_files` - Submission files
- `grade` - Grades/scores

### Communication (5 tables)
- `announcements` - Course announcements
- `messages` - Direct messages
- `conversations` - Message conversations
- `notifications` - User notifications
- `discussion_replies` - Discussion replies

### Tracking (4 tables)
- `activity_logs` - User activity logs
- `user_sessions` - Login sessions
- `progress` - Course progress
- `attendances` - Attendance records

### System (4 tables)
- `migrations` - Migration tracking
- `personal_access_tokens` - API tokens
- `sessions` - Session storage
- `cache` - Cache storage
- `jobs` - Queue jobs

---

## Verification Steps

### 1. Check Database Created
```bash
mysql -u root -p
SHOW DATABASES;
USE tinylearn;
SHOW TABLES;
```

### 2. Verify Test Data
```bash
# Check users
SELECT * FROM users;

# Check roles
SELECT * FROM roles;

# Check user roles
SELECT * FROM user_roles;

# Check courses
SELECT * FROM courses;
```

### 3. Test API Connection
```bash
# Start Laravel
php artisan serve

# Test health check
curl http://localhost:8000/api/health

# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## Troubleshooting

### "Database already exists"
- Drop existing database first:
  ```bash
  mysql -u root -p
  DROP DATABASE tinylearn;
  EXIT;
  ```
- Then import again

### "Access denied for user 'root'"
- Check MySQL is running
- Verify root password (usually empty for XAMPP)
- Use: `mysql -u root` (without -p if no password)

### "Table already exists"
- Use `--force` flag:
  ```bash
  mysql -u root -p tinylearn < create_database.sql --force
  ```

### "Foreign key constraint fails"
- Disable foreign key checks:
  ```bash
  mysql -u root -p
  SET FOREIGN_KEY_CHECKS=0;
  SOURCE create_database.sql;
  SET FOREIGN_KEY_CHECKS=1;
  EXIT;
  ```

### "Character set mismatch"
- Ensure database uses utf8mb4:
  ```bash
  ALTER DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

---

## After Import

### 1. Update .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Clear Laravel Cache
```bash
php artisan config:clear
php artisan cache:clear
```

### 3. Start Services
```bash
# Terminal 1
php artisan serve

# Terminal 2
php artisan reverb:start

# Terminal 3
cd react && npm run dev
```

### 4. Login
- Open http://localhost:5173
- Email: `admin@example.com`
- Password: `password`

---

## Database Backup

### Create Backup
```bash
# Export to file
mysqldump -u root -p tinylearn > backup-tinylearn.sql

# Or use phpMyAdmin
# Select database → Export → Download
```

### Restore from Backup
```bash
mysql -u root -p tinylearn < backup-tinylearn.sql
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Create DB | `CREATE DATABASE tinylearn;` |
| Import SQL | `mysql -u root -p tinylearn < file.sql` |
| Show tables | `SHOW TABLES;` |
| Check users | `SELECT * FROM users;` |
| Drop DB | `DROP DATABASE tinylearn;` |
| Backup | `mysqldump -u root -p tinylearn > backup.sql` |

---

## Support

If import fails:
1. Check MySQL is running
2. Verify database credentials in `.env`
3. Check file permissions
4. Review error message carefully
5. Try phpMyAdmin import (easier debugging)

---

**Status**: Ready to import ✅  
**Database**: tinylearn  
**Tables**: 25  
**Test Users**: 2  
**Last Updated**: March 10, 2026
