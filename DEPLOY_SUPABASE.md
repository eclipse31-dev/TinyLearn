# Deploy TinyLearn LMS to Supabase (10 Minutes)

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- ✅ PostgreSQL Database (included)
- ✅ Real-time subscriptions (WebSocket)
- ✅ Authentication (built-in)
- ✅ File storage (S3-compatible)
- ✅ Edge functions (serverless)
- ✅ Vector embeddings (AI-ready)

**Cost**: Free tier available, $25/month for production

---

## Prerequisites

1. GitHub account (free)
2. Supabase account (free) - https://supabase.com
3. Vercel account (free) - https://vercel.com (for frontend)

---

## Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub
4. Click **"New Project"**
5. Configure:
   - **Project name**: `tinylearn`
   - **Database password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing plan**: Free tier
6. Click **"Create new project"**
7. Wait 2-3 minutes for database to be created

---

## Step 2: Get Database Connection String (1 minute)

1. In Supabase dashboard, go to **"Settings"** → **"Database"**
2. Copy the **"Connection string"** (URI format)
3. It looks like: `postgresql://postgres:PASSWORD@HOST:5432/postgres`
4. Save this for later

---

## Step 3: Create Tables (2 minutes)

1. In Supabase, go to **"SQL Editor"**
2. Click **"New Query"**
3. Paste this SQL:

```sql
-- Create users table (Supabase auth handles this, but we need custom fields)
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS google_avatar TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS oauth_provider TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS FName TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS LName TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
```

4. Click **"Run"**
5. Tables are created!

---

## Step 4: Setup Authentication (2 minutes)

1. Go to **"Authentication"** → **"Providers"**
2. Enable **"Email"** (already enabled)
3. Enable **"Google"**:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Copy Client ID and Secret
   - Paste in Supabase
4. Click **"Save"**

---

## Step 5: Create .env File (1 minute)

Create `react/.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_URL=https://YOUR_BACKEND_DOMAIN.com
VITE_REVERB_HOST=YOUR_BACKEND_DOMAIN.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

Get these from Supabase:
- Go to **"Settings"** → **"API"**
- Copy **"Project URL"** and **"anon public"** key

---

## Step 6: Update Laravel .env (1 minute)

Update `.env`:

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

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app

GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Step 7: Deploy Backend (2 minutes)

### Option A: Deploy to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"GitHub Repo"**
4. Connect your GitHub account
5. Select `tinylearn` repository
6. Add environment variables from `.env`
7. Set build command: `composer install && php artisan migrate --force`
8. Deploy

### Option B: Deploy to Vercel (Serverless)

1. Go to https://vercel.com
2. Import your GitHub repo
3. Configure as Node.js project
4. Add environment variables
5. Deploy

### Option C: Deploy to Supabase Edge Functions

1. In Supabase, go to **"Edge Functions"**
2. Click **"Create a new function"**
3. Deploy Laravel as edge function

---

## Step 8: Deploy Frontend to Vercel (1 minute)

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `cd react && npm install && npm run build`
   - **Output Directory**: `react/dist`
5. Add environment variables from `react/.env.local`
6. Deploy

---

## Step 9: Run Migrations (1 minute)

```bash
# Connect to Supabase database
psql postgresql://postgres:PASSWORD@HOST:5432/postgres

# Run migrations
php artisan migrate --force
```

Or use Supabase SQL Editor to run migrations.

---

## Step 10: Test Deployment (1 minute)

1. Go to your Vercel frontend URL
2. Login with:
   - Email: `admin@example.com`
   - Password: `password`
3. Test features:
   - Create course
   - Invite students
   - Accept invitation
   - Unenroll

---

## Supabase Features for TinyLearn

### 1. Real-time Database
```javascript
// Subscribe to course changes
const subscription = supabase
  .from('courses')
  .on('*', payload => {
    console.log('Course updated:', payload)
  })
  .subscribe()
