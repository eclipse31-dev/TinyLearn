# Import Database to Supabase - Step by Step

**Status**: Ready to Import  
**Database**: TinyLearn LMS  
**File**: create_database.sql

---

## Method 1: Using Supabase SQL Editor (Recommended)

### Step 1: Go to Supabase Dashboard

1. Go to: https://app.supabase.com
2. Login with your account
3. Select project: `tinylearn`
4. Click **"SQL Editor"** in left sidebar

---

### Step 2: Create New Query

1. Click **"New Query"** button
2. You'll see a blank SQL editor

---

### Step 3: Paste Your SQL

1. Copy all the SQL from `create_database.sql`
2. Paste it into the SQL Editor
3. The SQL includes:
   - All table definitions
   - All indexes
   - All constraints
   - Sample data (users, roles, etc.)

---

### Step 4: Run the Query

1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for execution to complete
3. You should see: "Success" message

---

### Step 5: Verify Tables Created

1. Click **"Table Editor"** in left sidebar
2. You should see all tables:
   - ✅ users
   - ✅ roles
   - ✅ user_roles
   - ✅ courses
   - ✅ enrollments
   - ✅ notifications
   - ✅ And 20+ more tables

---

## Method 2: Split the SQL (If Method 1 Fails)

If the full SQL fails, split it into parts:

### Part 1: Create Tables Only

Copy and run just the CREATE TABLE statements (first half of SQL)

### Part 2: Create Indexes

Copy and run just the ALTER TABLE ... ADD INDEX statements

### Part 3: Add Constraints

Copy and run just the ALTER TABLE ... ADD CONSTRAINT statements

### Part 4: Insert Data

Copy and run just the INSERT INTO statements

---

## Important Notes

### Column Name Differences

Your SQL uses:
- `user_ID` (with capital ID)
- `course_ID` (with capital ID)

Supabase might prefer:
- `user_id` (lowercase)

**Solution**: The SQL will work as-is. Supabase accepts both formats.

### Data Types

Your SQL uses:
- `bigint(20) UNSIGNED` - Works in Supabase
- `enum('value1','value2')` - Works in Supabase
- `longtext` - Works in Supabase
- `timestamp` - Works in Supabase

All data types are compatible with PostgreSQL (which Supabase uses).

### Foreign Keys

Your SQL includes foreign key constraints. Supabase supports these fully.

---

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

```
https://app.supabase.com/project/wlcguodooyitrecgcauu/sql
```

### 2. Click "New Query"

### 3. Paste This SQL

```sql
-- Copy entire create_database.sql content here
```

### 4. Click "Run"

### 5. Wait for Success

You should see green checkmark and "Success" message.

### 6. Verify in Table Editor

Click "Table Editor" and see all tables created.

---

## Troubleshooting

### Error: "Table already exists"

**Cause**: Tables already created from previous attempt

**Solution**: 
1. Go to Table Editor
2. Delete existing tables
3. Try again

Or use this to drop all tables first:

```sql
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
-- ... drop all other tables
```

### Error: "Foreign key constraint failed"

**Cause**: Tables referenced before they're created

**Solution**: 
1. Run the SQL in parts
2. Create tables first
3. Then add constraints

### Error: "Column type not supported"

**Cause**: PostgreSQL doesn't support that type

**Solution**: 
- `bigint` → Works
- `enum` → Works
- `longtext` → Use `text` instead
- `timestamp` → Works

---

## What Gets Imported

### Tables (25 total)
- users
- roles
- user_roles
- courses
- enrollments
- notifications
- assignments
- submissions
- grades
- announcements
- discussions
- modules
- materials
- schedules
- And 11 more...

### Sample Data
- 1 Admin user (admin@example.com)
- 3 Roles (admin, teacher, student)
- Test data in cache and jobs tables

### Indexes
- 50+ indexes for performance
- Foreign key constraints
- Unique constraints

---

## After Import

### 1. Verify Data

```sql
-- Check users
SELECT * FROM users;

-- Check roles
SELECT * FROM roles;

-- Check enrollments
SELECT * FROM enrollments;
```

### 2. Get Connection String

1. Go to Settings → Database
2. Copy Connection string
3. Use in your .env file

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
| 2 | Create New Query | 30 sec |
| 3 | Paste SQL | 1 min |
| 4 | Run Query | 2-5 min |
| 5 | Verify Tables | 1 min |
| **Total** | | **5-10 min** |

---

## Next Steps

1. ✅ Import database to Supabase
2. ✅ Verify tables created
3. ✅ Get connection string
4. ✅ Update .env files
5. ✅ Deploy backend to Railway
6. ✅ Deploy frontend to Vercel
7. ✅ Test system

---

**Ready to import?** Follow the steps above! 🚀
