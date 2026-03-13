# XAMPP Setup Guide for TinyLearn

## Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start Apache
3. Start MySQL

## Step 2: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" to create new database
3. Database name: `tinylearn`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

## Step 3: Import SQL File
1. Select `tinylearn` database
2. Click "Import" tab
3. Choose file: `create_database_mysql.sql`
4. Click "Go"

## Step 4: Update .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=
```

## Step 5: Seed Database
```bash
php artisan db:seed --force
```

## Step 6: Run Servers
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

## Test Credentials
- Email: student@example.com
- Password: password

## Access URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- phpMyAdmin: http://localhost/phpmyadmin
