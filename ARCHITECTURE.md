# Architecture Overview: Content Creation System

## System Architecture Diagram

```
User Interface (React)
├── CoursesPage
│   └── Displays list of courses
│       ↓ User clicks course
│
├── CourseDetail (Main Hub)
│   ├── Displays course info, schedules
│   ├── Three tabs: Announcements | Assignments | Resources
│   └── "+ Add Item" button triggers navigation based on active tab
│
└── Creation Pages (Dynamic Navigation)
    ├── CreateAnnouncementPage (/courses/:courseId/announcements/create)
    ├── CreateAssignmentPage (/courses/:courseId/assignments/create)
    └── CreateResourcePage (/courses/:courseId/resources/create)
```

## Data Flow

### Creation Flow
```
Creation Form Component
    ↓
User fills form + clicks Submit
    ↓
handleSubmit() validation
    ↓
POST request to API endpoint with Bearer token
    ↓
Laravel Controller processes request
    ↓
Database validation + model creation
    ↓
API returns success/error response
    ↓
If success: Navigate back to CourseDetail
If error: Display error message in form
    ↓
CourseDetail re-fetches data
    ↓
New item appears in respective tab
```

### Display Flow
```
CourseDetail loads
    ↓
Fetches course data from /api/courses/{id}
    ↓
Parallel fetches:
├── GET /api/courses/{id}/announcements
├── GET /api/courses/{id}/assignments
└── GET /api/courses/{id}/resources
    ↓
Set state with fetched data
    ↓
Render tabs with content
    ↓
Each item in list renders in card format
```

## File Structure

```
react/src/
├── views/
│   ├── CourseDetail.jsx (UPDATED - added create button)
│   ├── CreateAnnouncementPage.jsx (NEW)
│   ├── CreateAssignmentPage.jsx (NEW)
│   └── CreateResourcePage.jsx (NEW)
├── styles/
│   ├── courseDetail.css (UPDATED - added .btn-create-item)
│   └── createForm.css (NEW - shared form styling)
├── router.jsx (UPDATED - added three new routes)
└── context/
    └── AuthContext.jsx (existing - provides token)

app/Http/Controllers/Api/
├── CourseController.php (existing - handles course endpoints)
├── AnnouncementController.php (existing - store() method ready)
├── AssignmentController.php (existing - store() method ready)
└── ResourceController.php (existing - store() method ready)

routes/
└── api.php (POST routes already configured)
```

## Component Props & State

### CourseDetail.jsx
```javascript
// Props
id (from useParams)

// State
{
  course: { course_ID, title, description, schedules[], ... },
  announcements: [],
  assignments: [],
  resources: [],
  loading: boolean,
  error: string,
  activeTab: 'announcements' | 'assignments' | 'resources'
}

// Navigation
useNavigate() → `/courses/${id}/${activeTab}/create`
```

### CreateAnnouncementPage.jsx
```javascript
// Props
courseId (from useParams)

// State
{
  formData: {
    title: string,
    content: string
  },
  loading: boolean,
  error: string
}

// API Call
POST /api/announcements
Body: { course_id, title, content }
```

### CreateAssignmentPage.jsx
```javascript
// State
{
  formData: {
    title: string,
    description: string,
    due_date: date
  },
  loading: boolean,
  error: string
}

// API Call
POST /api/assignments
Body: { course_id, title, description, due_date }
```

### CreateResourcePage.jsx
```javascript
// State
{
  formData: {
    title: string,
    description: string,
    type: 'link' | 'file',
    url: string (if type='link'),
    file: File (if type='file')
  },
  loading: boolean,
  error: string
}

// API Call
POST /api/resources
Body: FormData or JSON depending on type
```

## API Route Mapping

```
Routes (Laravel)
├── GET /api/courses/{id}
│   └── Returns course with relationships
│
├── GET /api/courses/{id}/announcements
│   └── CourseController::getAnnouncements()
│   → Returns: Announcement[]
│
├── POST /api/announcements
│   └── AnnouncementController::store()
│   ← Requires: course_id, title, content
│
├── GET /api/courses/{id}/assignments
│   └── CourseController::getAssignments()
│   → Returns: Assignment[]
│
├── POST /api/assignments
│   └── AssignmentController::store()
│   ← Requires: course_id, title, description, due_date
│
├── GET /api/courses/{id}/resources
│   └── CourseController::getResources()
│   → Returns: Resource[]
│
└── POST /api/resources
    └── ResourceController::store()
    ← Requires: course_id, title, description, type, [url|file]
```

## Authentication Flow

```
User Login
    ↓
Receives Bearer Token
    ↓
Token stored in localStorage/Context
    ↓
All API requests include:
Authorization: Bearer {token}
    ↓
Laravel Sanctum middleware validates token
    ↓
Request processed with user context
    ↓
If invalid: Returns 401 Unauthorized
If valid: Proceeds with request
```

## Error Handling Chain

