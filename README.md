# TinyLearn - Learning Management System

A modern, full-stack Learning Management System built with Laravel and React, featuring real-time updates, assignment submissions, and a beautiful pink-themed UI.

![TinyLearn](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat&logo=php)

## ✨ Features

### For Students
- 📚 Browse and enroll in courses
- 📝 Submit assignments with file uploads (documents, images, videos)
- 📊 View grades and teacher feedback
- 🗓️ Check class schedules
- 💬 Participate in discussions
- 📈 Track learning progress

### For Teachers
- 👨‍🏫 Create and manage courses
- 📋 Create assignments and assessments
- ✅ Grade student submissions
- 📤 Upload course materials
- 📢 Post announcements
- 👥 View student analytics

### For Admins
- 👤 Manage users and roles
- 📊 View system analytics
- ⚙️ Configure system settings

### General Features
- 🔴 Real-time notifications with Laravel Reverb
- 🌙 Dark mode support
- 🔍 Global search functionality
- 📱 Responsive design
- 🎨 Pink-themed UI with Lucide icons
- ⏱️ Online hours tracking
- 🔔 Activity feed

## 🚀 Quick Start

### Prerequisites

Before cloning this project, make sure you have the following installed:

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.0
- **npm** >= 9.0
- **SQLite** (or MySQL/PostgreSQL)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/eclipse31-dev/TinyLearn.git
cd TinyLearn
```

#### 2. Backend Setup (Laravel)

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database file
touch database/database.sqlite

# Run database migrations
php artisan migrate

# Seed the database with test data
php artisan db:seed

# Create storage link for file uploads
php artisan storage:link

# Create cache and queue tables
php artisan queue:table
php artisan migrate
```

#### 3. Frontend Setup (React)

```bash
# Navigate to React folder
cd react

# Install Node dependencies
npm install

# Copy React environment file
cp .env.example .env

# Return to root directory
cd ..
```

#### 4. Configure Environment Variables

Edit `.env` file in the root directory:

```env
APP_NAME=TinyLearn
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

BROADCAST_CONNECTION=reverb

REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

Edit `react/.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=your-app-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## 🏃 Running the Application

You need to run **3 separate terminals**:

### Terminal 1: Laravel Backend

```bash
php artisan serve
```

The backend will run on `http://localhost:8000`

### Terminal 2: Laravel Reverb (WebSocket Server)

```bash
php artisan reverb:start
```

The WebSocket server will run on `http://localhost:8080`

### Terminal 3: React Frontend

```bash
cd react
npm run dev
```

The frontend will run on `http://localhost:3000`

## 👤 Default Login Credentials

After seeding the database, you can login with:

### Admin Account
- **Email:** admin@example.com
- **Password:** password

### Teacher Account
- **Email:** teacher@example.com
- **Password:** password

### Student Account
- **Email:** student@example.com
- **Password:** password

## 📦 Dependencies

### Backend (Laravel)

```json
{
  "php": "^8.2",
  "laravel/framework": "^11.0",
  "laravel/sanctum": "^4.0",
  "laravel/reverb": "^1.0",
  "inertiajs/inertia-laravel": "^1.0"
}
```

Install with:
```bash
composer install
```

### Frontend (React)

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "axios": "^1.6.7",
  "lucide-react": "^0.344.0",
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0",
  "laravel-echo": "^1.16.1",
  "pusher-js": "^8.4.0-rc2"
}
```

Install with:
```bash
cd react
npm install
```

## 🗂️ Project Structure

```
TinyLearn/
├── app/                          # Laravel application
│   ├── Http/Controllers/Api/     # API controllers
│   ├── Models/                   # Eloquent models
│   ├── Services/                 # Business logic
│   └── Events/                   # Real-time events
├── database/
│   ├── migrations/               # Database migrations
│   ├── seeders/                  # Database seeders
│   └── database.sqlite           # SQLite database
├── react/                        # React frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── views/                # Page components
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── teacher/          # Teacher pages
│   │   │   ├── student/          # Student pages
│   │   │   └── shared/           # Shared pages
│   │   ├── context/              # React contexts
│   │   ├── services/             # API services
│   │   └── styles/               # CSS files
│   └── package.json
├── routes/
│   ├── api.php                   # API routes
│   └── web.php                   # Web routes
├── .env                          # Backend environment
├── composer.json                 # PHP dependencies
└── README.md                     # This file
```

## 🎨 Key Features Explained

### Assignment Submission System
- Students can upload multiple files (PDF, DOC, DOCX, JPG, PNG, MP4)
- Teachers can download files and provide grades with feedback
- Real-time notifications when grades are posted

### Real-Time Updates
- Powered by Laravel Reverb (WebSocket server)
- Live notifications for announcements, assignments, and grades
- Online user tracking
- Activity feed updates

### Pink Icon Theme
- All icons use Lucide React library
- Consistent pink theme (#ec4899) for instructor/teacher features
- Blue theme (#3b82f6) for student features
- Scalable vector icons

### Image Upload
- Course header images can be uploaded directly
- Supports both URL input and file upload
- Live preview before saving

## 🛠️ Development

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
# Build React frontend
cd react
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📝 Creating Test Data

Run the test data script to create sample assignments:

```bash
php create_test_assignments.php
```

This will create:
- 3 test assignments
- 1 course with module
- Enrolled student

## 🐛 Troubleshooting

### Issue: "Class not found" errors
**Solution:** Run `composer dump-autoload`

### Issue: Database connection errors
**Solution:** Check `.env` file and ensure `database.sqlite` exists

### Issue: WebSocket connection failed
**Solution:** Make sure Laravel Reverb is running on port 8080

### Issue: CORS errors
**Solution:** Check `config/cors.php` and ensure frontend URL is allowed

### Issue: File upload not working
**Solution:** Run `php artisan storage:link` and check folder permissions

### Issue: Icons not showing
**Solution:** Ensure `lucide-react` is installed: `cd react && npm install lucide-react`

## 📚 Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Laravel Reverb](https://reverb.laravel.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

**TinyLearn Team**

## 🙏 Acknowledgments

- Laravel Framework
- React Library
- Lucide Icons
- Chart.js
- All contributors

---

**Need Help?** Open an issue on GitHub or contact the development team.

**Happy Learning! 📚✨**
