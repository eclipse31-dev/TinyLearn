# TinyLearn - Getting Started Guide

Welcome to TinyLearn, a modern Learning Management System with real-time capabilities!

## Prerequisites

Before you start, make sure you have installed:
- **PHP 8.2+** - [Download](https://www.php.net/downloads)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Composer** - [Download](https://getcomposer.org/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start (Recommended)

### Windows Users
```bash
start-dev.bat
```

### Mac/Linux Users
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will automatically start all required services.

## Manual Setup

If you prefer to start services manually, follow these steps:

### 1. Install Dependencies

```bash
# Backend dependencies
composer install

# Frontend dependencies
cd react
npm install
cd ..
```

### 2. Setup Database

```bash
# Run migrations and seed test data
php artisan migrate:fresh --seed
```

### 3. Start Services

Open 4 separate terminals and run:

**Terminal 1 - Laravel API Server:**
```bash
php artisan serve
```
Runs on: `http://localhost:8000`

**Terminal 2 - WebSocket Server (Real-time):**
```bash
php artisan reverb:start
```
Runs on: `ws://localhost:8080`

**Terminal 3 - Queue Worker:**
```bash
php artisan queue:work
```

**Terminal 4 - React Development Server:**
```bash
cd react
npm run dev
```
Runs on: `http://localhost:3000`

## Test Credentials

Use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Teacher | teacher@example.com | password |
| Student | student@example.com | password |

## Project Structure

```
TinyLearn/
├── app/                    # Laravel backend
│   ├── Http/Controllers/   # API controllers
│   ├── Models/             # Database models
│   ├── Services/           # Business logic
│   └── Events/             # Event classes
├── react/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── views/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API & real-time services
│   │   └── context/        # React context
│   └── package.json
├── database/               # Migrations & seeders
├── routes/                 # API routes
├── config/                 # Configuration files
└── .env                    # Environment variables
```

## Key Features

### 🎓 Learning Management
- Create and manage courses
- Post announcements
- Create assignments and assessments
- Upload course materials
- Track student progress

### 👥 User Management
- Role-based access (Admin, Teacher, Student)
- User enrollment in courses
- Activity tracking
- Session management

### 💬 Communication
- Real-time messaging
- Discussion forums
- Notifications
- Announcements

### 📊 Analytics
- Dashboard with statistics
- Online hours tracking
- Grade management
- Progress reports

### ⚡ Real-Time Features
- Live course updates
- Instant notifications
- Real-time user tracking
- Live messaging
- WebSocket-based communication

## Real-Time Architecture

The project uses **Laravel Reverb** for WebSocket communication:

```
React Frontend (WebSocket Client)
         ↓
    Laravel Echo
         ↓
    Reverb Server (ws://localhost:8080)
         ↓
    Laravel Backend (Broadcasting)
```

For detailed real-time setup, see [REALTIME_SETUP.md](./REALTIME_SETUP.md)

## API Documentation

### Authentication
All API requests require a Bearer token:
```
Authorization: Bearer {token}
```

### Main Endpoints

**Courses:**
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

**Announcements:**
- `GET /api/courses/{courseId}/announcements` - List announcements
- `POST /api/announcements` - Create announcement
- `DELETE /api/announcements/{id}` - Delete announcement

**Assignments:**
- `GET /api/courses/{courseId}/assignments` - List assignments
- `POST /api/assessments` - Create assignment
- `DELETE /api/assessments/{id}` - Delete assignment

**Submissions:**
- `GET /api/submissions` - List submissions
- `POST /api/submissions` - Submit assignment
- `PUT /api/submissions/{id}/grade` - Grade submission

**Messages:**
- `GET /api/conversations` - List conversations
- `POST /api/messages` - Send message
- `GET /api/conversations/{id}/messages` - Get messages

For complete API documentation, check the routes in `routes/api.php`

## Development Workflow

### Creating a New Feature

1. **Backend:**
   - Create migration: `php artisan make:migration create_feature_table`
   - Create model: `php artisan make:model Feature`
   - Create controller: `php artisan make:controller Api/FeatureController`
   - Add routes in `routes/api.php`

2. **Frontend:**
   - Create component in `react/src/components/`
   - Create service in `react/src/services/`
   - Add routes in `react/src/router.jsx`

3. **Real-Time:**
   - Add event in `app/Events/`
   - Add broadcasting in controller
   - Subscribe in React component using `useRealtime` hook

### Running Tests

```bash
# Backend tests
php artisan test

# Frontend tests
cd react
npm run test
```

### Building for Production

```bash
# Build frontend
cd react
npm run build

# Optimize backend
php artisan optimize
php artisan config:cache
php artisan route:cache
```

## Troubleshooting

### Port Already in Use
If a port is already in use, you can change it:

```bash
# Laravel (default 8000)
php artisan serve --port=8001

# Reverb (default 8080)
php artisan reverb:start --port=8081

# React (default 3000)
cd react && npm run dev -- --port=3001
```

### Database Issues
```bash
# Reset database
php artisan migrate:fresh --seed

# Check migrations
php artisan migrate:status
```

### WebSocket Connection Issues
- Ensure Reverb is running: `php artisan reverb:start`
- Check firewall allows port 8080
- Verify browser console for errors
- Check `.env` has correct `REVERB_*` settings

### Node Modules Issues
```bash
# Clear cache and reinstall
cd react
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

### Backend (.env)
```
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
BROADCAST_CONNECTION=reverb
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_HOST=localhost
REVERB_PORT=8080
```

### Frontend (react/.env)
```
VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
```

## Performance Tips

1. **Database:**
   - Use indexes on frequently queried columns
   - Implement pagination for large datasets
   - Use eager loading to avoid N+1 queries

2. **Frontend:**
   - Use React.memo for expensive components
   - Implement code splitting with dynamic imports
   - Optimize images and assets

3. **Real-Time:**
   - Limit concurrent WebSocket connections
   - Use private channels for sensitive data
   - Implement message throttling if needed

## Deployment

For production deployment:

1. Use a managed WebSocket service (Pusher, Ably)
2. Set up proper HTTPS/WSS
3. Configure environment variables
4. Use a production database (MySQL, PostgreSQL)
5. Set up proper logging and monitoring
6. Enable CORS for your domain

See deployment guides for specific platforms.

## Support & Resources

- **Laravel Documentation:** https://laravel.com/docs
- **React Documentation:** https://react.dev
- **Laravel Echo:** https://laravel.com/docs/broadcasting
- **Reverb:** https://laravel.com/docs/reverb

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please follow the existing code style and create a pull request.

---

**Happy Learning! 🚀**

For questions or issues, please check the documentation or create an issue on GitHub.
