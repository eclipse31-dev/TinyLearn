# Discussion Forum Feature

## Overview
A fully functional discussion forum for students and teachers to collaborate, ask questions, and share ideas.

## Features Implemented

### Backend (Laravel)

1. **Database Tables**
   - `discussions` - Main discussion threads
   - `discussion_replies` - Replies to discussions (supports nested replies)

2. **Models**
   - `Discussion` - With relationships to User, Course, and Replies
   - `DiscussionReply` - With support for nested replies

3. **API Endpoints**
   - `GET /api/discussions` - List all discussions (with filters)
   - `POST /api/discussions` - Create new discussion
   - `GET /api/discussions/{id}` - View discussion with replies
   - `PUT /api/discussions/{id}` - Update discussion (owner/admin only)
   - `DELETE /api/discussions/{id}` - Delete discussion (owner/admin only)
   - `POST /api/discussions/{id}/reply` - Add reply to discussion
   - `POST /api/discussions/{id}/toggle-pin` - Pin/unpin (teacher/admin only)
   - `POST /api/discussions/{id}/toggle-lock` - Lock/unlock (teacher/admin only)

4. **Features**
   - Course-specific discussions
   - Categories (general, question, announcement, study-group)
   - Pin important discussions
   - Lock discussions to prevent replies
   - View counter
   - Nested replies support
   - Search functionality
   - Filter by course and category

### Frontend (React)

1. **Discussion List View**
   - Display all discussions
   - Filter by course, category
   - Search discussions
   - Show pinned discussions first
   - Display view count and reply count
   - Category badges with colors

2. **Create Discussion**
   - Modal form
   - Select category
   - Optional course association
   - Rich text content

3. **Discussion Detail View**
   - Full discussion content
   - Author information
   - View count
   - Course association
   - Pin/Lock indicators
   - Delete option (for owner/admin)

4. **Reply System**
   - Add replies to discussions
   - Nested replies support
   - Reply form
   - Locked discussions prevent new replies
   - Author and timestamp for each reply

5. **UI/UX**
   - Modern, clean design
   - Responsive layout
   - Color-coded categories
   - Icons for better visual hierarchy
   - Dark mode support
   - Loading states
   - Empty states

## Database Schema

### discussions table
```sql
- discussion_ID (PK)
- course_ID (FK, nullable) - Optional course association
- user_ID (FK) - Discussion creator
- title - Discussion title
- content - Discussion content
- category - Enum: general, question, announcement, study-group
- is_pinned - Boolean (default: false)
- is_locked - Boolean (default: false)
- views - Integer (default: 0)
- created_at, updated_at
```

### discussion_replies table
```sql
- reply_ID (PK)
- discussion_ID (FK) - Parent discussion
- user_ID (FK) - Reply author
- content - Reply content
- parent_reply_ID (FK, nullable) - For nested replies
- created_at, updated_at
```

## User Roles & Permissions

### All Users (Students, Teachers, Admins)
- ✅ View discussions
- ✅ Create discussions
- ✅ Reply to discussions
- ✅ Edit own discussions
- ✅ Delete own discussions

### Teachers & Admins Only
- ✅ Pin/unpin discussions
- ✅ Lock/unlock discussions
- ✅ Delete any discussion

## Categories

1. **General** (Gray) - General discussions
2. **Question** (Blue) - Questions and Q&A
3. **Announcement** (Pink) - Important announcements
4. **Study Group** (Green) - Study group formation

## Use Cases

### For Students:
1. Ask questions about assignments
2. Discuss course topics
3. Form study groups
4. Share resources and tips
5. Get help from peers and teachers

### For Teachers:
1. Make announcements
2. Answer student questions
3. Facilitate discussions
4. Pin important threads
5. Lock completed discussions

### Course-Specific:
- Discussions can be associated with specific courses
- Filter discussions by course
- Course name displayed on discussion cards

### General Forum:
- Discussions without course association
- General topics, career advice, etc.
- Visible to all users

## Technical Details

### View Counter
- Increments when user views discussion detail
- Displayed on discussion cards and detail view

### Nested Replies
- Replies can have child replies
- One level of nesting supported
- Visual indentation for nested replies

### Pin Feature
- Pinned discussions appear first in list
- Pin icon indicator
- Only teachers/admins can pin

### Lock Feature
- Locked discussions prevent new replies
- Lock icon indicator
- Only teachers/admins can lock
- Useful for closing resolved discussions

### Search & Filter
- Search by title or content
- Filter by course
- Filter by category
- Real-time filtering

## UI Components

### Discussion Card
- Title with pin/lock indicators
- Category badge
- Content preview (2 lines)
- Author, date, views, reply count
- Course tag (if associated)
- Hover effects

### Discussion Detail
- Full content display
- Author and metadata
- Pin/Lock indicators
- Delete button (for owner/admin)
- Replies section
- Reply form

### Create Modal
- Title input
- Category selector
- Course selector (optional)
- Content textarea
- Submit/Cancel buttons

## Styling

### Colors
- **General**: Gray (#6b7280)
- **Question**: Blue (#3b82f6)
- **Announcement**: Pink (#ec4899)
- **Study Group**: Green (#10b981)

### Design
- Modern card-based layout
- Gradient buttons
- Smooth transitions
- Responsive design
- Dark mode compatible

## Future Enhancements

- [ ] Upvote/downvote system
- [ ] Mark best answer (for questions)
- [ ] Notifications for replies
- [ ] Mention users (@username)
- [ ] Rich text editor (bold, italic, links)
- [ ] File attachments in discussions
- [ ] Discussion tags
- [ ] User reputation system
- [ ] Report inappropriate content
- [ ] Email notifications
- [ ] Discussion subscriptions
- [ ] Markdown support
