# Assignment Submission & Grading Feature

## Overview
Complete assignment submission system where students can attach files, mark assignments as done, and teachers can view submissions, download files, and grade them.

## Features

### Student Features
✅ View all assignments (pending, submitted, graded)
✅ Upload multiple files to assignments
✅ Add notes/comments for teachers
✅ Mark assignments as done (submit)
✅ View submission status
✅ View grades and teacher feedback
✅ Download submitted files

### Teacher Features
✅ View all student submissions
✅ Download student files
✅ Grade submissions (0-100 score)
✅ Provide written feedback
✅ Track submission statistics
✅ View submission history

## File Structure

### Student Components
```
react/src/views/student/
├── AssignmentsPage.jsx          # List all assignments
├── SubmitAssignmentPage.jsx     # Submit assignment with files
└── index.js                     # Exports
```

### Teacher Components
```
react/src/views/teacher/
├── GradeSubmissionsPage.jsx     # Grade student submissions
└── index.js                     # Exports
```

### Styles
```
react/src/styles/
├── assignments.css              # Assignments list styles
├── submit-assignment.css        # Submission form styles
└── grade-submissions.css        # Grading interface styles
```

## Routes

### Student Routes
- `/assignments` - View all assignments
- `/assignments/:assignmentId/submit` - Submit assignment

### Teacher Routes
- `/assignments/:assignmentId/grade` - Grade submissions

## API Endpoints Used

### Student Endpoints
```
GET  /api/courses                              # Get enrolled courses
GET  /api/courses/:courseId/assignments        # Get course assignments
GET  /api/assignments/:assignmentId/my-submission  # Get own submission
POST /api/submissions                          # Create/update submission
POST /api/submissions/:submissionId/files      # Upload file
DELETE /api/submission-files/:fileId           # Remove file
```

### Teacher Endpoints
```
GET  /api/assignments/:assignmentId            # Get assignment details
GET  /api/assignments/:assignmentId/submissions # Get all submissions
POST /api/submissions/:submissionId/grade      # Grade submission
```

## Student Workflow

### 1. View Assignments
```javascript
// Navigate to /assignments
// See all assignments with status badges:
- Pending (not submitted)
- Submitted (waiting for grade)
- Graded (has score and feedback)
```

### 2. Submit Assignment
```javascript
// Click "Submit Assignment" button
// Navigate to /assignments/:id/submit

// Upload files:
1. Click "📎 Attach File"
2. Select file (PDF, DOC, DOCX, JPG, PNG, MP4)
3. File uploads automatically
4. Can upload multiple files

// Add notes (optional):
- Write comments for teacher

// Submit:
- Click "✓ Mark as Done & Submit"
- Confirm submission
- Cannot edit after submission
```

### 3. View Grade
```javascript
// After teacher grades:
- See grade score (0-100%)
- Read teacher feedback
- View submitted files
```

## Teacher Workflow

### 1. View Submissions
```javascript
// Navigate to /assignments/:id/grade
// See statistics:
- Total submissions
- Graded count
- Pending count
```

### 2. Review Submission
```javascript
// Click on student submission
// View:
- Student information
- Attached files
- Student notes
- Submission date
```

### 3. Download Files
```javascript
// Click "⬇ Download" on any file
// File opens in new tab or downloads
```

### 4. Grade Submission
```javascript
// Enter score (0-100)
// Write feedback (optional)
// Click "Save Grade"
// Student receives notification
```

## Component Details

### AssignmentsPage.jsx
**Purpose**: List all student assignments with filtering

**Features**:
- Filter tabs (All, Pending, Submitted, Graded)
- Assignment cards with status badges
- Due date countdown
- Grade display for graded assignments
- Quick submit button

**State**:
```javascript
- assignments: Array of assignments with submission status
- loading: Boolean for loading state
- filter: String ('all', 'pending', 'submitted', 'graded')
```

### SubmitAssignmentPage.jsx
**Purpose**: Submit assignment with file uploads

**Features**:
- Assignment details display
- Multiple file upload
- File management (add/remove)
- Notes textarea
- Submit button with confirmation
- Grade and feedback display (if graded)

**State**:
```javascript
- assignment: Assignment object
- submission: Submission object
- files: Array of uploaded files
- notes: String for student notes
- uploading: Boolean for upload state
- submitting: Boolean for submit state
```

### GradeSubmissionsPage.jsx
**Purpose**: Grade student submissions

