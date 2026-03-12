# Google OAuth Configuration

## Current Status

✅ Google OAuth is configured locally  
⚠️ Needs production URL updates

## Your Current Credentials

```
GOOGLE_CLIENT_ID=230149310638-hus7hu3onr7bsqhku167uq2g6lu5vggo.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Production Deployment

### 1. Get Your URLs

**Railway Backend URL**
- Go to: https://railway.app
- Select TinyLearn project
- Backend service → Copy URL
- Example: `https://tinylearn-backend.railway.app`

**Vercel Frontend URL**
- Go to: https://vercel.com
- Select TinyLearn project
- Copy production URL
- Example: `https://tinylearn-frontend.vercel.app`

### 2. Update Google Console

1. Go to: https://console.cloud.google.com
2. Select your project
3. APIs & Services → Credentials
4. Click your OAuth 2.0 Client ID
5. Add to "Authorized redirect URIs":
   - `https://tinylearn-backend.railway.app/auth/google/callback`
   - `https://tinylearn-frontend.vercel.app/auth/google/callback`
6. Save

### 3. Update Railway Environment

Go to Railway dashboard:
1. Select TinyLearn backend
2. Variables tab
3. Update:
   ```
   APP_URL=https://tinylearn-backend.railway.app
   GOOGLE_REDIRECT_URI=https://tinylearn-backend.railway.app/auth/google/callback
   ```
4. Redeploy

### 4. Update Frontend

Create `react/.env.production`:
```
VITE_API_URL=https://tinylearn-backend.railway.app
```

### 5. Test

1. Go to frontend: `https://tinylearn-frontend.vercel.app`
2. Click "Login with Google"
3. Should redirect to Google login
4. After login, should redirect back with token

## 🔄 OAuth Flow

```
User clicks "Login with Google"
         ↓
Frontend redirects to:
https://tinylearn-backend.railway.app/auth/google/redirect
         ↓
Backend redirects to Google
         ↓
User logs in with Google
         ↓
Google redirects to:
https://tinylearn-backend.railway.app/auth/google/callback
         ↓
Backend creates/updates user
         ↓
Backend redirects to frontend with token:
https://tinylearn-frontend.vercel.app/auth/google/callback?token=...
         ↓
Frontend stores token
         ↓
User is logged in
```

## 📝 Files to Update

1. `.env` (on Railway)
   - APP_URL
   - GOOGLE_REDIRECT_URI

2. `react/.env.production`
   - VITE_API_URL

3. Google Console
   - Add production URLs

## ✅ Verification

After deployment, verify:
- [ ] Google Console has correct URLs
- [ ] Railway .env has correct URLs
- [ ] Frontend can reach backend
- [ ] Google login works
- [ ] User is created/updated
- [ ] Token is generated
- [ ] User is logged in

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Redirect URI mismatch | Check Google Console has exact URL |
| Invalid client | Verify CLIENT_ID and SECRET |
| CORS error | Check frontend URL in Railway |
| Token not found | Check token is in query params |
| User not created | Check database connection |

## 📞 Next Steps

1. Get your Railway and Vercel URLs
2. Update Google Console
3. Update .env on Railway
4. Update react/.env.production
5. Push to GitHub
6. Test on production
