# 🎯 Deploy with Supabase - Super Simple Guide

## 🚀 3 Services, 15 Minutes, $0 Cost

**Stack:**
- Vercel → React Frontend
- Railway → Laravel Backend  
- Supabase → PostgreSQL Database

---

## ⚡ Quick Start (Follow in Order)

### 1️⃣ Create Database (3 min)
👉 https://supabase.com/dashboard

1. Sign in with GitHub
2. Click "New Project"
3. Name: `tinylearn`
4. Password: [Create strong password - SAVE IT!]
5. Region: Choose closest
6. Click "Create"
7. Wait 2 minutes

**Get Connection Info:**
- Settings → Database → Connection string → URI
- Copy it: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`

---

### 2️⃣ Deploy Frontend (5 min)
👉 https://vercel.com/new

1. Import: `eclipse31-dev/TinyLearn`
2. Root Directory: `react`
3. Click "Deploy"
4. Save URL: `https://your-app.vercel.app`

---

### 3️⃣ Deploy Backend (7 min)
👉 https://railway.app/new

1. Deploy from GitHub: `eclipse31-dev/TinyLearn`
2. Add these variables:

**Copy-paste these:**
```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:6BNJDemix3Oeo9WeJFC7UcQ5Rw3Gi2Ohl0kIJJL2bbw=
SESSION_DRIVER=file
BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

**Add your Supabase details:**
```
DB_CONNECTION=pgsql
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
```

3. Generate Domain → Save URL: `https://your-app.railway.app`
4. Add: `APP_URL=https://your-app.railway.app`

---

### 4️⃣ Connect Services (2 min)

**Vercel:**
- Settings → Environment Variables
- Add: `VITE_API_BASE_URL` = Railway URL
- Redeploy

**Railway:**
- Variables
- Add: `CORS_ALLOWED_ORIGINS` = Vercel URL

---

## ✅ Test Your App

Open your Vercel URL:
- [ ] Can see login page?
- [ ] Can register?
- [ ] Can login?
- [ ] Can create course?

**✅ Working? DONE! 🎉**

---

## 🆘 Quick Fixes

**"Failed to fetch"**
→ Check VITE_API_BASE_URL in Vercel

**CORS error**
→ Check CORS_ALLOWED_ORIGINS in Railway

**Database error**
→ Check Supabase credentials in Railway

**500 error**
→ Check Railway logs

---

## 📊 View Your Data

Go to Supabase Dashboard:
- Table Editor → See all data
- SQL Editor → Run queries
- Backups → Auto-backed up daily

---

## 💰 All Free!

- Vercel: 100GB/month
- Railway: $5 credit/month
- Supabase: 500MB database

**Total: $0** 🎉

---

## 🎯 Your URLs

After deployment:
- Frontend: ___________________________
- Backend: ___________________________
- Database: Supabase Dashboard

---

## 📚 Need More Help?

Check these files:
- `SUPABASE_QUICK_START.md` - Detailed Supabase setup
- `DEPLOY_WITH_SUPABASE.md` - Complete deployment guide
- `START_HERE.md` - Alternative deployment method

---

**Ready? Start with Step 1 above! 🚀**
