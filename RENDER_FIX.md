# FIX RENDER DEPLOYMENT - SIMPLE STEPS

## THE PROBLEM
Render keeps detecting your project as Node.js instead of PHP/Laravel because it sees `package.json` in the root.

## THE SOLUTION (2 OPTIONS)

### OPTION 1: Delete and Recreate Service (EASIEST)

1. Go to Render Dashboard: https://dashboard.render.com
2. Find your service "tinylearn-backend"
3. Click on it
4. Go to "Settings" tab (bottom left)
5. Scroll to bottom → Click "Delete Web Service"
6. Confirm deletion

7. Create NEW service:
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `eclipse31-dev/TinyLearn`
   - **IMPORTANT**: In "Environment" dropdown, select **"Docker"** (NOT Node.js!)
   - Name: `tinylearn-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - Plan: **Free**
   
8. Add Environment Variables (click "Add Environment Variable"):
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
   ```

9. Click "Create Web Service"
10. Wait 5-10 minutes for deployment

### OPTION 2: Change Existing Service Runtime

1. Go to your service in Render Dashboard
2. Click "Settings" tab
3. Look for "Environment" or "Runtime" setting
4. Change from "Node" to "Docker"
5. Save changes
6. Go to "Manual Deploy" → "Deploy latest commit"

---

## AFTER DEPLOYMENT SUCCEEDS

You'll get a URL like: `https://tinylearn-backend.onrender.com`

### Update Frontend to Use Backend

1. Open `react/.env.production`
2. Change:
   ```
   VITE_API_BASE_URL=https://tinylearn-backend.onrender.com
   ```

3. Rebuild and redeploy frontend:
   ```bash
   cd react
   npm run build
   npx firebase deploy --only hosting
   ```

---

## TROUBLESHOOTING

### If deployment still fails:
- Make sure you selected "Docker" as environment (not Node.js)
- Check that Dockerfile exists in root directory
- Verify Supabase database is accessible

### If you see "php: command not found":
- You didn't select Docker environment
- Delete service and recreate with Docker

### If you see "npm install" errors:
- Render is still using Node.js environment
- Delete service and recreate with Docker selected

---

## VERIFY IT WORKS

After deployment:
1. Visit: `https://tinylearn-backend.onrender.com/api/health` (should return JSON)
2. Visit: `https://tinylearn-9a0f9.web.app` (your frontend)
3. Try logging in

---

## NEED HELP?

If this doesn't work, you have 2 other options:

1. **Run backend locally** (easiest for now):
   ```bash
   php artisan serve
   ```
   Then update frontend to use `http://localhost:8000`

2. **Try different platform**: Vercel, Railway, or Heroku
