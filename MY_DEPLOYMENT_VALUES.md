# 🎯 Your Deployment Values - Copy & Paste These

## ✅ Step 1: Deploy Frontend to Vercel

### Go to: https://vercel.com/new

1. Click "Import Git Repository"
2. Select: `eclipse31-dev/TinyLearn`
3. Configure Project:
   ```
   Root Directory: react
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
4. **DON'T add environment variables yet**
5. Click "Deploy"
6. Wait 2-3 minutes
7. **SAVE YOUR VERCEL URL**: _________________

---

## ✅ Step 2: Deploy Backend to Railway

### Go to: https://railway.app/new

1. Click "Deploy from GitHub repo"
2. Select: `eclipse31-dev/TinyLearn`
3. Click "Add variables" and paste these ONE BY ONE:

### Environment Variables for Railway:

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

4. Click "+ New" → "Database" → "MySQL"
   - This will automatically add DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

5. Add these additional variables:

```
DB_CONNECTION=mysql
```

6. After MySQL is added, add APP_URL:
   - Click "Generate Domain" first to get your Railway URL
   - Then add: `APP_URL=https://your-railway-url.railway.app`

7. **SAVE YOUR RAILWAY URL**: _________________

---

## ✅ Step 3: Connect Frontend to Backend

### Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your project (TinyLearn)
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
5. Add:
   ```
   Name: VITE_API_BASE_URL
   Value: [YOUR RAILWAY URL FROM STEP 2]
   Environment: Production
   ```
6. Click "Save"
7. Go to "Deployments" tab
8. Click "..." on latest deployment → "Redeploy"

---

## ✅ Step 4: Update Backend CORS

### Update Railway Environment Variables

1. Go to: https://railway.app/dashboard
2. Click on your project
3. Click "Variables"
4. Add new variable:
   ```
   Name: CORS_ALLOWED_ORIGINS
   Value: [YOUR VERCEL URL FROM STEP 1]
   ```
5. Railway will auto-redeploy

---

## ✅ Step 5: Run Database Migrations (If Needed)

If your app shows database errors:

### Option A: Via Railway Dashboard
1. Go to Railway Dashboard
2. Click on your service
3. The migrations should run automatically on first deploy

### Option B: Via Railway CLI (if needed)
```bash
npm install -g @railway/cli
railway login
railway link
railway run php artisan migrate --force
```

---

## 🎉 Your Live App URLs

After completing all steps:

- **Frontend**: [YOUR VERCEL URL]
- **Backend**: [YOUR RAILWAY URL]
- **Test Login**: Go to frontend URL and try to register/login

---

## 🧪 Testing Checklist

- [ ] Can access frontend URL
- [ ] Can see login page
- [ ] Can register new account
- [ ] Can login
- [ ] Can create a course
- [ ] No CORS errors in browser console (F12)

---

## 🆘 Troubleshooting

### "Failed to fetch" error
- Check VITE_API_BASE_URL in Vercel settings
- Make sure Railway backend is running (check Railway dashboard)

### CORS error
- Check CORS_ALLOWED_ORIGINS in Railway
- Make sure you included https:// in the URL
- Redeploy both services

### 500 Internal Server Error
- Check Railway logs (Dashboard → Service → Deployments → View Logs)
- Make sure APP_KEY is set correctly
- Check if database is connected

### Database connection error
- Make sure MySQL database is added in Railway
- Check if DB variables are present in Railway variables
- Try redeploying

---

## 📞 Need Help?

If you get stuck:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console (F12) for frontend errors
4. Make sure all environment variables are set correctly

---

## 🔑 Important Values (Keep These Safe)

- **APP_KEY**: `base64:6BNJDemix3Oeo9WeJFC7UcQ5Rw3Gi2Ohl0kIJJL2bbw=`
- **GitHub Repo**: `eclipse31-dev/TinyLearn`
- **Vercel URL**: [Fill in after Step 1]
- **Railway URL**: [Fill in after Step 2]
