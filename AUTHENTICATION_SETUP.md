# User Authentication Flow - Setup Guide

This document outlines the complete authentication flow for your Laravel-React application.

## Project Structure

```
Frontend (React) - runs on http://localhost:3000
├── src/
│   ├── context/
│   │   └── AuthContext.jsx (Global auth state management)
│   ├── components/
│   │   └── PrivateRoute.jsx (Route protection)
│   ├── views/
│   │   ├── login.jsx (Login form)
│   │   ├── Signup.jsx (Registration form)
│   │   ├── Dashboard.jsx (Protected dashboard)
│   │   └── NotFound.jsx (404 page)
│   ├── router.jsx (Route configuration)
│   └── main.jsx (App entry point with AuthProvider)

Backend (Laravel) - runs on http://localhost:8000
├── routes/
│   └── api.php (API endpoints)
├── app/Http/Controllers/Api/
│   ├── AuthController.php (Login, Register, Logout)
│   └── UserController.php (User data endpoints)
├── config/
│   └── cors.php (CORS configuration)
└── bootstrap/
    └── app.php (Middleware setup)
```

## Authentication Flow

### User Signup
1. User fills signup form with Name, Email, Password, Password Confirmation
2. React sends POST request to `http://localhost:8000/api/register`
3. Laravel validates and creates user account
4. Laravel returns user data and API token
5. React stores token and user in localStorage
6. Auth context is updated
7. User redirected to `/dashboard`

### User Login
1. User fills login form with Email and Password
2. React sends POST request to `http://localhost:8000/api/login`
3. Laravel validates credentials
4. Laravel generates API token
5. React stores token and user in localStorage
6. Auth context is updated
7. User redirected to `/dashboard`

### Protected Routes
1. Dashboard and home routes require authentication
2. PrivateRoute component checks if token exists
3. If no token, user redirected to `/login`
4. If token exists, user can access dashboard

### User Logout
1. User clicks logout button on dashboard
2. React sends POST request to `http://localhost:8000/api/logout`
3. Laravel invalidates the token
4. React clears localStorage
5. Auth context is cleared
6. User redirected to `/login`

## Starting the Application

### Database Setup
```bash
# Run migrations
php artisan migrate
```

### Start Laravel Server
```bash
# In project root
php artisan serve
```
Server runs on `http://localhost:8000`

### Start React Development Server
```bash
# In react folder
npm run dev
```
Server runs on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### POST /api/register
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-07T10:00:00Z"
  },
  "token": "1|abcdef123456..."
}
```

#### POST /api/login
Login an existing user
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-07T10:00:00Z"
  },
  "token": "1|abcdef123456..."
}
```

#### POST /api/logout
Logout the current user (requires authentication)
```
Request Headers:
Authorization: Bearer <token>

Response:
{
  "message": "Logged out"
}
```

#### GET /api/user
Get current authenticated user (requires authentication)
```
Request Headers:
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-07T10:00:00Z"
}
```

#### GET /api/users
Get list of all users (requires authentication)
```
Request Headers:
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  ...
]
```

## Key Technologies

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Laravel 12, Laravel Sanctum, CORS
- **Authentication**: API Tokens (Sanctum)
- **State Management**: React Context API

## Security Features

- Password hashing with bcrypt
- API token-based authentication
- CORS protection
- Protected routes on frontend
- Token stored in localStorage
- Token passed in Authorization header

## Customization

### Change API Base URL
Update the API URL in components:
- [react/src/views/login.jsx](react/src/views/login.jsx)
- [react/src/views/Signup.jsx](react/src/views/Signup.jsx)
- [react/src/views/Dashboard.jsx](react/src/views/Dashboard.jsx)

Look for `http://localhost:8000` and replace with your backend URL.

### Allowed Origins (CORS)
Edit [config/cors.php](config/cors.php):
- Update `allowed_origins` array with your frontend URL
- Default is `http://localhost:3000`

### Enable HTTPS
In [config/cors.php](config/cors.php), add your production URLs to `allowed_origins`
