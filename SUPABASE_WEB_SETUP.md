# Supabase Setup - Web Interface (No CLI Required)

**Status**: Ready to Setup  
**Project Ref**: wlcguodooyitrecgcauu  
**Method**: Using Supabase Web Dashboard

---

## Why This Method?

✅ No CLI installation needed  
✅ Works on any computer  
✅ Visual interface  
✅ Same result as CLI  
✅ Easier to understand

---

## Step 1: Go to Supabase Dashboard

1. Go to: https://app.supabase.com
2. Login with your account
3. Select project: `tinylearn`

---

## Step 2: Create Tables via SQL Editor

### Method 1: Use SQL Editor (Recommended)

1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New Query"**
3. Paste this SQL:

```sql
-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role_ID SERIAL PRIMARY KEY,
  role VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(role_ID) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  course_ID SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  course_code VARCHAR(50) UNIQUE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  is_private BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  header_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_ID SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(course_ID) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  enrollment_type VARCHAR(50) DEFAULT 'self',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  action_url TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_courses_is_private ON courses(is_private);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
```

4. Click **"Run"** button
5. Wait for success message
6. Tables are created!

---

## Step 3: Verify Tables Created

1. Click **"Table Editor"** in left sidebar
2. You should see:
   - ✅ roles
   - ✅ user_roles
   - ✅ courses
   - ✅ enrollments
   - ✅ notifications

---

## Step 4: Get Your Credentials

### Get API Keys

1. Click **"Settings"** (bottom left)
2. Click **"API"**
3. Copy these:
   - **Project URL**: `https://YOUR_PROJECT_ID.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (long string)

### Get Database Connection

1. Click **"Settings"** → **"Database"**
2. Copy **"Connection string"**:
   - Format: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

---

## Step 5: Update Your .env Files

### Backend (.env)

```env
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.com

DB_CONNECTION=pgsql
DB_HOST=YOUR_SUPABASE_HOST.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD

BROADCAST_CONNECTION=reverb
REVERB_HOST=your-backend-domain.com
REVERB_PORT=443
REVERB_SCHEME=https

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.your-domain.com
```

### Frontend (react/.env.local)

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_URL=https://your-backend-domain.com
VITE_REVERB_HOST=your-backend-domain.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

---

## Step 6: Setup Authentication

### Enable Email Authentication

1. Click **"Authentication"** in left sidebar
2. Click **"Providers"**
3. Verify **"Email"** is enabled (should be by default)

### Enable Google OAuth (Optional)

1. Click **"Authentication"** → **"Providers"**
2. Click **"Google"**
3. Go to Google Cloud Console
4. Create OAuth 2.0 credentials
5. Copy Client ID and Secret
6. Paste in Supabase
7. Click **"Save"**

---

## Step 7: Create Test Users

### Via Supabase Dashboard

1. Click **"Authentication"** → **"Users"**
2. Click **"Add user"**
3. Create users:

```
Admin:
  Email: admin@example.com
  Password: password

Teacher:
  Email: teacher@example.com
  Password: password

Student:
  Email: student@example.com
  Password: password
```

---

## Step 8: Deploy Backend to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"GitHub Repo"**
4. Connect GitHub
5. Select `tinylearn` repository
6. Add environment variables from `.env`
7. Set build command: `composer install && php artisan migrate --force`
8. Deploy

**Save**: Railway domain (e.g., `tinylearn-api.railway.app`)

---

## Step 9: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import `tinylearn` repository
4. Configure:
   - Framework: Vite
   - Build: `cd react && npm install && npm run build`
   - Output: `react/dist`
5. Add environment variables from `react/.env.local`
6. Deploy

**Save**: Vercel domain (e.g., `tinylearn.vercel.app`)

---

## Step 10: Test Your Deployment

1. Go to your Vercel frontend URL
2. Login with: `admin@example.com` / `password`
3. Test features:
   - ✅ Create course
   - ✅ Invite student
   - ✅ Accept invitation
   - ✅ Unenroll

---

## Supabase Dashboard Features

### 1. SQL Editor
- Write and run SQL queries
- Create tables
- Manage data

### 2. Table Editor
- Visual table management
- Add/edit/delete rows
- Filter and sort

### 3. Authentication
- Manage users
- View login history
- Configure providers

### 4. Real-time
- Monitor subscriptions
- View active connections

### 5. Storage
- Manage files
- Set permissions

### 6. Logs
- View database logs
- Monitor API calls

---

## Useful Supabase Dashboard Links

- **SQL Editor**: https://app.supabase.com/project/wlcguodooyitrecgcauu/sql
- **Table Editor**: https://app.supabase.com/project/wlcguodooyitrecgcauu/editor
- **Authentication**: https://app.supabase.com/project/wlcguodooyitrecgcauu/auth/users
- **Settings**: https://app.supabase.com/project/wlcguodooyitrecgcauu/settings/general

---

## Troubleshooting

### "Table already exists"
- Tables might already be created
- Check Table Editor
- If exists, skip creation

### "Connection refused"
- Check database credentials
- Verify Supabase project is running
- Check network connectivity

### "Authentication failed"
- Verify email provider is enabled
- Check user exists in database
- Verify password is correct

### "API not responding"
- Check Railway logs
- Verify database connection
- Check environment variables

---

## Next Steps

1. ✅ Create tables via SQL Editor
2. ✅ Get API credentials
3. ✅ Update .env files
4. ✅ Setup authentication
5. ✅ Create test users
6. ✅ Deploy backend
7. ✅ Deploy frontend
8. ✅ Test system

---

## Summary

**Method**: Web Dashboard (No CLI)  
**Time**: 10-15 minutes  
**Difficulty**: ⭐ Easy  
**Result**: Same as CLI method

---

**Ready to setup?** Follow the steps above! 🚀
