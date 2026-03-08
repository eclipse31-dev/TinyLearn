// COMPLETE DUMMY DATA FOR FULL DEMO MODE
// This file contains ALL data needed for a fully functional demo

// ============================================
// USERS
// ============================================
export const dummyUsers = {
  student: {
    user_ID: 1,
    FName: 'Demo',
    LName: 'Student',
    email: 'demo.student@tinylearn.com',
    username: 'demo_student',
    roles: [{ role: 'student', role_ID: 3 }],
    created_at: '2024-01-01T00:00:00Z'
  },
  teacher: {
    user_ID: 2,
    FName: 'Demo',
    LName: 'Teacher',
    email: 'demo.teacher@tinylearn.com',
    username: 'demo_teacher',
    roles: [{ role: 'teacher', role_ID: 2 }],
    created_at: '2024-01-01T00:00:00Z'
  },
  admin: {
    user_ID: 3,
    FName: 'Demo',
    LName: 'Admin',
    email: 'demo.admin@tinylearn.com',
    username: 'demo_admin',
    roles: [{ role: 'admin', role_ID: 1 }],
    created_at: '2024-01-01T00:00:00Z'
  }
};

// Additional students for teacher/admin views
export const allDummyUsers = [
  dummyUsers.student,
  dummyUsers.teacher,
  dummyUsers.admin,
  {
    user_ID: 4,
    FName: 'John',
    LName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    roles: [{ role: 'student', role_ID: 3 }],
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    user_ID: 5,
    FName: 'Jane',
    LName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    roles: [{ role: 'student', role_ID: 3 }],
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    user_ID: 6,
    FName: 'Mike',
    LName: 'Johnson',
    email: 'mike.j@example.com',
    username: 'mikej',
    roles: [{ role: 'student', role_ID: 3 }],
    created_at: '2024-02-01T00:00:00Z'
  }
];

// ============================================
// COURSES
// ============================================
export const dummyCourses = [
  {
    course_ID: 1,
    title: 'Introduction to Programming',
    course_code: 'CS101',
    description: 'Learn the basics of programming with Python. This course covers variables, data types, control structures, functions, and basic algorithms.',
    status: 'active',
    created_by: 2,
    teacher: dummyUsers.teacher,
    header_image_url: null,
    created_at: '2024-01-15T10:00:00Z',
    is_enrolled: true,
    enrollment_count: 45
  },
  {
    course_ID: 2,
    title: 'Web Development Fundamentals',
    course_code: 'WEB201',
    description: 'Build modern web applications with HTML, CSS, and JavaScript. Learn responsive design, DOM manipulation, and modern web APIs.',
    status: 'active',
    created_by: 2,
    teacher: dummyUsers.teacher,
    header_image_url: null,
    created_at: '2024-01-20T10:00:00Z',
    is_enrolled: true,
    enrollment_count: 38
  },
  {
    course_ID: 3,
    title: 'Data Structures and Algorithms',
    course_code: 'CS202',
    description: 'Master essential data structures and algorithms. Topics include arrays, linked lists, trees, graphs, sorting, and searching.',
    status: 'active',
    created_by: 2,
    teacher: dummyUsers.teacher,
    header_image_url: null,
    created_at: '2024-02-01T10:00:00Z',
    is_enrolled: true,
    enrollment_count: 32
  },
  {
    course_ID: 4,
    title: 'Database Management Systems',
    course_code: 'DB301',
    description: 'Learn SQL, database design, normalization, and query optimization. Work with MySQL and PostgreSQL.',
    status: 'active',
    created_by: 2,
    teacher: dummyUsers.teacher,
    header_image_url: null,
    created_at: '2024-02-10T10:00:00Z',
    is_enrolled: false,
    enrollment_count: 28
  }
];

// Export everything needed
export { dummyAnnouncements, dummyAssignments, dummyMaterials, dummyGrades, dummyEnrollments, dummyResources, dummyDiscussions, dummySubmissions, dummySchedules, dummyOnlineHours, dummyActivityLogs } from './dummyData';

// Demo credentials
export const demoCredentials = {
  student: {
    email: 'demo.student@tinylearn.com',
    password: 'demo123'
  },
  teacher: {
    email: 'demo.teacher@tinylearn.com',
    password: 'demo123'
  },
  admin: {
    email: 'demo.admin@tinylearn.com',
    password: 'demo123'
  }
};

// Helper functions
export const isDemoAccount = (email) => {
  return Object.values(demoCredentials).some(cred => cred.email === email);
};

export const getDemoUser = (email) => {
  if (email === demoCredentials.student.email) return dummyUsers.student;
  if (email === demoCredentials.teacher.email) return dummyUsers.teacher;
  if (email === demoCredentials.admin.email) return dummyUsers.admin;
  return null;
};

export const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true';
};
