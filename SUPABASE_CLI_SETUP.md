# Supabase CLI Setup & Migration Guide

**Status**: Ready to Setup  
**Project Ref**: wlcguodooyitrecgcauu

---

## Step 1: Install Supabase CLI

### Windows (PowerShell)

```powershell
# Install via npm (easiest)
npm install -g supabase

# Or install via Scoop
scoop install supabase

# Or install via Chocolatey
choco install supabase
```

### Verify Installation

```powershell
supabase --version
```

---

## Step 2: Link Your Project

```powershell
supabase link --project-ref wlcguodooyitrecgcauu
```

**What this does**:
- Connects your local project to Supabase
- Creates `.supabase` folder
- Stores project configuration

**You'll be asked**:
- Supabase password (from your project)
- Confirm linking

---

## Step 3: Create Migration Files

### Option A: Create Migration from SQL File

```powershell
# Create a new migration
supabase migration new add_invitation_fields

# This creates: supabase/migrations/TIMESTAMP_add_invitation_fields.sql
```

### Option B: Create Migration from Existing Database

```powershell
# Pull current schema from Supabase
supabase db pull

# This creates migration from remote database
```

---

## Step 4: Add Migration SQL

Edit the migration file created in `supabase/migrations/`:

```sql
-- Add is_private to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT true;

-- Update enrollments table to add new statuses
ALTER TABLE enrollments 
  ALTER COLUMN status TYPE VARCHAR(50);

-- Add enrollment_type column
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS enrollment_type VARCHAR(50) DEFAULT 'self';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
```

---

## Step 5: Push Migrations to Supabase

```powershell
supabase db push
```

**What this does**:
- Runs all pending migrations
- Updates remote database
- Confirms success

---

## Complete Setup Commands

Run these in order:

```powershell
# 1. Install CLI
npm install -g supabase

# 2. Verify installation
supabase --version

# 3. Link to your project
supabase link --project-ref wlcguodooyitrecgcauu

# 4. Create migration
supabase migration new add_invitation_fields

# 5. Edit the migration file (add SQL)

# 6. Push to Supabase
supabase db push

# 7. Verify
supabase db list
```

---

## Useful Supabase CLI Commands

### Database Commands

```powershell
# Link project
supabase link --project-ref wlcguodooyitrecgcauu

# Pull current schema
supabase db pull

# Push migrations
supabase db push

# List migrations
supabase migration list

# Create new migration
supabase migration new migration_name

# Reset database (WARNING: deletes all data)
supabase db reset
```

### Local Development

```powershell
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# View logs
supabase logs
```

### Authentication

```powershell
# Login to Supabase
supabase login

# Logout
supabase logout

# Show current user
supabase projects list
```

---

## Migration File Structure

Your migrations will be in:
```
supabase/
├── migrations/
│   ├── 20260312000000_add_invitation_fields.sql
│   └── 20260312000001_add_more_fields.sql
├── config.toml
└── .gitignore
```

---

## Example Migration File

```sql
-- supabase/migrations/20260312000000_add_invitation_fields.sql

-- Add is_private to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT true;

-- Add enrollment_type to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS enrollment_type VARCHAR(50) DEFAULT 'self';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_is_private ON courses(is_private);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
```

---

## Troubleshooting

### "supabase: command not found"

**Solution**: Install CLI
```powershell
npm install -g supabase
```

### "Project not linked"

**Solution**: Link your project
```powershell
supabase link --project-ref wlcguodooyitrecgcauu
```

### "Authentication failed"

**Solution**: Login again
```powershell
supabase login
```

### "Migration failed"

**Solution**: Check SQL syntax
```powershell
# View migration status
supabase migration list

# Check logs
supabase logs
```

---

## Best Practices

### 1. Always Create Migrations
```powershell
supabase migration new descriptive_name
```

### 2. Test Locally First
```powershell
supabase start
supabase db push
# Test locally
supabase stop
```

### 3. Use Descriptive Names
```powershell
# Good
supabase migration new add_invitation_fields

# Bad
supabase migration new update
```

### 4. Keep Migrations Small
- One feature per migration
- Easier to debug
- Easier to rollback

### 5. Version Control
```powershell
# Commit migrations
git add supabase/migrations/
git commit -m "Add invitation fields migration"
git push
```

---

## Full Setup Workflow

### 1. Install CLI
```powershell
npm install -g supabase
supabase --version
```

### 2. Link Project
```powershell
supabase link --project-ref wlcguodooyitrecgcauu
```

### 3. Create Migration
```powershell
supabase migration new add_invitation_fields
```

### 4. Edit Migration File
Add SQL to: `supabase/migrations/TIMESTAMP_add_invitation_fields.sql`

### 5. Push to Supabase
```powershell
supabase db push
```

### 6. Verify
```powershell
supabase migration list
```

### 7. Commit to Git
```powershell
git add supabase/
git commit -m "Add invitation fields migration"
git push
```

---

## Next Steps

1. ✅ Install Supabase CLI
2. ✅ Link your project
3. ✅ Create migration
4. ✅ Push to Supabase
5. ✅ Deploy backend
6. ✅ Deploy frontend
7. ✅ Test system

---

## Support

- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Migrations Guide**: https://supabase.com/docs/guides/cli/local-development
- **Project Ref**: wlcguodooyitrecgcauu

---

**Ready to setup?** Follow the commands above! 🚀
