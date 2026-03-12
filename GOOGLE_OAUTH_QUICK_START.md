# Google OAuth - Quick Start

## 🎯 What You Need to Do

### Step 1: Get Your URLs (5 min)
```
Railway Backend: https://your-railway-url.railway.app
Vercel Frontend: https://your-vercel-url.vercel.app
```

### Step 2: Update Google Console (5 min)
1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit OAuth Client
4. Add to "Authorized redirect URIs":
   ```
   https://your-railway-url.railway.app/auth/google/callback
   ```

### Step 3: Update Railway .env (3 min)
```
APP_URL=https://your-railway-url.railway.app
GOOGLE_REDIRECT_URI=https://your-railway-url.railway.app/auth/google/callback
```

### Step 4: Redeploy (2 min)
- Railway auto-deploys
- Test Google login

## 📋 Current Configuration

```
GOOGLE_CLIENT_ID=230149310638-hus7hu3onr7bsqhku167uq2g6lu5vggo.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## 🔗 OAuth Flow

```
User → Google Login → Backend → Google Auth → Backend → Frontend → Logged In
```

## ✅ Checklist

- [ ] Get Railway URL
- [ ] Get Vercel URL
- [ ] Update Google Console
- [ ] Update Railway .env
- [ ] Redeploy
- [ ] Test login

**Total Time: 15 minutes**

## 📚 Full Guides

- `GOOGLE_OAUTH_DEPLOYMENT.md` - Complete deployment guide
- `GOOGLE_OAUTH_CONFIG.md` - Configuration details
