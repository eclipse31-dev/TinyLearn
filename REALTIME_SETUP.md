# Real-Time Access Setup Guide

This project now has full real-time capabilities using Laravel Reverb WebSockets.

## Quick Start

### 1. Start the Backend Services

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
This starts on `http://localhost:8000`

**Terminal 2 - Reverb WebSocket Server:**
```bash
php artisan reverb:start
```
This starts on `ws://localhost:8080`

**Terminal 3 - Queue Worker (for background jobs):**
```bash
php artisan queue:work
```

### 2. Start the Frontend

**Terminal 4 - React Dev Server:**
```bash
cd react
npm run dev
```
This starts on `http://localhost:3000`

## Or Use the Combined Command

If you have all dependencies installed, run from the root:
```bash
composer dev
```
This runs all services concurrently.

## Real-Time Features Enabled

### 1. **Live Course Updates**
- Announcements appear instantly across all connected users
- Assignments update in real-time
- Course materials sync automatically

### 2. **Online User Tracking**
- See who's online in real-time
- User status updates instantly
- Activity tracking on dashboard

### 3. **Live Notifications**
- Instant notifications for all events
- Grade updates appear immediately
- Message notifications in real-time

### 4. **Session Management**
- Track active user sessions
- Real-time session updates
- Automatic session cleanup

### 5. **Message Broadcasting**
- Instant message delivery
- Discussion replies appear live
- Conversation updates in real-time

## Architecture

### Backend (Laravel)
- **Reverb**: WebSocket server for real-time communication
- **Broadcasting**: Event broadcasting system
- **Channels**: Public and private channel definitions
- **RealtimeService**: Centralized broadcast service

### Frontend (React)
- **Echo**: Laravel Echo client for WebSocket connections
- **useRealtime Hook**: React hook for subscribing to events
- **RealtimeService**: Centralized real-time event management
- **RealtimeDashboard**: Live dashboard component

## Environment Variables

### Backend (.env)
```
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=12345
REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
```

### Frontend (react/.env)
```
VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Using Real-Time Features in Components

### Subscribe to Events
```jsx
import { useRealtime } from '../hooks/useRealtime';

function MyComponent() {
  useRealtime('course.123', 'announcement.created', (data) => {
    console.log('New announcement:', data);
  });
}
```

### Broadcast Events
```jsx
import realtimeService from '../services/realtimeService';

// Broadcast to a channel
realtimeService.broadcast('course.123', 'announcement.created', {
  title: 'New Announcement',
  content: 'This is a test'
});
```

### Private Channels
```jsx
// Subscribe to private channel (only authenticated user)
useRealtime('user.123', 'notification.created', (data) => {
  console.log('Private notification:', data);
}, true); // true = private channel
```

## Available Channels

### Public Channels
- `course.{courseId}` - Course updates
- `online-users` - Online user tracking
- `user-sessions` - Session updates

### Private Channels
- `user.{userId}` - User-specific events
- `submission.{submissionId}` - Submission updates
- `conversation.{conversationId}` - Message conversations

## Available Events

### Course Events
- `course.updated` - Course information changed
- `announcement.created` - New announcement
- `assignment.created` - New assignment
- `material.created` - New material

### User Events
- `user.online` - User came online
- `notification.created` - New notification
- `session.updated` - Session activity

### Submission Events
- `submission.updated` - Submission status changed
- `grade.updated` - Grade posted

### Message Events
- `message.sent` - New message in conversation

## Testing Real-Time Features

1. Open the app in multiple browser windows
2. Log in with different users
3. Create an announcement in one window
4. Watch it appear instantly in other windows
5. Check the Real-time Dashboard for live updates

## Troubleshooting

### WebSocket Connection Issues
- Ensure Reverb server is running: `php artisan reverb:start`
- Check firewall allows port 8080
- Verify `REVERB_HOST` and `REVERB_PORT` in .env

### Events Not Broadcasting
- Check `BROADCAST_CONNECTION=reverb` in .env
- Verify channels.php has correct authorization logic
- Check browser console for connection errors

### Performance Issues
- Limit number of concurrent connections
- Use private channels for sensitive data
- Implement message throttling if needed

## Production Deployment

For production, use:
- **Pusher** or **Ably** instead of local Reverb
- Update `BROADCAST_CONNECTION` to `pusher` or `ably`
- Configure appropriate credentials in .env
- Use HTTPS/WSS for secure connections

## Next Steps

1. Implement real-time features in your components
2. Add event broadcasting to your controllers
3. Test with multiple concurrent users
4. Monitor performance and optimize as needed
5. Deploy to production with appropriate service
