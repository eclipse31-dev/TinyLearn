# Set Environment Variable in Vercel

Your backend is live at: **https://tinylearn-backend.onrender.com**

Now you need to tell Vercel to use this backend URL:

## Steps:

1. Go to: https://vercel.com/dashboard
2. Click on your project (TinyLearn)
3. Go to **Settings** tab
4. Click **Environment Variables** (left sidebar)
5. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://tinylearn-backend.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the three dots (...) on the latest deployment
9. Click **Redeploy**

## Done!

After redeployment, your app will be fully functional:
- Frontend on Vercel
- Backend on Render
- Database on Supabase

Visit your Vercel URL and try logging in!
