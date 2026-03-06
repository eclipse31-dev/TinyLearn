# Role-Based Dashboard Structure

## Overview
The dashboard is now separated into three distinct files based on user roles: Admin, Teacher, and Student. Each role has its own dedicated dashboard component with role-specific features and statistics.

## File Structure

```
react/src/views/
├── HomePage.jsx           # Router component (routes to role-specific dashboard)
├── AdminDashboard.jsx     # Admin-only dashboard
├── TeacherDashboard.jsx   # Teacher-only dashboard
└── StudentDashboard.jsx   # Student-only dashboard
```

## Components

### 1. HomePage.jsx (Router)
**Purpose**: Routes users to the appropriate dashboard based on their role

**Features**:
- Checks user authentication
- Determines user role from context
- Routes to appropriate dashboard component
- Redirects to login if not authenticated

**Code**:
```javascript
switch (role) {
  case 'admin':
    return <AdminDashboard />;
  case 'teacher':
    return <TeacherDashboard />;
  case 'student':
    return <StudentDashboard />;
  default:
    return <StudentDashboard />;
}
```

### 2. AdminDashboard.jsx
**Purpose**: Dashboard for administrators with system-wide statistics

**Features**:
- 👥 Total Users count
- 📚 Total Courses count
- 🟢 Users Online (real-time)
- 📝 Total Assignments count
- Real-time online hours bar chart
- Top users leaderboard
- Period selector (Today/Week/Month)
- Real-time WebSocket updates

**Stats Cards**:
```javascript
- Total Users
- Total Courses
- Users Online (real-time)
- Total Assignments
```

**Access**: Only users with `admin` role

### 3. TeacherDashboard.jsx
**Purpose**: Dashboard for teachers with course and student management

**Features**:
- 📚 My Courses count
- 👥 Total Students count
- ⏳ Pending Submissions count
- 📝 Total Assignments count
- Real-time online hours bar chart
- Top users leaderboard
- Period selector (Today/Week/Month)
- Real-time WebSocket updates

**Stats Cards**:
```javascript
- My Courses
- Total Students
- Pending Submissions
- Total Assignments
```

**Access**: Only users with `teacher` role

### 4. StudentDashboard.jsx
**Purpose**: Dashboard for students with personal academic progress

**Features**:
- 📚 Enrolled Courses count
- ⏳ Pending Assignments count
- ✅ Submitted Assignments count
- 📊 Average Grade percentage
- Real-time online hours bar chart
- Top users leaderboard
- Period selector (Today/Week/Month)
- Real-time WebSocket updates

**Stats Cards**:
```javascript
- Enrolled Courses
- Pending Assignments
- Submitted Assignments
- Average Grade
```

**Access**: Only users with `student` role

## Common Features (All Dashboards)

### Real-Time Updates
All dashboards include:
- WebSocket connection to `user-sessions` channel
- Auto-refresh on login/logout events
- Toast notifications for user activity
- Live indicators (🔴 LIVE badge)

### Online Hours Tracking
All dashboards display:
- **OnlineHoursChart**: Bar graph showing daily online hours
- **OnlineHoursStats**: Top 10 users by online hours
- **Period Selector**: Filter by Today/Week/Month

### Layout
All dashboards use:
- DashboardLayout wrapper
- Consistent styling
- Responsive design
- Role-specific welcome message

## API Integration

### Dashboard Stats Endpoint
```javascript
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Response varies by role**:

**Admin Response**:
```json
{
  "total_users": 50,
  "total_courses": 25,
  "active_users_online": 5,
  "total_assignments": 100,
  "users_by_role": {...},
  "courses_by_status": {...},
  "recent_activity": [...],
  "enrollment_trend": [...],
  "online_hours_chart": [...]
}
```

**Teacher Response**:
```json
{
  "my_courses": 5,
  "total_students": 120,
  "pending_submissions": 15,
  "total_assignments": 30,
  "recent_submissions": [...],
  "course_enrollments": [...]
}
```

**Student Response**:
```json
{
  "enrolled_courses": 6,
  "pending_assignments": 3,
  "submitted_assignments": 12,
  "average_grade": 85.5,
  "upcoming_assignments": [...],
  "recent_grades": [...],
  "course_progress": [...]
}
```

## Routing

### Current Route
```javascript
{
  path: "/",
  element: <PrivateRoute><HomePage /></PrivateRoute>,
}
```

### How It Works
1. User navigates to `/` or `/dashboard`
2. `PrivateRoute` checks authentication
3. `HomePage` component loads
4. User role is determined from `AuthContext`
5. Appropriate dashboard component renders

## Benefits of Separation

### 1. Maintainability
- Each role has its own file
- Easy to modify role-specific features
- Clear separation of concerns
- Reduced code complexity

### 2. Scalability
- Easy to add new role-specific features
- Can create new roles easily
- Independent component updates
- Better code organization

### 3. Performance
- Only loads necessary code for each role
- Smaller component size
- Faster rendering
- Better code splitting potential

### 4. Security
- Clear role boundaries
- Easier to audit permissions
- Role-specific data fetching
- Reduced risk of data leakage

### 5. Developer Experience
- Easy to find role-specific code
- Clear file naming convention
- Better code navigation
- Simplified debugging

## Customization Guide

### Adding New Stats Card

**Admin Dashboard**:
```javascript
<div className="stat-card">
  <div className="stat-icon">🎯</div>
  <div className="stat-info">
    <h4>New Metric</h4>
    <div className="stat-value">{dashboardStats.new_metric}</div>
  </div>
</div>
```

**Teacher Dashboard**:
```javascript
<div className="stat-card">
  <div className="stat-icon">📈</div>
  <div className="stat-info">
    <h4>Course Rating</h4>
    <div className="stat-value">{dashboardStats.course_rating}</div>
  </div>
</div>
```

**Student Dashboard**:
```javascript
<div className="stat-card">
  <div className="stat-icon">🏆</div>
  <div className="stat-info">
    <h4>Achievements</h4>
    <div className="stat-value">{dashboardStats.achievements}</div>
  </div>
</div>
```

### Adding New Section

Add after the stats cards:
```javascript
{/* New Section */}
<div className="new-section">
  <h2>Section Title</h2>
  {/* Section content */}
</div>
```

### Modifying Real-Time Behavior

Update the WebSocket listener:
```javascript
channel.listen('.session.updated', (data) => {
  console.log('Session updated:', data);
  // Custom logic here
  fetchDashboardStats();
  showCustomNotification(data);
});
```

## Testing

### Test Admin Dashboard
```bash
# Login as admin
Email: admin@example.com
Password: password
```

### Test Teacher Dashboard
```bash
# Login as teacher
Email: teacher@example.com
Password: password
```

### Test Student Dashboard
```bash
# Login as student
Email: student@example.com
Password: password
```

## File Locations

```
react/src/views/
├── HomePage.jsx              # 30 lines - Router
├── AdminDashboard.jsx        # 130 lines - Admin features
├── TeacherDashboard.jsx      # 130 lines - Teacher features
└── StudentDashboard.jsx      # 130 lines - Student features
```

## Summary

The dashboard is now cleanly separated into role-specific files:
- **HomePage.jsx**: Routes to appropriate dashboard
- **AdminDashboard.jsx**: System-wide administration
- **TeacherDashboard.jsx**: Course and student management
- **StudentDashboard.jsx**: Personal academic progress

Each dashboard maintains the same real-time features while displaying role-appropriate statistics and information.