```

### 2. Authentication
```javascript
// Sign up
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Sign in
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Google OAuth
const { user, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

### 3. File Storage
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('course-materials')
  .upload('path/to/file', file)

// Download file
const { data, error } = await supabase.storage
  .from('course-materials')
  .download('path/to/file')
```

### 4. Edge Functions
```bash
# Create function
supabase functions new send-invitation

# Deploy function
supabase functions deploy send-invitation
```

---

## Supabase vs Other Options

| Feature | Supabase | Firebase | AWS | Railway |
|---------|----------|----------|-----|---------|
| **Database** | PostgreSQL | Firestore | RDS | PostgreSQL |
| **Auth** | Built-in | Built-in | Cognito | Manual |
| **Real-time** | Yes | Yes | No | No |
| **Storage** | Yes | Yes | S3 | Manual |
| **Cost** | $25/mo | $25/mo | $20-100/mo | $5/mo |
| **Setup Time** | 10 min | 15 min | 1 hour | 30 min |

---

## Supabase Pricing

### Free Tier
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ Real-time subscriptions
- ✅ Edge functions (limited)

### Pro Tier ($25/month)
- ✅ 8 GB database
- ✅ 100 GB file storage
- ✅ Unlimited users
- ✅ Priority support
- ✅ Custom domains

### Team Tier ($599/month)
- ✅ 100 GB database
- ✅ 1 TB file storage
- ✅ Unlimited everything
- ✅ SSO
- ✅ Dedicated support

---

## Supabase Dashboard Features

### 1. SQL Editor
- Write and run SQL queries
- Create tables and indexes
- Manage data directly

### 2. Table Editor
- Visual table management
- Add/edit/delete rows
- Filter and sort data

### 3. Authentication
- Manage users
- View login history
- Configure providers

### 4. Real-time
- Monitor subscriptions
- View active connections
- Debug real-time issues

### 5. Storage
- Manage files
- Set permissions
- View usage

### 6. Edge Functions
- Deploy serverless functions
- Monitor execution
- View logs

### 7. Logs
- View database logs
- Monitor API calls
- Debug issues

---

## Connecting Laravel to Supabase

### 1. Install Supabase PHP Client

```bash
composer require supabase/supabase-php
```

### 2. Configure in Laravel

Create `config/supabase.php`:

```php
return [
    'url' => env('SUPABASE_URL'),
    'key' => env('SUPABASE_KEY'),
    'secret' => env('SUPABASE_SECRET'),
];
```

### 3. Use in Controllers

```php
use Supabase\Supabase;

$supabase = Supabase::create(
    config('supabase.url'),
    config('supabase.key')
);

// Get data
$response = $supabase
    ->from('courses')
    ->select('*')
    ->execute();

// Insert data
$response = $supabase
    ->from('courses')
    ->insert([
        'title' => 'New Course',
        'description' => 'Course description'
    ])
    ->execute();
```

---

## Connecting React to Supabase

### 1. Install Supabase JS Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client

Create `react/src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Use in Components

```javascript
import { supabase } from '../lib/supabase'

// Get courses
const { data: courses, error } = await supabase
  .from('courses')
  .select('*')

// Subscribe to real-time updates
const subscription = supabase
  .from('courses')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

---

## Supabase Real-time Features

### 1. Database Changes
```javascript
supabase
  .from('courses')
  .on('INSERT', payload => {
    console.log('New course:', payload.new)
  })
  .on('UPDATE', payload => {
    console.log('Updated course:', payload.new)
  })
  .on('DELETE', payload => {
    console.log('Deleted course:', payload.old)
  })
  .subscribe()
```

### 2. Presence
```javascript
// Track user presence
const { status } = await supabase
  .channel('online-users')
  .on('presence', { event: 'sync' }, () => {
    console.log('Users online')
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ user_id: userId })
    }
  })
```

### 3. Broadcast
```javascript
// Send message to all users
supabase
  .channel('notifications')
  .send({
    type: 'broadcast',
    event: 'course_invitation',
    payload: { course_id: 1, student_id: 5 }
  })
```

---

## Supabase Security

### 1. Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Students can only see their courses
CREATE POLICY "Students see their courses"
  ON courses FOR SELECT
  USING (
    created_by = auth.uid() OR
    is_private = false OR
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = courses.course_ID
      AND enrollments.user_id = auth.uid()
    )
  );
```

### 2. Authentication

```javascript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  // Redirect to login
}
```

### 3. Permissions

```javascript
// Check user role
const { data: roles } = await supabase
  .from('user_roles')
  .select('roles(*)')
  .eq('user_id', user.id)
```

---

## Supabase Backups

### Automatic Backups
- Daily backups (free tier)
- 7-day retention
- Point-in-time recovery

### Manual Backups
```bash
# Export database
pg_dump postgresql://postgres:PASSWORD@HOST:5432/postgres > backup.sql

# Import database
psql postgresql://postgres:PASSWORD@HOST:5432/postgres < backup.sql
```

---

## Supabase Monitoring

### 1. Database Metrics
- Query performance
- Connection count
- Storage usage

### 2. API Metrics
- Request count
- Response time
- Error rate

### 3. Real-time Metrics
- Active subscriptions
- Message throughput
- Connection status

---

## Troubleshooting

### Connection Error
```
Check:
1. Database credentials
2. Network connectivity
3. Firewall rules
4. IP whitelist
```

### Authentication Error
```
Check:
1. Email provider configured
2. OAuth credentials correct
3. Redirect URLs configured
4. User exists in database
```

### Real-time Not Working
```
Check:
1. Real-time enabled in settings
2. Subscription created correctly
3. Network connectivity
4. Browser console for errors
```

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Create tables
3. ✅ Setup authentication
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Run migrations
7. ✅ Test features
8. ✅ Setup monitoring
9. ✅ Configure backups
10. ✅ Monitor performance

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)
- [Supabase Community](https://discord.supabase.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## Summary

**Setup Time**: 10 minutes
**Cost**: Free tier or $25/month
**Features**: Database, Auth, Real-time, Storage
**Scalability**: Excellent
**Ease of Use**: Very Easy

Supabase is the perfect choice for TinyLearn LMS because it provides everything you need in one platform!

---

**Ready to deploy to Supabase?** 🚀

Follow the 10 steps above and your TinyLearn LMS will be live in minutes!
