# Supabase Deployment - Final Checklist

**Status**: Ready to Deploy  
**Project**: TinyLearn LMS  
**Date**: March 12, 2026

---

## Your Supabase Project

```
Project URL: https://wlcguodooyitrecgcauu.supabase.co
Project Ref: wlcguodooyitrecgcauu
```

---

## Deployment Checklist

### Phase 1: Database Setup (5 minutes)

- [ ] **Get Supabase Password**
  - Go to: https://app.supabase.com
  - Select project: tinylearn
  - Settings → Database
  - Copy password from connection string
  - Save it safely!

- [ ] **Import Database**
  - Go to SQL Editor
  - Create new query
  - Copy all from `create_database_postgresql.sql`
  - Paste into editor
  - Click "Run"
  - Wait for success ✅

- [ ] **Verify Tables**
  - Click "Table Editor"
  - See all 25 tables created
  - Check sample data (admin user, roles)

### Phase 2: Environment Configuration (5 minutes)

- [ ] **Update Backend .env**
  - Copy from `.env.supabase`
  - Replace `YOUR_SUPABASE_PASSWORD_HERE` with actual password
  - Keep other placeholders for now (update after deployment)

- [ ] **Update Frontend .env**
  - Copy from `react/.env.supabase`
  - Paste into `react/.env.local`
  - Keep placeholders for now

### Phase 3: Backend Deployment (10 minutes)

- [ ] **Create Railway Project**
  - Go to: https://railway.app
  - Click "New Project"
  - Select "GitHub Repo"
  - Connect GitHub account
  - Select `tinylearn` repository

- [ ] **Add Environment Variables**
  - Click your service
  - Go to "Variables" tab
  - Add all variables from `.env`:
    - DB_CONNECTION=pgsql
    - DB_HOST=wlcguodooyitrecgcauu.supabase.co
    - DB_PORT=5432
    - DB_DATABASE=postgres
    - DB_USERNAME=postgres
    - DB_PASSWORD=YOUR_PASSWORD
    - SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
    - SUPABASE_ANON_KEY=eyJhbGc...
    - APP_NAME=TinyLearn
    - APP_ENV=production
    - APP_DEBUG=false
    - BROADCAST_CONNECTION=reverb
    - REVERB_PORT=443
    - REVERB_SCHEME=https

- [ ] **Set Build Command**
  - Go to "Settings"
  - Build Command: `composer install && php artisan migrate --force`
  - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`

- [ ] **Deploy**
  - Click "Deploy"
  - Wait for deployment (5-10 minutes)
  - Copy Railway domain (e.g., tinylearn-api.railway.app)
  - Save it!

### Phase 4: Frontend Deployment (10 minutes)

- [ ] **Create Vercel Project**
  - Go to: https://vercel.com
  - Click "New Project"
  - Select "Import Git Repository"
  - Select `tinylearn` repository

- [ ] **Configure Build**
  - Settings → General
  - Framework: Vite
  - Build Command: `cd react && npm install && npm run build`
  - Output Directory: `react/dist`
  - Root Directory: `.`

- [ ] **Add Environment Variables**
  - Settings → Environment Variables
  - Add:
    - VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
    - VITE_SUPABASE_ANON_KEY=eyJhbGc...
    - VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
    - VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN
    - VITE_REVERB_PORT=443
    - VITE_REVERB_SCHEME=https
    - VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp

- [ ] **Deploy**
  - Click "Deploy"
  - Wait for deployment (5-10 minutes)
  - Copy Vercel domain (e.g., tinylearn.vercel.app)
  - Save it!

### Phase 5: Configuration Update (5 minutes)

- [ ] **Update .env with Domains**
  - Replace `your-railway-domain.railway.app` with actual Railway domain
  - Replace `your-vercel-domain.vercel.app` with actual Vercel domain
  - Update SANCTUM_STATEFUL_DOMAINS
  - Update REVERB_HOST

- [ ] **Update react/.env.local with Domains**
  - Replace `your-railway-domain.railway.app` with actual Railway domain
  - Update VITE_API_URL
  - Update VITE_REVERB_HOST

- [ ] **Update CORS**
  - Edit `config/cors.php`
  - Update `allowed_origins`:
    ```php
    'allowed_origins' => [
        'https://YOUR_VERCEL_DOMAIN.vercel.app',
        'https://YOUR_RAILWAY_DOMAIN.railway.app',
    ],
    ```

- [ ] **Commit and Push**
  - `git add .env config/cors.php react/.env.local`
  - `git commit -m "config: Update domains for production"`
  - `git push origin main`
  - Both services auto-redeploy

### Phase 6: Testing (5 minutes)

- [ ] **Test Frontend**
  - Go to your Vercel domain
  - Page loads successfully
  - No errors in console

- [ ] **Test Login**
  - Email: admin@example.com
  - Password: password
  - Login successful

- [ ] **Test Features**
  - Create a course
  - Invite a student
  - Accept invitation
  - Unenroll from course
  - Check notifications

- [ ] **Test Real-time**
  - Open in two browser windows
  - Create announcement in one
  - See it appear in other (real-time)

---

## Domains You'll Get

### Railway
- Format: `https://YOUR_PROJECT-api.railway.app`
- Example: `https://tinylearn-api.railway.app`
- Used for: Backend API, WebSocket

