# File Upload Feature for Teachers

## Overview
Teachers can now upload files (PDFs, documents, videos, images, etc.) when creating course materials/resources.

## Features Implemented

### Backend (Laravel)

1. **AttachmentController** (`app/Http/Controllers/Api/AttachmentController.php`)
   - `upload()` - Upload files (max 50MB)
   - `download()` - Download files
   - `show()` - Get attachment details
   - `destroy()` - Delete attachments

2. **API Routes** (`routes/api.php`)
   - `POST /api/attachments/upload` - Upload file
   - `GET /api/attachments/{id}` - Get attachment info
   - `GET /api/attachments/{id}/download` - Download file
   - `DELETE /api/attachments/{id}` - Delete attachment

3. **File Storage**
   - Files stored in `storage/app/public/attachments/`
   - Organized by type: `material`, `assignment`, `submission`
   - Public link: `public/storage` → `storage/app/public`

### Frontend (React)

1. **CreateResourcePage** (`react/src/views/teacher/CreateResourcePage.jsx`)
   - File upload input with drag-and-drop support
   - File size validation (50MB max)
   - Upload progress indicator
   - File preview with name and size
   - Remove file option

2. **CourseDetail** (`react/src/views/teacher/CourseDetail.jsx`)
   - Display attached files in resources tab
   - Download button for each attachment
   - File name and size display

3. **Styling** (`react/src/styles/createForm.css`, `courseDetail.css`)
   - Modern file upload UI
   - Download button styling
   - Responsive design

## Supported File Types

- **Documents**: PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), Excel (.xls, .xlsx), Text (.txt)
- **Archives**: ZIP
- **Media**: Videos (.mp4), Audio (.mp3), Images (.jpg, .jpeg, .png)
- **Max Size**: 50MB per file

## How Teachers Upload Files

1. Navigate to a course
2. Click "Resources" tab
3. Click "+ Add resource" button
4. Select a module (or create new)
5. Choose material type (document/video/link)
6. **Upload File** (optional):
   - Click "Choose File" button
   - Select file from computer
   - See file name and size preview
   - Can remove and select different file
7. Add content/description (optional)
8. Click "Create Material"
9. File uploads automatically before creating material

## How Students Download Files

1. Navigate to a course
2. Click "Resources" tab
3. See list of materials
4. Click "📎 Download: filename" button
5. File downloads to their computer

## Technical Details

### File Upload Process
1. User selects file in CreateResourcePage
2. File validated (size, type)
3. On form submit:
   - File uploaded first via `/api/attachments/upload`
   - Returns `attachment_ID`
   - Material created with `attachment_ID`
4. File stored in `storage/app/public/attachments/material/`

### File Download Process
1. User clicks download link
2. Request sent to `/api/attachments/{id}/download`
3. Backend validates attachment exists
4. File streamed to browser with original filename

### Security
- Authentication required for all operations
- Files stored outside public directory
- Accessed through controller (not direct URLs)
- File size limits enforced
- File type validation

## Database Schema

### attachments table
- `attachment_ID` - Primary key
- `file_name` - Original filename
- `file_path` - Storage path
- `file_type` - MIME type
- `file_size` - Size in bytes
- `uploaded_by` - User ID
- `created_at`, `updated_at`

### materials table
- `materials_ID` - Primary key
- `module_ID` - Foreign key
- `materials_type` - Type (document/video/link)
- `content` - URL or description
- `attachment_ID` - Foreign key (nullable)
- `created_by` - User ID
- `created_at`, `updated_at`

## Future Enhancements

- Drag-and-drop file upload
- Multiple file upload
- File preview (PDF, images)
- Progress bar for large files
- File type icons
- Cloud storage integration (S3, Google Drive)
- Virus scanning
- File compression