```
Form Submit
    ↓
Client-side validation
├─ Missing required fields?
└─ Invalid formats?
    ↓ (if valid)
API Request with token
    ↓
Server-side validation
├─ course_id exists?
├─ Data format correct?
└─ All required fields present?
    ↓ (if invalid)
Return 422 Validation Error
    ↓ (if valid)
Create model instance
    ↓
Save to database
    ↓ (if error)
Return error response
    ↓ (if success)
Return 201 Created + model data
    ↓
Front-end receives response
├─ status 2xx → Navigate back + refresh
└─ status >= 4xx → Display error message
```

## State Management

### Across Components
```
AuthContext (global)
└── token: string
    └── Used by: All API requests

CourseDetail (local)
├── course
├── announcements
├── assignments
├── resources
└── activeTab

Creation Forms (local)
├── formData
├── loading
└── error
```

## Styling Hierarchy

```
Global Styles
└── App.css

Component Styles
├── courseDetail.css
│   ├── .course-detail-page (main container)
│   ├── .course-header-section (purple gradient header)
│   ├── .course-tabs (tab navigation)
│   ├── .btn-create-item (NEW - add button)
│   ├── .announcement-card
│   ├── .assignment-card
│   └── .resource-card
│
└── createForm.css (NEW - shared)
    ├── .create-form-page (bg gradient)
    ├── .form-container (white card)
    ├── .form-group (form fields)
    ├── .form-error (error display)
    ├── .btn-submit
    └── .btn-cancel
```

## Responsive Design Breakpoints

```
Desktop (>= 1024px)
├── Full width layouts
├── Side-by-side elements
└── Large form containers

Tablet (768px - 1023px)
├── Adjusted spacing
├── Single column where needed
└── Optimized touch targets

Mobile (< 768px)
├── Full width forms
├── Stacked layouts
├── Larger buttons for touch
├── Reduced padding/font sizes
```

## Validation Rules Summary

| Field | Rules | Example |
|-------|-------|---------|
| course_id | integer, exists:courses,course_ID | 1 |
| title | string, max:255, required | "React Fundamentals" |
| content | string, required | "Learn React basics..." |
| description | string, required | "Complete assignment..." |
| due_date | date, >= today, required | "2024-12-31" |
| type | in:link,file, required | "link" |
| url | url (if type=link) | "https://..." |
| file | file, max:10240 (if type=file) | binary data |

## Performance Considerations

1. **Parallel Requests**: CourseDetail fetches announcements, assignments, resources in parallel
2. **Loading States**: Components show loading indicators to prevent perceived lag
3. **Error Boundaries**: Individual request failures don't crash entire component
4. **Form Optimization**: Creation forms validate before API call
5. **Navigation**: Direct route changes without full page reload (SPA)

## Security Measures

1. **Authentication**: Bearer token required for all API calls
2. **Validation**: Server-side validation of all inputs
3. **Foreign Keys**: course_id validated against courses table
4. **File Upload**: Handled through FormData with proper MIME type checking
5. **CORS**: Laravel CORS middleware handles cross-origin requests
6. **CSRF**: Token included automatically by Sanctum middleware

## Future Enhancements

1. **Edit Functionality**: Add edit routes and forms for existing content
2. **Delete Functionality**: Add delete buttons to content cards
3. **Bulk Operations**: Select multiple items for batch actions
4. **Search/Filter**: Filter content by date, author, status
5. **Rich Editor**: Upgrade textarea to rich text editor for announcements
6. **File Preview**: Show file previews for resource attachments
7. **Comments/Discussions**: Add discussion threads to announcements
8. **Notifications**: Alert users of new course content
9. **History/Versioning**: Track content changes over time
10. **Access Control**: Restrict who can create/edit content per role

## Troubleshooting Guide

### Issue: 404 on routes
- **Cause**: Route not configured in router.jsx
- **Solution**: Verify route matches component import + check path

### Issue: 401 Unauthorized on API calls
- **Cause**: Missing or invalid Bearer token
- **Solution**: Verify token in localStorage/Context, check token expiry

### Issue: 422 Validation Error
- **Cause**: Invalid data submitted to API
- **Solution**: Check server logs, verify all required fields present, correct data types

### Issue: Course data not loading
- **Cause**: Invalid courseId in URL params
- **Solution**: Verify courseId exists in database, check params extraction logic

### Issue: Form not submitting
- **Cause**: Client-side validation failing or loading state stuck
- **Solution**: Check console for errors, verify form data complete, restart component

## Testing Scenarios

1. **Happy Path**: Create announcement → view in CourseDetail
2. **Validation**: Submit empty form → verify error display
3. **Navigation**: Tab change → verify button target updates
4. **Loading**: During submission → verify loading spinner
5. **Error Recovery**: API error → verify error message + form remains open
6. **Auth**: Log out → verify redirected to login before access
7. **Mobile**: Test on mobile viewport → verify responsive layout
