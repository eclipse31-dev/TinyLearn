-- TinyLearn LMS Database Schema for PostgreSQL/Supabase
-- Converted from MySQL to PostgreSQL syntax

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role_ID SERIAL PRIMARY KEY,
  role VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_ID BIGSERIAL PRIMARY KEY,
  FName VARCHAR(255) NOT NULL,
  LName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  google_id VARCHAR(255) UNIQUE,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_role_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(role_ID) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  course_ID BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  course_code VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  is_private BOOLEAN DEFAULT true,
  created_by BIGINT NOT NULL REFERENCES users(user_ID),
  header_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  enrollment_type VARCHAR(50) DEFAULT 'self',
  enrolled_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  attachment_ID BIGSERIAL PRIMARY KEY,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  module_ID BIGSERIAL PRIMARY KEY,
  course_ID BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INT DEFAULT 1,
  created_by BIGINT NOT NULL REFERENCES users(user_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  assessment_ID BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  module_ID BIGINT NOT NULL REFERENCES modules(module_ID) ON DELETE CASCADE,
  attachment_ID BIGINT REFERENCES attachments(attachment_ID),
  status VARCHAR(50) DEFAULT 'draft',
  due_date DATE NOT NULL,
  created_by BIGINT NOT NULL REFERENCES users(user_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  submission_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  assessment_id BIGINT NOT NULL REFERENCES assessments(assessment_ID) ON DELETE CASCADE,
  attachment_ID BIGINT REFERENCES attachments(attachment_ID),
  status VARCHAR(50) DEFAULT 'submitted',
  notes TEXT,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create submission_files table
CREATE TABLE IF NOT EXISTS submission_files (
  id BIGSERIAL PRIMARY KEY,
  submission_ID BIGINT NOT NULL REFERENCES submissions(submission_ID) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'file',
  file_path VARCHAR(255),
  file_name VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(255),
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grade (
  grade_ID BIGSERIAL PRIMARY KEY,
  submission_ID BIGINT NOT NULL REFERENCES submissions(submission_ID) ON DELETE CASCADE,
  score INT NOT NULL,
  feedback TEXT,
  graded_by BIGINT NOT NULL REFERENCES users(user_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  announcement_ID BIGSERIAL PRIMARY KEY,
  course_ID BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  attachment_ID BIGINT REFERENCES attachments(attachment_ID),
  created_by BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
  discussion_ID BIGSERIAL PRIMARY KEY,
  course_ID BIGINT REFERENCES courses(course_ID) ON DELETE CASCADE,
  user_ID BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create discussion_replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  reply_ID BIGSERIAL PRIMARY KEY,
  discussion_ID BIGINT NOT NULL REFERENCES discussions(discussion_ID) ON DELETE CASCADE,
  user_ID BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_ID BIGINT REFERENCES discussion_replies(reply_ID) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id BIGSERIAL PRIMARY KEY,
  module_ID BIGINT NOT NULL REFERENCES modules(module_ID) ON DELETE CASCADE,
  materials_type VARCHAR(50) DEFAULT 'document',
  attachment_ID BIGINT REFERENCES attachments(attachment_ID),
  content TEXT,
  created_by BIGINT NOT NULL REFERENCES users(user_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  url VARCHAR(255),
  file_path VARCHAR(255),
  file_name VARCHAR(255),
  file_size INT,
  mime_type VARCHAR(255),
  attachment_id BIGINT REFERENCES attachments(attachment_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  schedule_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(user_ID) ON DELETE CASCADE,
  course_ID BIGINT REFERENCES courses(course_ID) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'class',
  description TEXT,
  location VARCHAR(255),
  color VARCHAR(255) DEFAULT '#3B82F6',
  day_in_week VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(50),
  recurrence_end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  conversation_ID BIGSERIAL PRIMARY KEY,
  user1_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  user2_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  message_ID BIGSERIAL PRIMARY KEY,
  conversation_ID BIGINT NOT NULL REFERENCES conversations(conversation_ID) ON DELETE CASCADE,
  sender_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  receiver_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  progress_ID BIGSERIAL PRIMARY KEY,
  student_ID BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  course_ID BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  completed_assessments INT DEFAULT 0,
  total_assessments INT DEFAULT 0,
  average_grade DECIMAL(5,2),
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_ID, course_ID)
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  log_ID BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  model_type VARCHAR(255),
  model_id BIGINT,
  description TEXT NOT NULL,
  properties JSONB,
  ip_address VARCHAR(255),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendances table
CREATE TABLE IF NOT EXISTS attendances (
  attendance_ID BIGSERIAL PRIMARY KEY,
  course_ID BIGINT NOT NULL REFERENCES courses(course_ID) ON DELETE CASCADE,
  student_ID BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'absent',
  notes TEXT,
  marked_by BIGINT REFERENCES users(user_ID),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_ID, student_ID, date)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  permission_ID BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  "group" VARCHAR(255) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_ID BIGINT NOT NULL REFERENCES roles(role_ID) ON DELETE CASCADE,
  permission_ID BIGINT NOT NULL REFERENCES permissions(permission_ID) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_ID, permission_ID)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_ID) ON DELETE CASCADE,
  login_at TIMESTAMP DEFAULT NOW(),
  logout_at TIMESTAMP,
  duration_minutes INT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_courses_is_private ON courses(is_private);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX idx_messages_conversation ON messages(conversation_ID);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

-- Insert sample data
INSERT INTO roles (role, created_at, updated_at) VALUES
('admin', NOW(), NOW()),
('teacher', NOW(), NOW()),
('student', NOW(), NOW())
ON CONFLICT (role) DO NOTHING;

-- Insert admin user
INSERT INTO users (FName, LName, email, username, password, created_at, updated_at) VALUES
('Admin', 'User', 'admin@example.com', 'admin', '$2y$12$qK3sYGVz8cU/MioUrUt21er1Jt1JdT844AdGjjJBm4sQmE5iclTsq', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.user_ID, r.role_ID, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.role = 'admin'
ON CONFLICT DO NOTHING;
