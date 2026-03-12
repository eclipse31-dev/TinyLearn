# Course Invitation System - Implementation Guide

## Overview
The TinyLearn LMS now features a complete course invitation system where:
- **Courses are private by default** - Only visible to invited students
- **Teachers/Admins can invite students** - Via the "Invite Students" button
- **Students receive notifications** - With accept/reject options
- **Students can unenroll** - From courses they've joined
- **Real-time notifications** - Instant updates when invited

## Key Features

### 1. Private Courses
- All new courses are created as **private** by default
- Private courses are **only visible to**:
  - The course creator (teacher/admin)
  - Students who have been invited
  - Teachers and admins (see all courses)
- Students cannot see private courses unless invited

### 2. Course Invitations
- Teachers/Admins can invite students from the course detail page
- Click **"Invite Students"** button to open the invitation modal
- Select multiple students to invite
- Students receive notifications with accept/reject options

### 3. Student Enrollment
Students can enroll in courses through:
- **Accepting an invitation** - Via notification
- **Using class code** - If teacher shares the code
- **Public courses** - If course is set to public

### 4. Unenroll Functionality
- Students can unenroll from courses anytime
- Click the menu (⋮) on a course card
- Select "Unenroll Course"
- Confirmation dialog appears before unenrolling

### 5. Notifications
- **Course Invitation** notifications appear in the notification center
- Students can **Accept** or **Reject** invitations
- Accepting creates an active enrollment
- Rejecting deletes the notification

## Database Changes

### Courses Table
```sql
ALTER TABLE courses ADD COLUMN is_private BOOLEAN DEFAULT true;
```

### Enrollments Table
```sql
-- Updated status enum to include: 'invited', 'accepted'
ALTER TABLE enrollments MODIFY COLUMN status ENUM('active','dropped','completed','invited','accepted') DEFAULT 'active';

-- Added enrollment_type column
ALTER TABLE enrollments ADD COLUMN enrollment_type ENUM('self','invited') DEFAULT 'self';
```

## API Endpoints

### Send Invitations
```
POST /api/courses/{courseId}/send-invitation
Headers: Authorization: Bearer {token}
Body: {
  "user_ids": [1, 2, 3]  // Array of student user IDs
}
Response: {
  "message": "Invitations sent successfully to X student(s)",
  "invited_count": 3,
  "failed_users": []
}
```

### Enroll in Course
```
POST /api/courses/{courseId}/enroll
Headers: Authorization: Bearer {token}
Response: {
  "message": "Successfully enrolled in course",
  "course": {...},
  "enrolled": true
}
```

### Unenroll from Course
```
POST /api/courses/{courseId}/unenroll
Headers: Authorization: Bearer {token}
Response: {
  "message": "Successfully unenrolled from course",
  "enrolled": false
}
```

## Frontend Components

### InviteStudentsModal
- **Location**: `react/src/components/InviteStudentsModal.jsx`
- **Features**:
  - Search students by name/email
  - Multi-select checkboxes
  - Shows selected count
  - Error handling

### NotificationsCenter Updates
- **Location**: `react/src/components/NotificationsCenter.jsx`
- **New Features**:
  - Displays course invitations
  - Accept/Reject buttons for invitations
  - Handles invitation acceptance
  - Handles invitation rejection

### CourseDetail Updates
- **Location**: `react/src/views/teacher/CourseDetail.jsx`
- **New Features**:
  - "Invite Students" button for teachers/admins
  - Opens InviteStudentsModal
  - Shows success message after inviting

## Enrollment Statuses

| Status | Meaning | User Can See Course |
|--------|---------|-------------------|
| `active` | Actively enrolled | Yes |
| `accepted` | Accepted invitation | Yes |
| `invited` | Pending invitation | No (but gets notification) |
| `dropped` | Unenrolled | No |
| `completed` | Course completed | Yes (archived) |

## Enrollment Types

