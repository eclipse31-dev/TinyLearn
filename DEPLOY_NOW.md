# 🚀 Deploy Your App NOW - Simple Steps

## Option 1: Deploy via Vercel Website (EASIEST - 5 minutes)

### Step 1: Deploy Frontend
1. Open: https://vercel.com/new
2. Click "Import Git Repository"
3. Find and select: `eclipse31-dev/TinyLearn`
4. Configure:
   - **Root Directory**: Click "Edit" and type: `react`
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `dist` (should auto-fill)
5. Click "Deploy" (Don't add environment variables yet)
6. Wait 2-3 minutes for deployment
7. Copy your Vercel URL (e.g., `https://tiny-learn-xyz.vercel.app`)

### Step 2: Deploy Backend
1. Open: https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select: `eclipse31-dev/TinyLearn`
4. Click "Add variables" and add these:

```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=${{MYSQL.MYSQL_HOST}}
DB_PORT=${{MYSQL.MYSQL_PORT}}
DB_DATABASE=${{MYSQL.MYSQL_DATABASE}}
DB_USERNAME=${{MYSQL.MYSQL_USER}}
DB_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}

SESSION_DRIVER=file
BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

5. Click "+ New" → "Database" → "MySQL" (this will auto-fill DB variables)
6. Wait for deployment (3-5 minutes)
7. Copy your Railway URL (e.g., `https://tinylearn.railway.app`)

### Step 3: Generate APP_KEY
1. Open your terminal
2. Run: `php artisan key:generate --show`
3. Copy the output (e.g., `base64:abc123...`)
4. Go back to Railway → Variables
5. Add new variable:
   - Name: `APP_KEY`
   - Value: (paste the key you copied)
6. Railway will auto-redeploy

### Step 4: Connect Frontend to Backend
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Railway URL (e.g., `https://tinylearn.railway.app`)
   - **Environment**: Production
5. Click "Save"
6. Go to "Deployments" tab
7. Click the "..." menu on the latest deployment
8. Click "Redeploy"

### Step 5: Update CORS
1. Go to Railway Dashboard
2. Click on your project → Variables
3. Add new variable:
   - **Name**: `CORS_ALLOWED_ORIGINS`
   - **Value**: Your Vercel URL (e.g., `https://tiny-learn-xyz.vercel.app`)
4. Railway will auto-redeploy

## ✅ Done! Test Your App

1. Visit your Vercel URL
2. Try to register/login
3. If you see CORS errors, double-check Step 5

---

## Option 2: Deploy via CLI (For Advanced Users)

### Deploy Frontend
```bash
cd react
npx vercel --prod
```

### Deploy Backend
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

---

## 🆘 Having Issues?

### Frontend shows "Failed to fetch"
- Check if VITE_API_BASE_URL is set correctly in Vercel
- Make sure Railway backend is running
- Check CORS_ALLOWED_ORIGINS in Railway

### Backend shows 500 error
- Check if APP_KEY is set in Railway
- Check if database is connected
- View logs in Railway dashboard

### Database errors
- Make sure MySQL database is added in Railway
- Check if DB variables are auto-filled
- Try running migrations manually:
  ```bash
  railway run php artisan migrate --force
  ```

---

## 📱 Your Live URLs

After deployment, save these:
- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-project.railway.app
- **Database**: Managed by Railway

---

## 🎉 Success Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] MySQL database created
- [ ] APP_KEY generated and set
- [ ] VITE_API_BASE_URL set in Vercel
- [ ] CORS_ALLOWED_ORIGINS set in Railway
- [ ] Can access frontend URL
- [ ] Can register/login
- [ ] No CORS errors

---

## 💡 Pro Tips

1. **Auto-deploy**: Both Vercel and Railway will auto-deploy when you push to GitHub
2. **View logs**: Check deployment logs in dashboards if something fails
3. **Environment variables**: Always set in dashboard, never commit .env files
4. **Database**: Railway provides free 500MB MySQL database
5. **Custom domain**: You can add custom domains in both Vercel and Railway settings

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

---

Need more help? Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting!
