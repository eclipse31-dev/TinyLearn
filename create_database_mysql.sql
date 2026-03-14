-- TinyLearn LMS - MySQL Database Schema
-- Updated for Laravel 12 with Google OAuth, Password Toggle, and Enhanced Features

-- Create Database
CREATE DATABASE IF NOT EXISTS tinylearn;
USE tinylearn;

-- Roles Table
CREATE TABLE roles (
    role_ID INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table (with Google OAuth support and enhanced fields)
CREATE TABLE users (
    user_ID INT PRIMARY KEY AUTO_INCREMENT,
    FName VARCHAR(100) NOT NULL,
    LName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    google_avatar VARCHAR(500) NULL,
    oauth_provider VARCHAR(50) NULL,
    profile_picture VARCHAR(500) NULL,
    bio LONGTEXT NULL,
    phone VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    email_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255) NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    remember_token VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Roles Junction Table
CREATE TABLE user_roles (
    user_role_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    role_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (role_ID) REFERENCES roles(role_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_ID, role_ID),
    INDEX idx_user_id (user_ID),
    INDEX idx_role_id (role_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses Table
CREATE TABLE courses (
    course_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    instructor_ID INT NOT NULL,
    header_image VARCHAR(500) NULL,
    enrollment_code VARCHAR(50) UNIQUE NULL,
    max_students INT DEFAULT 50,
    credits INT DEFAULT 3,
    semester VARCHAR(50) NULL,
    status ENUM('active', 'inactive', 'archived', 'draft') DEFAULT 'active',
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_instructor (instructor_ID),
    INDEX idx_status (status),
    INDEX idx_course_code (course_code),
    INDEX idx_semester (semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enrollments Table
CREATE TABLE enrollments (
    enrollment_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    course_ID INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'completed', 'dropped') DEFAULT 'active',
    grade_letter VARCHAR(2) NULL,
    final_score DECIMAL(5, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_ID, course_ID),
    INDEX idx_user_id (user_ID),
    INDEX idx_course_id (course_ID),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modules Table
CREATE TABLE modules (
    module_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    module_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_order (module_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Materials Table
CREATE TABLE materials (
    material_ID INT PRIMARY KEY AUTO_INCREMENT,
    module_ID INT NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    material_type ENUM('document', 'video', 'link', 'file', 'text', 'image') DEFAULT 'document',
    content LONGTEXT,
    file_path VARCHAR(500) NULL,
    file_size INT NULL,
    duration_minutes INT NULL,
    material_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_ID) REFERENCES modules(module_ID) ON DELETE CASCADE,
    INDEX idx_module_id (module_ID),
    INDEX idx_type (material_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assessments Table
CREATE TABLE assessments (
    assessment_ID INT PRIMARY KEY AUTO_INCREMENT,
    module_ID INT NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    assessment_type ENUM('quiz', 'assignment', 'exam', 'project', 'discussion') DEFAULT 'quiz',
    total_points INT DEFAULT 100,
    passing_score INT DEFAULT 60,
    due_date DATETIME NULL,
    allow_retake BOOLEAN DEFAULT FALSE,
    max_attempts INT DEFAULT 1,
    time_limit_minutes INT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_ID) REFERENCES modules(module_ID) ON DELETE CASCADE,
    INDEX idx_module_id (module_ID),
    INDEX idx_type (assessment_type),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcements Table
CREATE TABLE announcements (
    announcement_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    author_ID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    visibility ENUM('all', 'students', 'instructors') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    FOREIGN KEY (author_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_author_id (author_ID),
    INDEX idx_pinned (is_pinned),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assignments Table
CREATE TABLE assignments (
    assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    assignment_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    due_date DATETIME NOT NULL,
    total_points INT DEFAULT 100,
    allow_late_submission BOOLEAN DEFAULT TRUE,
    late_penalty_percent INT DEFAULT 10,
    allow_file_upload BOOLEAN DEFAULT TRUE,
    max_file_size_mb INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submissions Table
CREATE TABLE submissions (
    submission_ID INT PRIMARY KEY AUTO_INCREMENT,
    assignment_ID INT NOT NULL,
    user_ID INT NOT NULL,
    submission_text LONGTEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'graded', 'late', 'missing') DEFAULT 'submitted',
    is_late BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_ID) REFERENCES assignments(assignment_ID) ON DELETE CASCADE,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (assignment_ID, user_ID),
    INDEX idx_assignment_id (assignment_ID),
    INDEX idx_user_id (user_ID),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submission Files Table
CREATE TABLE submission_files (
    submission_file_ID INT PRIMARY KEY AUTO_INCREMENT,
    submission_ID INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_ID) REFERENCES submissions(submission_ID) ON DELETE CASCADE,
    INDEX idx_submission_id (submission_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grades Table
CREATE TABLE grades (
    grade_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    course_ID INT NOT NULL,
    assignment_ID INT NULL,
    assessment_ID INT NULL,
    points_earned DECIMAL(5, 2),
    total_points INT,
    grade_letter VARCHAR(2),
    grade_percentage DECIMAL(5, 2),
    feedback LONGTEXT,
    graded_by INT NULL,
    graded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    FOREIGN KEY (assignment_ID) REFERENCES assignments(assignment_ID) ON DELETE SET NULL,
    FOREIGN KEY (assessment_ID) REFERENCES assessments(assessment_ID) ON DELETE SET NULL,
    FOREIGN KEY (graded_by) REFERENCES users(user_ID) ON DELETE SET NULL,
    INDEX idx_user_id (user_ID),
    INDEX idx_course_id (course_ID),
    INDEX idx_assignment_id (assignment_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Discussions Table
CREATE TABLE discussions (
    discussion_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    author_ID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    reply_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    FOREIGN KEY (author_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_author_id (author_ID),
    INDEX idx_pinned (is_pinned),
    INDEX idx_locked (is_locked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Discussion Replies Table
CREATE TABLE discussion_replies (
    reply_ID INT PRIMARY KEY AUTO_INCREMENT,
    discussion_ID INT NOT NULL,
    author_ID INT NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_ID) REFERENCES discussions(discussion_ID) ON DELETE CASCADE,
    FOREIGN KEY (author_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_discussion_id (discussion_ID),
    INDEX idx_author_id (author_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Schedules Table
CREATE TABLE schedules (
    schedule_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    schedule_type ENUM('class', 'exam', 'assignment', 'event', 'office_hours') DEFAULT 'class',
    location VARCHAR(255) NULL,
    meeting_link VARCHAR(500) NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_start_date (start_date),
    INDEX idx_type (schedule_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance Table
CREATE TABLE attendance (
    attendance_ID INT PRIMARY KEY AUTO_INCREMENT,
    schedule_ID INT NOT NULL,
    user_ID INT NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused', 'online') DEFAULT 'absent',
    marked_at TIMESTAMP NULL,
    marked_by INT NULL,
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_ID) REFERENCES schedules(schedule_ID) ON DELETE CASCADE,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(user_ID) ON DELETE SET NULL,
    UNIQUE KEY unique_attendance (schedule_ID, user_ID),
    INDEX idx_schedule_id (schedule_ID),
    INDEX idx_user_id (user_ID),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progress Table
CREATE TABLE progress (
    progress_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    course_ID INT NOT NULL,
    module_ID INT NULL,
    material_ID INT NULL,
    completion_percentage INT DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    FOREIGN KEY (module_ID) REFERENCES modules(module_ID) ON DELETE SET NULL,
    FOREIGN KEY (material_ID) REFERENCES materials(material_ID) ON DELETE SET NULL,
    INDEX idx_user_id (user_ID),
    INDEX idx_course_id (course_ID),
    INDEX idx_module_id (module_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attachments Table
CREATE TABLE attachments (
    attachment_ID INT PRIMARY KEY AUTO_INCREMENT,
    attachable_type VARCHAR(255) NOT NULL,
    attachable_ID INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_attachable (attachable_type, attachable_ID),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
    notification_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT,
    notification_type VARCHAR(50),
    related_ID INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_user_id (user_ID),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Log Table (Enhanced for comprehensive tracking)
CREATE TABLE activity_logs (
    activity_log_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    action_type ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'download', 'upload', 'submit', 'grade', 'enroll', 'unenroll') DEFAULT 'create',
    description LONGTEXT,
    model_type VARCHAR(255),
    model_ID INT,
    old_values LONGTEXT NULL,
    new_values LONGTEXT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    status ENUM('success', 'failed', 'pending') DEFAULT 'success',
    response_time_ms INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_user_id (user_ID),
    INDEX idx_action (action),
    INDEX idx_action_type (action_type),
    INDEX idx_model_type (model_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Sessions Table
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMP NULL,
    duration_minutes INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_login_at (login_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversations Table (for messaging)
CREATE TABLE conversations (
    conversation_ID INT PRIMARY KEY AUTO_INCREMENT,
    participant_1_ID INT NOT NULL,
    participant_2_ID INT NOT NULL,
    last_message_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_1_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (participant_2_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_conversation (participant_1_ID, participant_2_ID),
    INDEX idx_participant_1 (participant_1_ID),
    INDEX idx_participant_2 (participant_2_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages Table
CREATE TABLE messages (
    message_ID INT PRIMARY KEY AUTO_INCREMENT,
    conversation_ID INT NOT NULL,
    sender_ID INT NOT NULL,
    content LONGTEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_ID) REFERENCES conversations(conversation_ID) ON DELETE CASCADE,
    FOREIGN KEY (sender_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_ID),
    INDEX idx_sender_id (sender_ID),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resources Table (for course materials)
CREATE TABLE resources (
    resource_ID INT PRIMARY KEY AUTO_INCREMENT,
    course_ID INT NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    resource_type ENUM('document', 'video', 'link', 'file', 'textbook') DEFAULT 'document',
    file_path VARCHAR(500) NULL,
    url VARCHAR(500) NULL,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_ID) REFERENCES courses(course_ID) ON DELETE CASCADE,
    INDEX idx_course_id (course_ID),
    INDEX idx_type (resource_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions Table
CREATE TABLE permissions (
    permission_ID INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role Permissions Junction Table
CREATE TABLE role_permissions (
    role_permission_ID INT PRIMARY KEY AUTO_INCREMENT,
    role_ID INT NOT NULL,
    permission_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_ID) REFERENCES roles(role_ID) ON DELETE CASCADE,
    FOREIGN KEY (permission_ID) REFERENCES permissions(permission_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_ID, permission_ID),
    INDEX idx_role_id (role_ID),
    INDEX idx_permission_id (permission_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Table
CREATE TABLE settings (
    setting_ID INT PRIMARY KEY AUTO_INCREMENT,
    user_ID INT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_setting (user_ID, setting_key),
    INDEX idx_user_id (user_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Roles
INSERT INTO roles (role, description) VALUES 
('admin', 'Administrator with full system access'),
('teacher', 'Instructor who creates and manages courses'),
('student', 'Student enrolled in courses');

-- Insert Admin User
INSERT INTO users (FName, LName, email, username, password, is_active, email_verified_at) VALUES 
('Admin', 'User', 'kenu933@gmail.com', 'admin_kenu933', '$2y$12$placeholder', TRUE, NOW());

-- Assign Admin Role to Admin User
INSERT INTO user_roles (user_ID, role_ID) 
SELECT u.user_ID, r.role_ID FROM users u, roles r 
WHERE u.email = 'kenu933@gmail.com' AND r.role = 'admin';

-- Insert Default Permissions
INSERT INTO permissions (permission_name, description) VALUES
('create_course', 'Can create new courses'),
('edit_course', 'Can edit courses'),
('delete_course', 'Can delete courses'),
('manage_users', 'Can manage user accounts'),
('view_analytics', 'Can view analytics'),
('grade_assignments', 'Can grade assignments'),
('create_announcements', 'Can create announcements'),
('manage_enrollments', 'Can manage course enrollments'),
('view_reports', 'Can view system reports'),
('manage_permissions', 'Can manage permissions');

-- Create Performance Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_courses_instructor ON courses(instructor_ID);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_ID, course_ID);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_submissions_assignment_user ON submissions(assignment_ID, user_ID);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_grades_user_course ON grades(user_ID, course_ID);
CREATE INDEX idx_messages_conversation ON messages(conversation_ID);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_notifications_user_read ON notifications(user_ID, is_read);
CREATE INDEX idx_activity_logs_user_action ON activity_logs(user_ID, action);
CREATE INDEX idx_progress_user_course ON progress(user_ID, course_ID);
CREATE INDEX idx_attendance_schedule_user ON attendance(schedule_ID, user_ID);

-- Laravel System Tables

-- Sessions Table (for session management)
CREATE TABLE IF NOT EXISTS sessions (
    id varchar(255) NOT NULL PRIMARY KEY,
    user_id bigint unsigned NULL,
    ip_address varchar(45) NULL,
    user_agent text NULL,
    payload longtext NOT NULL,
    last_activity int NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_last_activity (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cache Table (for caching)
CREATE TABLE IF NOT EXISTS cache (
    `key` varchar(255) NOT NULL PRIMARY KEY,
    `value` longtext NOT NULL,
    expiration int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrations Table (for tracking migrations)
CREATE TABLE IF NOT EXISTS migrations (
    id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    migration varchar(255) NOT NULL,
    batch int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs Table (for queue management)
CREATE TABLE IF NOT EXISTS jobs (
    id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    queue varchar(255) NOT NULL,
    payload longtext NOT NULL,
    attempts tinyint unsigned NOT NULL,
    reserved_at int unsigned NULL,
    available_at int unsigned NOT NULL,
    created_at int unsigned NOT NULL,
    INDEX idx_queue (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Failed Jobs Table (for tracking failed jobs)
CREATE TABLE IF NOT EXISTS failed_jobs (
    id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uuid varchar(255) NOT NULL UNIQUE,
    connection text NOT NULL,
    queue text NOT NULL,
    payload longtext NOT NULL,
    exception longtext NOT NULL,
    failed_at timestamp DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uuid (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Batches Table (for batch job management)
CREATE TABLE IF NOT EXISTS job_batches (
    id varchar(255) NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    total_jobs int NOT NULL,
    pending_jobs int NOT NULL,
    failed_jobs int NOT NULL,
    failed_job_ids longtext NOT NULL,
    options mediumtext NULL,
    cancelled_at int NULL,
    created_at int NOT NULL,
    finished_at int NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personal Access Tokens Table (for API authentication)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tokenable_type varchar(255) NOT NULL,
    tokenable_id bigint unsigned NOT NULL,
    name varchar(255) NOT NULL,
    token varchar(64) NOT NULL UNIQUE,
    abilities longtext NULL,
    last_used_at timestamp NULL,
    expires_at timestamp NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
