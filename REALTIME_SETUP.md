# Real-Time Features Setup Guide

## Overview
The application now has real-time features using Laravel Reverb (WebSocket server).

## What's Real-Time?
- **Announcements**: Instant notifications when new announcements are posted
- **Assignments**: Live updates when assignments are created
- **Grades**: Students get notified immediately when graded
- **Online Users**: See who's currently online in real-time
- **Activity Feed**: Live stream of platform activities

## Starting the Real-Time System

### 1. Start Laravel Backend (Terminal 1)
```bash
php artisan serve
```
This runs on `http://localhost:8000`

### 2. Start Reverb WebSocket Server (Terminal 2)
```bash
php artisan reverb:start
```
This runs on `ws://localhost:8080`

### 3. Start Queue Worker (Terminal 3)
```bash
php artisan queue:work
```
This processes broadcast events

### 4. Start React Frontend (Terminal 4)
```bash
cd react
npm run dev
```
This runs on `http://localhost:5173`

## Testing Real-Time Features

### Test Announcements
1. Login as teacher/admin
2. Create a new announcement
3. Other users will see instant notification

### Test Grades
1. Login as teacher
2. Grade a student submission
3. Student will receive instant notification

### Test Online Users
1. Open multiple browser windows
2. Login with different accounts
3. See online users list update in real-time

## Configuration Files

### Laravel (.env)
```
BROADCAST_CONNECTION=reverb
QUEUE_CONNECTION=database
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_HOST=localhost
REVERB_PORT=8080
```

### React (react/.env)
```
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Broadcast Channels

### Public Channels
- `announcements` - All announcements
- `assignments` - All assignments
- `course.{courseId}` - Course-specific updates

### Private Channels
- `user.{userId}` - Personal notifications (grades, etc.)

### Presence Channels
- `online` - Track online users

## Troubleshooting

### WebSocket Connection Failed
- Ensure Reverb is running: `php artisan reverb:start`
- Check port 8080 is not in use
- Verify REVERB_APP_KEY matches in both .env files

### Events Not Broadcasting
- Ensure queue worker is running: `php artisan queue:work`
- Check QUEUE_CONNECTION=database in .env
- Verify events implement ShouldBroadcast interface

### Authentication Issues
- Ensure token is stored in localStorage
- Check broadcasting/auth endpoint is accessible
- Verify user is authenticated before joining channels

## Components

### Real-Time Components
- `OnlineUsers.jsx` - Shows online users with presence channel
- `ActivityFeed.jsx` - Live activity stream
- `LiveProgressTracker.jsx` - Real-time progress updates
- `RealTimeNotifications.jsx` - Toast notifications for events

### Echo Service
- `react/src/services/echo.js` - WebSocket connection configuration
