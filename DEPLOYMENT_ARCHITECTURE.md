# TinyLearn Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TinyLearn LMS System                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (React)   │         │  Backend (Laravel)   │
│   Deployed on:       │         │  Deployed on:        │
│   - Vercel (Option)  │◄───────►│  - Railway           │
│   - Netlify (Option) │  HTTPS  │  - Heroku (Option)   │
│   - GitHub Pages     │         │  - AWS (Option)      │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         │                                  │
         └──────────────────┬───────────────┘
                            │
                    ┌───────▼────────┐
                    │  Supabase      │
                    │  PostgreSQL    │
                    │  Database      │
                    └────────────────┘
```

## Current Deployment Configuration

### Frontend
- **Framework**: React 19 with Inertia.js
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages
- **Environment**: `react/.env.local`

### Backend
- **Framework**: Laravel 12
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Railway
- **Real-time**: Laravel Reverb
- **Environment**: `.env`

### Database
- **Provider**: Supabase (PostgreSQL)
- **Host**: `aws-1-ap-south-1.pooler.supabase.com`
- **Connection**: Pooler (for Railway compatibility)
- **Tables**: 25 tables with relationships

## Deployment Flow

### 1. Local Development
```
┌─────────────────────────────────────────┐
│  Local Machine (Windows)                │
├─────────────────────────────────────────┤
│  Frontend: npm run dev                  │
│  Backend: php artisan serve             │
│  Database: Supabase (cloud)             │
└─────────────────────────────────────────┘
```

### 2. GitHub Repository
```
┌─────────────────────────────────────────┐
│  GitHub: eclipse31-dev/TinyLearn        │
├─────────────────────────────────────────┤
│  - Main branch (production)             │
│  - All code, migrations, configs        │
│  - Deployment files (Procfile, etc.)    │
└─────────────────────────────────────────┘
```

### 3. Backend Deployment (Railway)
```
┌─────────────────────────────────────────┐
│  Railway Backend Service                │
├─────────────────────────────────────────┤
│  Trigger: GitHub push to main           │
│  Build: Heroku PHP buildpack            │
│  Runtime: PHP 8.2 + PostgreSQL ext.     │
│  Environment: Variables from Railway    │
│  Database: Supabase PostgreSQL          │
└─────────────────────────────────────────┘
```

### 4. Frontend Deployment (Optional)
```
┌─────────────────────────────────────────┐
│  Frontend Service (Vercel/Netlify)      │
├─────────────────────────────────────────┤
│  Trigger: GitHub push to main           │
│  Build: npm run build                   │
│  Output: Static files                   │
│  API: Points to Railway backend         │
└─────────────────────────────────────────┘
```

## Environment Variables

### Backend (.env)
```
# Database
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.wlcguodooyitrecgcauu
DB_PASSWORD=[YOUR-PASSWORD]

# Supabase
SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_PUBLISHABLE_KEY=[PUBLISHABLE-KEY]

# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-url.railway.app
```

### Frontend (react/.env.local)
```
VITE_API_URL=https://your-railway-url.railway.app
VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
VITE_SUPABASE_ANON_KEY=[ANON-KEY]
```

## Deployment Files

### Procfile
Tells Railway how to run the app:
```
web: vendor/bin/heroku-php-apache2 -i /etc/php/conf.d/pdo_pgsql.ini public/
```

### runtime.txt
Specifies PHP version:
```
php-8.2.0
```

### .buildpacks
Specifies the buildpack:
```
https://github.com/heroku/heroku-buildpack-php.git
```

### .user.ini
Enables PostgreSQL extension:
```
extension=pdo_pgsql.so
```

## Database Schema

### Key Tables
- `users` - User accounts
- `roles` - Admin, Teacher, Student
- `courses` - Course information
- `enrollments` - Student enrollment with invitation system
- `modules` - Course modules
- `materials` - Course materials
- `assignments` - Assignments
- `submissions` - Student submissions
- `grades` - Grades and assessments
- `discussions` - Discussion forums
- `messages` - Direct messaging
- `notifications` - Real-time notifications
- `activity_logs` - User activity tracking

### Relationships
```
User
├── Roles (many-to-many)
├── Enrollments (one-to-many)
├── Courses (one-to-many as teacher)
├── Submissions (one-to-many)
├── Messages (one-to-many)
└── Notifications (one-to-many)

Course
├── Modules (one-to-many)
├── Enrollments (one-to-many)
├── Materials (one-to-many)
├── Assignments (one-to-many)
└── Discussions (one-to-many)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/google` - Google OAuth

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `POST /api/enrollments/{id}/accept` - Accept invitation
- `POST /api/enrollments/{id}/reject` - Reject invitation
- `DELETE /api/enrollments/{id}` - Unenroll

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/{id}` - Get submission

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

## Deployment Checklist

### Before Deployment
- [ ] All code committed to GitHub
- [ ] `.env` configured with Supabase credentials
- [ ] Database migrations created
- [ ] Tests passing locally
- [ ] Frontend builds successfully

### Railway Setup
- [ ] Project created on Railway
- [ ] GitHub connected
- [ ] Environment variables set
- [ ] Procfile and buildpack files in repo
- [ ] Database connection tested

### Post-Deployment
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Login works (admin, teacher, student)
- [ ] Database queries work
- [ ] Real-time features work
- [ ] File uploads work
- [ ] Notifications work

## Troubleshooting

### 505 Server Error
**Cause**: Missing PostgreSQL PHP extension  
**Fix**: Ensure Procfile, runtime.txt, .buildpacks, .user.ini are in repo  
**Action**: Redeploy on Railway

### Database Connection Error
**Cause**: Wrong credentials or host  
**Fix**: Verify `.env` variables match Supabase  
**Action**: Update environment variables on Railway

### Frontend Can't Connect to Backend
**Cause**: Wrong API URL  
**Fix**: Verify `VITE_API_URL` points to Railway backend  
**Action**: Update frontend environment variables

### Migrations Not Running
**Cause**: Database not initialized  
**Fix**: Run migrations manually  
**Action**: `railway run php artisan migrate --force`

## Monitoring

### Railway Logs
- Backend service → Logs tab
- Watch for errors and warnings
- Check deployment progress

### Supabase Logs
- Project → Logs
- Monitor database queries
- Check for connection issues

### Application Logs
- `storage/logs/laravel.log`
- Check for application errors
- Monitor activity

## Scaling

### Current Setup
- Railway: Free tier (suitable for development)
- Supabase: Free tier (suitable for development)
- Total cost: $0/month

### Production Setup
- Railway: Starter plan ($5/month)
- Supabase: Pro plan ($25/month)
- Total cost: $30/month

### High Traffic Setup
- Railway: Standard plan ($20/month)
- Supabase: Pro plan ($25/month)
- CDN: Cloudflare (free)
- Total cost: $45/month

## Security

### Environment Variables
- Never commit `.env` to GitHub
- Use `.env.example` for reference
- Rotate secrets regularly

### Database
- Use Supabase's built-in authentication
- Enable row-level security (RLS)
- Regular backups

### API
- Use Laravel Sanctum for authentication
- Rate limiting enabled
- CORS configured

### Frontend
- HTTPS only
- Content Security Policy
- XSS protection

## Backup Strategy

### Database
- Supabase automatic backups (daily)
- Manual backups before major changes
- Export data regularly

### Code
- GitHub repository (version control)
- Regular commits
- Tag releases

### Files
- Supabase Storage for uploads
- Regular cleanup of old files

---

**Last Updated**: March 12, 2026  
**Status**: Production Ready  
**Repository**: https://github.com/eclipse31-dev/TinyLearn
