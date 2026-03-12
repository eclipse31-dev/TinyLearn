# Supabase Quick Start - 10 Minutes

**Goal**: Deploy TinyLearn LMS to Supabase + Vercel + Railway

---

## What You'll Get

✅ **Backend**: Running on Railway ($5/month)  
✅ **Database**: PostgreSQL on Supabase ($0-25/month)  
✅ **Frontend**: Running on Vercel (free)  
✅ **Real-time**: WebSocket via Reverb  
✅ **Total Cost**: $5-30/month  
✅ **Uptime**: 99.9%+

---

## 5-Step Quick Start

### Step 1: Create Supabase Project (2 min)

```
1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New Project"
4. Name: tinylearn
5. Generate password (save it!)
6. Choose region
7. Click "Create"
8. Wait 2-3 minutes
```

**Save**: Database password, Project URL, API keys

---

### Step 2: Create Tables (2 min)

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy SQL from DEPLOY_SUPABASE.md (Step 3)
4. Click **Run**

**Done**: All tables created

---

### Step 3: Deploy Backend to Railway (2 min)

```
1. Go to https://railway.app
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect GitHub
5. Select tinylearn repo
6. Add .env variables:
   - DB_HOST=YOUR_SUPABASE_HOST.supabase.co
   - DB_PASSWORD=YOUR_PASSWORD
   - DB_USERNAME=postgres
   - DB_DATABASE=postgres
7. Build: composer install && php artisan migrate --force
8. Deploy
```

**Save**: Railway domain (e.g., tinylearn-api.railway.app)

---

### Step 4: Deploy Frontend to Vercel (2 min)

```
1. Go to https://vercel.com
2. Click "New Project"
3. Import tinylearn repo
4. Framework: Vite
5. Build: cd react && npm install && npm run build
6. Output: react/dist
7. Add env vars:
   - VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   - VITE_SUPABASE_ANON_KEY=YOUR_KEY
   - VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
8. Deploy
```

**Save**: Vercel domain (e.g., tinylearn.vercel.app)

---

### Step 5: Test (1 min)

```
1. Go to https://YOUR_VERCEL_DOMAIN.vercel.app
2. Login: admin@example.com / password
3. Create course
4. Invite student
5. Accept invitation
6. Unenroll
```

**Done**: System is live! 🎉

---

## Environment Variables

### Backend (.env)

```env
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR_RAILWAY_DOMAIN

DB_CONNECTION=pgsql
DB_HOST=YOUR_SUPABASE_HOST.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD

BROADCAST_CONNECTION=reverb
REVERB_HOST=YOUR_RAILWAY_DOMAIN
REVERB_PORT=443
REVERB_SCHEME=https

SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_DOMAIN
SESSION_DOMAIN=.railway.app
```

### Frontend (react/.env.local)

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
VITE_REVERB_HOST=YOUR_RAILWAY_DOMAIN
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

---

## Get Your Credentials

### From Supabase
1. Go to Settings → API
2. Copy: Project URL
3. Copy: anon public key
4. Go to Settings → Database
5. Copy: Connection string

### From Railway
1. Go to your service
2. Go to Settings
3. Copy: Public URL

### From Vercel
1. Go to your project
2. Copy: Domain

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

### Database Connection Failed
- Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
- Verify Supabase project is running
- Check network connectivity

### Frontend Not Loading
- Check VITE_API_URL is correct
- Verify Vercel environment variables
- Check browser console (F12)

### API Not Responding
- Check Railway logs
- Verify database connection
- Check Laravel logs

### Real-time Not Working
- Check Reverb configuration
- Verify WebSocket port (443)
- Check browser network tab

---

## Next Steps

1. ✅ Deploy to Supabase
2. ✅ Test all features
3. ✅ Invite team members
4. ✅ Start using with students
5. ✅ Setup monitoring
6. ✅ Configure backups

---

## Useful Links

- **Supabase**: https://app.supabase.com
- **Railway**: https://railway.app/dashboard
- **Vercel**: https://vercel.com/dashboard
- **GitHub**: https://github.com/eclipse31-dev/TinyLearn

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs

---

**Total Time**: 10 minutes  
**Total Cost**: $5-30/month  
**Status**: Production Ready

🚀 **Let's deploy!**
