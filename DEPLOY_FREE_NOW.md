# 🎯 Deploy FREE - Start Here!

## 💰 100% FREE - No Credit Card - 20 Minutes

---

## 🚀 3 Simple Steps

### STEP 1: Database (3 min)
👉 **https://supabase.com/dashboard**

1. Sign in with GitHub
2. New Project → Name: `tinylearn`
3. Create password (SAVE IT!)
4. Wait 2 minutes
5. Settings → Database → Copy "URI" connection string

**✏️ Save:** ___________________________

---

### STEP 2: Frontend (5 min)
👉 **https://vercel.com/new**

1. Sign in with GitHub
2. Import: `eclipse31-dev/TinyLearn`
3. Root Directory: `react`
4. Deploy
5. Wait 3 minutes

**✏️ Save URL:** ___________________________

---

### STEP 3: Backend (10 min)
👉 **https://dashboard.render.com/select-repo**

1. Sign up with GitHub
2. New + → Web Service
3. Connect: `eclipse31-dev/TinyLearn`
4. Settings:
   ```
   Name: tinylearn
   Runtime: PHP
   Build: composer install --no-dev --optimize-autoloader
   Start: php artisan serve --host=0.0.0.0 --port=$PORT
   Plan: Free
   ```

5. Add Environment Variables (copy these):
   ```
   APP_NAME=TinyLearn
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:6BNJDemix3Oeo9WeJFC7UcQ5Rw3Gi2Ohl0kIJJL2bbw=
   DB_CONNECTION=pgsql
   DB_PORT=5432
   SESSION_DRIVER=file
   BROADCAST_DRIVER=log
   CACHE_DRIVER=file
   QUEUE_CONNECTION=sync
   FILESYSTEM_DISK=local
   ```

6. Add YOUR Supabase details:
   ```
   DB_HOST=[from Step 1]
   DB_DATABASE=postgres
   DB_USERNAME=[from Step 1]
   DB_PASSWORD=[from Step 1]
   APP_URL=[your Render URL]
   ```

7. Create Web Service
8. Wait 8 minutes

**✏️ Save URL:** ___________________________

---

## 🔗 Connect Them (3 min)

### Vercel:
1. Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL` = [Render URL]
3. Deployments → Redeploy

### Render:
1. Dashboard → Your Service → Environment
2. Add: `CORS_ALLOWED_ORIGINS` = [Vercel URL]
3. Auto-redeploys

---

## ✅ Test

Open your Vercel URL:
- [ ] See login page?
- [ ] Can register?
- [ ] Can login?

**✅ Works? DONE! 🎉**

---

## 🆘 Problems?

**"Failed to fetch"**
→ Check VITE_API_BASE_URL in Vercel

**CORS error**
→ Check CORS_ALLOWED_ORIGINS in Render

**Slow first load**
→ Normal! Render free tier sleeps. Wait 30 sec.

---

## 📚 Need More Details?

See: **`FREE_FULL_STACK_DEPLOY.md`**

---

## 💰 Cost Breakdown

- Vercel: FREE ✅
- Render: FREE ✅
- Supabase: FREE ✅
- Credit Card: NOT NEEDED ✅

**Total: $0 Forever!**

---

**Ready? Start with Step 1! 🚀**
