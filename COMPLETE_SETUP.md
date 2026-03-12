# TinyLearn LMS - Complete Setup Guide

## Prerequisites
- PHP 8.1+ with MySQL support
- Node.js 18+
- Composer
- MySQL Server (XAMPP or standalone)
- Git

## Step 1: Database Setup

### Option A: Using XAMPP
1. Start XAMPP (Apache + MySQL)
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Create database `tinylearn`:
   - Click "New" → Enter `tinylearn` → Create
   - Or run SQL from `create_database.sql`

### Option B: Using Command Line
```bash
mysql -u root -p
CREATE DATABASE tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Step 2: Backend Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations and seed database
php artisan migrate:fresh --seed

# Clear cache
php artisan config:clear
php artisan cache:clear
```

## Step 3: Frontend Setup

```bash
cd react

# Install dependencies
npm install

# Build frontend (optional, for production)
npm run build
```

## Step 4: Start Services

### Terminal 1 - Laravel Backend
```bash
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2 - Laravel Reverb (Real-time)
```bash
php artisan reverb:start
# Runs on http://localhost:8080
```

### Terminal 3 - Queue Worker (optional)
```bash
php artisan queue:work
```

### Terminal 4 - React Frontend
```bash
cd react
npm run dev
# Runs on http://localhost:5173
```

## Step 5: Verify Setup

### Check Backend Health
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Login
1. Open http://localhost:5173
2. Login with test credentials:
   - **Admin**: admin@example.com / password
   - **Teacher**: teacher@example.com / password
   - **Student**: student@example.com / password

### Verify Real-time Features
1. Open dashboard in two browser tabs
2. Create an announcement in one tab
3. Should appear instantly in the other tab

## Environment Variables

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_CONNECTION=reverb
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### Frontend (react/.env)
```
VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Verify `tinylearn` database exists

### Frontend Can't Connect to Backend
- Ensure Laravel is running on port 8000
- Check `VITE_API_URL` in `react/.env`
- Clear browser cache and localStorage

### Real-time Features Not Working
- Ensure Reverb is running on port 8080
- Check WebSocket connection in browser DevTools
- Verify `REVERB_*` environment variables

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

## Project Structure

```
TinyLearn/
├── app/                    # Laravel backend
│   ├── Http/Controllers/   # API endpoints
│   ├── Models/             # Database models
│   ├── Services/           # Business logic
│   └── Events/             # Real-time events
├── react/                  # React frontend
│   ├── src/
│   │   ├── views/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API & real-time services
│   │   └── context/        # React context
│   └── package.json
├── database/
│   ├── migrations/         # Database schema
│   ├── seeders/            # Test data
│   └── factories/          # Model factories
├── routes/
│   ├── api.php             # API routes
│   └── channels.php        # WebSocket channels
└── config/                 # Configuration files
```

## Key Features

- **Real-time Updates**: WebSocket-based instant notifications
- **Course Management**: Create, edit, and manage courses
- **Assignments**: Submit and grade assignments
- **Discussions**: Real-time discussion forums
- **Announcements**: Broadcast announcements to students
- **Schedules**: Class scheduling and timetables
- **User Roles**: Admin, Teacher, Student with role-based access
- **Activity Logging**: Track user actions

## API Documentation

All API endpoints are prefixed with `/api/`

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `GET /user` - Get current user (requires auth)

### Courses
- `GET /courses` - List all courses
- `POST /courses` - Create course (teacher/admin)
- `GET /courses/{id}` - Get course details
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course

### Assignments
- `GET /assignments` - List assignments
- `POST /assignments` - Create assignment
- `POST /assignments/{id}/submit` - Submit assignment
- `GET /submissions` - List submissions
- `PUT /submissions/{id}/grade` - Grade submission

### Announcements
- `GET /announcements` - List announcements
- `POST /announcements` - Create announcement
- `DELETE /announcements/{id}` - Delete announcement

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/{id}/read` - Mark as read
- `DELETE /notifications/{id}` - Delete notification

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in `storage/logs/`
3. Check browser console for frontend errors
4. Verify all services are running
