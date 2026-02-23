# Database Structure and API Changes - Fixed

## Overview
The application database has been reorganized to support a module-based course structure. This document explains the new architecture and how to use the updated API.

## Database Architecture

### Previous Structure (❌ DEPRECATED)
- Courses → Announcements (direct)
- Courses → Assignments (direct, using `assignments` table)
- Courses → Resources (direct, using `resources` table)

### New Structure (✅ CURRENT)
```
Courses (course_ID)
├── Announcements (course_ID foreign key) - Direct relationship
├── Modules (course_ID foreign key)
│   ├── Assessments (module_ID foreign key)
│   └── Materials (module_ID foreign key, materials_type enum)
└── Schedules (course_ID foreign key)
```

## Table Schemas

### Courses Table
```sql
- course_ID (PRIMARY KEY, bigint)
- title (string)
- slug (string, unique)
- course_code (string, unique)
- description (text, nullable)
- status (enum: draft, active, archived)
- created_by (foreignId → users.user_ID)
- created_at, updated_at (timestamps)
```

### Announcements Table
```sql
- announcement_ID (PRIMARY KEY, bigint)
- course_ID (FOREIGN KEY → courses.course_ID)
- title (string)
- content (text)
- attachment_ID (nullable, FOREIGN KEY → attachments.attachment_ID)
- created_by (FOREIGN KEY → users.user_ID)
- created_at, updated_at (timestamps)
```

### Modules Table
```sql
- module_ID (PRIMARY KEY, bigint)
- course_ID (FOREIGN KEY → courses.course_ID)
- title (string)
- order (integer)
- created_by (FOREIGN KEY → users.user_ID)
- created_at, updated_at (timestamps)
```

### Assessments Table
```sql
- assessment_ID (PRIMARY KEY, bigint)
- module_ID (FOREIGN KEY → modules.module_ID)
- attachment_ID (nullable, FOREIGN KEY → attachments.attachment_ID)
- status (enum: draft, published, closed)
- due_date (date)
- created_by (FOREIGN KEY → users.user_ID)
- created_at, updated_at (timestamps)
```

### Materials Table
```sql
- id (PRIMARY KEY, bigint)
- module_ID (FOREIGN KEY → modules.module_ID)
- materials_type (enum: video, document, link)
- attachment_ID (nullable, FOREIGN KEY → attachments.attachment_ID)
- content (text, nullable)
- created_by (FOREIGN KEY → users.user_ID)
- created_at, updated_at (timestamps)
```

## API Endpoints

### Announcements (Direct course relationship)
```
GET    /api/courses/{courseId}/announcements       - List course announcements
POST   /api/announcements                           - Create announcement
GET    /api/announcements/{id}                      - Get single announcement
PUT    /api/announcements/{id}                      - Update announcement
DELETE /api/announcements/{id}                      - Delete announcement
```

**POST /api/announcements Request:**
```json
{
  "course_ID": 1,
  "title": "Welcome to Course",
  "content": "Introduction content...",
  "attachment_ID": null
}
```

### Modules (Course content organization)
```
GET    /api/courses/{courseId}/modules             - List course modules
POST   /api/modules                                - Create module
GET    /api/modules/{id}                           - Get module with assessments & materials
PUT    /api/modules/{id}                           - Update module
DELETE /api/modules/{id}                           - Delete module (cascades)
```

**POST /api/modules Request:**
```json
{
  "course_ID": 1,
  "title": "Module 1: Fundamentals",
  "order": 1
}
```

### Assessments (Module-based assignments)
```
GET    /api/courses/{courseId}/assessments         - List all course assessments
GET    /api/modules/{moduleId}/assessments        - List module assessments
POST   /api/assessments                            - Create assessment
GET    /api/assessments/{id}                       - Get single assessment
PUT    /api/assessments/{id}                       - Update assessment
DELETE /api/assessments/{id}                       - Delete assessment
```

**POST /api/assessments Request:**
```json
{
  "module_ID": 1,
  "due_date": "2024-12-31",
  "status": "draft"
}
```

### Materials (Module-based course resources)
```
GET    /api/courses/{courseId}/materials           - List all course materials
GET    /api/modules/{moduleId}/materials          - List module materials
POST   /api/materials                              - Create material
GET    /api/materials/{id}                         - Get single material
PUT    /api/materials/{id}                         - Update material
DELETE /api/materials/{id}                         - Delete material
```

**POST /api/materials Request:**
```json
{
  "module_ID": 1,
  "materials_type": "video",
  "content": "https://youtube.com/video",
  "attachment_ID": null
}
```

### Backward Compatibility Endpoints
For React components still using old patterns:
```
GET    /api/courses/{courseId}/assignments        - Returns all assessments
GET    /api/courses/{courseId}/resources          - Returns all materials
```

## Models & Relationships

### Course Model
```php
public function modules()      // hasMany(Module)
public function announcements() // hasMany(Announcement)
public function schedules()    // hasMany(Schedule)
public function creator()      // belongsTo(User)
public function enrollments()  // hasMany(Enrollment)
```

### Module Model
```php
public function course()        // belongsTo(Course)
public function assessments()   // hasMany(Assessment)
public function materials()     // hasMany(Material)
public function creator()       // belongsTo(User)
```

