# TinyLearn - Learning Management System

## 📚 Project Overview

TinyLearn is a modern, full-stack Learning Management System (LMS) designed for educational institutions. It provides a comprehensive platform for teachers to manage courses, assignments, and student progress, while offering students an intuitive interface to access learning materials and track their academic journey.

---

## 🎯 Key Features

### For Teachers/Admins:
- **Course Management**: Create, edit, and delete courses with rich content
- **Assignment System**: Create assessments with file attachments and due dates
- **Material Distribution**: Upload and share documents, videos, and links
- **Student Tracking**: View enrolled students and monitor progress
- **Announcements**: Broadcast important updates to course participants
- **Grade Management**: Review and grade student submissions
- **Discussion Forums**: Moderate course discussions and Q&A

### For Students:
- **Course Enrollment**: Browse and enroll in available courses
- **Assignment Submission**: Submit work with file uploads
- **Material Access**: Download course materials and resources
- **Progress Tracking**: Monitor course completion and grades
- **Discussion Participation**: Engage in course discussions
- **Schedule View**: Calendar view of classes and deadlines
- **Dashboard Analytics**: Track online hours and learning statistics

---

## 🛠️ Technology Stack

### Frontend:
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework

### Backend:
- **Laravel 11** - PHP framework
- **PHP 8.2+** - Server-side language
- **RESTful API** - Clean API architecture
- **Laravel Sanctum** - API authentication
- **Laravel Fortify** - Authentication scaffolding

### Database:
- **PostgreSQL** - Primary database (Supabase)
- **MySQL** - Alternative option (Railway)
- **Eloquent ORM** - Database abstraction

### Deployment:
- **Frontend**: Firebase Hosting / Vercel
- **Backend**: Render / Railway
- **Database**: Supabase / Railway
- **Version Control**: GitHub

---

## 🌟 Core Functionality

### Authentication & Authorization
- Role-based access control (Admin, Teacher, Student)
- Secure login/registration with Laravel Sanctum
- Password reset functionality
- Session management

### Course Management
- Create courses with titles, descriptions, and cover images
- Organize content into modules
- Schedule management with recurring patterns
- Course status tracking (draft, published, archived)

### Content Delivery
- Multiple material types (documents, videos, links)
- File upload and download system
- Attachment management
- Content organization by modules

### Assessment & Grading
- Create assignments with deadlines
- Student submission system
- File attachment support
- Grade tracking and feedback

### Communication
- Announcement system
- Discussion forums with categories
- Reply threading
- Pin and lock discussions

### Analytics & Reporting
- Student progress tracking
- Online hours monitoring
- Dashboard statistics
- Activity logs

---

## 📱 User Roles

### Admin
- Full system access
- User management
- Course oversight
- System configuration

### Teacher
- Create and manage courses
- Upload materials and assignments
- Grade student work
- Moderate discussions
- View class lists

### Student
- Enroll in courses
- Access materials
- Submit assignments
- Participate in discussions
- Track progress

---

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme toggle for user preference
- **Modern UI**: Clean, intuitive interface with Lucide icons
- **Color-Coded Roles**: Pink theme for teachers, blue for students
- **Interactive Charts**: Visual progress tracking
- **Real-time Updates**: Live notifications and updates

---

## 🚀 Deployment Status

### Live URLs:
- **Frontend**: https://tinylearn-9a0f9.web.app
- **Backend**: [To be deployed]
- **Database**: [To be configured]

### Deployment Stack:
- Frontend hosted on Firebase Hosting
- Backend ready for Render deployment
- Database ready for Supabase setup

---

## 📊 Project Statistics

- **Total Files**: 100+ source files
- **Components**: 20+ React components
- **API Endpoints**: 50+ RESTful endpoints
- **Database Tables**: 20+ tables
- **Features**: 30+ major features
- **Lines of Code**: 10,000+ lines

---

## 🔒 Security Features

- CSRF protection
- XSS prevention
- SQL injection protection
- Secure password hashing
- API token authentication
- CORS configuration
- Input validation
- File upload restrictions

---

## 📦 Installation

### Prerequisites:
- Node.js 18+
- PHP 8.2+
- Composer
- PostgreSQL or MySQL

### Quick Start:
```bash
# Clone repository
git clone https://github.com/eclipse31-dev/TinyLearn.git

# Install backend dependencies
composer install

# Install frontend dependencies
cd react
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start development servers
php artisan serve
npm run dev
```

---

## 🎓 Use Cases

### Educational Institutions:
- Schools and universities
- Online learning platforms
- Training centers
- Corporate training programs

### Features for Learning:
- Structured course delivery
- Assignment management
- Progress tracking
- Student engagement
- Resource sharing

---

## 🔄 Future Enhancements

- Video conferencing integration
- Quiz and exam system
- Certificate generation
- Mobile app (React Native)
- AI-powered recommendations
- Advanced analytics
- Gamification features
- Multi-language support

---

## 👥 Target Audience

- **Educational Institutions**: Schools, colleges, universities
- **Online Course Creators**: Independent educators
- **Corporate Training**: Employee development programs
- **Students**: Learners of all ages
- **Teachers**: Educators and instructors

---

## 📄 License

This project is open-source and available for educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Please follow standard Git workflow:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/eclipse31-dev/TinyLearn/issues
- Documentation: See deployment guides in repository

---

## 🏆 Project Highlights

✅ Full-stack application with modern tech stack
✅ Role-based access control
✅ Responsive design
✅ RESTful API architecture
✅ Secure authentication
✅ File upload/download system
✅ Real-time features
✅ Production-ready deployment
✅ Comprehensive documentation
✅ Free hosting options

---

**Built with ❤️ for education**

**Live Demo**: https://tinylearn-9a0f9.web.app
**Repository**: https://github.com/eclipse31-dev/TinyLearn
