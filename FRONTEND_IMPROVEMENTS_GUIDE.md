# Frontend Production-Ready Improvements

## 📁 New Folder Structure

```
react/src/
├── api/                    # API service layer
│   ├── client.js          # Axios instance with interceptors
│   ├── courseService.js   # Course API calls
│   ├── assignmentService.js
│   ├── submissionService.js
│   ├── authService.js
│   └── notificationService.js
├── components/
│   ├── common/            # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorBoundary.jsx
│   ├── layout/            # Layout components
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── features/          # Feature-specific components
│       ├── courses/
│       ├── assignments/
│       ├── notifications/
│       └── dashboard/
├── hooks/                 # Custom React hooks
│   ├── useAuth.js
│   ├── useCourses.js
│   ├── useNotifications.js
│   └── useDebounce.js
├── context/               # Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── NotificationContext.jsx
├── pages/                 # Page components
│   ├── Dashboard.jsx
│   ├── Courses.jsx
│   ├── Assignments.jsx
│   └── Settings.jsx
├── utils/                 # Utility functions
│   ├── formatters.js
│   ├── validators.js
│   └── constants.js
├── styles/                # Global styles
└── router/                # Route configuration
    └── index.jsx
```

## 1. API Service Layer

### api/client.js
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### api/courseService.js
```javascript
import apiClient from './client';

export const courseService = {
  getAll: (params) => apiClient.get('/courses', { params }),
  getById: (id) => apiClient.get(`/courses/${id}`),
  create: (data) => apiClient.post('/courses', data),
  update: (id, data) => apiClient.put(`/courses/${id}`, data),
  delete: (id) => apiClient.delete(`/courses/${id}`),
  search: (query) => apiClient.get('/courses/search', { params: { q: query } }),
};
```

## 2. Custom Hooks

### hooks/useCourses.js
```javascript
import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../api/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAll(params);
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id, courseData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await courseService.update(id, courseData);
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
```

### hooks/useNotifications.js
```javascript
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../api/notificationService';
import echo from '../services/echo';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  // Real-time notifications
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const channel = echo.private(`user.${userId}`);
    
    channel.listen('.notification.created', (event) => {
      setNotifications(prev => [event.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      echo.leave(`user.${userId}`);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
```

## 3. Enhanced Dashboard Component

### pages/Dashboard.jsx
```javascript
import { useState, useEffect } from 'react';
import { dashboardService } from '../api/dashboardService';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingAssignments from '../components/dashboard/UpcomingAssignments';
import CourseProgress from '../components/dashboard/CourseProgress';
import Loading from '../components/common/Loading';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <div className="dashboard">
        <h1>Welcome back, {user.first_name}!</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          {user.role === 'admin' && (
            <>
              <StatsCard
                title="Total Users"
                value={stats.total_users}
                icon="👥"
                trend="+12%"
              />
              <StatsCard
                title="Total Courses"
                value={stats.total_courses}
                icon="📚"
                trend="+5%"
              />
              <StatsCard
                title="Assignments"
                value={stats.total_assignments}
                icon="📝"
              />
              <StatsCard
                title="Submissions"
                value={stats.total_submissions}
                icon="✅"
              />
            </>
          )}

          {user.role === 'teacher' && (
            <>
              <StatsCard
                title="My Courses"
                value={stats.my_courses}
                icon="📚"
              />
              <StatsCard
                title="Total Students"
                value={stats.total_students}
                icon="👥"
              />
              <StatsCard
                title="Pending Submissions"
                value={stats.pending_submissions}
                icon="⏳"
              />
            </>
          )}

          {user.role === 'student' && (
            <>
              <StatsCard
                title="Enrolled Courses"
                value={stats.enrolled_courses}
                icon="📚"
              />
              <StatsCard
                title="Pending Assignments"
                value={stats.pending_assignments}
                icon="📝"
              />
              <StatsCard
                title="Average Grade"
                value={`${stats.average_grade?.toFixed(1)}%`}
                icon="⭐"
              />
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <div className="dashboard-left">
            {user.role === 'student' && (
              <>
                <UpcomingAssignments assignments={stats.upcoming_assignments} />
                <CourseProgress progress={stats.course_progress} />
              </>
            )}
            {user.role === 'teacher' && (
              <RecentActivity activity={stats.recent_submissions} />
            )}
          </div>

          <div className="dashboard-right">
            <RecentActivity activity={stats.recent_activity} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

## 4. Role-Based Routing

### router/ProtectedRoute.jsx
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

### router/index.jsx
```javascript
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Loading from '../components/common/Loading';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Courses = lazy(() => import('../pages/Courses'));
const CourseDetail = lazy(() => import('../pages/CourseDetail'));
const Assignments = lazy(() => import('../pages/Assignments'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading fullscreen />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading fullscreen />}>
          <Courses />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses/create',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <Suspense fallback={<Loading fullscreen />}>
          <CreateCourse />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // ... more routes
]);

export default router;
```

## 5. Performance Optimization

### Memoization Example
```javascript
import { useMemo, useCallback } from 'react';

function CourseList({ courses, onCourseClick }) {
  // Memoize filtered courses
  const activeCourses = useMemo(() => {
    return courses.filter(course => course.status === 'active');
  }, [courses]);

  // Memoize callback
  const handleClick = useCallback((courseId) => {
    onCourseClick(courseId);
  }, [onCourseClick]);

  return (
    <div>
      {activeCourses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => handleClick(course.id)}
        />
      ))}
    </div>
  );
}
```

## 6. Error Handling

### components/common/ErrorBoundary.jsx
```javascript
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 7. Implementation Checklist

### Phase 1: Structure
- [ ] Create new folder structure
- [ ] Move existing components to appropriate folders
- [ ] Create API service layer
- [ ] Set up axios interceptors

### Phase 2: State Management
- [ ] Implement custom hooks
- [ ] Refactor context providers
- [ ] Add error handling
- [ ] Add loading states

### Phase 3: Components
- [ ] Create reusable components
- [ ] Implement role-based UI
- [ ] Add confirmation dialogs
- [ ] Improve responsiveness

### Phase 4: Performance
- [ ] Implement lazy loading
- [ ] Add memoization
- [ ] Optimize re-renders
- [ ] Add virtual scrolling for lists

### Phase 5: Testing
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Test error scenarios
- [ ] Test role-based access

## 8. Next Steps

1. Run migrations for new tables:
```bash
php artisan migrate
```

2. Install any missing npm packages:
```bash
cd react
npm install
```

3. Update environment variables:
```env
VITE_API_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=your-key
```

4. Start implementing the new structure incrementally
5. Test each component as you refactor
6. Update documentation as you go