**Features**:
- Submissions list with status
- Submission details panel
- File download functionality
- Grading form (score + feedback)
- Statistics dashboard

**State**:
```javascript
- assignment: Assignment object
- submissions: Array of student submissions
- selectedSubmission: Currently selected submission
- score: Number (0-100)
- feedback: String for teacher feedback
- grading: Boolean for grading state
```

## File Upload

### Supported Formats
- Documents: PDF, DOC, DOCX
- Images: JPG, JPEG, PNG
- Videos: MP4, WEBM

### File Storage
- Files stored in: `storage/app/public/submissions/:submissionId/`
- Accessible via: `/storage/submissions/:submissionId/:filename`

### File Icons
- 📄 PDF files
- 🖼️ Image files
- 🎥 Video files
- 📝 Word documents
- 📎 Other files

## Status Flow

```
Draft → Submitted → Graded
  ↓         ↓          ↓
Can edit  Locked   View grade
```

### Status Badges
- **Pending**: Yellow - Not submitted yet
- **Submitted**: Blue - Waiting for teacher review
- **Graded**: Green - Has score and feedback
- **Draft**: Gray - Saved but not submitted

## Styling

### Color Scheme
- Primary: #ec4899 (Pink)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Danger: #ef4444 (Red)
- Info: #3b82f6 (Blue)

### Responsive Design
- Desktop: Full layout with sidebars
- Tablet: Stacked layout
- Mobile: Single column, optimized buttons

## Usage Examples

### Student: Submit Assignment
```javascript
// 1. Go to Assignments page
navigate('/assignments');

// 2. Click on assignment
navigate(`/assignments/${assignmentId}/submit`);

// 3. Upload files
<input type="file" onChange={handleFileUpload} />

// 4. Add notes
<textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

// 5. Submit
<button onClick={handleSubmit}>Mark as Done & Submit</button>
```

### Teacher: Grade Submission
```javascript
// 1. Go to grade page
navigate(`/assignments/${assignmentId}/grade`);

// 2. Select student
<div onClick={() => handleSelectSubmission(submission)}>

// 3. Download files
<button onClick={() => downloadFile(file)}>Download</button>

// 4. Enter grade
<input type="number" value={score} onChange={(e) => setScore(e.target.value)} />

// 5. Save grade
<button onClick={handleGradeSubmission}>Save Grade</button>
```

## Database Schema

### submissions table
```sql
- submission_ID (primary key)
- assessment_id (foreign key)
- user_id (foreign key)
- status (draft, submitted, graded)
- notes (text)
- submitted_at (timestamp)
- created_at, updated_at
```

### submission_files table
```sql
- id (primary key)
- submission_ID (foreign key)
- type (file, link, image, video)
- file_path (string)
- file_name (string)
- file_size (integer)
- mime_type (string)
- url (string, nullable)
- created_at, updated_at
```

### grade table
```sql
- grade_ID (primary key)
- submission_ID (foreign key)
- score (decimal 0-100)
- feedback (text)
- graded_by (foreign key to users)
- created_at, updated_at
```

## Security

### Student Permissions
✅ Can only view own assignments
✅ Can only submit to own assignments
✅ Can only edit before submission
✅ Cannot delete after submission

### Teacher Permissions
✅ Can view all submissions for their courses
✅ Can grade any submission
✅ Can download student files
✅ Can update grades

## Future Enhancements

- [ ] Bulk file upload
- [ ] Drag and drop file upload
- [ ] File preview (PDF, images)
- [ ] Rubric-based grading
- [ ] Peer review system
- [ ] Late submission penalties
- [ ] Resubmission requests
- [ ] Grade analytics
- [ ] Export grades to CSV
- [ ] Email notifications

## Testing

### Test as Student
```bash
1. Login: student@example.com / password
2. Navigate to /assignments
3. Click "Submit Assignment"
4. Upload files
5. Add notes
6. Submit
7. Check status
```

### Test as Teacher
```bash
1. Login: teacher@example.com / password
2. Navigate to /assignments/:id/grade
3. Select student submission
4. Download files
5. Enter grade and feedback
6. Save grade
7. Verify student sees grade
```

## Summary

Complete assignment submission and grading system with:
- ✅ File upload functionality
- ✅ Mark as done feature
- ✅ Teacher grading interface
- ✅ Feedback system
- ✅ Status tracking
- ✅ Responsive design
- ✅ Clean UI/UX

Students can easily submit assignments with files, and teachers can efficiently grade and provide feedback!
