# 🚀 Deploy with Vercel + Railway + Supabase

## Why This Stack?
- **Vercel**: React frontend (Fast, global CDN)
- **Railway**: Laravel backend (Easy PHP hosting)
- **Supabase**: PostgreSQL database (Free 500MB, better than MySQL)

---

## 📋 Prerequisites
- GitHub account ✅
- Vercel account ✅
- Railway account (sign up with GitHub)
- Supabase account (sign up with GitHub)

---

## STEP 1: Create Supabase Database (5 min)

### 1.1 Create Project
👉 https://supabase.com/dashboard

1. Click "New Project"
2. Fill in:
   - **Name**: `tinylearn`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. ⏰ Wait 2-3 minutes for database to be ready

### 1.2 Get Database Connection Details
1. Go to "Project Settings" (gear icon)
2. Click "Database" in sidebar
3. Scroll to "Connection string"
4. Copy the "URI" connection string
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

**✏️ Save your connection string:** ___________________________

### 1.3 Update Laravel for PostgreSQL
We need to change from MySQL to PostgreSQL.

---

## STEP 2: Update Laravel Configuration

### 2.1 Update Database Config
Open `.env` file and change:

```env
DB_CONNECTION=pgsql
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
```

### 2.2 Test Locally (Optional)
```bash
php artisan migrate
```

If it works, you're ready to deploy!

---

## STEP 3: Deploy Frontend to Vercel (5 min)

👉 https://vercel.com/new

1. Click "Import Git Repository"
2. Select: `eclipse31-dev/TinyLearn`
3. Configure:
   - **Root Directory**: `react`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"
5. ⏰ Wait 2-3 minutes
6. **✏️ Save your Vercel URL:** ___________________________

---

## STEP 4: Deploy Backend to Railway (8 min)

👉 https://railway.app/new

### 4.1 Create Project
1. Click "Deploy from GitHub repo"
2. Select: `eclipse31-dev/TinyLearn`

### 4.2 Add Environment Variables
Click "Variables" and add these ONE BY ONE:

```
APP_NAME=TinyLearn
```

```
APP_ENV=production
```

```
APP_DEBUG=false
```

```
APP_KEY=base64:6BNJDemix3Oeo9WeJFC7UcQ5Rw3Gi2Ohl0kIJJL2bbw=
```

```
DB_CONNECTION=pgsql
```

```
DB_HOST=db.xxx.supabase.co
```
(Replace with your Supabase host from Step 1.2)

```
DB_PORT=5432
```

```
DB_DATABASE=postgres
```

```
DB_USERNAME=postgres
```

```
DB_PASSWORD=your-supabase-password
```
(Your password from Step 1.1)

```
SESSION_DRIVER=file
```

```
BROADCAST_DRIVER=log
```

```
CACHE_DRIVER=file
```

```
QUEUE_CONNECTION=sync
```

```
FILESYSTEM_DISK=local
```

### 4.3 Generate Domain
1. Click "Settings" → "Networking"
2. Click "Generate Domain"
3. **✏️ Save your Railway URL:** ___________________________

### 4.4 Add APP_URL
Go back to "Variables" and add:
```
APP_URL=https://your-railway-url.railway.app
```

⏰ Wait 3-5 minutes for deployment

---

## STEP 5: Connect Frontend to Backend (2 min)

### 5.1 Update Vercel
👉 https://vercel.com/dashboard

1. Click your "TinyLearn" project
2. Go to "Settings" → "Environment Variables"
3. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Railway URL
   - **Environment**: Production
4. Click "Save"
5. Go to "Deployments" → "..." → "Redeploy"

### 5.2 Update Railway CORS
👉 https://railway.app/dashboard

1. Click your project
2. Go to "Variables"
3. Add:
   - **Name**: `CORS_ALLOWED_ORIGINS`
   - **Value**: Your Vercel URL
4. Railway will auto-redeploy

---

## STEP 6: Run Migrations (2 min)

### Option A: Automatic (Recommended)
Railway should run migrations automatically on first deploy.

### Option B: Manual (If needed)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Run migrations
railway run php artisan migrate --force
```

---

## STEP 7: Test Your App! 🎉

**Open your Vercel URL**

Test:
- [ ] Can see login page
- [ ] Can register account
- [ ] Can login
- [ ] Can create course
- [ ] No errors in console (F12)

**✅ If everything works: CONGRATULATIONS! 🎊**

---

## 🆘 Troubleshooting

### "Failed to fetch" error
**Fix:**
1. Check `VITE_API_BASE_URL` in Vercel
2. Make sure Railway backend is running
3. Check Railway logs for errors

### CORS error
**Fix:**
1. Check `CORS_ALLOWED_ORIGINS` in Railway
2. Make sure URL includes `https://`
3. Redeploy both services

### Database connection error
**Fix:**
1. Check Supabase connection string
2. Verify DB_HOST, DB_PASSWORD in Railway
3. Make sure Supabase project is active
4. Check Railway logs: `railway logs`

### 500 Internal Server Error
**Fix:**
1. Check Railway logs
2. Verify APP_KEY is set
3. Check database connection
4. Run migrations manually

---

## 📊 Supabase Database Management

### View Your Data
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. You can see all your tables and data

### Run SQL Queries
1. Go to "SQL Editor"
2. Run custom queries
3. View query results

### Backup Database
1. Go to "Database" → "Backups"
2. Supabase auto-backs up daily
3. You can restore from any backup

---

## 💰 Pricing (All Free Tier)

- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 free credit/month
- **Supabase**: 500MB database, 2GB bandwidth

**Total Cost**: $0 for small projects! 🎉

---

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Use strong database password**
3. **Enable Row Level Security in Supabase** (optional)
4. **Set APP_DEBUG=false in production**
5. **Use HTTPS only** (automatic with Vercel/Railway)

---

## 📱 Your Live URLs

After deployment:
- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-project.railway.app
- **Database**: Managed by Supabase

---

## 🎯 Summary of What You Did

✅ Created PostgreSQL database on Supabase
✅ Deployed React frontend to Vercel
✅ Deployed Laravel backend to Railway
✅ Connected all three services
✅ Configured environment variables
✅ Ran database migrations
✅ Tested the application

**Your full-stack LMS is now live! 🚀**

---

## 🔄 Auto-Deploy

Every time you push to GitHub:
- Vercel rebuilds frontend automatically
- Railway redeploys backend automatically
- No manual deployment needed!

---

## 📚 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs

---

## 🎓 Next Steps

1. **Add Custom Domain**: Configure in Vercel settings
2. **Set Up Email**: Configure mail settings in Railway
3. **Enable Backups**: Supabase auto-backs up daily
4. **Monitor Usage**: Check dashboards regularly
5. **Scale Up**: Upgrade plans as you grow

---

## 💡 Pro Tips

1. **Supabase Studio**: Use it to manage your database visually
2. **Railway Logs**: Check logs if something breaks
3. **Vercel Analytics**: Enable to track visitors
4. **Environment Variables**: Update in dashboards, not in code
5. **Database Indexes**: Add indexes for better performance

---

Need help? Check the other deployment guides or ask for assistance!
