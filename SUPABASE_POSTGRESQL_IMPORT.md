# Import PostgreSQL Database to Supabase

**Status**: Ready to Import  
**File**: create_database_postgresql.sql  
**Format**: PostgreSQL (Supabase compatible)

---

## Problem Solved

Your original SQL was in **MySQL format** with backticks (`` ` ``).  
Supabase uses **PostgreSQL** which uses double quotes (`"`) or no quotes.

**Solution**: I've converted the SQL to PostgreSQL format!

---

## Step 1: Copy the PostgreSQL SQL

The file `create_database_postgresql.sql` contains:
- ✅ All tables in PostgreSQL syntax
- ✅ All indexes
- ✅ All constraints
- ✅ Sample data (admin user, roles)
- ✅ No backticks (MySQL syntax removed)

---

## Step 2: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Select project: `tinylearn`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**

---

## Step 3: Paste the PostgreSQL SQL

1. Open `create_database_postgresql.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor

---

## Step 4: Run the Query

1. Click **"Run"** button (or Ctrl+Enter)
2. Wait 2-5 minutes
3. You should see: **"Success"** message

---

## Step 5: Verify Tables

1. Click **"Table Editor"** in left sidebar
2. You should see all tables:
   - ✅ users
   - ✅ roles
   - ✅ courses
   - ✅ enrollments
   - ✅ notifications
   - ✅ And 20+ more...

---

## What's Different from MySQL

### MySQL (Old - Doesn't work)
```sql
CREATE TABLE `users` (
  `user_ID` BIGINT UNSIGNED NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  ...
)
```

### PostgreSQL (New - Works!)
```sql
CREATE TABLE users (
  user_ID BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ...
)
```

### Key Changes
- ✅ Removed backticks (`` ` ``)
- ✅ Changed `BIGINT(20) UNSIGNED` → `BIGSERIAL`
- ✅ Changed `AUTO_INCREMENT` → `SERIAL`
- ✅ Changed `ENGINE=InnoDB` → Removed (PostgreSQL default)
- ✅ Changed `CHARSET` → Removed (PostgreSQL default)
- ✅ Changed `longtext` → `TEXT`
- ✅ Changed `json_valid()` → Removed (PostgreSQL validates automatically)
- ✅ Changed `ENUM` → `VARCHAR` (PostgreSQL compatible)
- ✅ Changed `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`

---

## Sample Data Included

The PostgreSQL SQL includes:
- ✅ 3 Roles: admin, teacher, student
- ✅ 1 Admin user: admin@example.com / password
- ✅ Admin role assigned to admin user

---

## Troubleshooting

### Error: "syntax error at or near"

**Cause**: Still using MySQL SQL

**Solution**: 
1. Delete all tables
2. Use `create_database_postgresql.sql` instead
3. Try again

### Error: "Table already exists"

**Solution**: 
1. Go to Table Editor
2. Delete all tables
3. Try again

Or run this first:

```sql
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS grade CASCADE;
DROP TABLE IF EXISTS submission_files CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
```

### Error: "Foreign key constraint failed"

**Cause**: Tables referenced before they're created

**Solution**: The PostgreSQL SQL is ordered correctly. If this happens:
1. Delete all tables
2. Try again with fresh import

---

## After Import

### 1. Verify Data

```sql
-- Check users
SELECT * FROM users;

-- Check roles
SELECT * FROM roles;

-- Check user_roles
SELECT * FROM user_roles;
```

### 2. Get Connection String

1. Go to Settings → Database
2. Copy Connection string
3. Format: `postgresql://user:password@host:port/database`

### 3. Update .env

```env
DB_CONNECTION=pgsql
DB_HOST=YOUR_SUPABASE_HOST.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD
```

---

## Quick Reference

| Step | Action | Time |
|------|--------|------|
| 1 | Open Supabase SQL Editor | 1 min |
| 2 | Copy PostgreSQL SQL | 1 min |
| 3 | Paste into editor | 1 min |
| 4 | Click Run | 2-5 min |
| 5 | Verify tables | 1 min |
| **Total** | | **6-10 min** |

---

## Files

- **create_database_postgresql.sql** ← Use this for Supabase
- **create_database.sql** ← Old MySQL format (don't use)

---

## Next Steps

1. ✅ Import PostgreSQL database
2. ✅ Verify tables created
3. ✅ Get connection string
4. ✅ Update .env files
5. ✅ Deploy backend to Railway
6. ✅ Deploy frontend to Vercel
7. ✅ Test system

---

**Ready to import?** Use `create_database_postgresql.sql` in Supabase SQL Editor! 🚀
