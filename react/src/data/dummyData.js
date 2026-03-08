// Dummy data for demo mode (no database connection needed)

export const dummyUsers = {
  student: {
    user_ID: 1,
    FName: 'Demo',
    LName: 'Student',
    email: 'demo.student@tinylearn.com',
    username: 'demo_student',
    roles: [{ role: 'student', role_ID: 3 }]
  },
  teacher: {
    user_ID: 2,
    FName: 'Demo',
    LName: 'Teacher',
    email: 'demo.teacher@tinylearn.com',
    username: 'demo_teacher',
    roles: [{ role: 'teacher', role_ID: 2 }]
  },
  admin: {
    user_ID: 3,
    FName: 'Demo',
    LName: 'Admin',
    email: 'demo.admin@tinylearn.com',
    username: 'demo_admin',
    roles: [{ role: 'admin', role_ID: 1 }]
  }
};

export const dummyCourses = [
  {
    course_ID: 1,
    title: 'Introduction to Programming',
    course_code: 'CS101',
    description: 'Learn the basics of programming with Python',
    status: 'active',
    created_by: 2,
    header_image_url: null
  },
  {
    course_ID: 2,
    title: 'Web Development Fundamentals',
    course_code: 'WEB201',
    description: 'Build modern web applications with HTML, CSS, and JavaScript',
    status: 'active',
    created_by: 2,
    header_image_url: null
  },
  {
    course_ID: 3,
    title: 'Data Structures and Algorithms',
    course_code: 'CS202',
    description: 'Master essential data structures and algorithms',
    status: 'active',
    created_by: 2,
    header_image_url: null
  }
];

export const dummyAnnouncements = [
  {
    announcement_ID: 1,
    course_id: 1,
    title: 'Welcome to the Course!',
    content: 'Welcome to Introduction to Programming. We are excited to have you here!',
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    announcement_ID: 2,
    course_id: 1,
    title: 'Assignment 1 Posted',
    content: 'The first assignment has been posted. Please check the assignments section.',
    created_at: '2024-03-05T14:30:00Z'
  }
];

export const dummyAssignments = [
  {
    assessment_ID: 1,
    course_id: 1,
    title: 'Variables and Data Types',
    description: 'Complete exercises on variables and data types',
    type: 'assignment',
    due_date: '2024-03-20T23:59:59Z',
    total_points: 100,
    status: 'published'
  },
  {
    assessment_ID: 2,
    course_id: 2,
    title: 'Build a Landing Page',
    description: 'Create a responsive landing page using HTML and CSS',
    type: 'assignment',
    due_date: '2024-03-25T23:59:59Z',
    total_points: 150,
    status: 'published'
  }
];

export const dummyMaterials = [
  {
    material_ID: 1,
    course_id: 1,
    title: 'Course Syllabus',
    description: 'Complete course syllabus and schedule',
    type: 'document',
    file_path: null,
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    material_ID: 2,
    course_id: 1,
    title: 'Python Basics Tutorial',
    description: 'Introduction to Python programming',
    type: 'video',
    file_path: null,
    created_at: '2024-03-02T10:00:00Z'
  }
];

export const dummyGrades = [
  {
    grade_ID: 1,
    assessment_id: 1,
    student_id: 1,
    score: 85,
    feedback: 'Good work! Keep practicing.',
    graded_at: '2024-03-15T10:00:00Z'
  }
];

export const dummyEnrollments = [
  {
    enrollment_ID: 1,
    user_id: 1,
    course_id: 1,
    enrolled_at: '2024-03-01T10:00:00Z',
    status: 'active'
  },
  {
    enrollment_ID: 2,
    user_id: 1,
    course_id: 2,
    enrolled_at: '2024-03-01T10:00:00Z',
    status: 'active'
  }
];

// Demo login credentials
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

// Check if login is a demo account
export const isDemoAccount = (email) => {
  return Object.values(demoCredentials).some(cred => cred.email === email);
};

// Get demo user by email
export const getDemoUser = (email) => {
  if (email === demoCredentials.student.email) return dummyUsers.student;
  if (email === demoCredentials.teacher.email) return dummyUsers.teacher;
  if (email === demoCredentials.admin.email) return dummyUsers.admin;
  return null;
};
