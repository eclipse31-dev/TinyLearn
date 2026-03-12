# Supabase Deployment Checklist

**Status**: Ready to Deploy  
**Estimated Time**: 10-15 minutes

---

## Pre-Deployment

- [ ] GitHub account created
- [ ] Supabase account created (https://supabase.com)
- [ ] Vercel account created (https://vercel.com)
- [ ] Code pushed to GitHub

---

## Step 1: Create Supabase Project (2 min)

- [ ] Go to https://supabase.com
- [ ] Sign up with GitHub
- [ ] Click "New Project"
- [ ] Project name: `tinylearn`
- [ ] Generate strong database password
- [ ] Choose region closest to you
- [ ] Select Free tier
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for database creation

---

## Step 2: Get Database Connection (1 min)

- [ ] Go to Settings → Database
- [ ] Copy Connection string (URI format)
- [ ] Save for later: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

---

## Step 3: Create Tables (2 min)

- [ ] Go to SQL Editor
- [ ] Click "New Query"
- [ ] Paste SQL from DEPLOY_SUPABASE.md (Step 3)
- [ ] Click "Run"
- [ ] Verify tables created

---

## Step 4: Setup Authentication (2 min)

- [ ] Go to Authentication → Providers
- [ ] Verify Email is enabled
- [ ] Enable Google OAuth:
  - [ ] Go to Google Cloud Console
  - [ ] Create OAuth 2.0 credentials
  - [ ] Copy Client ID and Secret
  - [ ] Paste in Supabase
- [ ] Click "Save"

---

## Step 5: Get API Keys (1 min)

- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy anon public key
- [ ] Copy service_role key (for backend)

---

## Step 6: Update Environment Files (2 min)

### Backend (.env)
- [ ] DB_CONNECTION=pgsql
- [ ] DB_HOST=YOUR_SUPABASE_HOST.supabase.co
- [ ] DB_PORT=5432
- [ ] DB_DATABASE=postgres
- [ ] DB_USERNAME=postgres
- [ ] DB_PASSWORD=YOUR_PASSWORD
- [ ] APP_URL=https://your-backend-domain.com
- [ ] SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com

### Frontend (react/.env.local)
- [ ] VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
- [ ] VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
- [ ] VITE_API_URL=https://your-backend-domain.com

---

## Step 7: Deploy Backend (2 min)

### Option A: Railway (Recommended)
- [ ] Go to https://railway.app
- [ ] Click "New Project"
- [ ] Select "GitHub Repo"
- [ ] Connect GitHub account
- [ ] Select `tinylearn` repository
- [ ] Add environment variables from .env
- [ ] Set build command: `composer install && php artisan migrate --force`
- [ ] Deploy

### Option B: Vercel
- [ ] Go to https://vercel.com
- [ ] Import GitHub repo
- [ ] Configure as Node.js
- [ ] Add environment variables
- [ ] Deploy

---

## Step 8: Deploy Frontend (1 min)

- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import GitHub repo
- [ ] Framework: Vite
- [ ] Build Command: `cd react && npm install && npm run build`
- [ ] Output Directory: `react/dist`
- [ ] Add environment variables from react/.env.local
- [ ] Deploy

---

## Step 9: Run Migrations (1 min)

- [ ] Connect to Supabase database
- [ ] Run: `php artisan migrate --force`
- [ ] Or use Supabase SQL Editor

---

## Step 10: Test Deployment (2 min)

- [ ] Go to Vercel frontend URL
- [ ] Login with: admin@example.com / password
- [ ] Test: Create course
- [ ] Test: Invite student
- [ ] Test: Accept invitation
- [ ] Test: Unenroll

---

## Post-Deployment

- [ ] Verify all features working
- [ ] Test real-time notifications
- [ ] Check database connection
- [ ] Monitor logs for errors
- [ ] Setup monitoring/alerts
- [ ] Configure backups

---

## Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/eclipse31-dev/TinyLearn

---

## Troubleshooting

### Database Connection Error
- Check credentials in .env
- Verify Supabase host and port
- Check network connectivity
- Verify IP whitelist

### Frontend Not Loading
- Check Vercel environment variables
- Verify VITE_API_URL is correct
- Check browser console for errors

### API Not Responding
- Check Railway logs
- Verify database connection
- Check environment variables
- Review Laravel logs

### Real-time Not Working
- Check WebSocket configuration
- Verify Reverb settings
- Check browser console
- Review network tab

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Docs**: https://laravel.com/docs

---

**Ready to deploy?** Follow the steps above! 🚀

Estimated total time: 10-15 minutes
