# Import TinyLearn Database to XAMPP

## Quick Steps (2 Minutes)

### Step 1: Start XAMPP
1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Wait until both show "Running"

### Step 2: Open phpMyAdmin
1. Open your browser
2. Go to: **http://localhost/phpmyadmin**
3. You should see the phpMyAdmin interface

### Step 3: Import Database
1. Click **"Import"** tab at the top
2. Click **"Choose File"** button
3. Navigate to your TinyLearn project folder
4. Select: **`create_database.sql`**
5. Scroll down and click **"Go"** button
6. Wait for the import to complete (should take 10-30 seconds)

### Step 4: Verify Import
1. Look at the left sidebar
2. You should see **`tinylearn`** database
3. Click on it to expand
4. You should see **25 tables**:
   - activity_logs
   - announcements
   - assessments
   - attachments
   - attendances
   - cache
   - cache_locks
   - conversations
   - courses
   - discussions
   - discussion_replies
   - enrollments
   - grade
   - jobs
   - materials
   - messages
   - migrations
   - modules
   - notifications
   - password_reset_tokens
   - permissions
   - personal_access_tokens
   - progress
   - resources
   - roles
   - role_permissions
   - schedules
   - sessions
   - submissions
   - submission_files
   - users
   - user_roles
   - user_sessions

### Step 5: Check Test Data
1. Click on **`users`** table
2. Click **"Browse"** tab
3. You should see 2 users:
   - admin@example.com (Admin)
   - kusa_230000002006@uic.edu.ph (Student)

## ✅ Done!

Your database is now imported and ready to use!

---

## Alternative: Command Line Method

If you prefer command line:

```bash
# Navigate to your project folder
cd C:\path\to\TinyLearn

# Import database
C:\xampp\mysql\bin\mysql -u root tinylearn < create_database.sql
```

---

## Troubleshooting

### "Database doesn't exist"
The SQL file will create it automatically. Just import the file.

### "Import failed" or "Error"
1. Make sure MySQL is running in XAMPP
2. Try importing again
3. Check the error message in phpMyAdmin

### "File too large"
1. In phpMyAdmin, click "Import"
2. Look for "Maximum file size" limit
3. Your file should be under this limit
4. If not, use command line method instead

---

## After Import

### Update .env file
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

### Clear Laravel cache
```bash
php artisan config:clear
php artisan cache:clear
```

### Start services
```bash
# Terminal 1
php artisan serve

# Terminal 2
php artisan reverb:start

# Terminal 3
cd react && npm run dev
```

### Login
- Open: http://localhost:5173
- Email: admin@example.com
- Password: password

---

## Test Credentials

```
Admin:
  Email: admin@example.com
  Password: password

Student:
  Email: kusa_230000002006@uic.edu.ph
  Password: password
```

---

## What You Get

✅ **25 tables** with complete schema  
✅ **2 test users** (admin + student)  
✅ **3 roles** (admin, teacher, student)  
✅ **1 test course**  
✅ **All relationships** configured  
✅ **Foreign keys** set up  
✅ **Indexes** optimized  

---

**Ready to use!** 🚀
