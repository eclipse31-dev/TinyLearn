# 🎉 Deploy Full Stack - 100% FREE (No Credit Card!)

## 🚀 Complete Stack - Zero Cost Forever

**What You'll Deploy:**
- ✅ React Frontend → **Vercel** (Free forever)
- ✅ Laravel Backend → **Render** (Free tier, no card needed)
- ✅ PostgreSQL Database → **Supabase** (Free 500MB)

**Total Cost: $0** 💰
**Credit Card Required: NO** ❌
**Time: 20 minutes** ⏱️

---

## 📋 What You Need
- GitHub account (you have this ✅)
- Email address
- That's it!

---

## STEP 1: Create Free Database (3 min)

### Go to Supabase
👉 **https://supabase.com/dashboard**

1. Click "Sign in with GitHub" (no credit card!)
2. Click "New Project"
3. Fill in:
   ```
   Organization: Create new (your name)
   Name: tinylearn
   Database Password: [Create strong password - SAVE IT!]
   Region: Choose closest to you
   Plan: Free (default)
   ```
4. Click "Create new project"
5. ⏰ Wait 2 minutes

### Get Database Connection
1. Click "Project Settings" (gear icon)
2. Click "Database"
3. Scroll to "Connection string"
4. Click "URI" tab
5. Copy the string

**Example:**
```
postgresql://postgres.abcdefg:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**✏️ SAVE THIS:** ___________________________

---

## STEP 2: Deploy Frontend to Vercel (5 min)

### Go to Vercel
👉 **https://vercel.com/signup**

1. Click "Continue with GitHub" (no credit card!)
2. Authorize Vercel

### Import Project
👉 **https://vercel.com/new**

1. Click "Import Git Repository"
2. Find: `eclipse31-dev/TinyLearn`
3. Click "Import"
4. Configure:
   - **Root Directory**: Click "Edit" → Type: `react`
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy" (don't add env vars yet)
6. ⏰ Wait 3 minutes
7. **✏️ SAVE YOUR URL:** ___________________________

---

## STEP 3: Deploy Backend to Render (10 min)

### Go to Render
👉 **https://render.com/register**

1. Click "Sign up with GitHub" (no credit card!)
2. Authorize Render

### Create Web Service
👉 **https://dashboard.render.com/select-repo**

1. Click "New +" → "Web Service"
2. Connect GitHub account if needed
3. Find and select: `eclipse31-dev/TinyLearn`
4. Click "Connect"

### Configure Service
Fill in these settings:

```
Name: tinylearn
Region: Choose closest
Branch: main
Root Directory: (leave empty)
Runtime: PHP
Build Command: composer install --no-dev --optimize-autoloader
Start Command: php artisan serve --host=0.0.0.0 --port=$PORT
Instance Type: Free
```

### Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these ONE BY ONE:

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
DB_HOST=aws-0-us-east-1.pooler.supabase.com
```
(Use YOUR Supabase host from Step 1)

```
DB_PORT=5432
```

```
DB_DATABASE=postgres
```

```
DB_USERNAME=postgres.abcdefg
```
(Use YOUR Supabase username from Step 1)

```
DB_PASSWORD=your-supabase-password
```
(Use YOUR password from Step 1)

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

```
APP_URL=https://tinylearn.onrender.com
```
(Will be your Render URL)

### Deploy
1. Click "Create Web Service"
2. ⏰ Wait 5-8 minutes (first deploy is slow)
3. **✏️ SAVE YOUR URL:** ___________________________

---

## STEP 4: Connect Frontend to Backend (2 min)

### Update Vercel
👉 **https://vercel.com/dashboard**

1. Click your "TinyLearn" project
2. Go to "Settings" → "Environment Variables"
3. Click "Add New"
4. Fill in:
   ```
   Name: VITE_API_BASE_URL
   Value: https://tinylearn.onrender.com
   ```
   (Use YOUR Render URL from Step 3)
5. Environment: Select "Production"
6. Click "Save"

### Redeploy Frontend
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. ⏰ Wait 2 minutes

---

## STEP 5: Update Backend CORS (1 min)

### Update Render
👉 **https://dashboard.render.com**

1. Click your "tinylearn" service
2. Go to "Environment" tab
3. Click "Add Environment Variable"
4. Fill in:
   ```
   Key: CORS_ALLOWED_ORIGINS
   Value: https://your-app.vercel.app
   ```
   (Use YOUR Vercel URL from Step 2)
5. Click "Save Changes"
6. Render will auto-redeploy (2-3 min)

---

