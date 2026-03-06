# Role-Based Folder Structure

## Overview
The application now uses a clean folder structure where each user role (Admin, Teacher, Student) has its own dedicated folder containing role-specific components and features.

## Folder Structure

```
react/src/views/
├── HomePage.jsx                    # Router component
├── admin/
│   ├── Dashboard.jsx              # Admin dashboard
│   └── index.js                   # Export file
├── teacher/
│   ├── Dashboard.jsx              # Teacher dashboard
│   └── index.js                   # Export file
└── student/
    ├── Dashboard.jsx              # Student dashboard
    └── index.js                   # Export file
```

## Detailed Structure

### Admin Folder (`react/src/views/admin/`)
**Purpose**: Contains all admin-specific views and components

**Files**:
- `Dashboard.jsx` - Main admin dashboard with system-wide statistics
- `index.js` - Export file for clean imports

**Features**:
- 👥 Total Users management
- 📚 Total Courses overview
- 🟢 Real-time users online
- 📝 Total Assignments tracking
- Online hours bar chart
- Top users leaderboard

**Future Additions**:
```
admin/
├── Dashboard.jsx
├── UserManagement.jsx
├── SystemSettings.jsx
├── Reports.jsx
├── Analytics.jsx
└── index.js
```

### Teacher Folder (`react/src/views/teacher/`)
**Purpose**: Contains all teacher-specific views and components

**Files**:
- `Dashboard.jsx` - Main teacher dashboard with course management
- `index.js` - Export file for clean imports

**Features**:
- 📚 My Courses management
- 👥 Student tracking
- ⏳ Pending submissions review
- 📝 Assignment management
- Online hours bar chart
- Student activity tracking

**Future Additions**:
```
teacher/
├── Dashboard.jsx
├── CourseManagement.jsx
├── GradeBook.jsx
├── StudentProgress.jsx
├── CreateAssignment.jsx
└── index.js
```

### Student Folder (`react/src/views/student/`)
**Purpose**: Contains all student-specific views and components

**Files**:
- `Dashboard.jsx` - Main student dashboard with academic progress
- `index.js` - Export file for clean imports

**Features**:
- 📚 Enrolled courses view
- ⏳ Pending assignments list
- ✅ Submitted work tracking
- 📊 Average grade display
- Online hours bar chart
- Personal progress tracking

**Future Additions**:
```
student/
├── Dashboard.jsx
├── MyCourses.jsx
├── Assignments.jsx
├── Grades.jsx
├── Schedule.jsx
└── index.js
```

## Import Pattern

### Clean Imports with index.js
Each folder has an `index.js` file that exports components:

```javascript
// react/src/views/admin/index.js
export { default as Dashboard } from './Dashboard';

// react/src/views/teacher/index.js
export { default as Dashboard } from './Dashboard';

// react/src/views/student/index.js
export { default as Dashboard } from './Dashboard';
```

### Usage in HomePage.jsx
```javascript
import { Dashboard as AdminDashboard } from './admin';
import { Dashboard as TeacherDashboard } from './teacher';
import { Dashboard as StudentDashboard } from './student';
```

## Routing Logic

### HomePage.jsx (Router Component)
```javascript
export default function HomePage() {
  const { user } = useContext(AuthContext);
  const role = user?.roles?.[0]?.role || 'student';

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
}
```

## Benefits

### 1. Organization
✅ Clear separation by role
✅ Easy to find role-specific code
✅ Logical folder structure
✅ Scalable architecture

### 2. Maintainability
✅ Isolated role features
✅ Independent updates
✅ Reduced merge conflicts
✅ Clear ownership

### 3. Scalability
✅ Easy to add new role features
✅ Can add new roles easily
✅ Room for growth
✅ Modular design

### 4. Developer Experience
✅ Intuitive navigation
✅ Clear naming conventions
✅ Easy onboarding
✅ Better code reviews

### 5. Security
✅ Clear role boundaries
✅ Easier permission audits
✅ Reduced data leakage risk
✅ Role-based access control

## Adding New Components

### Admin Component
```bash
# Create new admin component
react/src/views/admin/UserManagement.jsx
```

```javascript
// Export in index.js
export { default as Dashboard } from './Dashboard';
export { default as UserManagement } from './UserManagement';
```

### Teacher Component
```bash
# Create new teacher component
react/src/views/teacher/GradeBook.jsx
```

```javascript
// Export in index.js
export { default as Dashboard } from './Dashboard';
export { default as GradeBook } from './GradeBook';
```

### Student Component
```bash
# Create new student component
react/src/views/student/MyCourses.jsx
```

```javascript
// Export in index.js
export { default as Dashboard } from './Dashboard';
export { default as MyCourses } from './MyCourses';
```

## File Naming Conventions

### Component Files
- Use PascalCase: `Dashboard.jsx`, `UserManagement.jsx`
- Descriptive names: `CreateAssignment.jsx`, `StudentProgress.jsx`
- Avoid abbreviations: `GradeBook.jsx` not `GB.jsx`

### Export Files
- Always named `index.js`
- Contains all exports for the folder
- Uses named exports for clarity

### Style Files (if needed)
- Use kebab-case: `dashboard.css`, `user-management.css`
- Co-locate with components
- Import relatively

## Import Path Examples

### From HomePage
```javascript
// Clean imports
import { Dashboard as AdminDashboard } from './admin';
import { Dashboard as TeacherDashboard } from './teacher';
import { Dashboard as StudentDashboard } from './student';
```

### From Dashboard Components
```javascript
// Relative imports for shared components
import DashboardLayout from '../../components/DashboardLayout';
import OnlineHoursChart from '../../components/OnlineHoursChart';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/home.css';
```

### Future Role-Specific Imports
```javascript
// Admin importing admin components
import { UserManagement, SystemSettings } from './';

// Teacher importing teacher components
import { GradeBook, CourseManagement } from './';

// Student importing student components
import { MyCourses, Assignments } from './';
```

## Migration Guide

### Before (Old Structure)
```
react/src/views/
├── HomePage.jsx
├── AdminDashboard.jsx
├── TeacherDashboard.jsx
└── StudentDashboard.jsx
```

### After (New Structure)
```
react/src/views/
├── HomePage.jsx
├── admin/
│   ├── Dashboard.jsx
│   └── index.js
├── teacher/
│   ├── Dashboard.jsx
│   └── index.js
└── student/
    ├── Dashboard.jsx
    └── index.js
```

## Testing

### Test Each Role Dashboard
```bash
# Admin
Email: admin@example.com
Password: password
Expected: Admin Dashboard with system stats

# Teacher
Email: teacher@example.com
Password: password
Expected: Teacher Dashboard with course stats

# Student
Email: student@example.com
Password: password
Expected: Student Dashboard with academic stats
```

## Future Enhancements

### Shared Components
```
react/src/views/
├── shared/
│   ├── OnlineHoursWidget.jsx
│   ├── StatsCard.jsx
│   └── index.js
```

### Role-Specific Styles
```
react/src/views/
├── admin/
│   ├── Dashboard.jsx
│   ├── styles/
│   │   └── dashboard.css
│   └── index.js
```

### Role-Specific Utilities
```
react/src/views/
├── admin/
│   ├── Dashboard.jsx
│   ├── utils/
│   │   └── adminHelpers.js
│   └── index.js
```

## Summary

The new folder structure provides:
- **Clear Organization**: Each role has its own folder
- **Easy Navigation**: Find role-specific code quickly
- **Scalability**: Add new features without cluttering
- **Maintainability**: Update roles independently
- **Clean Imports**: Use index.js for better imports

This structure makes the codebase more professional, maintainable, and ready for future growth!
