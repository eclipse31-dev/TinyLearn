# Quick Deployment Steps

## ✅ What's Been Done

1. ✅ Created centralized API configuration (`react/src/config/api.js`)
2. ✅ Updated React components to use environment variables
3. ✅ Created Vercel configuration (`react/vercel.json`)
4. ✅ Created Railway configuration (`railway.json`, `nixpacks.toml`, `Procfile`)
5. ✅ Created comprehensive deployment guide
6. ✅ Pushed all changes to GitHub

## 🚀 Next Steps (Do These Now)

### 1. Deploy Frontend to Vercel (5 minutes)

**Via Dashboard** (Easiest):
1. Go to: https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import: `eclipse31-dev/TinyLearn`
4. Settings:
   - Root Directory: `react`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - Name: `VITE_API_BASE_URL`
   - Value: `http://localhost:8000` (temporary, update after backend deploy)
6. Click "Deploy"

### 2. Deploy Backend to Railway (10 minutes)

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `eclipse31-dev/TinyLearn`
5. Add MySQL Database:
   - Click "+ New" → "Database" → "MySQL"
6. Add Environment Variables (in Railway dashboard):
   ```
   APP_NAME=TinyLearn
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://your-app.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MYSQL.MYSQL_HOST}}
   DB_PORT=${{MYSQL.MYSQL_PORT}}
   DB_DATABASE=${{MYSQL.MYSQL_DATABASE}}
   DB_USERNAME=${{MYSQL.MYSQL_USER}}
   DB_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}
   
   SESSION_DRIVER=file
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

7. Generate APP_KEY locally:
   ```bash
   php artisan key:generate --show
   ```
   Copy the output and paste it as APP_KEY value

8. Deploy will start automatically

### 3. Connect Frontend to Backend (2 minutes)

1. Copy your Railway backend URL (e.g., `https://tinylearn.railway.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `VITE_API_BASE_URL`:
   - Value: `https://your-backend.railway.app`
4. Go to Deployments → Click "..." → "Redeploy"

### 4. Update Backend CORS (2 minutes)

1. Copy your Vercel frontend URL (e.g., `https://tinylearn.vercel.app`)
2. Go to Railway Dashboard → Your Project → Variables
3. Update `CORS_ALLOWED_ORIGINS`:
   - Value: `https://your-frontend.vercel.app`
4. Railway will auto-redeploy

## 🎉 Done!

Your app should now be live at:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-project.railway.app`

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Try to register a new account
3. Login
4. Create a course
5. Upload a file

## ⚠️ Important Notes

- The `.env` file in `react/` folder is gitignored (safe)
- Never commit sensitive keys
- Railway will run migrations automatically
- Vercel will rebuild on every GitHub push
- Railway will redeploy on every GitHub push

## 📚 Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

## 🔧 Common Issues

**Frontend can't reach backend**:
- Check VITE_API_BASE_URL in Vercel
- Check CORS_ALLOWED_ORIGINS in Railway
- Redeploy both services

**Database errors**:
- Check DB variables in Railway
- Run migrations: `railway run php artisan migrate --force`

**Build fails**:
- Check build logs in Vercel/Railway dashboard
- Verify all dependencies are in package.json/composer.json
