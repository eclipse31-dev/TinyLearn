# Google OAuth Deployment Guide

## 🔐 Current Setup

Your app has Google OAuth configured. The flow is:
1. User clicks "Login with Google"
2. Redirects to: `http://localhost:8000/auth/google/redirect`
3. Google authenticates user
4. Redirects back to: `http://localhost:8000/auth/google/callback`
5. Backend creates/updates user and generates token
6. Redirects to frontend with token

## 📋 Deployment Steps

### Step 1: Update Google Console

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to: APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Click "Edit"
6. Add your production URLs to "Authorized redirect URIs":

```
https://your-railway-backend.railway.app/auth/google/callback
https://your-vercel-frontend.vercel.app/auth/google/callback
```

### Step 2: Update .env on Railway

Update these variables in Railway dashboard:

```
APP_URL=https://your-railway-backend.railway.app
GOOGLE_REDIRECT_URI=https://your-railway-backend.railway.app/auth/google/callback
```

### Step 3: Update Frontend Environment

Create `react/.env.production`:

```
VITE_API_URL=https://your-railway-backend.railway.app
VITE_GOOGLE_REDIRECT_URL=https://your-railway-backend.railway.app/auth/google/redirect
```

### Step 4: Update Frontend Code

In `react/src/views/shared/AdminLogin.jsx`, update the Google login button:

```javascript
const handleGoogleLogin = () => {
  const redirectUrl = import.meta.env.VITE_GOOGLE_REDIRECT_URL || 
    'http://localhost:8000/auth/google/redirect';
  window.location.href = redirectUrl;
};
```

### Step 5: Deploy

1. Push changes to GitHub
2. Railway auto-deploys backend
3. Vercel auto-deploys frontend
4. Test Google login

## 🔗 URL Mapping

### Local Development
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Google Redirect: `http://localhost:8000/auth/google/redirect`
- Google Callback: `http://localhost:8000/auth/google/callback`

### Production (Railway + Vercel)
- Backend: `https://your-railway-backend.railway.app`
- Frontend: `https://your-vercel-frontend.vercel.app`
- Google Redirect: `https://your-railway-backend.railway.app/auth/google/redirect`
- Google Callback: `https://your-railway-backend.railway.app/auth/google/callback`

## 🚀 Quick Deployment Checklist

- [ ] Get your Railway backend URL
- [ ] Get your Vercel frontend URL
- [ ] Update Google Console with new URLs
- [ ] Update .env on Railway
- [ ] Update react/.env.production
- [ ] Update frontend code
- [ ] Push to GitHub
- [ ] Test Google login on production

## ⚠️ Important Notes

1. **HTTPS Required**: Google OAuth requires HTTPS in production
2. **Exact URLs**: URLs must match exactly in Google Console
3. **No Trailing Slashes**: Don't add trailing slashes to URLs
4. **Test Locally First**: Test with localhost before deploying

## 🔍 Troubleshooting

### "Redirect URI mismatch"
- Check Google Console has exact URL
- No trailing slashes
- Must be HTTPS in production

### "Invalid client"
- Verify GOOGLE_CLIENT_ID is correct
- Verify GOOGLE_CLIENT_SECRET is correct

### "Token not found"
- Check frontend is using correct backend URL
- Check token is being passed in query params

## 📞 Support

- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
- Laravel Socialite: https://laravel.com/docs/socialite