## STEP 6: Run Database Migrations

### Option A: Automatic (Render Shell)
1. Go to Render Dashboard
2. Click your service
3. Click "Shell" tab (top right)
4. Wait for shell to connect
5. Run:
   ```bash
   php artisan migrate --force
   ```

### Option B: Via Render Deploy Hook
Migrations should run automatically on first deploy.

---

## ✅ TEST YOUR APP!

### Open Your Vercel URL
👉 Your frontend URL from Step 2

**Test:**
- [ ] Can see login page?
- [ ] Can register new account?
- [ ] Can login?
- [ ] Can create a course?
- [ ] No errors in console (F12)?

**✅ Everything works? CONGRATULATIONS! 🎊**

---

## 🎯 Your Live URLs

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://tinylearn.onrender.com
```

**Database (Supabase):**
```
Managed at: https://supabase.com/dashboard
```

---

## 💰 Free Tier Limits

### Vercel (Frontend)
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Global CDN
- **Cost: FREE FOREVER**

### Render (Backend)
- ✅ 750 hours/month (enough for 1 app)
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 min inactivity (wakes in 30 sec)
- **Cost: FREE FOREVER**

### Supabase (Database)
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Daily backups
- **Cost: FREE FOREVER**

---

## ⚠️ Important Notes

### Render Free Tier
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Perfect for demos and learning
- No credit card required!

### Keep App Awake (Optional)
Use a free service like **UptimeRobot**:
1. Go to: https://uptimerobot.com
2. Add your Render URL
3. Ping every 5 minutes
4. App stays awake!

---

## 🆘 Troubleshooting

### "Failed to fetch" error
**Fix:**
1. Check VITE_API_BASE_URL in Vercel
2. Make sure Render app is awake (visit URL)
3. Check Render logs for errors

### CORS error
**Fix:**
1. Check CORS_ALLOWED_ORIGINS in Render
2. Make sure URL includes `https://`
3. Redeploy Render service

### Database connection error
**Fix:**
1. Check Supabase credentials in Render
2. Verify DB_HOST, DB_USERNAME, DB_PASSWORD
3. Check Supabase project is active
4. Run migrations: `php artisan migrate --force`

### 500 Internal Server Error
**Fix:**
1. Check Render logs (Dashboard → Logs tab)
2. Verify APP_KEY is set
3. Check database connection
4. Run: `php artisan config:clear`

### Render app is slow
**Normal!** Free tier sleeps after 15 min.
- First request: ~30 seconds
- Subsequent requests: Fast
- Use UptimeRobot to keep awake

---

## 📊 View Your Data

### Supabase Dashboard
👉 **https://supabase.com/dashboard**

1. Click your project
2. **Table Editor** → View all tables and data
3. **SQL Editor** → Run custom queries
4. **Database** → View backups

---

## 🔄 Auto-Deploy

Every time you push to GitHub:
- ✅ Vercel rebuilds frontend automatically
- ✅ Render redeploys backend automatically
- ✅ No manual deployment needed!

---

## 🎓 What You Just Did

✅ Deployed React frontend to Vercel
✅ Deployed Laravel backend to Render
✅ Created PostgreSQL database on Supabase
✅ Connected all three services
✅ Configured environment variables
✅ Ran database migrations
✅ Tested the application

**Your full-stack LMS is now LIVE! 🚀**

**Total Cost: $0**
**Credit Card: Not Required**
**Deployment Time: ~20 minutes**

---

## 🎉 Success Checklist

- [ ] Supabase database created
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] CORS configured
- [ ] Migrations ran successfully
- [ ] Can access frontend URL
- [ ] Can register/login
- [ ] Can create courses
- [ ] No errors in console

---

## 💡 Pro Tips

1. **Bookmark your URLs** - Save all three dashboard URLs
2. **Check Render logs** - If something breaks, logs show why
3. **Supabase backups** - Auto-backed up daily
4. **Keep app awake** - Use UptimeRobot for faster response
5. **Monitor usage** - Check dashboards monthly

---

## 📱 Share Your App

Your app is now live and accessible to anyone!
- Share your Vercel URL with friends
- They can register and use your LMS
- No payment required from them either!

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## 🎯 Next Steps

1. **Test thoroughly** - Try all features
2. **Add custom domain** - Free in Vercel settings
3. **Monitor usage** - Check dashboards weekly
4. **Backup data** - Supabase auto-backs up
5. **Share with users** - Your LMS is ready!

---

**Need help? All services have free support forums!**

**Congratulations on deploying your full-stack app! 🎊**