### Announcement Model
```php
public function course()        // belongsTo(Course)
public function creator()       // belongsTo(User)
public function attachment()    // belongsTo(Attachment)
```

### Assessment Model
```php
public function module()        // belongsTo(Module)
public function course()        // Through module
public function creator()       // belongsTo(User)
public function attachment()    // belongsTo(Attachment)
public function submissions()   // hasMany(Submission)
```

### Material Model
```php
public function module()        // belongsTo(Module)
public function course()        // Through module
public function creator()       // belongsTo(User)
public function attachment()    // belongsTo(Attachment)
```

## Controllers

### New/Updated Controllers

**AnnouncementController**
- `index($courseId)` - Get all announcements for course
- `store()` - Create announcement (expects `course_ID`, not `course_id`)
- `show($id)`, `update($id)`, `destroy($id)` - CRUD operations

**ModuleController**
- `index($courseId)` - Get all modules for course
- `store()` - Create module with order auto-calculation
- `show($id)` - Get module with relationships
- `update($id)`, `destroy($id)` - Update/Delete (cascades)

**AssessmentController**
- `index($moduleId)` - Get module assessments
- `getByCourse($courseId)` - Get all course assessments through modules
- `store()` - Create assessment (expects `module_ID`)
- `show($id)`, `update($id)`, `destroy($id)` - CRUD operations

**MaterialController**
- `index($moduleId)` - Get module materials
- `getByCourse($courseId)` - Get all course materials through modules
- `store()` - Create material (expects `module_ID`, `materials_type`)
- `show($id)`, `update($id)`, `destroy($id)` - CRUD operations

**CourseController** (Updated methods)
- `getAnnouncements($courseId)` - Still works
- `getAssignments($courseId)` - Now returns assessments through modules
- `getResources($courseId)` - Now returns materials through modules
- `getAssessments($courseId)` - New direct method for assessments
- `getMaterials($courseId)` - New direct method for materials

## Migration Path

### For Existing React Components

**Old Announcements Logic** → Still works, no changes needed
```javascript
POST /api/announcements with { course_id, title, content }
// Change to: { course_ID, title, content }
```

**Old Assignments Logic** → Updated to work with modules
```javascript
// Old: Expected assignments table with course_id
// New: Use assessments endpoint or courseId/assessments

// Create through module
POST /api/assessments with { module_ID, due_date, status }

// Get for course (backwards compatible)
GET /api/courses/{courseId}/assignments
```

**Old Resources Logic** → Updated to work with modules
```javascript
// Old: Expected resources table with course_id
// New: Use materials endpoint or courseId/materials

// Create through module
POST /api/materials with { module_ID, materials_type, content }

// Get for course (backwards compatible)
GET /api/courses/{courseId}/resources
```

## Key Changes for Developers

### Column Name Changes
- Table primary/foreign keys use UPPERCASE (e.g., `course_ID`, `announcement_ID`)
- Update any database queries

### Foreign Key Changes
- Assessments and Materials now reference `module_ID` instead of `course_ID`
- Must create/select a module before creating assessments or materials

### New Table Structure
- Modules table added (required for assessments and materials)
- No more "assignments" or "resources" tables

### Validation Rules
All validation now uses uppercase column names:
```php
'course_ID' => 'exists:courses,course_ID'
'module_ID' => 'exists:modules,module_ID'
```

## Backward Compatibility Layer

### React Component Updates Needed

**CourseDetail Component** - Still works but:
- Announcements fetch continues to work
- Assignments fetch now gets assessments through modules
- Resources fetch now gets materials through modules

**CreateAnnouncementPage** - Update request body:
```javascript
// OLD: course_id
// NEW: course_ID
```

**CreateAssignmentPage** - Needs complete rework:
```javascript
// Now requires module_ID, not course_id
// Must use /api/assessments, not /api/assignments
// Payload structure changed
```

**CreateResourcePage** - Needs complete rework:
```javascript
// Now requires module_ID, not course_id
// Must use /api/materials, not /api/resources
// Payload structure changed
```

## Implementation checklist

- [x] Fixed Announcement model (course_ID primary/foreign keys)
- [x] Created Module model
- [x] Created Assessment model
- [x] Fixed Material model
- [x] Updated Course model relationships
- [x] Fixed AnnouncementController
- [x] Created AssessmentController
- [x] Updated MaterialController
- [x] Created ModuleController
- [x] Updated CourseController endpoints
- [x] Added API routes for new endpoints
- [ ] Update React components to handle module-based structure
- [ ] Test all API endpoints
- [ ] Update front-end forms for module selection

## Next Steps

1. **Update React Components** to be module-aware:
   - Add module selection in forms
   - Update CreateAssignmentPage to work with assessments
   - Update CreateResourcePage to work with materials

2. **Create Module Management UI**:
   - Add module creation/edit/delete forms
   - Add module list/reorder UI in course detail

3. **Test All Flows**:
   - Course creation with modules
   - Module creation within courses
   - Assessment creation in modules
   - Material creation in modules
   - Display in CourseDetail component

4. **Data Migration** (if needed):
   - Migrate existing assignments to assessments
   - Migrate existing resources to materials
   - Create default modules for existing courses