### Vercel
- Format: `https://YOUR_PROJECT.vercel.app`
- Example: `https://tinylearn.vercel.app`
- Used for: Frontend React app

---

## Environment Variables Reference

### Backend (.env)
```
# Database
DB_CONNECTION=pgsql
DB_HOST=wlcguodooyitrecgcauu.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD

# Supabase
SUPABASE_PROJECT_URL=https://wlcguodooyitrecgcauu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR_RAILWAY_DOMAIN

# Broadcasting
BROADCAST_CONNECTION=reverb
REVERB_HOST=YOUR_RAILWAY_DOMAIN
REVERB_PORT=443
REVERB_SCHEME=https

# CORS
SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_DOMAIN
SESSION_DOMAIN=.railway.app
```

### Frontend (react/.env.local)
```
VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
```

---

## Test Credentials

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

## Troubleshooting

### Database Connection Error
- Check DB_PASSWORD is correct
- Verify DB_HOST is correct
- Check network connectivity

### Frontend Not Loading
- Check VITE_API_URL is correct
- Verify Vercel environment variables
- Check browser console for errors

### API Not Responding
- Check Railway logs
- Verify database connection
- Check environment variables

### Real-time Not Working
- Check REVERB_HOST is correct
- Verify REVERB_PORT is 443
- Check REVERB_SCHEME is https

---

## Total Time

| Phase | Time |
|-------|------|
| Database Setup | 5 min |
| Environment Config | 5 min |
| Backend Deployment | 10 min |
| Frontend Deployment | 10 min |
| Configuration Update | 5 min |
| Testing | 5 min |
| **Total** | **40 min** |

---

## Files You'll Need

- `.env.supabase` - Backend template
- `react/.env.supabase` - Frontend template
- `create_database_postgresql.sql` - Database schema
- `SUPABASE_CREDENTIALS_SETUP.md` - Detailed setup guide
- `config/cors.php` - CORS configuration

---

## After Deployment

### Monitoring
- Check Railway logs regularly
- Monitor Vercel analytics
- Set up error tracking (optional)

### Backups
- Supabase automatic backups (included)
- Export database weekly (optional)

### Scaling
- Railway auto-scales on demand
- Vercel auto-scales on demand
- Supabase scales automatically

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **GitHub**: https://github.com/eclipse31-dev/TinyLearn

---

## Summary

✅ **Database**: Supabase PostgreSQL  
✅ **Backend**: Railway (Laravel)  
✅ **Frontend**: Vercel (React)  
✅ **Real-time**: Reverb WebSocket  
✅ **Cost**: ~$10/month  
✅ **Uptime**: 99.9%+  

---

**Ready to deploy?** Follow the checklist above! 🚀

**Total time to production: ~40 minutes**
