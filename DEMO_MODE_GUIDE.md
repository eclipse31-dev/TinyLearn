# Demo Mode Guide

## Overview
TinyLearn includes a complete demo mode that allows users to explore the full application without requiring a backend connection or database. This is perfect for demonstrations, testing, and showcasing the application.

## Demo Accounts

### Student Account
- **Email:** `demo.student@tinylearn.com`
- **Password:** `demo123`
- **Features:** View courses, assignments, materials, submit work, check grades

### Teacher Account
- **Email:** `demo.teacher@tinylearn.com`
- **Password:** `demo123`
- **Features:** Manage courses, create assignments, grade submissions, view analytics

### Admin Account
- **Email:** `demo.admin@tinylearn.com`
- **Password:** `demo123`
- **Features:** User management, system-wide analytics, full administrative access

## How Demo Mode Works

### 1. Authentication
When a user logs in with a demo account email:
- The system detects it's a demo account
- Sets `localStorage.setItem('demoMode', 'true')`
- No backend API call is made
- User is logged in with mock user data

### 2. API Interception
All API calls are intercepted when in demo mode:
- **Global axios interceptor** catches all axios requests
- **Mock API service** returns realistic dummy data
- **No network requests** are made to the backend
- **Realistic delays** simulate actual API response times

### 3. Complete Dummy Data
The system includes comprehensive dummy data:
- **4 Courses** with realistic descriptions
- **4 Announcements** from teachers
- **4 Assignments** with due dates
- **5 Materials** (documents and videos)
- **4 Resources** (external links)
- **3 Discussions** with replies
- **5 Schedules** for classes
- **Online hours statistics** with charts
- **Activity logs** showing recent actions
- **Grades and submissions**

## Features That Work in Demo Mode

### ✅ Fully Functional
- **Dashboard** - All statistics and charts display correctly
- **Courses** - Browse all courses, view details
- **Assignments** - View assignments, see due dates
- **Materials** - Access course materials
- **Resources** - View external resources
- **Discussions** - Read discussions and replies
- **Schedules** - View class schedules
- **Online Hours Chart** - Interactive bar chart with data
- **Online Hours Stats** - User activity statistics
- **Activity Logs** - Recent user actions
- **Grades** - View grades and feedback
- **Navigation** - All pages and routes work

### ⚠️ Simulated (No Real Changes)
- **Creating content** - Shows success message but doesn't persist
- **Editing content** - Shows success message but doesn't persist
- **Deleting content** - Shows success message but doesn't persist
- **Submitting assignments** - Shows success but doesn't save
- **Grading submissions** - Shows success but doesn't save

## Technical Implementation

### File Structure
```
react/src/
├── config/
│   └── api.js                 # API configuration with interceptors
├── services/
│   └── mockApi.js             # Mock API service
├── data/
│   └── dummyData.js           # All dummy data
└── views/
    └── shared/
        └── Login.jsx          # Demo account detection
```

### Key Components

#### 1. API Configuration (`config/api.js`)
- Exports `isDemoMode()` function
- Sets up global axios interceptors
- Intercepts ALL axios requests when in demo mode
- Returns mock data instead of making network calls

#### 2. Mock API Service (`services/mockApi.js`)
- Contains all mock API methods
- Simulates realistic API delays (300ms)
- Returns data in the same format as real backend
- Supports filtering and parameters

#### 3. Dummy Data (`data/dummyData.js`)
- Comprehensive dataset for all features
- Realistic content and relationships
- Demo user credentials
- Helper functions for demo account detection

## Adding New Features to Demo Mode

When adding new features that require API calls:

1. **Add dummy data** to `dummyData.js`:
```javascript
export const dummyNewFeature = [
  { id: 1, name: 'Example', ... }
];
```

2. **Add mock API method** to `mockApi.js`:
```javascript
getNewFeature: async () => {
  if (!isDemoMode()) return null;
  await delay();
  return { data: { items: dummyNewFeature } };
}
```

3. **Add interceptor** in `api.js`:
```javascript
if (url.includes('/api/new-feature') && config.method === 'get') {
  throw { mockData: await mockApi.getNewFeature() };
}
```

## Testing Demo Mode

### Local Testing
1. Run the app: `npm run dev`
2. Navigate to login page
3. Use demo credentials
4. Verify all features work without backend

### Production Testing
1. Visit: `https://vite-react-z6ty.vercel.app`
2. Login with demo account
3. Test all pages and features
4. Verify no network errors in console

## Benefits

### For Users
- **No setup required** - Works immediately
- **Full feature access** - See everything the app can do
- **Safe exploration** - Can't break anything
- **Fast performance** - No network latency

### For Developers
- **Easy demonstrations** - Show features without backend
- **Frontend testing** - Test UI without database
- **Offline development** - Work without backend running
- **Quick prototyping** - Test new features rapidly

## Deployment

Demo mode works automatically on Vercel:
- No environment variables needed for demo accounts
- No backend configuration required
- Works immediately after deployment
- Users can switch between demo and real accounts

## Troubleshooting

### Demo mode not working
- Check browser console for errors
- Verify `localStorage.getItem('demoMode')` returns `'true'`
- Clear browser cache and try again

### Missing data
- Check `dummyData.js` has all required data
- Verify mock API methods return correct format
- Check interceptor is catching the API call

### Build errors
- Ensure no circular dependencies
- Verify all imports are correct
- Check for syntax errors in dummy data

## Future Enhancements

Potential improvements for demo mode:
- **Persistent demo data** - Save changes in localStorage
- **Multiple demo scenarios** - Different data sets
- **Demo mode indicator** - Visual banner showing demo mode
- **Demo data reset** - Button to reset to initial state
- **More realistic data** - Larger datasets for stress testing

## Conclusion

Demo mode provides a complete, functional experience of TinyLearn without requiring any backend infrastructure. It's perfect for demonstrations, testing, and allowing users to explore the application risk-free.
