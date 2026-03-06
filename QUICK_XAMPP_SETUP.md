# Quick XAMPP Setup - Start Here! 🚀

## ⚠️ IMPORTANT: Start XAMPP First!

Before running any Laravel commands, you MUST start XAMPP services.

## Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
   - Find XAMPP in your Start Menu or Desktop
   - Run as Administrator (right-click → Run as administrator)

2. **Start Required Services**
   - Click "Start" next to **Apache**
   - Click "Start" next to **MySQL**
   - Wait until both show "Running" in green

![XAMPP Control Panel](https://i.imgur.com/xampp-example.png)

## Step 2: Create Database

### Option A: Automatic (Recommended)
Open your browser and go to:
```
http://localhost/phpmyadmin
```

Then:
1. Click "SQL" tab at the top
2. Copy and paste this:
```sql
CREATE DATABASE IF NOT EXISTS `tinylearn` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```
3. Click "Go"

### Option B: Manual
1. Go to `http://localhost/phpmyadmin`
2. Click "New" in left sidebar
3. Database name: `tinylearn`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

## Step 3: Verify Configuration

Your `.env` file should have:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

✅ Already configured!

## Step 4: Run Migrations

Open terminal in your project folder and run:

```bash
# Clear config cache
php artisan config:clear

# Run migrations to create tables
php artisan migrate

# Seed database with test data
php artisan db:seed
```

## Step 5: Verify in phpMyAdmin

1. Go to `http://localhost/phpmyadmin`
2. Click on `tinylearn` database (left sidebar)
3. You should see 20+ tables!

## Step 6: Run Your Application

Now you can run your Laravel app:

```bash
# Terminal 1: Laravel Backend
php artisan serve

# Terminal 2: Laravel Reverb
php artisan reverb:start

# Terminal 3: React Frontend
cd react
npm run dev
```

## ✅ Success Checklist

- [ ] XAMPP Control Panel is open
- [ ] Apache is running (green)
- [ ] MySQL is running (green)
- [ ] Database `tinylearn` exists in phpMyAdmin
- [ ] Migrations completed successfully
- [ ] Test data seeded
- [ ] Laravel server running on port 8000
- [ ] React app running on port 3000

## 🎯 Access Your Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Database:** tinylearn

## 🔑 Login Credentials

After seeding:
- **Admin:** admin@example.com / password
- **Teacher:** teacher@example.com / password
- **Student:** student@example.com / password

## 🐛 Common Issues

### "Connection refused" error
**Problem:** MySQL is not running
**Solution:** Start MySQL in XAMPP Control Panel

### "Database doesn't exist" error
**Problem:** Database not created
**Solution:** Create `tinylearn` database in phpMyAdmin

### "Access denied" error
**Problem:** Wrong MySQL credentials
**Solution:** Check `.env` file, default is root with no password

### Port 3306 already in use
**Problem:** Another MySQL instance is running
**Solution:** Stop other MySQL services or change port in XAMPP

## 📊 Viewing Your Data

### In phpMyAdmin:
1. Go to http://localhost/phpmyadmin
2. Click `tinylearn` database
3. Click any table to view data
4. Use "Browse" tab to see records

### Example Queries:

**View all users:**
```sql
SELECT user_ID, FName, LName, email FROM users;
```

**View all courses:**
```sql
SELECT course_ID, title, course_code, status FROM courses;
```

**View assignments:**
```sql
SELECT assessment_ID, title, due_date, status FROM assessments;
```

## 🎉 You're All Set!

Your TinyLearn database is now running on XAMPP MySQL and you can view/manage it through phpMyAdmin!

**Need help?** Check the full `XAMPP_SETUP_GUIDE.md` for detailed troubleshooting.
