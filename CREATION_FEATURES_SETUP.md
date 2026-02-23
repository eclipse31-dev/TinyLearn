# Content Creation Features Setup Guide

## Overview
This document outlines the implementation of announcement, assignment, and resource creation features for the Laravel-React Learning Management System.

## Created Files

### React Components

#### 1. **CreateAnnouncementPage.jsx**
- **Location**: `react/src/views/CreateAnnouncementPage.jsx`
- **Purpose**: Form for creating new course announcements
- **Features**:
  - Title input field
  - Rich content textarea
  - Form validation with error display
  - Post request to `/api/announcements`
  - Navigation back to course detail on success
  - Loading state handling

**Key Routes**:
- Route: `/courses/:courseId/announcements/create`
- Method: POST to `http://localhost:8000/api/announcements`

**Request Payload**:
```json
{
  "course_id": 1,
  "title": "Announcement title",
  "content": "Announcement content"
}
```

#### 2. **CreateAssignmentPage.jsx**
- **Location**: `react/src/views/CreateAssignmentPage.jsx`
- **Purpose**: Form for creating new course assignments
- **Features**:
  - Title input field
  - Description textarea
  - Due date picker with minimum date validation (today)
  - Form validation with error display
  - Post request to `/api/assignments`
  - Navigation back to course detail on success
  - Loading state handling

**Key Routes**:
- Route: `/courses/:courseId/assignments/create`
- Method: POST to `http://localhost:8000/api/assignments`

**Request Payload**:
```json
{
  "course_id": 1,
  "title": "Assignment title",
  "description": "Assignment description",
  "due_date": "2024-12-31"
}
```

#### 3. **CreateResourcePage.jsx**
- **Location**: `react/src/views/CreateResourcePage.jsx`
- **Purpose**: Form for creating course resources (links or file uploads)
- **Features**:
  - Title input field
  - Description textarea
  - Resource type selector (link/file)
  - Conditional URL input for links
  - Conditional file upload for files
  - Form data handling for file uploads
  - Post request to `/api/resources`
  - Navigation back to course detail on success
  - Loading state handling

**Key Routes**:
- Route: `/courses/:courseId/resources/create`
- Method: POST to `http://localhost:8000/api/resources`

**Request Payload** (for link):
```json
{
  "course_id": 1,
  "title": "Resource title",
  "description": "Resource description",
  "type": "link",
  "url": "https://example.com"
}
```

**Request Payload** (for file):
```
FormData:
- course_id: 1
- title: "Resource title"
- description: "Resource description"
- type: "file"
- file: <File object>
```

### CSS Styling

#### 4. **createForm.css**
- **Location**: `react/src/styles/createForm.css`
- **Purpose**: Shared styling for all content creation forms
- **Features**:
  - Gradient background matching app theme
  - Responsive form container
  - Form group styling with focus states
  - Disabled state handling
  - Error message display
  - Submit/Cancel button styling
  - Mobile responsive design (breakpoint at 768px)
  - Smooth animations and transitions

### Router Configuration

#### 5. **router.jsx** (Updated)
- **Location**: `react/src/router.jsx`
- **Changes**:
  - Added imports for three new page components
  - Added three new routes:
    - `/courses/:courseId/announcements/create` → CreateAnnouncementPage
    - `/courses/:courseId/assignments/create` → CreateAssignmentPage
    - `/courses/:courseId/resources/create` → CreateResourcePage
  - All routes wrapped with PrivateRoute for authentication

### Updated Components

#### 6. **CourseDetail.jsx** (Updated)
- **Location**: `react/src/views/CourseDetail.jsx`
- **Changes**:
  - Added "+ Add {item}" button in tab navigation
  - Button navigates to appropriate creation page based on active tab
  - Dynamic button text based on current tab (announcement, assignment, resource)
  - Positioned button with flex layout in tab bar

