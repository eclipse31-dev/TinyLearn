# Real-Time Online Hours Tracking System

## Overview
The online hours tracking system now updates in real-time using Laravel Reverb WebSockets. When any user logs in or out, all connected clients see the updates instantly.

## Real-Time Features

### 1. Live Session Updates
- **Instant Updates**: When a user logs in or out, all dashboards update immediately
- **No Page Refresh**: Data refreshes automatically without reloading the page
- **WebSocket Connection**: Uses Laravel Reverb for efficient real-time communication

### 2. Live Notifications
- **Toast Notifications**: Pop-up notifications when users go online/offline
  - 🟢 Green toast for login: "User Name is now online"
  - 🔴 Red toast for logout: "User Name went offline"
- **Auto-dismiss**: Notifications disappear after 3 seconds
- **Smooth Animations**: Slide-in and slide-out effects

### 3. Real-Time Indicators
- **Live Badge**: Shows "🔴 LIVE" indicator on the chart title
- **Pulsing Dot**: Animated indicator in the statistics panel
- **Active Users Count**: Updates instantly when users login/logout

### 4. Auto-Refresh Components
All these components update automatically:
- **Bar Chart**: Daily online hours graph
- **Statistics Panel**: Top users leaderboard
- **Dashboard Stats Cards**: Total users online count
- **Active Users Counter**: Real-time count of online users

## Technical Implementation

### Backend (Laravel)

#### Event Broadcasting
**File**: `app/Events/UserSessionUpdated.php`
```php
// Broadcasts on 'user-sessions' channel
// Event name: 'session.updated'
// Data: user_id, user_name, action (login/logout), timestamp
```

#### Service Layer
**File**: `app/Services/UserSessionService.php`
- `startSession()`: Creates session and broadcasts login event
- `endSession()`: Ends session and broadcasts logout event

#### Broadcasting Configuration
- **Channel**: `user-sessions` (public channel)
- **Event**: `.session.updated`
- **Transport**: Laravel Reverb WebSocket server

### Frontend (React)

#### WebSocket Connection
**File**: `react/src/services/echo.js`
```javascript
// Connects to Laravel Reverb on port 8080
// Manages WebSocket connection lifecycle
```

#### Real-Time Components

1. **OnlineHoursChart.jsx**
   - Listens to `user-sessions` channel
   - Refreshes chart data on session updates
   - Shows "🔴 LIVE" indicator in title

2. **OnlineHoursStats.jsx**
   - Listens to `user-sessions` channel
   - Refreshes statistics on session updates
   - Shows toast notifications for login/logout
   - Displays pulsing "Live" badge

3. **HomePage.jsx**
   - Listens to `user-sessions` channel
   - Refreshes dashboard stats on session updates
   - Updates active users count in real-time

## How It Works

### Login Flow
1. User logs in via `AuthController::login()`
2. `UserSessionService::startSession()` creates a session record
3. `UserSessionUpdated` event is broadcast to all clients
4. All connected dashboards receive the event
5. Components automatically refresh their data
6. Toast notification appears: "🟢 User is now online"

### Logout Flow
1. User logs out via `AuthController::logout()`
2. `UserSessionService::endSession()` ends the session
3. `UserSessionUpdated` event is broadcast to all clients
4. All connected dashboards receive the event
5. Components automatically refresh their data
6. Toast notification appears: "🔴 User went offline"

### Real-Time Updates
```javascript
// Components listen for events
echo.channel('user-sessions')
  .listen('.session.updated', (data) => {
    // data contains: user_id, user_name, action, timestamp
    showNotification(data);
    refreshData();
  });
```

## Visual Indicators

### Live Badge
```
🔴 LIVE - User Online Hours - Last 7 Days
```
- Appears in chart title
- Indicates real-time data

### Pulsing Indicator
```
● Live
```
- Green badge with pulsing dot
- Shows in statistics panel header
- Animated to draw attention

### Toast Notifications
```
🟢 John Doe is now online
🔴 Jane Smith went offline
```
- Slides in from right
- Auto-dismisses after 3 seconds
- Color-coded by action

## Testing Real-Time Features

### Test Scenario 1: Single User
1. Open dashboard in browser
2. Open another browser/incognito window
3. Login with different user
4. Watch first dashboard update in real-time
5. See toast notification appear

### Test Scenario 2: Multiple Users
1. Open 3+ browser windows
2. Login with different users in each
3. Logout from one window
4. Watch all other windows update instantly
5. See notifications in all windows

### Test Scenario 3: Chart Updates
1. Open dashboard
2. Note current chart data
3. Login/logout with another user
4. Watch chart bars update automatically
5. No page refresh needed

## Configuration

### Laravel Reverb
**File**: `.env`
```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### React Echo
**File**: `react/.env`
```env
VITE_REVERB_APP_KEY=your-app-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Running the System

### Start All Services
```bash
# Terminal 1: Laravel Backend
php artisan serve

# Terminal 2: Laravel Reverb
php artisan reverb:start

# Terminal 3: React Frontend
cd react
npm run dev
```

### Verify WebSocket Connection
1. Open browser console
2. Look for: "Echo connected to Reverb"
3. Check Network tab for WebSocket connection
4. Should see `ws://localhost:8080` connection

## Performance Considerations

### Efficient Updates
- Only broadcasts to other users (not sender)
- Debounced data fetching to prevent excessive API calls
- Lightweight event payloads
- Automatic cleanup on component unmount

### Scalability
- Public channel (no authentication overhead)
- Efficient WebSocket protocol
- Minimal data transfer
- Can handle hundreds of concurrent users

## Troubleshooting

### WebSocket Not Connecting
1. Check Reverb is running: `php artisan reverb:start`
2. Verify port 8080 is not blocked
3. Check `.env` configuration matches
4. Look for errors in browser console

### Events Not Received
1. Check channel name: `user-sessions`
2. Verify event name: `.session.updated`
3. Ensure broadcasting is enabled
4. Check Reverb logs for errors

### Toast Not Appearing
1. Check browser console for errors
2. Verify echo service is imported
3. Check CSS animations are loaded
4. Ensure notifications aren't blocked

## Future Enhancements

- [ ] Private channels for user-specific data
- [ ] Presence channels to show who's online
- [ ] Typing indicators for discussions
- [ ] Real-time grade updates
- [ ] Live assignment submissions
- [ ] Real-time course enrollment updates
- [ ] Activity feed with live updates
- [ ] Real-time notifications center

## Benefits

✅ **Instant Updates**: No manual refresh needed
✅ **Better UX**: Users see changes immediately
✅ **Engagement**: Live indicators keep users informed
✅ **Scalable**: WebSocket protocol is efficient
✅ **Modern**: Real-time features expected in modern apps
✅ **Collaborative**: Multiple users see same data instantly

## Summary

The real-time online hours tracking system provides instant visibility into user activity across the platform. Using Laravel Reverb and WebSockets, all connected clients receive updates immediately when users login or logout, creating a dynamic and engaging user experience.
