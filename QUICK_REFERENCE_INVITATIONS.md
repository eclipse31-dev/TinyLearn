# Quick Reference: Course Invitations

## What Changed?

### 1. Courses are now PRIVATE by default
- Students can't see courses unless invited
- Teachers/Admins see all courses
- Teachers can make courses public if needed

### 2. Students can UNENROLL from courses
- Click menu (⋮) on course card
- Select "Unenroll Course"
- Confirmation required

### 3. Teachers can INVITE students
- Go to course detail page
- Click "Invite Students" button
- Select students from list
- Send invitations

### 4. Students get NOTIFICATIONS for invitations
- Bell icon shows unread count
- Click notification to see details
- Accept or Reject invitation
- Accepting enrolls them in course

## How to Use

### As a Teacher/Admin

**To Invite Students:**
1. Create a course (it's private by default)
2. Go to course detail page
3. Click "Invite Students" button
4. Search and select students
5. Click "Send Invitations"
6. Students receive notifications

**To Make Course Public:**
1. Edit the course
2. Set `is_private` to false
3. Save changes
4. All students can now see it

### As a Student

**To Accept an Invitation:**
1. Click bell icon (notifications)
2. Find "Course Invitation" notification
3. Click "Accept" button
4. Course appears in your course list

**To Reject an Invitation:**
1. Click bell icon (notifications)
2. Find "Course Invitation" notification
3. Click "Reject" button
4. Notification disappears

**To Unenroll from a Course:**
1. Go to Courses page
2. Find the course
3. Click menu (⋮) on course card
4. Select "Unenroll Course"
5. Confirm unenrollment

## Database Changes

```sql
-- Courses table
ALTER TABLE courses ADD COLUMN is_private BOOLEAN DEFAULT true;

-- Enrollments table
-- Status now includes: 'invited', 'accepted'
-- New column: enrollment_type ('self' or 'invited')
```

## API Endpoints

```
POST /api/courses/{id}/send-invitation
  Body: { "user_ids": [1, 2, 3] }

POST /api/courses/{id}/enroll
  (Accept invitation or self-enroll)

POST /api/courses/{id}/unenroll
  (Unenroll from course)
```

## Enrollment Statuses

- `active` - Actively enrolled
- `accepted` - Accepted invitation
- `invited` - Pending invitation (not enrolled yet)
- `dropped` - Unenrolled
- `completed` - Course finished

## Key Files

- `app/Http/Controllers/Api/CourseController.php` - Backend logic
- `react/src/components/InviteStudentsModal.jsx` - Invite UI
- `react/src/components/NotificationsCenter.jsx` - Notifications
- `react/src/views/teacher/CourseDetail.jsx` - Course detail page

## Testing Checklist

- [ ] Create course (should be private)
- [ ] Invite students (should send notifications)
- [ ] Accept invitation as student (should enroll)
- [ ] Reject invitation as student (should delete notification)
- [ ] Unenroll from course (should remove from list)
- [ ] Make course public (should be visible to all)
- [ ] Use class code to enroll (should work)

## Troubleshooting

**Students can't see invited courses?**
- Check they accepted the invitation
- Check enrollment status is 'accepted' or 'active'

**Invite button not showing?**
- Verify you're a teacher or admin
- Verify you're on the course detail page

**Can't unenroll?**
- Check you're enrolled in the course
- Try refreshing the page

## Support

For detailed information, see `INVITATION_SYSTEM.md`
