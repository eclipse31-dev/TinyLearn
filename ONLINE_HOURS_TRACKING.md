# Online Hours Tracking System

## Overview
The system now tracks user online hours and displays them in a beautiful bar graph on the Dashboard.

## Features Implemented

### Backend (Laravel)

1. **Database Table**: `user_sessions`
   - Tracks login/logout times
   - Calculates session duration
   - Stores IP address and user agent
   - Supports active session tracking

2. **UserSession Model** (`app/Models/UserSession.php`)
   - Relationships with User model
   - Helper methods for calculating hours
   - Query scopes for filtering (today, week, month)

3. **UserSessionService** (`app/Services/UserSessionService.php`)
   - `startSession()` - Creates session on login
   - `endSession()` - Ends session on logout
   - `getOnlineHoursStats()` - Get user statistics by period
   - `getDailyOnlineHoursChart()` - Get chart data for visualization
   - `getActiveUsersCount()` - Count currently online users

4. **Updated Controllers**:
   - `AuthController` - Automatically starts/ends sessions on login/logout
   - `DashboardAnalyticsController` - New endpoints for online hours data

5. **New API Endpoints**:
   - `GET /api/dashboard/stats` - Dashboard statistics
   - `GET /api/dashboard/online-hours?period=week` - Online hours stats
   - `GET /api/dashboard/online-hours-chart?days=7` - Chart data

### Frontend (React)

1. **OnlineHoursChart Component** (`react/src/components/OnlineHoursChart.jsx`)
   - Beautiful bar chart using Chart.js
   - Shows total hours online per day
   - Shows number of active users per day
   - Dual Y-axis for better visualization
   - Period selector (week/month)

2. **OnlineHoursStats Component** (`react/src/components/OnlineHoursStats.jsx`)
   - Top 10 users by online hours
   - Role-based color coding (pink for admin/teacher, blue for student)
   - Session count per user
   - Currently online users indicator

3. **Enhanced Dashboard** (`react/src/views/Dashboard.jsx`)
   - Quick stats cards (role-based)
   - Period selector (Today/Week/Month)
   - Grid layout with chart and statistics
   - Real-time data fetching

4. **Styling** (`react/src/styles/online-hours.css`)
   - Modern, clean design
   - Responsive layout
   - Loading states and error handling
   - Hover effects and animations

## How It Works

1. **Session Tracking**:
   - When a user logs in, a new session is created with `login_at` timestamp
   - Session is marked as `is_active = true`
   - When user logs out, session is updated with `logout_at` and `duration_minutes`
   - Session is marked as `is_active = false`

2. **Data Visualization**:
   - Chart shows daily online hours for the last 7 or 30 days
   - Statistics show top users ranked by total online hours
   - Active users are counted in real-time

3. **Period Filtering**:
   - Today: Shows only today's data
   - Week: Shows last 7 days
   - Month: Shows last 30 days

## Usage

### Running the Application

```bash
# Start Laravel backend (port 8000)
php artisan serve

# Start Laravel Reverb (port 8080)
php artisan reverb:start

# Start React frontend (port 3000)
cd react
npm run dev
```

### Accessing the Dashboard

1. Open http://localhost:3000
2. Login with test credentials:
   - Admin: admin@example.com / password
   - Teacher: teacher@example.com / password
   - Student: student@example.com / password
3. View the Dashboard to see online hours tracking

### Creating Test Data

```bash
php create_test_sessions.php
```

This creates sample session data for the last 7 days and some active sessions.

## API Examples

### Get Online Hours Statistics
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/dashboard/online-hours?period=week"
```

### Get Chart Data
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/dashboard/online-hours-chart?days=7"
```

### Get Dashboard Stats
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/dashboard/stats"
```

## Database Schema

```sql
CREATE TABLE user_sessions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_at TIMESTAMP NOT NULL,
    logout_at TIMESTAMP NULL,
    duration_minutes INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);
```

## Features

✅ Automatic session tracking on login/logout
✅ Real-time active users count
✅ Beautiful bar chart visualization
✅ Top users leaderboard
✅ Period filtering (today/week/month)
✅ Role-based color coding
✅ Responsive design
✅ Loading states and error handling
✅ Dual Y-axis chart (hours + user count)
✅ Session duration calculation
✅ IP address and user agent tracking

## Future Enhancements

- Export data to CSV/PDF
- Email reports for admins
- Session timeout warnings
- Detailed session history per user
- Activity heatmap
- Comparison between periods
- User engagement metrics

## Notes

- Sessions are automatically created on login
- Sessions are automatically ended on logout
- Active sessions show current online time
- Chart updates when period is changed
- Statistics are cached for 5 minutes for performance
- Old sessions can be cleaned up using `UserSessionService::cleanupOldSessions()`
