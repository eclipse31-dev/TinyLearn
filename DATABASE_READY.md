# ✅ TinyLearn Database - Ready to Import

## You Have Everything You Need

Your complete TinyLearn database SQL dump is ready to import into XAMPP.

---

## What You Have

### SQL Dump File
- **File**: `create_database.sql`
- **Size**: Complete database export
- **Format**: MySQL/MariaDB SQL
- **Date**: March 10, 2026

### Database Contents
- **Name**: `tinylearn`
- **Tables**: 25 (all with schema)
- **Records**: Pre-populated with test data
- **Users**: 2 (admin + student)
- **Relationships**: All configured

### Test Credentials
```
Admin:
  Email: admin@example.com
  Password: password

Student:
  Email: kusa_230000002006@uic.edu.ph
  Password: password
```

---

## Import in 3 Steps

### Step 1: Start XAMPP
- Open XAMPP Control Panel
- Click "Start" next to MySQL
- Wait for "Running" status

### Step 2: Import Database
**Option A - phpMyAdmin (Easiest)**
1. Go to: http://localhost/phpmyadmin
2. Click "Import"
3. Choose: `create_database.sql`
4. Click "Go"

**Option B - Command Line**
```bash
mysql -u root -p tinylearn < create_database.sql
```

**Option C - Batch Script**
```bash
import-database.bat
```

### Step 3: Verify
```bash
mysql -u root -p
USE tinylearn;
SHOW TABLES;
# Should show 25 tables
```

---

## After Import

### 1. Update .env
```
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Start Services
```bash
# Terminal 1
php artisan serve

# Terminal 2
php artisan reverb:start

# Terminal 3
cd react && npm run dev
```

### 3. Login
- Open: http://localhost:5173
- Email: admin@example.com
- Password: password

---

## Documentation Files

| File | Purpose |
|------|---------|
| `RESTORE_DATABASE.md` | Complete import guide |
| `DATABASE_IMPORT_GUIDE.md` | Detailed instructions |
| `import-database.bat` | Windows import script |
| `create_database.sql` | SQL dump file |

---

## Quick Reference

```bash
# Import
mysql -u root -p tinylearn < create_database.sql

# Verify
mysql -u root -p -e "USE tinylearn; SHOW TABLES;"

# Check users
mysql -u root -p -e "USE tinylearn; SELECT * FROM users;"

# Backup
mysqldump -u root -p tinylearn > backup.sql
```

---

## Database Structure

### 25 Tables Organized By Function

**User Management** (5)
- users, roles, user_roles, permissions, role_permissions

**Courses** (4)
- courses, enrollments, modules, schedules

**Content** (5)
- materials, assessments, resources, attachments, discussions

**Submissions** (3)
- submissions, submission_files, grade

**Communication** (5)
- announcements, messages, conversations, notifications, discussion_replies

**Tracking** (4)
- activity_logs, user_sessions, progress, attendances

**System** (4)
- migrations, personal_access_tokens, sessions, cache, jobs

---

## Troubleshooting

### MySQL not found
- Ensure XAMPP MySQL is running
- Add to PATH: `C:\xampp\mysql\bin`

### Access denied
- XAMPP root has no password
- Use: `mysql -u root` (no -p flag)

### Database exists
- Drop first: `DROP DATABASE tinylearn;`
- Then import

### Foreign key error
- Disable checks:
  ```bash
  SET FOREIGN_KEY_CHECKS=0;
  SOURCE create_database.sql;
  SET FOREIGN_KEY_CHECKS=1;
  ```

---

## Verification Checklist

- [ ] MySQL running in XAMPP
- [ ] `create_database.sql` file exists
- [ ] Database imported successfully
- [ ] 25 tables created
- [ ] Test users visible
- [ ] `.env` updated with DB credentials
- [ ] Laravel cache cleared
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can login with admin credentials

---

## Next Steps

1. ✅ Import database (this page)
2. ✅ Start services
3. ✅ Login to application
4. ✅ Explore features
5. ✅ Customize as needed

---

## Support

**Need help?**
- Read: `RESTORE_DATABASE.md`
- Read: `DATABASE_IMPORT_GUIDE.md`
- Check: MySQL error log
- Try: phpMyAdmin import (better errors)

---

## Status

✅ **Database Dump**: Ready  
✅ **SQL File**: Present  
✅ **Test Data**: Included  
✅ **Documentation**: Complete  
✅ **Import Scripts**: Available  

**You're all set! Import now.** 🚀

---

*Generated: March 11, 2026*  
*Database: tinylearn*  
*Tables: 25*  
*Status: Ready to Import*
