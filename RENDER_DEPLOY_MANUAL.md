# 🚀 Deploy Backend to Render - Manual Steps

## ⚠️ Important: Configure Correctly

Render tried to build the React app instead of Laravel. Follow these EXACT steps:

---

## Step 1: Go to Render Dashboard

👉 **https://dashboard.render.com**

If not signed up:
1. Click "Get Started"
2. Sign up with GitHub (FREE, no card!)

---

## Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect account" if needed
4. Find and select: `eclipse31-dev/TinyLearn`
5. Click "Connect"

---

## Step 3: Configure Service (IMPORTANT!)

Fill in EXACTLY as shown:

### Basic Settings:
```
Name: tinylearn-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: (leave EMPTY)
```

### Build Settings:
```
Runtime: PHP
PHP Version: 8.2 (or latest)
Build Command: composer install --no-dev --optimize-autoloader
Start Command: php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

### Instance Type:
```
Plan: Free
```

---

## Step 4: Add Environment Variables

Click "Advanced" → Scroll to "Environment Variables"

Add these ONE BY ONE (click "Add Environment Variable" for each):

### Required Variables:

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
DB_PORT=5432
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

### Database Variables (from Supabase):

**If you have Supabase connection string:**
Example: `postgresql://postgres.abc:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

Extract and add:

```
DB_HOST=aws-0-us-east-1.pooler.supabase.com
```

```
DB_DATABASE=postgres
```

```
DB_USERNAME=postgres.abc
```

```
DB_PASSWORD=your-supabase-password
```

### URLs (Add after deployment):

```
APP_URL=https://tinylearn-backend.onrender.com
```
(Replace with YOUR actual Render URL after it's generated)

```
CORS_ALLOWED_ORIGINS=https://tinylearn-9a0f9.web.app
```
(Your Firebase URL)

---

## Step 5: Create Web Service

1. Click "Create Web Service" button at bottom
2. Wait 5-8 minutes for deployment
3. Watch the logs for any errors

---

## Step 6: Get Your Backend URL

Once deployed:
1. You'll see: "Your service is live 🎉"
2. Copy your URL (e.g., `https://tinylearn-backend.onrender.com`)
3. **SAVE THIS URL!**

---

## Step 7: Update APP_URL

1. Go to "Environment" tab
2. Find `APP_URL`
3. Update with your actual Render URL
4. Click "Save Changes"
5. Service will auto-redeploy (2-3 min)

---

## Step 8: Connect Frontend to Backend

### Update Firebase Frontend:

Create file: `react/.env.production`
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

### Rebuild and Deploy:
```bash
cd react
npm run build
npx firebase deploy
```

---

## ✅ Test Your App

Open: **https://tinylearn-9a0f9.web.app**

Try:
- [ ] Can see login page?
- [ ] Can register new account?
- [ ] Can login?
- [ ] Can create course?

**If everything works: 🎉 SUCCESS!**

---

## 🆘 Troubleshooting

### Build fails with "composer not found"
- Make sure Runtime is set to "PHP"
- Check PHP version is 8.2+

### "Class not found" errors
- Check APP_KEY is set correctly
- Run: `composer install --optimize-autoloader`

### Database connection errors
- Verify all DB_* variables are correct
- Check Supabase project is active
- Test connection string

### CORS errors
- Check CORS_ALLOWED_ORIGINS matches Firebase URL exactly
- Include `https://` in the URL
- Redeploy after changing

### App is slow
- Normal! Free tier sleeps after 15 min
- First request takes ~30 seconds
- Use UptimeRobot to keep awake

---

## 📊 Check Deployment Status

### Render Dashboard:
- **Logs**: View build and runtime logs
- **Events**: See deployment history
- **Metrics**: CPU and memory usage
- **Shell**: Access terminal

---

## 🎯 Your URLs

**Frontend (Firebase):**
```
https://tinylearn-9a0f9.web.app
```

**Backend (Render):**
```
https://your-backend.onrender.com
```

**Database (Supabase):**
```
https://supabase.com/dashboard
```

---

## 💡 Pro Tips

1. **Check Logs**: If deployment fails, check logs in Render dashboard
2. **Environment Variables**: Double-check all variables are set
3. **Database**: Make sure Supabase project is active
4. **CORS**: Must match Firebase URL exactly
5. **Free Tier**: App sleeps after 15 min, wakes in 30 sec

---

## 🔄 Redeploy

If you need to redeploy:
1. Go to Render Dashboard
2. Click your service
3. Click "Manual Deploy" → "Deploy latest commit"

Or push to GitHub (auto-deploys):
```bash
git push origin main
```

---

**Need help? Check the logs in Render dashboard!**