| Type | Meaning |
|------|---------|
| `self` | Student enrolled using class code |
| `invited` | Student was invited by teacher/admin |

## User Workflows

### Teacher/Admin Inviting Students
1. Go to course detail page
2. Click "Invite Students" button
3. Search and select students
4. Click "Send Invitations"
5. Students receive notifications

### Student Accepting Invitation
1. Check notifications (bell icon)
2. See "Course Invitation" notification
3. Click "Accept" button
4. Automatically enrolled in course
5. Course appears in their course list

### Student Rejecting Invitation
1. Check notifications (bell icon)
2. See "Course Invitation" notification
3. Click "Reject" button
4. Notification is deleted
5. No enrollment created

### Student Unenrolling
1. Go to Courses page
2. Find the course
3. Click menu (⋮) on course card
4. Select "Unenroll Course"
5. Confirm unenrollment
6. Course removed from their list

## Course Visibility Logic

### For Teachers/Admins
- See **all courses** (private and public)
- Can edit and manage all courses

### For Students
- See **public courses** (is_private = false)
- See **courses they're enrolled in** (any status except 'invited')
- See **courses they've been invited to** (status = 'invited') - but only in notifications

## Configuration

### Making a Course Public
Teachers can make courses public by:
1. Editing the course
2. Setting `is_private` to `false`
3. Course becomes visible to all students

### Default Course Privacy
- New courses are **private by default**
- Teachers can change this when creating or editing

## Testing the System

### Test Scenario 1: Invite and Accept
1. Login as teacher
2. Create a new course (will be private)
3. Go to course detail
4. Click "Invite Students"
5. Select a student
6. Send invitation
7. Login as student
8. Check notifications
9. Click "Accept"
10. Course appears in student's course list

### Test Scenario 2: Invite and Reject
1. Follow steps 1-6 from Scenario 1
2. Login as student
3. Check notifications
4. Click "Reject"
5. Notification disappears
6. Course does NOT appear in course list

### Test Scenario 3: Unenroll
1. Student accepts invitation (from Scenario 1)
2. Go to Courses page
3. Find the course
4. Click menu (⋮)
5. Select "Unenroll Course"
6. Confirm
7. Course disappears from list

## Troubleshooting

### Students can't see invited courses
- Check enrollment status is 'accepted' or 'active'
- Verify notification was sent
- Check student accepted the invitation

### Invitation button not showing
- Verify user is teacher or admin
- Check user has permission to edit course
- Verify course exists

### Students see all courses
- Check course `is_private` setting
- Verify student is not enrolled
- Check user role (admins see all)

## Future Enhancements

- [ ] Bulk invite via CSV upload
- [ ] Email notifications for invitations
- [ ] Invitation expiration dates
- [ ] Invitation history/audit log
- [ ] Resend invitation option
- [ ] Invite by email (auto-create account)
- [ ] Class roster management
- [ ] Enrollment approval workflow

## Files Modified/Created

### Created
- `react/src/components/InviteStudentsModal.jsx`
- `react/src/styles/inviteStudentsModal.css`
- `database/migrations/2026_03_12_000000_add_invitation_fields.php`

### Modified
- `app/Http/Controllers/Api/CourseController.php` - Added enroll(), updated sendInvitation(), updated index()
- `app/Models/Course.php` - Added is_private to fillable
- `react/src/components/NotificationsCenter.jsx` - Added invitation handling
- `react/src/views/teacher/CourseDetail.jsx` - Added invite button
- `database/migrations/2026_02_16_055850_create_enrollments_table.php` - Added new statuses
- `database/migrations/2026_02_16_055850_create_courses_table.php` - Added is_private column

## Summary

The invitation system is now fully implemented and ready to use. Teachers can invite students to private courses, students receive notifications, and can accept or reject invitations. Students can also unenroll from courses at any time. The system maintains course privacy while allowing flexible enrollment management.
