# Google OAuth Setup Guide for TinyLearn LMS

## Overview
This guide will help you set up Google OAuth authentication for your TinyLearn LMS system. Users can now log in using their Google accounts, and their profile information will automatically sync with the system.

## Prerequisites
- Google Cloud Console account
- TinyLearn LMS running locally or on a server
- Composer and npm installed

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it "TinyLearn LMS" (or your preferred name)

### 1.2 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in the required fields:
     - App name: "TinyLearn LMS"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email)
4. After consent screen is configured, create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "TinyLearn Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `http://localhost:8000` (development)
     - Your production domain
   - Authorized redirect URIs:
     - `http://localhost:8000/api/auth/google/callback` (development)
     - Your production callback URL

### 1.4 Copy Your Credentials
- Copy the **Client ID** and **Client Secret**
- Keep these safe - you'll need them in the next step

## Step 2: Configure Environment Variables

### 2.1 Update .env file
Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

Replace:
- `your_client_id_here` with your Google Client ID
- `your_client_secret_here` with your Google Client Secret

### 2.2 For Production
When deploying to production, update:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

## Step 3: Verify Installation

### 3.1 Check Composer Packages
The following packages should be installed:
- `laravel/socialite` - OAuth authentication
- `google/apiclient-services` - Google API services

If not installed, run:
```bash
composer require laravel/socialite google/apiclient-services
```

### 3.2 Clear Configuration Cache
```bash
php artisan config:clear
```

## Step 4: Database Schema

The following columns have been added to the `users` table:
- `google_id` - Stores Google user ID
- `google_avatar` - Stores Google profile picture URL
- `oauth_provider` - Stores the OAuth provider name

These are already in your database.

## Step 5: Test Google Login

### 5.1 Start Your Services
Make sure all services are running:
```bash
# Terminal 1: Laravel API
php artisan serve

# Terminal 2: Reverb WebSocket (optional)
php artisan reverb:start

# Terminal 3: React Frontend
cd react
npm run dev
```

### 5.2 Test Login Flow
1. Go to http://localhost:5173/login
2. Click "Sign in with Google" button
3. You'll be redirected to Google login
4. After authentication, you'll be logged into TinyLearn
5. Your profile will be automatically created/updated with:
   - First name and last name from Google
   - Email from Google
   - Profile picture from Google
   - Default role: Student (for new users)

## How It Works

### User Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User grants permission
4. Google redirects back to `/api/auth/google/callback`
5. System checks if user exists:
   - **If Google ID exists**: Update avatar and log in
   - **If email exists**: Link Google account to existing user
   - **If new user**: Create account with Google data and assign Student role
6. User is logged in and redirected to dashboard

### Profile Sync
When a user logs in with Google:
- First name and last name are synced from Google
- Email is synced from Google
- Profile picture (avatar) is synced from Google
- User roles are preserved (or Student role assigned for new users)

## API Endpoints

### Get Google Login URL
```
GET /api/auth/google/login-url?role=student
```
Returns the Google OAuth login URL

### Google OAuth Callback
```
GET /api/auth/google/callback
POST /api/auth/google/callback
```
Handles the OAuth callback from Google

## Frontend Components

### GoogleLoginButton Component
Located at: `react/src/components/GoogleLoginButton.jsx`

Usage:
```jsx
import GoogleLoginButton from './components/GoogleLoginButton';

<GoogleLoginButton role="student" />
```

The button is already integrated into:
- Student/Teacher Login page
- Admin Login page

## Troubleshooting

### Issue: "Invalid Client ID"
- Verify your `GOOGLE_CLIENT_ID` in `.env`
- Check that the Client ID matches in Google Cloud Console
- Clear config cache: `php artisan config:clear`

### Issue: "Redirect URI mismatch"
- Ensure the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:8000/api/auth/google/callback` (development)
- Check for trailing slashes and protocol (http vs https)

### Issue: "User not found after login"
- Check that the user was created in the database
- Verify the `users` table has the Google OAuth columns
- Check Laravel logs: `storage/logs/laravel.log`

### Issue: "CORS errors"
- Verify `localhost:5173` is in `config/cors.php` allowed_origins
- Check that `GOOGLE_REDIRECT_URI` is correct in `.env`

## Security Notes

1. **Never commit credentials**: Keep `.env` file in `.gitignore`
2. **Use HTTPS in production**: Always use HTTPS for OAuth
3. **Validate tokens**: The system validates Google tokens server-side
4. **Secure storage**: Google IDs and avatars are stored securely in the database

## Next Steps

1. Test the Google login flow thoroughly
2. Configure email notifications for new OAuth users
3. Add role assignment logic for different user types
4. Set up production Google OAuth credentials
5. Monitor user creation and profile sync

## Support

For issues or questions:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MySQL is running and database is accessible

---

**Last Updated**: March 11, 2026
**Version**: 1.0
