# TinyLearn System Description

## One-Sentence Explanation

TinyLearn is a comprehensive Learning Management System (LMS) that enables teachers to create and manage courses, assignments, and materials while allowing students to enroll, submit work, participate in discussions, and track their academic progress through an intuitive web interface.

## Key Features

- **Course Management** - Create, edit, and organize courses
- **Assignment System** - Create assignments, collect submissions, grade work
- **Materials & Resources** - Share documents, videos, and external links
- **Discussion Forums** - Enable student-teacher communication
- **Schedule Management** - Organize class schedules and events
- **Progress Tracking** - Monitor student performance and engagement
- **Real-time Analytics** - View online hours and activity statistics
- **Role-Based Access** - Student, Teacher, and Admin roles
- **Demo Mode** - Full-featured demo without backend connection

## Technology Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization
- Lucide React for icons

### Backend
- Laravel PHP framework
- RESTful API architecture
- MySQL/PostgreSQL database
- JWT authentication
- Laravel Sanctum for API tokens

### Deployment
- **Frontend:** Vercel (https://vite-react-z6ty.vercel.app)
- **Backend:** Render (https://tinylearn-backend.onrender.com)
- **Database:** Supabase PostgreSQL

## User Roles

### Student
- Enroll in courses
- View materials and resources
- Submit assignments
- Participate in discussions
- Track grades and progress

### Teacher
- Create and manage courses
- Post announcements
- Create assignments
- Grade submissions
- View student analytics

### Admin
- Manage all users
- System-wide analytics
- Full administrative control
- User role management
