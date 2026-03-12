# Restore TinyLearn Database from SQL Dump

## Quick Start (2 Minutes)

### Option 1: Using phpMyAdmin (Easiest)

1. **Start XAMPP**
   - Start Apache and MySQL

2. **Open phpMyAdmin**
   - Go to: http://localhost/phpmyadmin

3. **Import Database**
   - Click "Import" tab
   - Choose file: `create_database.sql`
   - Click "Go"

4. **Done!**
   - Database restored with all tables and data

### Option 2: Using Command Line

```bash
# Navigate to project directory
cd C:\path\to\TinyLearn

# Import database
mysql -u root -p tinylearn < create_database.sql

# When prompted for password, just press Enter (XAMPP has no password)
```

### Option 3: Using Batch Script (Windows)

```bash
# Double-click: import-database.bat
# Or run from command line:
import-database.bat
```

---

## What Gets Restored

### Database: `tinylearn`

**25 Tables** with complete schema:
- User management (users, roles, permissions)
- Course management (courses, modules, schedules)
- Content (materials, assessments, resources)
- Submissions & grading
- Communication (announcements, messages, discussions)
- Tracking (activity logs, sessions, progress)
- System tables (migrations, tokens, cache)

**Test Data**:
- 2 users (admin + student)
- 3 roles (admin, teacher, student)
- 1 course
- 1 enrollment
- All relationships configured

**Test Credentials**:
```
Admin User:
  Email: admin@example.com
  Password: password
  Role: Admin

Student User:
  Email: kusa_230000002006@uic.edu.ph
  Password: password
  Role: Student
```

---

## Detailed Steps

### Step 1: Ensure MySQL is Running

**XAMPP Control Panel**:
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for it to show "Running"

**Verify Connection**:
```bash
mysql -u root
# Should connect without error
# Type: EXIT to quit
```

### Step 2: Create Database (if needed)

**Via phpMyAdmin**:
1. Go to http://localhost/phpmyadmin
2. Click "New"
3. Enter: `tinylearn`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

**Via Command Line**:
```bash
mysql -u root -p
CREATE DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Import SQL Dump

**Method A: phpMyAdmin (Recommended)**
1. Select `tinylearn` database
2. Click "Import" tab
3. Click "Choose File"
4. Select: `create_database.sql`
5. Click "Go"
6. Wait for completion message

**Method B: Command Line**
```bash
mysql -u root -p tinylearn < create_database.sql
```

**Method C: Batch Script (Windows)**
```bash
import-database.bat
```

### Step 4: Verify Import

**Check Tables**:
```bash
mysql -u root -p
USE tinylearn;
SHOW TABLES;
# Should show 25 tables
```

**Check Test Data**:
```bash
SELECT * FROM users;
# Should show 2 users

SELECT * FROM roles;
# Should show 3 roles

SELECT * FROM courses;
# Should show 1 course
```

---

## After Import

### 1. Update .env File

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

**Terminal 1 - Backend**:
```bash
php artisan serve
```

**Terminal 2 - Real-time**:
```bash
php artisan reverb:start
```

**Terminal 3 - Frontend**:
```bash
cd react
npm run dev
```

### 4. Login

1. Open: http://localhost:5173
2. Email: `admin@example.com`
3. Password: `password`
4. Click "Login"

---

## Troubleshooting

### "MySQL not found"
- Ensure XAMPP MySQL is running
- Add MySQL to PATH:
  - XAMPP MySQL path: `C:\xampp\mysql\bin`
  - Add to Windows PATH environment variable

### "Access denied for user 'root'"
- XAMPP root has no password
- Use: `mysql -u root` (without -p)
- Or press Enter when prompted for password

### "Database already exists"
- Drop existing database:
  ```bash
  mysql -u root -p
  DROP DATABASE tinylearn;
  EXIT;
  ```
- Then import again

### "Table already exists"
- Use force flag:
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
- Fix database character set:
  ```bash
  mysql -u root -p
  ALTER DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  EXIT;
  ```

### Import hangs or takes too long
- Check file size: `create_database.sql` should be ~500KB
- Try phpMyAdmin instead (better error messages)
- Check MySQL error log: `C:\xampp\mysql\data\mysql_error.log`

---

## Verify Everything Works

### 1. Database Connection
```bash
php artisan tinker
>>> DB::connection()->getPdo();
# Should return PDO object
>>> exit
```

### 2. API Health Check
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 3. Login Test
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
# Should return user data and token
```

### 4. Frontend Access
- Open: http://localhost:5173
- Should load login page
- Login with admin credentials
- Should see dashboard

---

## Database Backup

### Create Backup
```bash
# Export current database
mysqldump -u root -p tinylearn > backup-tinylearn-$(date +%Y%m%d).sql

# Or via phpMyAdmin
# Select database → Export → Download
```

### Restore from Backup
```bash
mysql -u root -p tinylearn < backup-tinylearn-20260310.sql
```

---

## File Reference

| File | Purpose |
|------|---------|
| `create_database.sql` | Complete SQL dump with schema and data |
| `import-database.bat` | Windows batch script for easy import |
| `DATABASE_IMPORT_GUIDE.md` | Detailed import guide |
| `RESTORE_DATABASE.md` | This file |

---

## Quick Commands

```bash
# Import database
mysql -u root -p tinylearn < create_database.sql

# Check tables
mysql -u root -p -e "USE tinylearn; SHOW TABLES;"

# Check users
mysql -u root -p -e "USE tinylearn; SELECT * FROM users;"

# Backup database
mysqldump -u root -p tinylearn > backup.sql

# Drop database
mysql -u root -p -e "DROP DATABASE tinylearn;"

# Create database
mysql -u root -p -e "CREATE DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## Support

**If import fails:**
1. ✓ Verify MySQL is running
2. ✓ Check file exists: `create_database.sql`
3. ✓ Try phpMyAdmin (better error messages)
4. ✓ Check MySQL error log
5. ✓ Verify database credentials in `.env`

**If login fails after import:**
1. ✓ Clear Laravel cache: `php artisan cache:clear`
2. ✓ Check user exists: `SELECT * FROM users;`
3. ✓ Verify password hash
4. ✓ Check API is running: `php artisan serve`

---

## Status

✅ **Database Ready**: `tinylearn`  
✅ **Tables**: 25  
✅ **Test Data**: Included  
✅ **Users**: 2 (admin + student)  
✅ **Relationships**: Configured  

**Ready to use!** 🚀

---

*Last Updated: March 10, 2026*  
*SQL Dump Version: 5.2.1*  
*Server: MariaDB 10.4.32*
