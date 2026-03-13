-- TinyLearn LMS - MySQL Database Schema for XAMPP
-- Create database
CREATE DATABASE IF NOT EXISTS tinylearn;
USE tinylearn;

-- Users table
CREATE TABLE users (
  user_ID INT PRIMARY KEY AUTO_INCREMENT,
  FName VARCHAR(100) NOT NULL,
  LName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  google_id VARCHAR(255),
  google_avatar VARCHAR(255),
  oauth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
  role_ID INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Roles (many-to-many)
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(role_ID) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Courses table
CREATE TABLE courses (
  course_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_name VARCHAR(255) NOT NULL,
  course_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  is_private BOOLEAN DEFAULT TRUE,
  course_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Modules table
CREATE TABLE modules (
  module_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  description TEXT,
  module_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Materials table
CREATE TABLE materials (
  material_ID INT PRIMARY KEY AUTO_INCREMENT,
  module_id INT NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  material_type VARCHAR(50),
  content LONGTEXT,
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(module_ID) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
  enrollment_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  status ENUM('invited', 'accepted', 'rejected', 'active', 'completed') DEFAULT 'active',
  enrollment_type ENUM('self', 'invited') DEFAULT 'self',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Assignments table
CREATE TABLE assignments (
  assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  assignment_name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME,
  total_marks INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Submissions table
CREATE TABLE submissions (
  submission_ID INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  user_id INT NOT NULL,
  submission_text TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_ID) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Submission Files table
CREATE TABLE submission_files (
  file_ID INT PRIMARY KEY AUTO_INCREMENT,
  submission_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_ID) ON DELETE CASCADE
);

-- Grades table
CREATE TABLE grades (
  grade_ID INT PRIMARY KEY AUTO_INCREMENT,
  submission_id INT NOT NULL,
  marks_obtained INT,
  feedback TEXT,
  graded_by INT NOT NULL,
  graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_ID) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Assessments table
CREATE TABLE assessments (
  assessment_ID INT PRIMARY KEY AUTO_INCREMENT,
  module_id INT NOT NULL,
  assessment_name VARCHAR(255) NOT NULL,
  assessment_type VARCHAR(50),
  total_marks INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(module_ID) ON DELETE CASCADE
);

-- Discussions table
CREATE TABLE discussions (
  discussion_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Discussion Replies table
CREATE TABLE discussion_replies (
  reply_ID INT PRIMARY KEY AUTO_INCREMENT,
  discussion_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (discussion_id) REFERENCES discussions(discussion_ID) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
  message_ID INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Conversations table
CREATE TABLE conversations (
  conversation_ID INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
  notification_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Announcements table
CREATE TABLE announcements (
  announcement_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Attachments table
CREATE TABLE attachments (
  attachment_ID INT PRIMARY KEY AUTO_INCREMENT,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE attendances (
  attendance_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Schedules table
CREATE TABLE schedules (
  schedule_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Resources table
CREATE TABLE resources (
  resource_ID INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  resource_name VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50),
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Progress table
CREATE TABLE progress (
  progress_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  completion_percentage INT DEFAULT 0,
  last_accessed TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_ID) ON DELETE CASCADE
);

-- Activity Logs table
CREATE TABLE activity_logs (
  log_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- User Sessions table
CREATE TABLE user_sessions (
  session_ID INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_ID) ON DELETE CASCADE
);

-- Permissions table
CREATE TABLE permissions (
  permission_ID INT PRIMARY KEY AUTO_INCREMENT,
  permission_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role) VALUES ('admin'), ('teacher'), ('student');

-- Insert default permissions
INSERT INTO permissions (permission_name, description) VALUES
('create_course', 'Can create courses'),
('edit_course', 'Can edit courses'),
('delete_course', 'Can delete courses'),
('grade_assignment', 'Can grade assignments'),
('view_analytics', 'Can view analytics');

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_course_teacher ON courses(teacher_id);
CREATE INDEX idx_enrollment_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_assignment_course ON assignments(course_id);
CREATE INDEX idx_submission_assignment ON submissions(assignment_id);
CREATE INDEX idx_discussion_course ON discussions(course_id);
CREATE INDEX idx_message_users ON messages(sender_id, receiver_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