#### 7. **courseDetail.css** (Updated)
- **Location**: `react/src/styles/courseDetail.css`
- **Changes**:
  - Updated `.course-tabs` to use `justify-content: space-between` for button positioning
  - Added `.btn-create-item` styling:
    - Purple gradient background matching app theme
    - Hover effects with elevation and shadow
    - Responsive sizing with `min-width: max-content`
    - Proper spacing and typography

## API Endpoints

All endpoints require OAuth Bearer token authentication.

### Announcements
- **GET** `/api/courses/{courseId}/announcements` - List all announcements for a course
- **POST** `/api/announcements` - Create new announcement

### Assignments
- **GET** `/api/courses/{courseId}/assignments` - List all assignments for a course
- **POST** `/api/assignments` - Create new assignment

### Resources
- **GET** `/api/courses/{courseId}/resources` - List all resources for a course
- **POST** `/api/resources` - Create new resource

## User Flow

1. **Navigate to Course Detail**
   - User clicks on a course from the courses list
   - CourseDetail page loads with announcements, assignments, and resources tabs

2. **Create Content**
   - User clicks on "Add announcement/assignment/resource" button
   - Navigates to appropriate creation page
   - Form pre-populates with course context

3. **Submit Content**
   - User fills form fields
   - Submits via POST request to API
   - On success: Redirects back to course detail
   - On error: Displays error message in form

4. **View Content**
   - Back on course detail, new content appears in respective tab
   - Content is displayed in card format with relevant information

## Database Models

All models use the following foreign key relationship:
- Foreign key: `course_id` (lowercase)
- Primary key: Course.`course_ID` (uppercase)

### Announcement Model
- **Table**: announcements
- **Fillable**: course_id, title, content, posted_at, created_by, attachment_id

### Assignment Model
- **Table**: assignments
- **Fillable**: course_id, title, description, due_date

### Resource Model
- **Table**: resources
- **Fillable**: course_id, title, description, type, url, file_path, file_name, file_size, mime_type, attachment_id

## Validation Rules

### Announcement
- course_id: required, integer, must exist in courses.course_ID
- title: required, string, max 255 characters
- content: required, string

### Assignment
- course_id: required, integer, must exist in courses.course_ID
- title: required, string, max 255 characters
- description: required, string
- due_date: required, date, must be >= today

### Resource
- course_id: required, integer, must exist in courses.course_ID
- title: required, string, max 255 characters
- description: required, string
- type: required, in:link,file
- url: required if type=link, url format
- file: required if type=file, file format, max 10MB

## Error Handling

All forms include:
- Client-side validation errors displayed prominently
- Server validation errors caught and displayed
- Loading states to prevent duplicate submissions
- Error messages with helpful context

## Authentication

All requests require:
- Bearer token in Authorization header: `Authorization: Bearer {token}`
- Token obtained from login/authentication flow
- Stored in AuthContext for React components

## Styling Notes

- All new pages use shared `createForm.css` for consistency
- Form theme uses purple gradient: #667eea to #764ba2
- Responsive design supports mobile, tablet, and desktop
- Smooth transitions and hover effects for better UX
- Disabled state styling for accessibility

## Testing Checklist

- [ ] Navigate to course detail page
- [ ] Click "+ Add announcement" button and verify navigation
- [ ] Fill announcement form and submit
- [ ] Verify announcement appears in announcements tab
- [ ] Click "+ Add assignment" button and verify navigation
- [ ] Fill assignment form and verify due date validation
- [ ] Submit assignment and verify it appears in assignments tab
- [ ] Click "+ Add resource" button and verify navigation
- [ ] Test link type resource creation
- [ ] Test file upload resource creation
- [ ] Verify all create buttons navigate correctly based on active tab
- [ ] Test error handling with invalid data
- [ ] Verify loading states during submission
- [ ] Test mobile responsive layout

## Notes

- CourseDetail uses `useParams()` to get course ID from URL
- Each creation page uses `courseId` parameter (converted from `id` in CourseDetail)
- File uploads use FormData for proper multipart/form-data encoding
- Date picker uses ISO 8601 format (YYYY-MM-DD)
- All API calls include Bearer token authentication
- Navigation back to course detail uses numeric course ID from params
