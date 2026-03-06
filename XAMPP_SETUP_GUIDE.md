# XAMPP Setup Guide for TinyLearn

## Prerequisites
- XAMPP installed on your system
- Apache and MySQL services running in XAMPP

## Step-by-Step Setup

### 1. Start XAMPP Services

Open XAMPP Control Panel and start:
- ✅ Apache (for phpMyAdmin)
- ✅ MySQL (for database)

### 2. Create Database in phpMyAdmin

#### Option A: Using phpMyAdmin Interface
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "New" in the left sidebar
3. Enter database name: `tinylearn`
4. Select collation: `utf8mb4_unicode_ci`
5. Click "Create"

#### Option B: Using SQL Script
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on "SQL" tab at the top
3. Copy and paste the contents of `create_database.sql`
4. Click "Go"

### 3. Verify Database Configuration

Your `.env` file should now have:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** If your XAMPP MySQL has a password, add it to `DB_PASSWORD=your_password`

### 4. Clear Laravel Configuration Cache

```bash
php artisan config:clear
php artisan cache:clear
```

### 5. Run Database Migrations

```bash
# Run all migrations to create tables
php artisan migrate

# If you get errors, try fresh migration
php artisan migrate:fresh

# Seed the database with test data
php artisan db:seed
```

### 6. Verify in phpMyAdmin

1. Go to `http://localhost/phpmyadmin`
2. Click on `tinylearn` database in the left sidebar
3. You should see all tables:
   - users
   - roles
   - courses
   - enrollments
   - assessments
   - submissions
   - submission_files
   - grades
   - modules
   - announcements
   - schedules
   - user_sessions
   - notifications
   - activity_logs
   - and more...

## Viewing Your Data

### Access phpMyAdmin
- URL: `http://localhost/phpmyadmin`
- Username: `root`
- Password: (leave empty, or your XAMPP MySQL password)

### Browse Tables
1. Select `tinylearn` database from left sidebar
2. Click on any table name to view data
3. Use "Browse" tab to see records
4. Use "SQL" tab to run custom queries

### Common Queries

#### View All Users
```sql
SELECT * FROM users;
```

#### View All Courses
```sql
SELECT * FROM courses;
```

#### View Assignments with Submissions
```sql
SELECT 
    a.title AS assignment,
    u.FName AS student,
    s.status,
    s.submitted_at
FROM assessments a
LEFT JOIN submissions s ON a.assessment_ID = s.assessment_id
LEFT JOIN users u ON s.user_id = u.user_ID;
```

#### View Grades
```sql
SELECT 
    u.FName AS student,
    a.title AS assignment,
    g.score,
    g.feedback
FROM grade g
JOIN submissions s ON g.submission_ID = s.submission_ID
JOIN users u ON s.user_id = u.user_ID
JOIN assessments a ON s.assessment_id = a.assessment_ID;
```

## Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:** 
1. Check if MySQL is running in XAMPP
2. Verify your MySQL password in `.env`
3. Try resetting MySQL password in XAMPP

### Issue: "Database 'tinylearn' doesn't exist"
**Solution:** 
1. Create the database manually in phpMyAdmin
2. Or run: `php artisan db:create` (if you have the package)

### Issue: "SQLSTATE[HY000] [2002] Connection refused"
**Solution:**
1. Make sure MySQL is running in XAMPP
2. Check if port 3306 is not blocked
3. Verify `DB_HOST=127.0.0.1` in `.env`

### Issue: Migration errors
**Solution:**
```bash
# Drop all tables and re-run migrations
php artisan migrate:fresh

# If that doesn't work, manually delete tables in phpMyAdmin
# Then run migrations again
php artisan migrate
```

### Issue: "Syntax error or access violation: 1071 Specified key was too long"
**Solution:**
Add to `app/Providers/AppServiceProvider.php`:
```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

## Switching Back to SQLite

If you want to switch back to SQLite:

1. Update `.env`:
```env
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=tinylearn
# DB_USERNAME=root
# DB_PASSWORD=
```

2. Create SQLite file:
```bash
touch database/database.sqlite
```

3. Run migrations:
```bash
php artisan migrate:fresh --seed
```

## Benefits of Using MySQL with XAMPP

✅ **Visual Interface:** Easy to view and edit data in phpMyAdmin
✅ **Better Performance:** MySQL is faster for larger datasets
✅ **Production Ready:** Most hosting providers use MySQL
✅ **Advanced Features:** Stored procedures, triggers, views
✅ **Backup Tools:** Easy database export/import
✅ **Query Builder:** Visual query builder in phpMyAdmin

## Accessing Your Database

### phpMyAdmin
- **URL:** http://localhost/phpmyadmin
- **Database:** tinylearn
- **Tables:** 20+ tables

### MySQL Command Line
```bash
# Access MySQL
mysql -u root -p

# Select database
USE tinylearn;

# Show tables
SHOW TABLES;

# View table structure
DESCRIBE users;
```

## Database Backup

### Export Database
1. Open phpMyAdmin
2. Select `tinylearn` database
3. Click "Export" tab
4. Choose "Quick" or "Custom" method
5. Click "Go" to download SQL file

### Import Database
1. Open phpMyAdmin
2. Select `tinylearn` database
3. Click "Import" tab
4. Choose your SQL file
5. Click "Go"

## Summary

Your TinyLearn database is now configured to work with XAMPP MySQL!

- ✅ Database: `tinylearn`
- ✅ Access: phpMyAdmin at `http://localhost/phpmyadmin`
- ✅ All tables created via Laravel migrations
- ✅ Test data seeded
- ✅ Ready for development

**Happy coding! 🚀**
