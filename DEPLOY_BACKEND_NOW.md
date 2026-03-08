# DEPLOY BACKEND TO RENDER - STEP BY STEP

Your frontend is live at: **https://tinylearn.com**
Your backend is running locally at: **http://localhost:8000**

But Netlify can't access localhost! You need to deploy the backend.

## EASIEST SOLUTION: Deploy Backend to Render

### Step 1: Go to Render Dashboard
Open: https://dashboard.render.com

### Step 2: Delete Old Service (if exists)
1. Find "tinylearn-backend" service
2. Click on it
3. Settings (bottom left) → Scroll down → "Delete Web Service"
4. Confirm deletion

### Step 3: Create NEW Service with Docker
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub: `eclipse31-dev/TinyLearn`
4. **CRITICAL**: In "Environment" dropdown → Select **"Docker"** (NOT Node.js!)
5. Fill in:
   - Name: `tinylearn-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - Plan: **Free**

### Step 4: Add Environment Variables
Click "Add Environment Variable" for each:

```
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:6BNJDemix3Oeo9WeJFC7UcQ5Rw3Gi2Ohl0kIJJL2bbw=

DB_CONNECTION=pgsql
DB_HOST=db.vitoowevsvfekxemflaw.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=sECURITY31!GGDAGWGG

SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

CORS_ALLOWED_ORIGINS=https://tinylearn.com
```

### Step 5: Create Service
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://tinylearn-backend.onrender.com`

### Step 6: Update Frontend
Once backend is deployed, update frontend:

1. Edit `react/.env.production`:
   ```
   VITE_API_BASE_URL=https://tinylearn-backend.onrender.com
   ```

2. Rebuild and deploy:
   ```bash
   cd react
   npm run build
   npx netlify-cli deploy --prod
   ```

### Step 7: Test
Visit https://tinylearn.com and try logging in!

---

## ALTERNATIVE: Use Your Local Backend Temporarily

If Render keeps failing, you can test locally:

1. Keep backend running: `php artisan serve`
2. Open frontend locally: `cd react && npm run dev`
3. Visit: http://localhost:5173
4. Login and test features

This way you can at least use the app while we figure out deployment.

---

## TROUBLESHOOTING

### If Render still detects as Node.js:
- You MUST select "Docker" manually in the Environment dropdown
- Don't use auto-detect
- Delete and recreate if needed

### If deployment fails:
- Check build logs in Render dashboard
- Verify Supabase database is accessible
- Make sure all environment variables are set

### If login still fails after deployment:
- Check CORS settings
- Verify backend URL in frontend .env.production
- Check Render logs for errors
